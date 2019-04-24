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

import {Observable, of} from 'rxjs';
import { SiteMap} from '../site-map';
import { SitePoint} from '../site-point';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {

    siteMaps: Observable<SiteMap[]>;
    siteMapName: string;
    sitePoints: Observable<SitePoint[]>;
    map: OlMap;
    source: OlXYZ;
    layer: OlTileLayer;
    view: OlView;
    markerSource: OlSourceVector;
    markerLayer: OlLayerVector;

    constructor(private appService: AppService, private router: Router) { }

    ngOnInit() {
        this.sitePoints = of([]);

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

        this.markerSource = new OlSourceVector({});
        this.markerLayer = new OlLayerVector({ source: this.markerSource});
        this.map.addLayer(this.markerLayer );
    }

    reloadData() {
        this.siteMaps = of([]);
        /*this.appService.getMap('new map4')
            .subscribe(
                response => {
                    console.log(response);
                    this.fixSiteMap(response.name, response.points);
                    this.siteMaps.subscribe(siteMaps => {
                        siteMaps[0].points.forEach(function(point) {
                            this.addMarker(point.lon, point.lat);
                        }.bind(this));
                    });
                }
                , error => {
                    console.log(error);

                });*/
        this.appService.getAllMaps()
            .subscribe(
                responses => {
                    console.log(responses);
                    responses.forEach(function(response) {
                        const fixedMap = this.fixSiteMap(response.name, response.points);
                        this.siteMaps.subscribe(siteMaps => {
                            siteMaps.push(fixedMap);
                        });
                        this.siteMaps.subscribe(siteMaps => {
                            siteMaps[0].points.forEach(function(point) {
                                this.addMarker(point.lon, point.lat);
                            }.bind(this));
                        });
                    }.bind(this));
                }
                , error => {
                    console.log(error);

                });

    }

    handleMapClick(evt) {
        const lontat = toLonLat(evt.coordinate);
        console.log(lontat); //   <=== coordinate projection

        this.addMarker(lontat[0], lontat[1]);

        /*this.siteMaps.subscribe(siteMaps => {
            const sitePoint = new SitePoint();
            sitePoint.lon = parseFloat (lontat[0]);
            sitePoint.lat = parseFloat (lontat[1]);
            siteMaps[0].points.push(sitePoint);
        });*/

        this.siteMaps.subscribe(siteMaps => {
            const newSiteMap = siteMaps.find(siteMap => siteMap.name === this.siteMapName);
            this.sitePoints.subscribe(sitePoints => {
                const sitePoint = new SitePoint();
                sitePoint.lon = parseFloat (lontat[0]);
                sitePoint.lat = parseFloat (lontat[1]);
                sitePoints.push(sitePoint);
            });
        });

    }

    addMarker(lng, lat) {

        const marker = new OlFeature({
            geometry: new OlGeomPoint(transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'))
        });

        const iconStyle = new OlStyle({
            image: new OlIcon(({
                anchor: [0.5, 1],
                src: 'http://cdn.mapmarker.io/api/v1/pin?text=&size=30&hoffset=1'
            }))
        });

        marker.setStyle(iconStyle);

        marker.on('click', function(evt) {
            console.log('click'); //   <=== coordinate projection
        });

        this.markerSource.addFeature(marker);
    }
    onLogout() {
        this.appService.logout();
    }
    adminPage() {
        this.router.navigate(['../admin-page']);
    }

    fixSiteMap(name: string, points: string) {
        const siteMap = new SiteMap();
        siteMap.name = name;
        siteMap.points = [];

        points = points.replace(new RegExp('\\(', 'g'), '');
        points = points.replace(new RegExp('\\)', 'g'), '');
        points = points.replace(new RegExp(';', 'g'), '');

        const newPoints = points.split('POINT');
        newPoints.forEach(function(point){
            if(point !== '') {
                const lonLat = point.split(' ');
                const sitePoint = new SitePoint();
                sitePoint.lon = parseFloat (lonLat[1]);
                sitePoint.lat = parseFloat (lonLat[2]);
                siteMap.points.push(sitePoint);
            }

        });
        return siteMap;
    }

    saveMap(){
        const newSiteMap = new SiteMap();
        newSiteMap.name = this.siteMapName;
        this.sitePoints.subscribe(sitePoints => {
            newSiteMap.points = sitePoints;
        });
        this.appService.addMap(newSiteMap)
            .subscribe(
                response => {
                    console.log(response);
                }
                , error => {
                    console.log(error);

                });
    }

    select(){
        this.sitePoints = of([]);
        this.siteMaps = of([]);
        this.markerSource.clear();
        this.appService.getAllMaps()
            .subscribe(
                responses => {
                    console.log(responses);
                    responses.forEach(function(response) {
                        const fixedMap = this.fixSiteMap(response.name, response.points);
                        this.siteMaps.subscribe(siteMaps => {
                            siteMaps.push(fixedMap);
                        });
                        if(response.name === this.siteMapName) {
                            this.sitePoints.subscribe(sitePoints => {
                                fixedMap.points.forEach(function(point) {
                                    sitePoints.push(point);
                                });

                            });
                            fixedMap.points.forEach(function(point) {
                                this.addMarker(point.lon, point.lat);
                            }.bind(this));
                        }
                    }.bind(this));
                }
                , error => {
                    console.log(error);

                });

        console.log(this.siteMapName);
        this.siteMaps.subscribe(siteMaps => {
            const newSiteMap = siteMaps.find(siteMap => siteMap.name === this.siteMapName);
            this.sitePoints.subscribe(sitePoints => {
                newSiteMap.points.forEach(function(point) {
                    sitePoints.push(point);
                });

            });
        });
    }
}
