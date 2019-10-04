import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit {

  scale:string;
  getNotes:any;

  constructor( private global:GlobalService ) { }

  ngOnInit() {
    this.global.appKey.subscribe(
      gKey => (
        this.scale = gKey['scale'],

        this.getNotes = this.global.getScaleNotes(gKey)
      )
    )

    // console.log(this.getNotes);
  }

  noteOpts( details, test ) {
    var html = details['friendly'].note;

    html = '<span class="friendly">'+this.global.formatNote(html, true)+'</span>';

    return html;
  }

}
