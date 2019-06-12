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
    trackCheckpoints: CheckPoint[];


    selectedMarker: Marker;
    selectedCheckpoint: CheckPoint;
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
        this.selectedCheckpoint = new CheckPoint();
        this.selectedCheckpointAffiliateMarkers = of([]);
        this.isAdmin();
    }

    clickOnMarker($event) {
        console.log('click' + $event.marker.lon + ' ' + $event.marker.lat);
        this.selectedMarker = $event.marker;
        this.selectedCheckpoint = this.trackCheckpoints.find(checkpoint => checkpoint.mainMarker.id === $event.marker.id);
        this.refreshCheckpoint();
        this.editMarkerForm();
    }

    clickOnMap($event) {
        if (this.markerEdit) {
            const lontat = $event.coordinate;
            console.log(lontat);

            const marker = new Marker();
            marker.coordinate = Marker.lonLatToCoordinates(lontat[0], lontat[1]);
            marker.lanternCode = this.selectedCheckpoint.mainMarker.lanternCode + ' AM';
            this.appService.addMarkerToEvent(this.selectedEvent, marker).subscribe(
                response => {
                    console.log(response);
                    marker.id = String(response);

                    this.appService.addCheckpointAffiliateMarker(this.selectedCheckpoint, marker.id).subscribe(
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

        }
    }

    refreshCheckpoint() {
        this.selectedCheckpointAffiliateMarkers = of([]);
        this.selectedCheckpointAffiliateMarkers.subscribe(selectedCheckpointAffiliateMarkers => {
            this.selectedCheckpoint.affiliateMarkers.forEach(function(affiliateMarker) {
                selectedCheckpointAffiliateMarkers.push(affiliateMarker);
            }.bind(this));
        })
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
                        this.selectedTrack.checkPoints.forEach(function(checkpoint) {
                            let newCheckpoint = new CheckPoint();
                            newCheckpoint = checkpoint;
                            let newMarker = new Marker();
                            newMarker = checkpoint.mainMarker;
                            let coordinates = checkpoint.mainMarker.coordinate;
                            if(coordinates != null) {
                                const lonLat = Marker.coordinatesToLonLat(coordinates);
                                newMarker.lon = lonLat.lon;
                                newMarker.lat = lonLat.lat;
                                this.child.addMarker(lonLat.lon, lonLat.lat, checkpoint.mainMarker);
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
