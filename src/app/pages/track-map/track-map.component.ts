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

    checkpointEdit = false;
    showAdminPanelButton: boolean;

    affiliateMarkerEdit = false;

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
            this.editCheckpointForm();
        }
        else {
            this.affiliateMarkerEdit = true;
        }
    }

    clickOnMap($event) {
        if (this.checkpointEdit) {
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
                        this.refreshCheckpoint();
                        this.refreshSelectedTrack();

                    }
                    , error2 => {
                        console.log(error2.error);
                        this.refreshCheckpoint();
                        this.refreshSelectedTrack();

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
            this.child.addMarker(lonLat.lon, lonLat.lat, marker, this.isAffiliateMarker(marker));
        }
    }

    isAffiliateMarker(marker) {
        let isAffiliate = false;
        this.selectedEvent.tracks.forEach(track => {
            track.checkPoints.forEach(checkpoint => {
                if(checkpoint.affiliateMarkers.find(affiliateMarker => affiliateMarker.id === marker.id)) {
                    isAffiliate = true;
                }
            });
        });
        return isAffiliate;
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
        this.affiliateMarkerEdit = false;
    }

    deleteMarker() {
        this.appService.deleteCheckpointAffiliateMarker(this.checkAffiliateMarkerMainMarker(this.selectedMarker), this.selectedMarker.id).subscribe(
            responses => {
                console.log(responses);
                this.appService.deleteMarkerFromEvent(this.selectedEvent, this.selectedMarker).subscribe(
                    responses2 => {
                        console.log(responses2);
                        this.refreshSelectedTrack();
                    }
                    , error => {
                        console.log(error);
                        this.refreshSelectedTrack();
                    }
                );
            }
            , error => {
                console.log(error);
                this.appService.deleteMarkerFromEvent(this.selectedEvent, this.selectedMarker).subscribe(
                    responses => {
                        console.log(responses);
                        this.refreshSelectedTrack();
                    }
                    , error2 => {
                        console.log(error2);
                        this.refreshSelectedTrack();
                    }
                );
            }
        );
        this.affiliateMarkerEdit = false;
    }

    checkAffiliateMarkerMainMarker(marker) {
        let foundCheckpoint;
        this.selectedTrack.checkPoints.forEach(checkpoint => {
            const foundAffiliateMarker = checkpoint.affiliateMarkers.find(affiliateMarker => affiliateMarker.id === marker.id);
            if(foundAffiliateMarker) {
                foundCheckpoint = checkpoint;
            }
        });
        return foundCheckpoint;
    }

    editCheckpointForm() {
        this.checkpointEdit = true;
    }

    return() {
        this.refreshSelectedTrack();
        this.checkpointEdit = false;
        this.addNewAffiliateMarker = false;
        this.affiliateMarkerEdit = false;
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
