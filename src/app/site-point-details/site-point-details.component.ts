import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../app.service';

import { MapComponent } from '../map/map.component';
import {SitePoint} from '../site-point';
import { Marker } from '../marker';

@Component({
    selector: 'site-point-details',
    templateUrl: './site-point-details.component.html',
    styleUrls: ['./site-point-details.component.css']
})
export class SitePointDetailsComponent implements OnInit {

    //@Input() sitePoint: SitePoint;
    //sitePointNew: SitePoint;
    sitePointEdit = false;

    @Input() marker: Marker;
    newMarker: Marker;

    constructor(private customerService: AppService, private mapComponent: MapComponent) { }

    ngOnInit() {

    }
    edit() {
        this.newMarker = new Marker();
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

        this.marker.lon = null;
        this.marker.lat = null;
        this.marker = null;
    }
}
