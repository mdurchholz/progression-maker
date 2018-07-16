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

      // this.route.paramMap.subscribe((params: ParamMap) => {
      //     let scale = params.get('scale');
      //     let note  = params.get('note');
      //
      //     this.scale = scale ? scale : null;
      // });
      //
      // console.log(this.scale);
  }

}
