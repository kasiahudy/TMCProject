import {Component, OnInit, ViewChild} from '@angular/core';

import { AppService } from '../../app.service';
import {Router, ActivatedRoute} from '@angular/router';

import {Observable, of} from 'rxjs';

import { Event } from '../../models/event';
import { Marker } from '../../models/marker';
import {Track} from '../../models/track';
import {Checkpoint} from '../../models/checkpoint';

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
    trackCheckpoints: Checkpoint[];


    selectedMarker: Marker;
    selectedCheckpoint: Checkpoint;
    selectedCheckpointAffiliateMarkers: Observable<Marker[]>;

    markerEdit: boolean;
    showAdminPanelButton: boolean;

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
        this.trackCheckpoints = [];
        this.selectedMarker = new Marker();
        this.selectedCheckpoint = new Checkpoint();
        this.selectedCheckpointAffiliateMarkers = of([]);
        this.isAdmin();
    }

    clickOnMarker($event) {
        console.log('click' + $event.marker.lon + ' ' + $event.marker.lat);
        this.selectedMarker = $event.marker;
        this.selectedCheckpoint = this.trackCheckpoints.find(checkpoint => checkpoint.mainMarker.id === $event.marker.id);
        this.selectedCheckpointAffiliateMarkers.subscribe(selectedCheckpointAffiliateMarkers => {
            selectedCheckpointAffiliateMarkers = this.selectedCheckpoint.affiliateMarkers;
        })
        this.editMarkerForm();
    }

    clickOnMap($event) {
        if (this.markerEdit) {
            const lontat = $event.coordinate;
            console.log(lontat); //   <=== coordinate projection

            const marker = new Marker();
            marker.coordinate = Marker.lonLatToCoordinates(lontat[0], lontat[1]);
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

    refreshSelectedTrack() {
        this.appService.getEvent(this.selectedEvent).subscribe(
            response => {
                let event = new Event();
                event = response;
                this.selectedEvent = event;
                this.selectedTrack = this.selectedEvent.tracks.find(track => track.id === this.selectedTrack.id);
                this.trackMarkers = of([]);
                this.trackCheckpoints = [];
                this.child.markerSource.clear();

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
                                this.child.addMarker(newMarker.lon, newMarker.lat, checkpoint.mainMarker);
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

    editMarkerForm() {
        this.markerEdit = true;
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
        this.router.navigate(['../main-map-page', this.selectedEvent.id]);
    }

    onLogout() {
        this.appService.logout();
    }
}
