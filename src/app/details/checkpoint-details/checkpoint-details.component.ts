import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from '../../app.service';

import { MapComponent } from '../../pages/map/map.component';
import { Marker } from '../../models/marker';
import {Observable} from 'rxjs';
import {Track} from '../../models/track';

@Component({
    selector: 'checkpoint-details',
    templateUrl: './checkpoint-details.component.html',
    styleUrls: ['./checkpoint-details.component.css']
})
export class CheckpointDetailsComponent implements OnInit {

    checkpointEdit = false;

    @Input() track: Track;
    affiliateMarkers: Observable<Marker[]>;

    constructor(private appService: AppService, private mapComponent: MapComponent) { }

    ngOnInit() {

    }

}
