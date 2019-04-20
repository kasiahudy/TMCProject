import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../app.service';

import { MapComponent } from '../map/map.component';
import {RoutePoint} from '../route-point';

@Component({
    selector: 'route-point-details',
    templateUrl: './route-point-details.component.html',
    styleUrls: ['./route-point-details.component.css']
})
export class RoutePointDetailsComponent implements OnInit {

    @Input() routePoint: RoutePoint;

    constructor(private customerService: AppService, private mapComponent: MapComponent) { }

    ngOnInit() {
    }

}
