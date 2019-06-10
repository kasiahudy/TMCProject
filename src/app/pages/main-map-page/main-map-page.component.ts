import { Component, OnInit, ViewChild } from '@angular/core';

import { AppService } from '../../app.service';
import {Router, ActivatedRoute} from '@angular/router';

import {Observable, of} from 'rxjs';

import { Event } from '../../models/event';
import { Marker } from '../../models/marker';
import {Track} from '../../models/track';
import {Checkpoint} from '../../models/checkpoint';

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
            const lontat = $event.coordinate;
            console.log(lontat); //   <=== coordinate projection

            const marker = new Marker();
            marker.coordinate = Marker.lonLatToCoordinates(lontat[0], lontat[1]);
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
                            this.child.addMarker(lonLat.lon, lonLat.lat, marker);
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

    returnToEventSelect() {
        this.router.navigate(['../event-page']);
    }

    onLogout() {
        this.appService.logout();
    }
}
