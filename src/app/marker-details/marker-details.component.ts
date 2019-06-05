import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from '../app.service';

import { MapComponent } from '../map/map.component';
import { Marker } from '../models/marker';

@Component({
    selector: 'marker-details',
    templateUrl: './marker-details.component.html',
    styleUrls: ['./marker-details.component.css']
})
export class MarkerDetailsComponent implements OnInit {

    sitePointEdit = false;

    @Input() marker: Marker;

    constructor(private appService: AppService, private mapComponent: MapComponent) { }

    ngOnInit() {
        let coordinates = this.marker.coordinate;
        coordinates = coordinates.replace(new RegExp('POINT \\(', 'g'), '');
        coordinates = coordinates.replace(new RegExp('\\);', 'g'), '');
        const lonLat = coordinates.split(' ');
        this.marker.lon = parseFloat (lonLat[0]);
        this.marker.lat = parseFloat (lonLat[1]);

    }

}
