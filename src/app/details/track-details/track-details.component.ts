import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from '../../app.service';

import {Track} from '../../models/track';
import {Observable, of} from 'rxjs';
import {Marker} from '../../models/marker';
import {Event} from '../../models/event';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'track-details',
    templateUrl: './track-details.component.html',
    styleUrls: ['./track-details.component.css']
})

export class TrackDetailsComponent implements OnInit {

    @Input() track: Track;
    @Input() event: Event;
    @Output() showMainMenu: EventEmitter<null> = new EventEmitter();
    @Output() hideMainMenu: EventEmitter<null> = new EventEmitter();
    trackMarkers: Observable<Marker[]>;
    trackEdit: boolean;

    constructor(private appService: AppService, private router: Router) { }

    ngOnInit() {
        this.trackEdit = false;
        this.trackMarkers = of([]);
        this.trackMarkers.subscribe(markers => {
            this.track.checkPoints.forEach(function(checkpoint) {
                let marker = new Marker();
                marker = checkpoint.mainMarker;
                if(marker != null) {
                    markers.push(marker);
                }
            }.bind(this));
        });
    }

    editTrack() {
        this.router.navigate(['../track-map', this.event.id, this.track.id]);
    }


}
