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

  //
  public checkTechnical( note ) { return note['technical'] && !this.showFriendly; }

  //
  public checkFriendly( note ) { return note['technical'] ? this.showFriendly : true; }

  // Build note HTML of notes 1 - 7
  public noteOpts( details, i, harmonic:boolean = false ) {

    var noteHTML = null;

    // Check for minor or diminished chords
    if( ( this.global.isMinor() && (i==1 || i==4 || i==5)) ||
        (!this.global.isMinor() && (i==2 || i==3 || i==6))  )
    {
      noteHTML = {class:'minor', html:'m'};
    }
    else if( (this.global.isMinor() && i==2) || (!this.global.isMinor() && i==7 ) || harmonic )
    {
      noteHTML = {class:'dim', html:'&deg;'};
    }

    return noteHTML;
  }

}
