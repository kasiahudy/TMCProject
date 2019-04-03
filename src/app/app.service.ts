import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {Router} from '@angular/router';
import { User } from './user';
import { SystemUser } from './system-user';

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
        this.router.navigate(['../login']);
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
}
