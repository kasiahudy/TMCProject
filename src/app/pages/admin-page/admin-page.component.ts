import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import {Observable, of} from 'rxjs';
import {SystemUser} from '../../models/system-user';
import {Router} from '@angular/router';
import { Event } from '../../models/event';
import * as moment from 'moment';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.css']
})

export class AdminPageComponent implements OnInit {

    users: Observable<SystemUser[]>;
    isAddNewEvent: boolean;
    newEventName: string;
    newEventDate: string;
    message: any;

    events: Observable<Event[]>;

    constructor(private appService: AppService, private router: Router) {
        this.message = {exists: 'false'};
    }

    ngOnInit() {
        this.isAddNewEvent = false;
        this.loadEvents();
        this.reloadData();
    }

    onLogout() {
        this.appService.logout() .subscribe(
            responses => {
                console.log(responses);
            }
            , error => {
                console.log(error);

            });
    }

    reloadData() {
        this.users = this.appService.getUsers();
    }

    addNewEvent() {
        this.isAddNewEvent = true;
    }

    loadEvents() {
        this.events = of([]);
        this.appService.getAllEvents()
            .subscribe(
                responses => {
                    console.log(responses);
                    responses.forEach(function(response) {
                        this.events.subscribe(events => {
                            //let builder = response.bulders.find
                            events.push(response);
                        });
                    }.bind(this));
                }
                , error => {
                    console.log(error);

                });
    }

    saveNewEvent() {
        this.isAddNewEvent = false;
        if(this.newEventName !== '') {
            const event = new Event();
            event.name = this.newEventName;
            event.date = this.newEventDate;
            if(moment(event.date).isValid()){
                event.date = moment(event.date).format('YYYY-MM-DD');
                this.appService.addEvent(event).subscribe(
                    response => {
                        console.log(response);
                        this.loadEvents();
                    }
                    , error => {
                        console.log(error);
                        this.loadEvents();
                    });
            } else {
                this.message = {exists: true, text: 'Wrong date type', type: 'error'};
            }
        } else {
            this.message = {exists: true, text: 'Fill name field', type: 'error'};
        }
        this.newEventDate = '';
        this.newEventName = '';
    }

    cancel() {
        this.isAddNewEvent = false;
    }

}
