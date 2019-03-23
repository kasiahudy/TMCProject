import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../app.service';
import { User } from '../user';

@Component({
    selector: 'app-login-page',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    user: User = new User();
    x: User;
    constructor(private appService: AppService, private router: Router) { }
    ngOnInit() {
    }

    onSubmit() {
        this.x = this.user;
        // this.appService.loginUser(this.user)
        //    .subscribe(
        //        response => {console.log(response); this.userType = response['userType']; }, error => console.log(error));
        switch (this.user.username) {
            case 'admin': {
                localStorage.setItem('currentUser', JSON.stringify('user'));
                this.router.navigate(['../admin-page']);
                break;
            }
            case 'user': {
                localStorage.setItem('currentUser', JSON.stringify('user'));

                this.router.navigate(['../map']);
                break;
            }
            default: {
                break;
            }
        }
    }
}
