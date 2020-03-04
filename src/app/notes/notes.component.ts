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
  showFriendly:boolean;

  constructor( public global:GlobalService ) { }

  ngOnInit() {
    this.global.appKey.subscribe(
      gKey => (
        this.getNotes = this.global.getScaleNotes(gKey),
        this.harmonic = this.getNotes[ Object.keys(this.getNotes).length - 1 ]
      )
    )

    this.global.isFriendly.subscribe( value => this.showFriendly = value );
  }


  /////////////////////////////////////////////////////////
  // If technical exists and is not friendly mode
  /////////////////////////////////////////////////////////
  public checkTechnical( note ) { return note['technical'] && !this.showFriendly; }
  /////////////////////////////////////////////////////////
  // If technical exists, hide if not friendly mode, otherwise always show
  /////////////////////////////////////////////////////////
  public checkFriendly( note ) { return note['technical'] ? this.showFriendly : true; }
  /////////////////////////////////////////////////////////


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
  //
  /////////////////////////////////////////////////////////
  public noteClick( note ) {
      // console.log( note );
  }
  /////////////////////////////////////////////////////////

}
