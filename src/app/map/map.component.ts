import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit {

  scale:string;
  baseN:string;

  constructor( private global:GlobalService ) {  }

  ngOnInit() {
    this.global.appKey.subscribe(
        gKey => (
            this.scale = gKey.scale,
            this.baseN = this.global.formatNote(gKey.note)
        )
    )
  }

}
