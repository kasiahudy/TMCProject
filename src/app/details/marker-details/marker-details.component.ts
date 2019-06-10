import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from '../../app.service';

import { Marker } from '../../models/marker';

@Component({
    selector: 'marker-details',
    templateUrl: './marker-details.component.html',
    styleUrls: ['./marker-details.component.css']
})
export class MarkerDetailsComponent implements OnInit {

    sitePointEdit = false;

    @Input() marker: Marker;

    constructor(private appService: AppService) { }

    ngOnInit() {
        const coordinates = this.marker.coordinate;
        const lonLat = Marker.coordinatesToLonLat(coordinates)
        this.marker.lon = lonLat.lon;
        this.marker.lat = lonLat.lat;

    }

}
