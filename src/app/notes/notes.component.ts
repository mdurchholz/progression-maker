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


  // Build note HTML of notes 1 - 7
  public noteOpts( details, i, harmonic:boolean = false ) {

    var noteHTML = '';

    // Check for technical note
    if( details['technical'] ) noteHTML += '<span class="technical">'+this.global.noteStringToHtml( details['technical'] )+'</span>';

    // Add friendly note
    noteHTML += '<span class="friendly">'+this.global.noteStringToHtml( details['friendly'] )+'</span>';

    // Check for minor or diminished chords
    if( ( this.global.isMinor && (i==1 || i==4 || i==5)) ||
        (!this.global.isMinor && (i==2 || i==3 || i==6))  )
      noteHTML += '<span class="chord-type minor">m</span>';
    else if( (this.global.isMinor && i==2) || (!this.global.isMinor && i==7 ) )
      noteHTML += '<span class="chord-type dim">&deg;</span>';
    else if( harmonic )
      noteHTML += '<span class="chord-type dim">&deg;</span></div>';

    return noteHTML;
  }

}
