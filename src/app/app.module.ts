import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { MainMapPageComponent } from './pages/main-map-page/main-map-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './pages/register/register.component';
import { UserDetailsComponent } from './details/user-details/user-details.component';
import { MarkerDetailsComponent} from './details/marker-details/marker-details.component';
import {TrackDetailsComponent} from './details/track-details/track-details.component';
import {EventPageComponent} from './pages/event-page/event-page.component';
import {CheckpointDetailsComponent} from './details/checkpoint-details/checkpoint-details.component';
import {TrackMapComponent} from './pages/track-map/track-map.component';
import {EventDetailsComponent} from './details/event-details/event-details.component';
import {MapComponent} from './map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainMapPageComponent,
    AdminPageComponent,
    RegisterComponent,
    UserDetailsComponent,
    MarkerDetailsComponent,
    TrackDetailsComponent,
    EventPageComponent,
    CheckpointDetailsComponent,
    TrackMapComponent,
    EventDetailsComponent,
      MapComponent
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
