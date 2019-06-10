import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainMapPageComponent } from './pages/main-map-page/main-map-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './pages/register/register.component';
import {EventPageComponent} from './pages/event-page/event-page.component';
import {TrackMapComponent} from './pages/track-map/track-map.component';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'main-map-page/:selectedEventId', component: MainMapPageComponent, canActivate: [AuthGuard] },
    { path: 'admin-page', component: AdminPageComponent, canActivate: [AuthGuard] },
    { path: 'register', component:  RegisterComponent},
    { path: 'event-page', component: EventPageComponent},
    { path: 'track-map/:selectedEventId/:selectedTrackId', component: TrackMapComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes),
        RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
