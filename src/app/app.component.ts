import { Component, OnInit } from '@angular/core';
import { Router, ParamMap } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public title;

    constructor(private router: Router) {

    }

    ngOnInit() {
        let state = 'Minor';

        this.title = 'C '+state+' Chord Map';

        // console.log(this.router);
    }
}
