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
import {Router, ActivatedRoute} from '@angular/router';

import {Observable, of} from 'rxjs';

import { Event } from '../models/event';
import { Marker } from '../models/marker';
import {Track} from '../models/track';
import {Checkpoint} from "../models/checkpoint";

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
    selectedEventTracks: Observable<Track[]>;
    selectedTrack: Track;
    selectedTrackName: string;
    trackMarkers: Observable<Marker[]>;

    markerEdit: boolean;
    selectedMarker: Marker;

    addNewTrack:boolean;
    newTrackName: string

    showAdminPanelButton: boolean;

    constructor(private appService: AppService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.selectedEvent = new Event();
        this.route.params.subscribe(params => {
            const selectedEventId = params['selectedEventId'];
            this.selectedEvent.id = selectedEventId;
            this.refreshSelectedEvent();
        });

        this.isAdmin();
        this.markerEdit = false;
        this.addNewTrack = false;

        this.events = of([]);
        this.eventMarkers = of([]);
        this.selectedEventTracks = of([]);
        this.trackMarkers = of([]);

        this.selectedMarker = new Marker();

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

        this.markerSource = new OlSourceVector({});
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

        /*const iconStyle = new OlStyle({
            image: new OlIcon(({
                anchor: [0.5, 1],
                src: 'http://cdn.mapmarker.io/api/v1/pin?text=&size=30&hoffset=1'
            }))
        });

        marker.setStyle(iconStyle);*/

        this.markerSource.addFeature(olMarker);
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
        //this.saveMarker();
        const checkpoint = new Checkpoint();
        checkpoint.mainMarker = this.selectedMarker;
        this.appService.addCheckpointToTrack(this.selectedTrack, checkpoint).subscribe(
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

    return() {
        this.markerEdit = false;
        this.addNewTrack = false;
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
