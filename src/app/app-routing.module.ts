import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'map', component: MapComponent, canActivate: [AuthGuard] },
    { path: 'admin-page', component: AdminPageComponent, canActivate: [AuthGuard] },
    { path: 'register', component:  RegisterComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes),
        RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
