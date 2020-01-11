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
  getNotesTest:any;

  constructor( private global:GlobalService ) { }

  ngOnInit() {
    this.global.appKey.subscribe(
      gKey => (
        this.scale = gKey['scale'],

        this.getNotes = this.global.getScaleNotes(gKey),
        this.getNotesTest = 0
      )
    )
  }

  noteOpts( details ) {
    var friendly = details['friendly'],
        noteHTML = '<span class="friendly">'+this.global.noteObjectToString(details['friendly'], true);

    if( details['technical'] ) {

    }

    noteHTML += '</span>';

    return noteHTML;
  }

}
