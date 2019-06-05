import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Observable } from 'rxjs';
import {SystemUser} from '../models/system-user';
import {Router} from '@angular/router';
import { SiteMap} from '../site-map';
import { Event } from '../models/event';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.css']
})

export class AdminPageComponent implements OnInit {

    users: Observable<SystemUser[]>;
    isAddNewEvent: boolean;
    newEventName: string;

    constructor(private appService: AppService, private router: Router) { }

    ngOnInit() {
        this.isAddNewEvent = false;
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

    saveNewEvent() {
        this.isAddNewEvent = false;
        if(this.newEventName !== '') {
            const event = new Event();
            event.name = this.newEventName;
            event.date = '2019-05-15';
            this.appService.addEvent(event).subscribe(
                response => {
                    console.log(response);
                }
                , error => {
                    console.log(error);

                });
        }
    }

    cancel() {
        this.isAddNewEvent = false;
    }

}
