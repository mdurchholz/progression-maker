import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
// import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss']
})
export class HeadingComponent implements OnInit {

    title:string;

    constructor( private global:GlobalService ) { }

    ngOnInit() {
      this.global.appKey.subscribe( gKey => this.title = this.formatHeading(gKey) );
    }

    formatHeading( getKey ) {
      return this.global.formatNote(getKey.note) + ' ' + this.global.capitalize(getKey.scale) + ' Chord Map';
    }
}
