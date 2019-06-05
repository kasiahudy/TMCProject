import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './register/register.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { MarkerDetailsComponent} from './marker-details/marker-details.component';
import {TrackDetailsComponent} from './track-details/track-details.component';
import {EventPageComponent} from './event-page/event-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MapComponent,
    AdminPageComponent,
    RegisterComponent,
    UserDetailsComponent,
    MarkerDetailsComponent,
    TrackDetailsComponent,
      EventPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
