import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

    public scale;
    public getPaths;

    constructor(private router: Router) {
        this.getPaths = router.parseUrl(window.location.pathname).root.children.primary.segments;
    }

    ngOnInit() {
        this.scale  = this.getPaths[0].path;
    }
}
