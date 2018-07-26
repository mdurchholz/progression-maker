import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public note;
    public title;
    public getPaths;

    constructor(private router: Router, private global: GlobalService ) {
        const tree = router.parseUrl(window.location.pathname),
              path = tree.root.children.primary;

        this.getPaths = path ? path.segments : false;
    }

    ngOnInit() {
        function capitalize(string) { return string.charAt(0).toUpperCase() + string.slice(1); }

        if( this.getPaths )
        {
            var scale  = capitalize(this.getPaths[0].path),
                getKey = this.global.parseKey(this.getPaths[1].path);

            this.note  = this.global.formatNote(getKey['base']+getKey['semi']);
            this.title = scale+' Chord Map';
        }
        else
        {
            this.title = 'Welcome!';
        }
    }
}
