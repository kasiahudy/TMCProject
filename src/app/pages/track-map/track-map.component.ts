import {Component, OnInit, ViewChild} from '@angular/core';

import { AppService } from '../../app.service';
import {Router, ActivatedRoute} from '@angular/router';

import {Observable, of} from 'rxjs';

import { Event } from '../../models/event';
import { Marker } from '../../models/marker';
import {Track} from '../../models/track';
import {CheckPoint} from '../../models/checkPoint';

import { saveAs } from 'file-saver';
import {MapComponent} from '../../map/map.component';


@Component({
    selector: 'track-map',
    templateUrl: './track-map.component.html',
    styleUrls: ['./track-map.component.css']
})

export class TrackMapComponent implements OnInit {

    @ViewChild(MapComponent) child:MapComponent;

    selectedEvent: Event;
    selectedTrack: Track;
    trackMarkers: Observable<Marker[]>;
    trackCheckpoints:  Observable<CheckPoint[]>;


    selectedMarker: Marker;
    selectedCheckpoint: CheckPoint;
    selectedCheckpointAffiliateMarkers: Observable<Marker[]>;

    markerEdit: boolean;
    showAdminPanelButton: boolean;

    addNewAffiliateMarker = false;
    newTapeCode: string;
    newLanternCode: string;
    newMarker;

    constructor(private appService: AppService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.selectedEvent = new Event();
            this.selectedTrack = new Track();
            this.selectedTrack.id = params['selectedTrackId'];
            this.selectedEvent.id = params['selectedEventId'];
            this.refreshSelectedTrack();
        });

        this.markerEdit = false;
        this.trackMarkers = of([]);
        this.trackCheckpoints = of([]);
        this.selectedMarker = new Marker();
        this.selectedCheckpoint = new CheckPoint();
        this.selectedCheckpointAffiliateMarkers = of([]);
        this.isAdmin();
    }

    clickOnMarker($event) {
        console.log('click' + $event.marker.lon + ' ' + $event.marker.lat);
        this.selectedMarker = $event.marker;
        this.trackCheckpoints.subscribe(trackCheckpoints => {
            this.selectedCheckpoint = trackCheckpoints.find(checkpoint => checkpoint.mainMarker.id === $event.marker.id);
        });
        if(this.selectedCheckpoint) {
            this.refreshCheckpoint();
            this.editMarkerForm();
        }
    }

    clickOnMap($event) {
        if (this.markerEdit) {
            this.addNewAffiliateMarker = true;
            const lontat = $event.coordinate;
            console.log(lontat);

            this.newMarker = new Marker();
            this.newMarker.coordinate = Marker.lonLatToCoordinates(lontat[0], lontat[1]);

            this.newMarker.lanternCode = this.selectedCheckpoint.mainMarker.lanternCode + ' AM';

        }
    }

    createAffiliateMarker() {
        this.newMarker.tapeCode = this.newTapeCode;
        this.newMarker.lanternCode = this.newLanternCode;
        this.appService.addMarkerToEvent(this.selectedEvent, this.newMarker).subscribe(
            response => {
                console.log(response);
                this.newMarker.id = String(response);

                this.appService.addCheckpointAffiliateMarker(this.selectedCheckpoint, this.newMarker.id).subscribe(
                    response2 => {
                        console.log(response2);
                        this.refreshSelectedTrack();
                        this.refreshCheckpoint();
                    }
                    , error2 => {
                        console.log(error2.error);
                        this.refreshSelectedTrack();
                        this.refreshCheckpoint();
                    });
            }
            , error => {
                console.log(error.error);
            }
        );
        this.newTapeCode = null;
        this.addNewAffiliateMarker = false;
    }

    refreshCheckpoint() {
        this.selectedCheckpointAffiliateMarkers = of([]);
        this.selectedCheckpointAffiliateMarkers.subscribe(selectedCheckpointAffiliateMarkers => {
            this.selectedCheckpoint.affiliateMarkers.forEach(function(affiliateMarker) {
                selectedCheckpointAffiliateMarkers.push(affiliateMarker);
            }.bind(this));
        });
    }

    refreshSelectedTrack() {
        this.appService.getEvent(this.selectedEvent).subscribe(
            response => {
                let event = new Event();
                event = response;
                this.selectedEvent = event;
                this.selectedTrack = this.selectedEvent.tracks.find(track => track.id === this.selectedTrack.id);
                this.trackMarkers = of([]);
                this.trackCheckpoints = of([]);
                this.child.markerSource.clear();

                this.trackCheckpoints.subscribe(trackCheckpoints => {
                        this.selectedTrack.checkPoints.forEach(function(checkpoint) {
                            this.addMarkerToMap(checkpoint.mainMarker)
                            checkpoint.affiliateMarkers.forEach(affiliateMarker => {
                                this.addMarkerToMap(affiliateMarker);
                            })
                            trackCheckpoints.push(checkpoint);
                        }.bind(this));
                });

            }
            , error => {
                console.log(error);
            });
    }

    addMarkerToMap(marker) {
        const newMarker = marker;
        const coordinates = marker.coordinate;
        if(coordinates != null) {
            const lonLat = Marker.coordinatesToLonLat(coordinates);
            newMarker.lon = lonLat.lon;
            newMarker.lat = lonLat.lat;
            this.child.addMarker(lonLat.lon, lonLat.lat, marker);
        }
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

    editMarkerForm() {
        this.markerEdit = true;
    }

    return() {
        this.markerEdit = false;
        this.addNewAffiliateMarker = false;
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
        this.router.navigate(['../main-map-page', this.selectedEvent.id]);
    }

    onLogout() {
        this.appService.logout();
    }
}
