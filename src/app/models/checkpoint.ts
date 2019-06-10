import { Marker } from './marker';
export class Checkpoint {
    id: string;
    mainMarker: Marker;
    affiliateMarkers: Marker[];
}
