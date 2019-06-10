import { Component, OnInit } from '@angular/core';

import OlMap from 'ol/Map';
import OlXYZ from 'ol/source/XYZ';

import OlWMS from 'ol/source/TileWMS';

import OlTileLayer from 'ol/layer/Tile';
import OlView from 'ol/View';

import OlLayerVector from 'ol/layer/Vector';
import OlSourceVector from 'ol/source/Vector';
import OlFeature from 'ol/Feature';
import OlGeomPoint from 'ol/geom/Point';
import OlStyle from 'ol/style/Style';
import OlIcon from 'ol/style/Icon';
import OlText from 'ol/style/Text';

import { transform, toLonLat, get } from 'ol/proj';

import { fromLonLat } from 'ol/proj';
import { AppService } from '../../app.service';
import {Router, ActivatedRoute} from '@angular/router';

import {Observable, of} from 'rxjs';

import { Event } from '../../models/event';
import { Marker } from '../../models/marker';
import {Track} from '../../models/track';
import {Checkpoint} from '../../models/checkpoint';

import { saveAs } from 'file-saver';


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

    eventMarkers: Observable<Marker[]>;
    selectedEvent: Event;
    selectedEventTracks: Observable<Track[]>;
    selectedTrack: Track;
    selectedTrackName: string;
    trackMarkers: Observable<Marker[]>;

    markerEdit: boolean;
    selectedMarker: Marker;

    addNewTrack:boolean;
    newTrackName: string

    showAdminPanelButton: boolean;
    allMarkersShown: boolean;

    constructor(private appService: AppService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.allMarkersShown = false;
        this.selectedEvent = new Event();
        this.route.params.subscribe(params => {
            const selectedEventId = params['selectedEventId'];
            this.selectedEvent.id = selectedEventId;
            this.refreshSelectedEvent();
        });

        this.isAdmin();
        this.markerEdit = false;
        this.addNewTrack = false;

        this.eventMarkers = of([]);
        this.selectedEventTracks = of([]);
        this.trackMarkers = of([]);

        this.selectedMarker = new Marker();

        /*this.source = new OlWMS({
            url: 'http://mapy.geoportal.gov.pl/wss/service/img/guest/TOPO/MapServer/WMSServer',
            params: {
                'LAYERS': 'Raster',
                'CRS': 'EPSG:2180',
                'VERSION': '1.1.1'
            }
        });*/

        this.source = new OlXYZ({
            url: 'http://tile.osm.org/{z}/{x}/{y}.png',
            crossOrigin: 'anonymous'
        });

        this.layer = new OlTileLayer({
            source: this.source,
            /*isBaseLayer: true,
            projection: get('EPSG:2180')*/
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

        this.markerSource = new OlSourceVector({
        });
        this.markerLayer = new OlLayerVector({ source: this.markerSource});
        this.map.addLayer(this.markerLayer );
        this.markerSource.clear();
    }



    handleMapClick(evt) {
        const f = this.map.forEachFeatureAtPixel(
            evt.pixel,
            function(ft, layer){return ft;}
        );
        if (f && f.get('type') === 'click') {
            const marker = f.get('desc');
            console.log('click' + marker.lon + ' ' + marker.lat);
            this.selectedMarker = marker;
            this.editMarkerForm();
        } else {
            if (!this.markerEdit && this.selectedEvent != null) {
                const lontat = toLonLat(evt.coordinate);
                console.log(lontat); //   <=== coordinate projection

                const marker = new Marker();
                marker.coordinate = 'POINT (' + lontat[0] + ' ' + lontat[1] + ');';
                this.appService.addMarkerToEvent(this.selectedEvent, marker).subscribe(
                    response => {
                        console.log(response);
                        this.refreshSelectedEvent();
                    }
                    , error => {
                        console.log(error.error);
                        this.refreshSelectedEvent();
                    }
                );
            }
        }

    }

    addMarker(lng, lat, marker) {

        const olMarker = new OlFeature({
            type: 'click',
            desc: marker,
            geometry: new OlGeomPoint(transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'))
        });

        // icon creator: http://cdn.mapmarker.io/editor
        const iconStyle = new OlStyle({
            image: new OlIcon(({
                anchor: [0.5, 0.5],
                src: 'assets/marker.png',
                crossOrigin: null
            })),
            text: new OlText({
                text: marker.lanternCode,
                offsetY: -16,
                font: 'bold 15px sans-serif'
            })
            //image: new OlIcon(({
                //anchor: [0.5, 1],
                //src: 'http://cdn.mapmarker.io/api/v1/pin?text=&size=30&hoffset=1'
            //}))
        });

        olMarker.setStyle(iconStyle);

        this.markerSource.addFeature(olMarker);
    }

    refreshSelectedEvent() {
        this.appService.getEvent(this.selectedEvent).subscribe(
            response => {
                let event = new Event();
                event = response;
                this.selectedEvent = event;

                this.eventMarkers = of([]);
                this.markerSource.clear();
                this.selectedEventTracks = of([]);

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
                            this.addMarker(newMarker.lon, newMarker.lat, marker);
                        }
                        eventMarkers.push(newMarker);

                    }.bind(this));
                });

                this.selectedEventTracks.subscribe(eventTracks => {
                    this.selectedEvent.tracks.forEach(function(track) {
                        let newTrack = new Track();
                        newTrack = track;
                        eventTracks.push(newTrack);
                    }.bind(this));
                });
            }
            , error => {
                console.log(error);

            });
    }

    editMarkerForm() {
        this.markerEdit = true;
    }

    selectTrack(selectEvent) {
        const selectedTrackId = selectEvent.target.value;

        this.selectedEventTracks.subscribe(tracks => {
            this.selectedTrack = tracks.find(track => track.id === selectedTrackId);
        });
        this.trackMarkers.subscribe(markers => {
            this.selectedTrack.checkpoints.forEach(function(checkpoint) {
                let marker = new Marker();
                marker = checkpoint.mainMarker;
                if(marker != null) {
                    markers.push(marker);
                }
            }.bind(this));
        });
        this.refreshSelectedEvent();
    }

    addToTrack() {
        if(this.selectedMarker.lanternCode != null) {
            const checkpoint = new Checkpoint();
            checkpoint.mainMarker = this.selectedMarker;
            this.appService.addCheckpointToTrack(this.selectedTrack, checkpoint).subscribe(
                responses2 => {
                    console.log(responses2);
                    this.refreshSelectedEvent();
                }
                , error2 => {
                    console.log(error2);
                    this.refreshSelectedEvent();
                }
            );
        }
    }

    saveMarker() {
        this.appService.editMarker(this.selectedMarker).subscribe(
            responses => {
                console.log(responses);
                this.refreshSelectedEvent();
            }
            , error => {
                console.log(error);
                this.refreshSelectedEvent();
            }
        );
        this.markerEdit = false;
    }

    deleteMarker() {
        let isMarkerInTrack = false;
        this.selectedEventTracks.subscribe(tracks => {
            tracks.forEach(function(track) {
                track.checkpoints.forEach(function(checkpoint) {
                    if(checkpoint.mainMarker.id === this.selectedMarker.id) {
                        this.appService.deleteCheckpointFromTrack(track, checkpoint).subscribe(
                            responses => {
                                console.log(responses);
                                this.appService.deleteMarkerFromEvent(this.selectedEvent, this.selectedMarker).subscribe(
                                    responses2 => {
                                        console.log(responses2);
                                        this.refreshSelectedEvent();
                                    }
                                    , error2 => {
                                        console.log(error2);
                                        this.refreshSelectedEvent();
                                    }
                                );
                            }
                            , error => {
                                console.log(error);
                                this.appService.deleteMarkerFromEvent(this.selectedEvent, this.selectedMarker).subscribe(
                                    responses2 => {
                                        console.log(responses2);
                                        this.refreshSelectedEvent();
                                    }
                                    , error2 => {
                                        console.log(error2);
                                        this.refreshSelectedEvent();
                                    }
                                );
                            }
                        );
                        isMarkerInTrack = true;
                    }
                }.bind(this));
            }.bind(this));
        });
        if(!isMarkerInTrack) {
            this.appService.deleteMarkerFromEvent(this.selectedEvent, this.selectedMarker).subscribe(
                responses => {
                    console.log(responses);
                    this.refreshSelectedEvent();
                }
                , error => {
                    console.log(error);
                    this.refreshSelectedEvent();
                }
            );
        }

    }

    newTrackForm() {
        this.addNewTrack = true;
    }

    addTrack() {
        const track = new Track();
        track.name = this.newTrackName;
        this.appService.addTrackToEvent(this.selectedEvent, track).subscribe(
            response => {
                console.log(response);
                this.refreshSelectedEvent();
            }
            , error => {
                console.log(error.error);
                this.refreshSelectedEvent();
            }
        );
        this.addNewTrack = false;
    }

    exportMap() {
        this.map.once('rendercomplete', function(event) {
            const canvas = event.context.canvas;
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
            } else {
                canvas.toBlob(function(blob) {
                    saveAs(blob, 'map.png');
                });
            }
        });
        this.map.renderSync();
    }

    return() {
        this.markerEdit = false;
        this.addNewTrack = false;
    }

    showAllMarkers(){
        this.allMarkersShown = true;
    }

    hideAllMarkers() {
        this.allMarkersShown = false;
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

    onLogout() {
        this.appService.logout();
    }
}
