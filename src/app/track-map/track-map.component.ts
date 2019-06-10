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
import { AppService } from '../app.service';
import {Router, ActivatedRoute} from '@angular/router';

import {Observable, of} from 'rxjs';

import { Event } from '../models/event';
import { Marker } from '../models/marker';
import {Track} from '../models/track';
import {Checkpoint} from '../models/checkpoint';

import { saveAs } from 'file-saver';


@Component({
    selector: 'track-map',
    templateUrl: './track-map.component.html',
    styleUrls: ['./track-map.component.css']
})

export class TrackMapComponent implements OnInit {

    map: OlMap;
    source: OlXYZ;
    layer: OlTileLayer;
    view: OlView;
    markerSource: OlSourceVector;
    markerLayer: OlLayerVector;

    selectedEvent: Event;
    selectedTrack: Track;
    trackMarkers: Observable<Marker[]>;
    trackCheckpoints: Checkpoint[];


    selectedMarker: Marker;
    selectedCheckpoint: Checkpoint;
    selectedCheckpointAffiliateMarkers: Observable<Marker[]>;

    markerEdit: boolean;
    showAdminPanelButton: boolean;

    constructor(private appService: AppService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.selectedEvent = new Event();
        this.selectedTrack = new Track();
        this.route.params.subscribe(params => {
            this.selectedTrack.id = params['selectedTrackId'];
            this.selectedEvent.id = params['selectedEventId'];
            this.refreshSelectedTrack();
        });

        this.isAdmin();
        this.markerEdit = false;

        this.trackMarkers = of([]);
        this.trackCheckpoints = [];
        this.selectedMarker = new Marker();
        this.selectedCheckpoint = new Checkpoint();
        this.selectedCheckpointAffiliateMarkers = of([]);

        this.source = new OlWMS({
            url: 'http://mapy.geoportal.gov.pl/wss/service/img/guest/ORTO/MapServer/WMSServer',
            params: {
                'LAYERS': 'Raster',
                'CRS': 'EPSG:2180',
                'VERSION': '1.1.1'
            }
        });

        this.layer = new OlTileLayer({
            source: this.source,
            isBaseLayer: true,
            projection: get('EPSG:2180')
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
            this.selectedCheckpoint = this.trackCheckpoints.find(checkpoint => checkpoint.mainMarker.id === marker.id);
            this.selectedCheckpointAffiliateMarkers.subscribe(selectedCheckpointAffiliateMarkers => {
                selectedCheckpointAffiliateMarkers = this.selectedCheckpoint.affiliateMarkers;
            })
            this.editMarkerForm();
        } else {
            if (this.markerEdit) {
                const lontat = toLonLat(evt.coordinate);
                console.log(lontat); //   <=== coordinate projection

                const marker = new Marker();
                marker.coordinate = 'POINT (' + lontat[0] + ' ' + lontat[1] + ');';
                this.selectedCheckpoint.affiliateMarkers.push(marker);
                this.selectedCheckpointAffiliateMarkers.subscribe(selectedCheckpointAffiliateMarkers => {
                    selectedCheckpointAffiliateMarkers = this.selectedCheckpoint.affiliateMarkers;
                });
                const checkpointIndex = this.selectedTrack.checkpoints.findIndex(checkpoint => checkpoint.id === this.selectedCheckpoint.id);
                this.selectedTrack.checkpoints[checkpointIndex] = this.selectedCheckpoint;
                this.appService.addMarkerToEvent(this.selectedEvent, marker).subscribe(
                    response => {
                        console.log(response);
                        this.appService.addCheckpointToTrack(this.selectedTrack, this.selectedCheckpoint).subscribe(
                            response2 => {
                                console.log(response2);
                                this.refreshSelectedTrack();
                            }
                            , error2 => {
                                console.log(error2.error);
                                this.refreshSelectedTrack();
                            }
                        );
                    }
                    , error => {
                        console.log(error.error);
                        this.appService.addCheckpointToTrack(this.selectedTrack, this.selectedCheckpoint).subscribe(
                            response2 => {
                                console.log(response2);
                                this.refreshSelectedTrack();
                            }
                            , error2 => {
                                console.log(error2.error);
                                this.refreshSelectedTrack();
                            }
                        );
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

    refreshSelectedTrack() {
        this.appService.getEvent(this.selectedEvent).subscribe(
            response => {
                let event = new Event();
                event = response;
                this.selectedEvent = event;
                this.selectedTrack = this.selectedEvent.tracks.find(track => track.id === this.selectedTrack.id);
                this.trackMarkers = of([]);
                this.trackCheckpoints = [];
                this.markerSource.clear();

                    this.trackMarkers.subscribe(trackMarkers => {
                        this.selectedTrack.checkpoints.forEach(function(checkpoint) {
                            let newCheckpoint = new Checkpoint();
                            newCheckpoint = checkpoint;
                            let newMarker = new Marker();
                            newMarker = checkpoint.mainMarker;
                            let coordinates = checkpoint.mainMarker.coordinate;
                            if(coordinates != null) {
                                coordinates = coordinates.replace(new RegExp('POINT \\(', 'g'), '');
                                coordinates = coordinates.replace(new RegExp('\\);', 'g'), '');
                                const lonLat = coordinates.split(' ');
                                newMarker.lon = parseFloat (lonLat[0]);
                                newMarker.lat = parseFloat (lonLat[1]);
                                this.addMarker(newMarker.lon, newMarker.lat, checkpoint.mainMarker);
                            }
                            this.trackCheckpoints.push(newCheckpoint);
                            trackMarkers.push(newMarker);
                        }.bind(this));
                    });

            }
            , error => {
                console.log(error);
            });
    }

    saveMarker() {
        this.appService.editMarker(this.selectedMarker).subscribe(
            responses => {
                console.log(responses);
                this.refreshSelectedTrack();
            }
            , error => {
                console.log(error);
                this.refreshSelectedTrack();
            }
        );
        this.markerEdit = false;
    }

    deleteMarker() {

    }

    editMarkerForm() {
        this.markerEdit = true;
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

    returnToMainMap(){
        this.router.navigate(['../map', this.selectedEvent.id]);
    }

    onLogout() {
        this.appService.logout();
    }
}
