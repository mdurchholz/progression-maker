import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../global.service';

@Component({
  selector: 'heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss']
})
export class HeadingComponent implements OnInit {

    public title;
    public getPaths;

    constructor(private router: Router, private global: GlobalService) {
        this.getPaths = router.parseUrl(window.location.pathname).root.children.primary.segments;
    }

    ngOnInit() {

      if( this.getPaths )
      {
        var scale  = this.global.capitalize(this.getPaths[0].path),
            getKey = this.global.parseKey(this.getPaths[1].path);

        this.title = this.global.formatNote(getKey['base'],getKey['semi']) + ' ' + scale + ' Chord Map';
      }
      else
      {
        this.title = 'Welcome!';
      }
    }

}
