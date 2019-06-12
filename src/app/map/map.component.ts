import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { AppService } from '../app.service';

import OlMap from 'ol/Map';
import OlXYZ from 'ol/source/XYZ';

import OlWMS from 'ol/source/TileWMS';

import OlTileLayer from 'ol/layer/Tile';
import OlView from 'ol/View';

import OlLayerVector from 'ol/layer/Vector';
import OlSourceVector from 'ol/source/Vector';
import OlFeature from 'ol/Feature';
import OlGeomPoint from 'ol/geom/Point';
import OlStyle from 'ol/style/Style';
import OlIcon from 'ol/style/Icon';
import OlText from 'ol/style/Text';

import { transform, toLonLat, get } from 'ol/proj';

import { fromLonLat } from 'ol/proj';
import { saveAs } from 'file-saver';

@Component({
    selector: 'map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

    @Output() clickOnMarker = new EventEmitter();
    @Output() clickOnMap = new EventEmitter();
    map: OlMap;
    source: OlXYZ;
    layer: OlTileLayer;
    view: OlView;
    markerSource: OlSourceVector;
    markerLayer: OlLayerVector;

    constructor(private customerService: AppService) { }

    ngOnInit() {
        /*this.source = new OlWMS({
            url: 'http://mapy.geoportal.gov.pl/wss/service/img/guest/TOPO/MapServer/WMSServer',
            params: {
                'LAYERS': 'Raster',
                'CRS': 'EPSG:2180',
                'VERSION': '1.1.1'
            }
        });*/
        this.source = new OlXYZ({
            url: 'http://tile.osm.org/{z}/{x}/{y}.png',
            crossOrigin: 'anonymous'
        });

        this.layer = new OlTileLayer({
            source: this.source,
            /*isBaseLayer: true,
            projection: get('EPSG:2180')*/
        });

        this.view = new OlView({
            center: fromLonLat([18.532743, 54.422876]),
            zoom: 11
        });

        this.map = new OlMap({
            target: 'map',
            layers: [this.layer],
            view: this.view
        });

        this.map.on('click', this.handleMapClick.bind(this));

        this.markerSource = new OlSourceVector({
        });
        this.markerLayer = new OlLayerVector({ source: this.markerSource});
        this.map.addLayer(this.markerLayer );
        this.markerSource.clear();
    }

    handleMapClick(evt) {
        const f = this.map.forEachFeatureAtPixel(
            evt.pixel,
            function(ft, layer){return ft;}
        );
        if (f && f.get('type') === 'click') {
            const marker = f.get('desc');
            this.clickOnMarker.emit({marker: marker});
        } else {

            this.clickOnMap.emit({coordinate: toLonLat(evt.coordinate)});
        }
    }

    addMarker(lng, lat, marker) {

        const olMarker = new OlFeature({
            type: 'click',
            desc: marker,
            geometry: new OlGeomPoint(transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'))
        });

        // icon creator: http://cdn.mapmarker.io/editor
        const iconStyle = new OlStyle({
            image: new OlIcon(({
                anchor: [0.5, 0.5],
                src: 'assets/marker.png',
                crossOrigin: null
            })),
            text: new OlText({
                text: marker.tapeCode + ' ' + (marker.lanternCode ? marker.lanternCode : ''),
                offsetY: -16,
                font: 'bold 15px sans-serif'
            })
        });

        olMarker.setStyle(iconStyle);

        this.markerSource.addFeature(olMarker);
    }

    exportMap() {
        this.map.once('rendercomplete', function(event) {
            const canvas = event.context.canvas;
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
            } else {
                canvas.toBlob(function(blob) {
                    saveAs(blob, 'map.png');
                });
            }
        });
        this.map.renderSync();
    }

}
