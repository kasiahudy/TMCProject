import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../app.service';
import { SystemUser } from '../models/system-user';

@Component({
    selector: 'app-login-page',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    user: SystemUser = new SystemUser();
    constructor(private appService: AppService, private router: Router) { }
    ngOnInit() {
    }

    onSubmit() {
        this.appService.loginUser(this.user.login, this.user.password)
            .subscribe(
                response => {
                    console.log(response);
                    this.router.navigate(['../event-page']);},
                    error => console.log(error));

    }
}
