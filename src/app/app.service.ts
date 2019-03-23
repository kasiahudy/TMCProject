import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    private baseUrl = 'http://localhost:8080/api/login';

    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        return this.http.post<any>(`${this.baseUrl}` + `/users/authenticate`, { '{username}': username, '{password}': password })
            .pipe(map(user => {
                if (user && user.token) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }

    createUser(user): Observable<Object> {
        return this.http.post(`${this.baseUrl}` + `/create`, user);
    }

    updateUser(id: number, type: string): Observable<Object> {
        return this.http.put(`${this.baseUrl}/${id}`, type);
    }

    deleteUser(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
    }

    getUsers(): Observable<any> {
        return this.http.get(`${this.baseUrl}`);
    }
}
