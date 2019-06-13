import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from '../../app.service';

import { Event } from '../../models/event';
import {Observable, of} from 'rxjs';
import {SystemUser} from '../../models/system-user';
import {Track} from '../../models/track';

@Component({
    selector: 'event-details',
    templateUrl: './event-details.component.html',
    styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {

    @Input() event: Event;
    @Input() users: Observable<SystemUser[]>;
    isEditEvent = false;
    eventBuilders: Observable<SystemUser>;
    eventTracks: Observable<Track[]>;

    selectedUserUsername: string;

    constructor(private appService: AppService) { }

    ngOnInit() {
        this.loadEventBuilders();
        this.loadEventTracks();
    }

    loadEventBuilders() {
        this.eventBuilders = this.appService.getBuilders(this.event);
    }

    loadEventTracks() {
        this.eventTracks = this.appService.getEventTracks(this.event);
    }

    selectUser(selectEvent) {
        this.selectedUserUsername = selectEvent.target.value;
    }

    addBuilder(){
        console.log(this.selectedUserUsername);
        this.appService.addBuilder(this.event, this.selectedUserUsername).subscribe(
            responses => {
                console.log(responses);
                this.loadEventBuilders();
            }
            , error => {
                console.log(error);
                this.loadEventBuilders();
            });
    }

    deleteBuilder($event) {
        this.appService.deleteBuilder(this.event, $event.builderId).subscribe(
            responses => {
                console.log(responses);
                this.loadEventBuilders();
            }
            , error => {
                console.log(error);
                this.loadEventBuilders();
            });
    }

    editEvent() {
        this.isEditEvent = true;
    }

    return(){
        this.isEditEvent = false;
    }
}
