export class Marker {
    id: string;
    coordinate: string;
    lon: number;
    lat: number;
    lanternCode: string;
    tapeCode: string;

    static lonLatToCoordinates(lon, lat) {
        const coordinates = 'POINT (' + lon + ' ' + lat + ');';
        return coordinates;
    }

    static coordinatesToLonLat(coordinates) {
        let lon = null;
        let lat = null
        if(coordinates != null) {
            coordinates = coordinates.replace(new RegExp('POINT \\(', 'g'), '');
            coordinates = coordinates.replace(new RegExp('\\);', 'g'), '');
            const lonLat = coordinates.split(' ');
            lon = parseFloat(lonLat[0]);
            lat = parseFloat(lonLat[1]);
        }
        return {lon, lat};
    }
}

