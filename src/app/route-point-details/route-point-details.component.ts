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
    routePointNew: RoutePoint;
    routePointEdit = false;

    constructor(private customerService: AppService, private mapComponent: MapComponent) { }

    ngOnInit() {

    }
    edit() {
        this.routePointNew = new RoutePoint();
        this.routePointNew.name = this.routePoint.name;
        this.routePointNew.description = this.routePoint.description;
        this.routePointNew.lat = this.routePoint.lat;
        this.routePointNew.lon = this.routePoint.lon;
        this.routePointEdit = true;
    }
    onSubmit(){
        this.routePoint = this.routePointNew;
        this.routePointEdit = false;
    }

    cancel() {
        this.routePointEdit = false;
    }
}
