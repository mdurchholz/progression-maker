import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

@Component({
    selector: 'map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

    public scale;

    constructor(private route: ActivatedRoute, private router: Router) {

    }

    ngOnInit() {

        var path = window.location.pathname;

        if( path.charAt( 0 ) === '/' )  path = path.slice( 1 );

        var array = path.split('/'),
            scale = array[0],
            key   = array[1];

        if( array.length > 2 )
        {
            this.router.navigate([scale+'/'+key]);
        }
        // else if()
        // {
        //
        // }
    }
}
