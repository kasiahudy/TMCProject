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
    @Output() refreshEvent: EventEmitter<null> = new EventEmitter();

    constructor(private appService: AppService, private adminPageComponent: AdminPageComponent) { }

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
        this.appService.deleteUser(this.user)
            .subscribe(
                data => {
                    console.log(data);
                    this.refreshEvent.emit();
                },
                error => {
                    console.log(error);
                    this.refreshEvent.emit();
                });
    }

    delete() {
        if(this.isBuilder) {
            this.deleteBuilder.emit({builderId: this.user.login});
        }
    }
}
