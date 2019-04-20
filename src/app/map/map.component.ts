import { Component, OnInit } from '@angular/core';

import OlMap from 'ol/Map';
import OlXYZ from 'ol/source/XYZ';
import OlTileLayer from 'ol/layer/Tile';
import OlView from 'ol/View';

import OlLayerVector from 'ol/layer/Vector';
import OlSourceVector from 'ol/source/Vector';
import OlFeature from 'ol/Feature';
import OlGeomPoint from 'ol/geom/Point';
import OlStyle from 'ol/style/Style';
import OlIcon from 'ol/style/Icon';

import { transform } from 'ol/proj';
import { toLonLat } from 'ol/proj';

import { fromLonLat } from 'ol/proj';
import { AppService } from '../app.service';
import {Router} from '@angular/router';

import {Observable} from 'rxjs';
import {RoutePoint} from '../route-point';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {

    routePoints: Observable<RoutePoint[]>;
    map: OlMap;
    source: OlXYZ;
    layer: OlTileLayer;
    view: OlView;

    constructor(private appService: AppService, private router: Router) { }

    ngOnInit() {


        this.source = new OlXYZ({
            url: 'http://tile.osm.org/{z}/{x}/{y}.png'
        });

        this.layer = new OlTileLayer({
            source: this.source
        });

        this.view = new OlView({
            center: fromLonLat([18.532743, 54.422876]),
            zoom: 11
        });

        this.map = new OlMap({
            target: 'map',
            layers: [this.layer],
            view: this.view
        });

        this.map.on('click', this.handleMapClick.bind(this));
        this.reloadData();
    }

    reloadData() {
        this.routePoints = this.appService.getRoutePoints();
        this.routePoints.subscribe(routePoints => {
                routePoints.forEach(function(routePoint){
                    var x = routePoint;
                    console.log(routePoint);
                    this.addMarker(routePoint.lon, routePoint.lat);
                }.bind(this));
        });
    }

    handleMapClick(evt) {
        const lontat = toLonLat(evt.coordinate);
        console.info(lontat); //   <=== coordinate projection

        this.addMarker(lontat[0], lontat[1]);

        this.routePoints.subscribe(routePoints => {
            const routePoint = new RoutePoint();
            routePoint.name = 'point ' + routePoints.length;
            routePoint.description = 'desc ' + routePoints.length;
            routePoint.lon = lontat[0];
            routePoint.lat = lontat[1];
            routePoints.push(routePoint);
        });
    }

    addMarker(lng, lat) {
        const source = new OlSourceVector({});
        const layer = new OlLayerVector({ source: source});
        this.map.addLayer(layer );
        const marker = new OlFeature({
            geometry: new OlGeomPoint(transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'))
        });

        var iconStyle = new OlStyle({
            image: new OlIcon(({
                anchor: [0.5, 1],
                src: 'http://cdn.mapmarker.io/api/v1/pin?text=&size=30&hoffset=1'
            }))
        });

        marker.setStyle(iconStyle);

        marker.on('click', function(evt) {
            console.info('click'); //   <=== coordinate projection
        });

        source.addFeature(marker);
    }
    onLogout() {
        this.appService.logout();
    }
    adminPage() {
        this.router.navigate(['../admin-page']);
    }
}
