import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Router} from '@angular/router';
import { SystemUser } from './models/system-user';
import { Event } from './models/event';
import {Marker} from './models/marker';
import {Track} from './models/track';
import {CheckPoint} from './models/checkPoint';

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

    deleteUser(user: SystemUser) {
        return this.http.post(`${this.baseUrl}/users/remove`, user, { withCredentials: true});
    }

    addEvent(event: Event) {
        return this.http.post(`${this.baseUrl}` + `/events/add?`, event,{ withCredentials: true});
    }

    getAllEvents(): Observable<any> {
        return this.http.get(`${this.baseUrl}/events`,{ withCredentials: true});
    }

    getEvent(event: Event): Observable<any> {
        return this.http.get(`${this.baseUrl}/events/${event.id}`,{ withCredentials: true});
    }

    addMarkerToEvent(event: Event, marker: Marker) {
        return this.http.put(`${this.baseUrl}/events/markers?eventId=${event.id}`, marker,{ withCredentials: true});
    }

    deleteMarkerFromEvent(event: Event, marker: Marker) {
        return this.http.delete(`${this.baseUrl}/events/markers?eventId=${event.id}&markerId=${marker.id}`,{ withCredentials: true});
    }

    editMarker(marker: Marker) {
        return this.http.post(`${this.baseUrl}` + `/markers?`, marker,{ withCredentials: true});
    }

    addTrackToEvent(event: Event, track: Track) {
        return this.http.put(`${this.baseUrl}/events/tracks?eventId=${event.id}`, track,{ withCredentials: true});
    }

    getEventTracks(event: Event): Observable<any> {
        return this.http.get(`${this.baseUrl}/events/tracks?eventId=${event.id}`, { withCredentials: true});
    }

    deleteTrack(event: Event, track: Track) {
        return this.http.delete(`${this.baseUrl}/events/tracks?eventId=${event.id}&trackId=${track.id}`,{ withCredentials: true});
    }

    addCheckpointToTrack(track: Track, checkpoint: CheckPoint) {
        return this.http.put(`${this.baseUrl}/tracks/checkpoints?trackId=${track.id}`, checkpoint,{ withCredentials: true});
    }

    deleteCheckpointFromTrack(track: Track, checkpoint: CheckPoint) {
        return this.http.delete(`${this.baseUrl}/tracks/checkpoints?trackId=${track.id}&checkPointId=${checkpoint.id}`,{ withCredentials: true});
    }

    getCheckpointAffiliatesMarkers(checkpoint: CheckPoint, affiliateId: string): Observable<any>  {
        return this.http.get(`${this.baseUrl}/checkpoints/affiliates?checkPointId=${checkpoint.id}&affiliateId=${affiliateId}`,{ withCredentials: true});
    }

    addCheckpointAffiliateMarker(checkpoint: CheckPoint, affiliateId: string)  {
        return this.http.put(`${this.baseUrl}/checkpoints/affiliates?checkPointId=${checkpoint.id}&affiliateId=${affiliateId}`, affiliateId,{ withCredentials: true});
    }

    deleteCheckpointAffiliateMarker(checkpoint: CheckPoint, affiliateId: string) {
        return this.http.delete(`${this.baseUrl}/checkpoints/affiliates?checkPointId=${checkpoint.id}&affiliateId=${affiliateId}`,{ withCredentials: true});
    }

    getBuilders(event: Event): Observable<any> {
        return this.http.get(`${this.baseUrl}/events/builders?eventId=${event.id}`,{ withCredentials: true});
    }

    addBuilder(event: Event, builderId: string) {
        return this.http.post(`${this.baseUrl}/events/builders?eventId=${event.id}&builderId=${builderId}`, builderId,{ withCredentials: true});
    }

    deleteBuilder(event: Event, builderId: string) {
        return this.http.delete(`${this.baseUrl}/events/builders?eventId=${event.id}&builderId=${builderId}`,{ withCredentials: true});
    }
}
