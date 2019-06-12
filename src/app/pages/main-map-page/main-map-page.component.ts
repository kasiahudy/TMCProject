import { Component, OnInit, ViewChild } from '@angular/core';

import { AppService } from '../../app.service';
import {Router, ActivatedRoute} from '@angular/router';

import {Observable, of} from 'rxjs';

import { Event } from '../../models/event';
import { Marker } from '../../models/marker';
import {Track} from '../../models/track';
import {CheckPoint} from '../../models/checkPoint';

import {MapComponent} from '../../map/map.component';


@Component({
    selector: 'main-map-page',
    templateUrl: './main-map-page.component.html',
    styleUrls: ['./main-map-page.component.css']
})

export class MainMapPageComponent implements OnInit {

    @ViewChild(MapComponent) child:MapComponent;

    eventMarkers: Observable<Marker[]>;
    selectedEvent: Event;
    selectedEventTracks: Observable<Track[]>;

    selectedTrack: Track;
    selectedTrackName: string;
    trackMarkers: Observable<Marker[]>;

    markerEdit = false;
    selectedMarker: Marker;

    addNewTrack = false;
    newTrackName: string

    showAdminPanelButton: boolean;
    allMarkersShown = false;

    addNewMarker = false;
    newMarker;
    newTapeCode: string;

    constructor(private appService: AppService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.selectedEvent = new Event();
            const selectedEventId = params['selectedEventId'];
            this.selectedEvent.id = selectedEventId;
            this.refreshSelectedEvent();
        });

        this.eventMarkers = of([]);
        this.selectedEventTracks = of([]);
        this.trackMarkers = of([]);

        this.selectedMarker = new Marker();

        this.isAdmin();
    }


    clickOnMarker($event) {
        console.log('click' + $event.marker.lon + ' ' + $event.marker.lat);
        this.selectedMarker = $event.marker;
        this.editMarkerForm();
    }

    clickOnMap($event) {
        if (!this.markerEdit && this.selectedEvent != null) {
            this.addNewMarker = true;
            const lontat = $event.coordinate;
            console.log(lontat);

            this.newMarker = new Marker();
            this.newMarker.coordinate = Marker.lonLatToCoordinates(lontat[0], lontat[1]);
        }
    }

    createMarker() {
        this.newMarker.tapeCode = this.newTapeCode;
        this.appService.addMarkerToEvent(this.selectedEvent, this.newMarker).subscribe(
            response => {
                console.log(response);
                this.refreshSelectedEvent();
            }
            , error => {
                console.log(error.error);
                this.refreshSelectedEvent();
            }
        );
        this.newTapeCode = null;
        this.addNewMarker = false;
    }




    refreshSelectedEvent() {
        this.appService.getEvent(this.selectedEvent).subscribe(
            response => {
                let event = new Event();
                event = response;
                this.selectedEvent = event;

                this.eventMarkers = of([]);
                this.child.markerSource.clear();
                this.selectedEventTracks = of([]);

                this.eventMarkers.subscribe(eventMarkers => {
                    this.selectedEvent.markers.forEach(function(marker) {
                        const newMarker = marker;
                        const coordinates = marker.coordinate;
                        if(coordinates != null) {
                            const lonLat = Marker.coordinatesToLonLat(coordinates);
                            newMarker.lon = lonLat.lon;
                            newMarker.lat = lonLat.lat;
                            if(!this.isAffiliateMarker(marker)) {
                                this.child.addMarker(lonLat.lon, lonLat.lat, marker);
                            }

                        }
                        eventMarkers.push(newMarker);

                    }.bind(this));
                });

                this.selectedEventTracks.subscribe(eventTracks => {
                    this.selectedEvent.tracks.forEach(function(track) {
                        const newTrack = track;
                        eventTracks.push(newTrack);
                    }.bind(this));
                });
            }
            , error => {
                console.log(error);

            });
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

    editMarkerForm() {
        this.markerEdit = true;
    }

    selectTrack(selectEvent) {
        const selectedTrackId = selectEvent.target.value;

        this.selectedEventTracks.subscribe(tracks => {
            this.selectedTrack = tracks.find(track => track.id === selectedTrackId);
        });
        this.trackMarkers.subscribe(markers => {
            this.selectedTrack.checkPoints.forEach(function(checkpoint) {
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
            const checkpoint = new CheckPoint();
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
        this.addNewMarker = false;
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

    returnToEventSelect() {
        this.router.navigate(['../event-page']);
    }

    onLogout() {
        this.appService.logout();
    }
}
