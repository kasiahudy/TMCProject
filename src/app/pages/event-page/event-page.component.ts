import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import {Observable, of} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {Event} from "../../models/event";
import {CurrentUser} from "../../models/currentUser";

@Component({
    selector: 'event-page',
    templateUrl: './event-page.component.html',
    styleUrls: ['./event-page.component.css']
})

export class EventPageComponent implements OnInit {

    selectedEventId: string;
    events: Observable<Event[]>;
    showAdminPanelButton: boolean;
    username: string;

    constructor(private appService: AppService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.isAdmin();
        this.loadEvents();
        this.username = CurrentUser.username;
    }

    loadEvents() {
        this.events = of([]);
        this.appService.getAllEvents()
            .subscribe(
                responses => {
                    console.log(responses);
                    responses.forEach(function(response) {
                        this.events.subscribe(events => {
                            const eventBuilder = response.builders.find(builder => builder.login === this.username);
                            if(eventBuilder != null || this.username === 'admin') {
                                events.push(response);
                            }
                        });
                    }.bind(this));
                }
                , error => {
                    console.log(error);

                });
    }

    selectEvent(selectEvent){
        this.selectedEventId = selectEvent.target.value;

    }

    goToMap() {
        if(this.selectedEventId != null) {
            this.router.navigate(['../main-map-page', this.selectedEventId]);
        }
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

    onLogout() {
        this.appService.logout();
    }


}
