import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Observable } from 'rxjs';
import {SystemUser} from '../system-user';
import {Router} from '@angular/router';
import { SiteMap} from '../site-map';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.css']
})

export class AdminPageComponent implements OnInit {

    users: Observable<SystemUser[]>;
    isAddNewMAp: boolean;
    newMapName: string;

    constructor(private appService: AppService, private router: Router) { }

    ngOnInit() {
        this.isAddNewMAp = false;
        this.reloadData();
    }

    onLogout() {
        this.appService.logout() .subscribe(
            responses => {
                console.log(responses);
            }
            , error => {
                console.log(error);

            });
    }

    reloadData() {
        this.users = this.appService.getUsers();
    }

    addNewMap() {
        this.isAddNewMAp = true;
    }

    saveNewMap() {
        this.isAddNewMAp = false;
        if(this.newMapName !== '') {
            const siteMap = new SiteMap();
            siteMap.name = this.newMapName;
            siteMap.points = [];
            this.appService.addMap(siteMap).subscribe(
                response => {
                    console.log(response);
                }
                , error => {
                    console.log(error);

                });
        }
    }

    cancel() {
        this.isAddNewMAp = false;
    }

}
