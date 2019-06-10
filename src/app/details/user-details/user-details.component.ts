import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { AppService } from '../../app.service';

import { AdminPageComponent } from '../../pages/admin-page/admin-page.component';
import {SystemUser} from '../../models/system-user';

@Component({
    selector: 'user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

    @Input() user: SystemUser;
    @Input() isBuilder: boolean;
    @Output() deleteBuilder = new EventEmitter();

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

    delete() {
        if(this.isBuilder) {
            this.deleteBuilder.emit({builderId: this.user.login});
        }
    }
}
