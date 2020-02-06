import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss']
})
export class HeadingComponent implements OnInit {

    title:string;

    constructor( public global:GlobalService ) { }

    ngOnInit() {
      this.global.appKey.subscribe( gKey => this.title = this.formatHeading(gKey) );
    }

    // Format heading HTML
    public formatHeading( getKey ) {
      return this.global.noteStringToHtml(getKey.note) + ' ' + this.capitalize(getKey.scale) + ' Chord Map';
    }

    // Capitalize the first letter of a string
    private capitalize(str:string) { return str.charAt(0).toUpperCase() + str.slice(1); }

}
