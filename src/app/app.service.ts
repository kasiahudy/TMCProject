import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {Router} from '@angular/router';
import { User } from './user';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    private baseUrl = 'http://localhost:8080/api/login';

    constructor(private http: HttpClient, private router: Router) { }

    loginUser(username: string, password: string) {
        return this.http.post<any>(`${this.baseUrl}` + `/users/authenticate`, { '{username}': username, '{password}': password })
            .pipe(map(user => {
                if (user && user.token) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                return user;
            }));
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.router.navigate(['../login']);
    }

    createUser(user): Observable<Object> {
        return this.http.post(`${this.baseUrl}` + `/create`, user);
    }

    updateUser(id: number, value: any): Observable<Object> {
        return this.http.put(`${this.baseUrl}/${id}`, value);
    }

    deleteUser(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
    }

    getUsers(): Observable<any> {
        // return this.http.get(`${this.baseUrl}`);
        const user = new User();
        user.username = 'user';
        user.type = 'type';
        const users = [user, user, user, user];
        return of(users);
    }
}
