import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../app.service';

import { MapComponent } from '../map/map.component';
import {SiteMap} from '../site-map';
import {Observable, of} from 'rxjs';
import {SitePoint} from '../site-point';

@Component({
    selector: 'site-map-details',
    templateUrl: './site-map-details.component.html',
    styleUrls: ['./site-map-details.component.css']
})
export class SiteMapDetailsComponent implements OnInit {

    @Input() siteMap: SiteMap;
    sitePoints: Observable<SitePoint[]>;

    constructor(private customerService: AppService, private mapComponent: MapComponent) { }

    ngOnInit() {
        this.sitePoints = of(this.siteMap.points);
    }
}
