import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Router} from '@angular/router';
import { SystemUser } from './models/system-user';
import { Event } from './models/event';
import {Marker} from './models/marker';
import {Track} from './models/track';
import {Checkpoint} from './models/checkpoint';

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
        return this.http.post(`${this.baseUrl}` + `/users/add`, user);
    }

    getUsers(): Observable<any> {
        return this.http.get(`${this.baseUrl}/users`,{ withCredentials: true});
        /*const user = new User();
        user.username = 'user';
        user.type = 'type';
        const users = [user, user, user, user];
        return of(users);*/
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

    deleteCheckpointFromTrack(track: Track, checkpoint: Checkpoint) {
        return this.http.delete(`${this.baseUrl}/tracks/checkpoints?trackId=${track.id}&checkPointId=${checkpoint.id}`);
    }

    getBuilders(event: Event): Observable<any> {
        return this.http.get(`${this.baseUrl}/events/builders?eventId=${event.id}`);
    }

    addBuilder(event: Event, builderId: string) {
        return this.http.post(`${this.baseUrl}/events/builders?eventId=${event.id}&builderId=${builderId}`, builderId);
    }

    deleteBuilder(event: Event, builderId: string) {
        return this.http.delete(`${this.baseUrl}/events/builders?eventId=${event.id}&builderId=${builderId}`);
    }
}
