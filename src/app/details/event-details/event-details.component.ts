import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from '../../app.service';

import { Event } from '../../models/event';
import {Observable} from "rxjs";
import {SystemUser} from "../../models/system-user";

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
    selectedUserUsername: string;

    constructor(private appService: AppService) { }

    ngOnInit() {
    }

    selectUser(selectEvent) {
        this.selectedUserUsername = selectEvent.target.value;
    }

    addBuilder(){
        console.log(this.selectedUserUsername);
    }

    editEvent() {
        this.isEditEvent = true;
    }

    return(){
        this.isEditEvent = false;
    }
}
