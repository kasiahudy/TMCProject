import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../app.service';
import { User } from '../user';

import { AdminPageComponent } from '../admin-page/admin-page.component';
import {SystemUser} from '../system-user';

@Component({
    selector: 'user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

    @Input() user: SystemUser;

    constructor(private customerService: AppService, private adminPageComponent: AdminPageComponent) { }

    ngOnInit() {
    }

    updateUser() {
        /*this.customerService.updateUser(this.user.id,
            { username: this.user.login, type: this.user.privilage})
            .subscribe(
                data => {
                    console.log(data);
                    this.user = data as User;
                },
                error => console.log(error));*/
    }

    deleteUser() {
        /*this.customerService.deleteUser(this.user.id)
            .subscribe(
                data => {
                    console.log(data);
                    this.adminPageComponent.reloadData();
                },
                error => console.log(error));*/
    }
}
