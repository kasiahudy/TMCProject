import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from '../app.service';

import { MapComponent } from '../map/map.component';
import {Track} from '../models/track';
import {Observable, of} from "rxjs";
import {Marker} from "../models/marker";

@Component({
    selector: 'track-details',
    templateUrl: './track-details.component.html',
    styleUrls: ['./track-details.component.css']
})

export class TrackDetailsComponent implements OnInit {

    @Input() track: Track;
    trackMarkers: Observable<Marker[]>;

    constructor(private appService: AppService, private mapComponent: MapComponent) { }

    ngOnInit() {
        this.trackMarkers = of([]);
        this.trackMarkers.subscribe(markers => {
            this.track.checkpoints.forEach(function(checkpoint) {
                let marker = new Marker();
                marker = checkpoint.mainMarker;
                if(marker != null) {
                    markers.push(marker);
                }
            }.bind(this));
        });
    }

}
