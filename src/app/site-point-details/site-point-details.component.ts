import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../app.service';

import { MapComponent } from '../map/map.component';
import {SitePoint} from '../site-point';

@Component({
    selector: 'site-point-details',
    templateUrl: './site-point-details.component.html',
    styleUrls: ['./site-point-details.component.css']
})
export class SitePointDetailsComponent implements OnInit {

    @Input() sitePoint: SitePoint;
    sitePointNew: SitePoint;
    sitePointEdit = false;

    constructor(private customerService: AppService, private mapComponent: MapComponent) { }

    ngOnInit() {

    }
    edit() {
        this.sitePointNew = new SitePoint();
        this.sitePointNew.lat = this.sitePoint.lat;
        this.sitePointNew.lon = this.sitePoint.lon;
        this.sitePointEdit = true;
    }
    onSubmit(){
        this.sitePoint = this.sitePointNew;
        this.sitePointEdit = false;
    }

    cancel() {
        this.sitePointEdit = false;
    }

    delete() {
        this.sitePoint = null;
    }
}
