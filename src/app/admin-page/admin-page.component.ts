import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Observable } from 'rxjs';
import {SystemUser} from '../system-user';
import {Router} from '@angular/router';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.css']
})

export class AdminPageComponent implements OnInit {

    users: Observable<SystemUser[]>;

    constructor(private appService: AppService, private router: Router) { }

    ngOnInit() {
        this.reloadData();
    }

    onLogout() {
        this.appService.logout();
    }

    mapPage() {
        this.router.navigate(['../map']);
    }

    reloadData() {
        this.users = this.appService.getUsers();
    }

}
