import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  getNotes:object;
  harmonic:object;

  constructor( public global:GlobalService ) { }

  ngOnInit() {
    this.global.appKey.subscribe(
      gKey => (
        this.getNotes = this.global.getScaleNotes(gKey),
        this.harmonic = this.getNotes[ Object.keys(this.getNotes).length - 1 ]
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

    note.position = position;

    // this.global.newChordList.push(note);

    let list = this.global.getChordLists();

    list[0].list.push(note);

    this.global.chordLists.next( list );

    /*
    let list = this.getChordLists();

    list.unshift();
    */
  }
  /////////////////////////////////////////////////////////

}
