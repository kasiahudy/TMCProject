import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import {Observable, of} from 'rxjs';
import {Router} from '@angular/router';
import {Event} from "../models/event";

@Component({
    selector: 'event-page',
    templateUrl: './event-page.component.html',
    styleUrls: ['./event-page.component.css']
})

export class EventPageComponent implements OnInit {

    selectedEventId: string;
    events: Observable<Event[]>;

    constructor(private appService: AppService, private router: Router) { }

    ngOnInit() {
        this.loadEvents();
    }

    loadEvents() {
        this.events = of([]);
        this.appService.getAllEvents()
            .subscribe(
                responses => {
                    console.log(responses);
                    responses.forEach(function(response) {
                        this.events.subscribe(events => {
                            events.push(response);
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
            this.router.navigate(['../map', this.selectedEventId]);
        }
    }


}
