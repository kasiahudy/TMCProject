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

import { Event } from '../event';
import { Marker } from '../marker';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {

    map: OlMap;
    source: OlXYZ;
    layer: OlTileLayer;
    view: OlView;
    markerSource: OlSourceVector;
    markerLayer: OlLayerVector;


    events: Observable<Event[]>;
    eventMarkers: Observable<Marker[]>;
    selectedEvent: Event;
    selectedEventName: string;

    isEventChosen: boolean;
    showAdminPanelButton: boolean;

    constructor(private appService: AppService, private router: Router) { }

    ngOnInit() {
        this.isAdmin();
        this.isEventChosen = false;

        this.events = of([]);
        this.eventMarkers = of([]);

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
        this.markerSource.clear();
    }

    isAdmin() {
        this.appService.getUsers().subscribe(
            users => {
                if(users.length === 0){
                    this.showAdminPanelButton = false;
                } else {
                    this.showAdminPanelButton = true;
                }
            });
    }

    reloadData() {
        this.loadEvents();
    }

    handleMapClick(evt) {
        const lontat = toLonLat(evt.coordinate);
        console.log(lontat); //   <=== coordinate projection

        this.addMarker(lontat[0], lontat[1]);

        const marker = new Marker();
        marker.coordinate = 'POINT (' + lontat[0] + ' ' + lontat[1] + ');';
        this.appService.addMarkerToEvent(this.selectedEvent, marker).subscribe(
            response => {
                console.log(response);}
            , error => {
                console.log(error.error);
            }
        );

        /*this.siteMaps.subscribe(siteMaps => {
            const sitePoint = new SitePoint();
            sitePoint.lon = parseFloat (lontat[0]);
            sitePoint.lat = parseFloat (lontat[1]);
            siteMaps[0].points.push(sitePoint);
        });*/

        /*this.siteMaps.subscribe(siteMaps => {
            const newSiteMap = siteMaps.find(siteMap => siteMap.name === this.siteMapName);
            this.sitePoints.subscribe(sitePoints => {
                const sitePoint = new SitePoint();
                sitePoint.lon = parseFloat (lontat[0]);
                sitePoint.lat = parseFloat (lontat[1]);
                sitePoints.push(sitePoint);
            });
        });*/

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
        /*
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

                });*/
    }

    loadEvents() {
        this.eventMarkers = of([]);
        this.events = of([]);
        this.appService.getAllEvents()
            .subscribe(
                responses => {
                    console.log(responses);
                    responses.forEach(function(response) {
                        this.events.subscribe(events => {
                            events.push(response);
                        });
                    }.bind(this));
                }
                , error => {
                    console.log(error);

                });
    }

    select(selectEvent){
        const selectedEventId = selectEvent.target.value;
        this.isEventChosen = true;
        this.markerSource.clear();
        this.eventMarkers = of([]);
        //this.loadEvents();

        this.events.subscribe(events => {
            this.selectedEvent = events.find(event => event.id === selectedEventId);
        });

        this.eventMarkers.subscribe(eventMarkers => {
            this.selectedEvent.markers.forEach(function(marker) {
                let newMarker = new Marker();
                newMarker = marker;
                let coordinates = marker.coordinate;
                if(coordinates != null) {
                    coordinates = coordinates.replace(new RegExp('POINT \\(', 'g'), '');
                    coordinates = coordinates.replace(new RegExp('\\);', 'g'), '');
                    const lonLat = coordinates.split(' ');
                    newMarker.lon = parseFloat (lonLat[0]);
                    newMarker.lat = parseFloat (lonLat[1]);
                    this.addMarker(newMarker.lon, newMarker.lat);
                }
                eventMarkers.push(newMarker);

            }.bind(this));
        });

        const u = this.eventMarkers;
        /*this.isMapChosen = true;
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
        });*/

    }

    onLogout() {
        this.appService.logout();
    }
}
