import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from '../../app.service';

import { Marker } from '../../models/marker';
import {Observable, of} from 'rxjs';
import {CheckPoint} from '../../models/checkPoint';

@Component({
    selector: 'checkpoint-details',
    templateUrl: './checkpoint-details.component.html',
    styleUrls: ['./checkpoint-details.component.css']
})
export class CheckpointDetailsComponent implements OnInit {

    @Input() checkpoint: CheckPoint;
    @Input() showAffiliateMarkers: boolean;
    affiliateMarkers: Observable<Marker[]>;

    constructor(private appService: AppService) { }

    ngOnInit() {
        if(this.showAffiliateMarkers) {
            this.affiliateMarkers = of([]);
            this.affiliateMarkers.subscribe(affiliateMarkers => {
                this.checkpoint.affiliateMarkers.forEach(affiliateMarker => {
                    affiliateMarkers.push(affiliateMarker);
                });
            });
        }

    }

}
