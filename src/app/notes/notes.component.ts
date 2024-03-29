import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  getNotes:object;

  constructor( public global:GlobalService ) { }

  ngOnInit() {
    this.global.appKey.subscribe(
      gKey => (
        this.getNotes = this.global.getScaleNotes(gKey)
      )
    )
  }


  /////////////////////////////////////////////////////////
  // Return HTML of a note's spot in a scale
  /////////////////////////////////////////////////////////
  public getSpot( number ) {
    switch (number) {
      case 1  : return 'TONIC'; break;
      case 8  : return '7<sup>(Harmonic)</sup>'; break;
      default : return number;
    }
   }
  /////////////////////////////////////////////////////////


  /////////////////////////////////////////////////////////
  // Add note to list when in build mode
  /////////////////////////////////////////////////////////
  public noteClick( position, note ) {
    if( !this.global.isBuilding ) { return; }

    this.global.activeNote = position;

    note.position = position + 1;

    this.global.setLines( position );

    let list = this.global.chordLists;

    list[0].list.push(note);

    this.global.chordLists = list;
  }
  /////////////////////////////////////////////////////////

}
