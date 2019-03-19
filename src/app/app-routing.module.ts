import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'map', component: MapComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes),
        RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
