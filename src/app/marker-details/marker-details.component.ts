import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from '../app.service';

import { MapComponent } from '../map/map.component';
import { Marker } from '../models/marker';
import { Event } from '../models/event';

@Component({
    selector: 'marker-details',
    templateUrl: './marker-details.component.html',
    styleUrls: ['./marker-details.component.css']
})
export class MarkerDetailsComponent implements OnInit {

    sitePointEdit = false;

    @Input() marker: Marker;
    @Input() event: Event;
    @Output() refreshEvent: EventEmitter<null> = new EventEmitter();
    newMarker: Marker;

    constructor(private appService: AppService, private mapComponent: MapComponent) { }

    ngOnInit() {

    }
    edit() {
        this.newMarker = new Marker();
        this.newMarker.id = this.marker.id;
        this.newMarker.lat = this.marker.lat;
        this.newMarker.lon = this.marker.lon;
        this.sitePointEdit = true;
    }
    onSubmit(){
        this.marker = this.newMarker;
        this.sitePointEdit = false;
    }

    cancel() {
        this.sitePointEdit = false;
    }

    delete() {
        this.appService.deleteMarkerFromEvent(this.event, this.marker).subscribe(
            responses => {
                console.log(responses);
                this.marker.lon = null;
                this.marker.lat = null;
                this.marker = null;
                this.refreshEvent.emit();
            }
            , error => {
                console.log(error);
                this.refreshEvent.emit();
            }
        );
    }
}
