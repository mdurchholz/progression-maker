import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule, routingComponents } from './app-routing.module';

import { AppComponent } from './app.component';
import { GlobalService } from './global.service';
import { NavigationComponent } from './navigation/navigation.component';
import { MapComponent } from './map/map.component';
import { NotesComponent } from './notes/notes.component';

import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    routingComponents,
    MapComponent,
    NotesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [GlobalService, CookieService],
  bootstrap: [AppComponent]
})

export class AppModule { }
