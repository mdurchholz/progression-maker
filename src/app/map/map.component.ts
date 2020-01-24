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
  }

  noteOpts( details, position ) {
    var friendly  = details['friendly'],
        technical = details['technical'],
        noteHTML  = '';

    if( technical ) noteHTML += '<span class="technical">'+this.global.noteStringToHtml( technical )+'</span>';

    noteHTML += '<span class="friendly">'+this.global.noteStringToHtml( friendly )+'</span>';

    return noteHTML;
  }

}
