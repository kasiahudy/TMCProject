import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Observable } from 'rxjs';
import {User} from "../user";

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.css']
})

export class AdminPageComponent implements OnInit {

    users: Observable<User[]>;

    constructor(private appService: AppService) { }

    ngOnInit() {
        this.reloadData();
    }

    onLogout() {
        this.appService.logout();
    }

    reloadData() {
        this.users = this.appService.getUsers();
    }

}
