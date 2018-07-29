import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { GlobalService } from '../global.service';

@Component({
  selector: 'heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss']
})
export class HeadingComponent implements OnInit {

    public title;

    constructor( private router:Router, private global:GlobalService ) {
      this.router.events.subscribe((evt) => {
        if (evt instanceof NavigationEnd) {
          this.ngOnInit();
        }
      });
    }

    ngOnInit() {
      this.title = this.formatHeading(this.global.getPaths()['key'], this.global.getPaths()['scale']);
    }

    formatHeading(key, scale){
      return this.global.formatNote(key['base'],key['semi']) + ' ' + this.global.capitalize(scale) + ' Chord Map';
    }
}
