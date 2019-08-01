import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule, routingComponents } from './app-routing.module';

import { AppComponent } from './app.component';
import { GlobalService } from './global.service';
import { HeadingComponent } from './heading/heading.component';
import { NavigationComponent } from './navigation/navigation.component';
import { MapComponent } from './map/map.component';


@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    routingComponents,
    HeadingComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [GlobalService],
  bootstrap: [AppComponent]
})

export class AppModule { }
