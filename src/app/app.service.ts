import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Router} from '@angular/router';
import { SystemUser } from './models/system-user';
import { SiteMap } from './site-map';
import { Event } from './models/event';
import {Marker} from './models/marker';
import {Track} from "./models/track";
import {Checkpoint} from "./models/checkpoint";

@Injectable({
    providedIn: 'root'
})
export class AppService {

    private baseUrl = 'http://localhost:8080/api';

    constructor(private http: HttpClient, private router: Router) { }

    loginUser(username: string, password: string) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Access-Control-Allow-Credentials':  'true',
            })
        };

        const payload = new FormData();

        payload.append('username', username);
        payload.append('password', password);
        return this.http.post<any>(`${this.baseUrl}` + `/login`, payload,{ withCredentials: true});
    }

    logout() {
        localStorage.removeItem('currentUser');
        return this.http.get(`${this.baseUrl}/logout`);
    }

    createUser(user: SystemUser): Observable<Object> {

        //const user = new SystemUser();
        //user.login = 'katxxxx';
        //user.password = 'hud';
        //user.privilage = 'NORMAL_USER';

        return this.http.post(`${this.baseUrl}` + `/users/add`, user);
    }

    updateUser(id: number, value: any): Observable<Object> {
        return this.http.put(`${this.baseUrl}/${id}`, value);
    }

    deleteUser(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
    }

    getUsers(): Observable<any> {
        return this.http.get(`${this.baseUrl}/users`,{ withCredentials: true});
        /*const user = new User();
        user.username = 'user';
        user.type = 'type';
        const users = [user, user, user, user];
        return of(users);*/
    }

    fixSiteMap(siteMap: SiteMap) {
        const newSiteMap = {name: '', points: ''};
        newSiteMap.name = siteMap.name;
        siteMap.points.forEach( function(point) {
            newSiteMap.points += 'POINT (' + point.lon + ' ' + point.lat + ');';
        });
        return newSiteMap;
    }

    addMap(siteMap: SiteMap) {
        /*const siteMap = new SiteMap();
        siteMap.name = 'new map4';
        siteMap.points = [];

        const routePoint = new SitePoint();
        routePoint.lon = 18.532743;
        routePoint.lat = 54.422876;

        const routePoint2 = new SitePoint();
        routePoint2.lon = 18.544867;
        routePoint2.lat = 54.422876;
        siteMap.points.push(routePoint);
        siteMap.points.push(routePoint2);*/


        return this.http.post(`${this.baseUrl}` + `/maps?`, this.fixSiteMap(siteMap));
    }

    getMap(siteMapName: string): Observable<any> {


        return this.http.get(`${this.baseUrl}/maps/points?`, {params: {mapName: siteMapName}});
    }

    getAllMaps(): Observable<any> {
        return this.http.get(`${this.baseUrl}/maps/all`);
    }

    addEvent(event: Event) {
        return this.http.post(`${this.baseUrl}` + `/events/add?`, event);
    }

    getAllEvents(): Observable<any> {
        return this.http.get(`${this.baseUrl}/events`);
    }

    getEvent(event: Event): Observable<any> {
        return this.http.get(`${this.baseUrl}/events/${event.id}`);
    }

    addMarkerToEvent(event: Event, marker: Marker) {
        return this.http.put(`${this.baseUrl}/events/markers?eventId=${event.id}`, marker);
    }

    deleteMarkerFromEvent(event: Event, marker: Marker) {
        return this.http.delete(`${this.baseUrl}/events/markers?eventId=${event.id}&markerId=${marker.id}`);
    }

    editMarker(marker: Marker) {
        return this.http.post(`${this.baseUrl}` + `/markers?`, marker);
    }

    addTrackToEvent(event: Event, track: Track) {
        return this.http.put(`${this.baseUrl}/events/tracks?eventId=${event.id}`, track);
    }

    addCheckpointToTrack(track: Track, checkpoint: Checkpoint) {
        return this.http.put(`${this.baseUrl}/tracks/checkpoints?id=${track.id}`, checkpoint);
    }
}
