import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../app.service';
import { SystemUser } from '../system-user';

@Component({
    selector: 'app-register-page',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
    user: SystemUser = new SystemUser();
    message: any;
    constructor(private appService: AppService, private router: Router) {
        this.message = {exists: 'false'};
    }
    ngOnInit() {
    }

    onSubmit() {
        this.user.privilage = 'NORMAL_USER';
        this.appService.createUser(this.user)
            .subscribe(
            response => {
                console.log(response);}
            , error => {
                console.log(error.error.text);
                if(error.error.text === undefined) {
                    this.message = {exists: true, text: 'User login already exists', type: 'error'};
                } else {
                    this.router.navigate(['../map']);
                }

            });
    }
}
