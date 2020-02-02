import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  isMinor:boolean;
  getNotes:object;

  constructor( public global:GlobalService ) { }

  ngOnInit() {

    this.global.appKey.subscribe(
      gKey => (
        this.isMinor = gKey['scale']=='minor',
        this.getNotes = this.global.getScaleNotes(gKey)
      )
    )
  }

  // Build note HTML of notes 1 - 7
  public noteOpts( details, i ) {

    var noteHTML = '<span class="fill"></span><div><div class="spot">'+ (i==1 ? 'TONIC' : i) + '</div><div class="root">';

    // Check for technical note
    if( details['technical'] ) noteHTML += '<span class="technical">'+this.global.noteStringToHtml( details['technical'] )+'</span>';

    // Add friendly note
    noteHTML += '<span class="friendly">'+this.global.noteStringToHtml( details['friendly'] )+'</span>';

    // Check for minor or diminished chords
    if( ( this.isMinor && (i==1 || i==4 || i==5)) ||
        (!this.isMinor && (i==2 || i==3 || i==6))  )
      noteHTML += '<span class="chord-type minor">m</span>';
    else if( (this.isMinor && i==2) || (!this.isMinor && i==7 ) )
      noteHTML += '<span class="chord-type dim">&deg;</span>';

    return noteHTML + '</div>';
  }

  // Build note HTML of minor 7 harmonic
  public note7Harmonic( details, i ) {
    var noteHTML = '<span class="spot">7<span class="type">(harmonic)</span></span><span class="root">';

    // Check for technical note
    if( details['technical'] ) noteHTML += '<span class="technical">'+this.global.noteStringToHtml( details['technical'] )+'</span>';

    noteHTML += '<span class="friendly">'+this.global.noteStringToHtml( details['friendly'] )+'</span><span class="chord-type dim">&deg;</span></span></div>';

    return noteHTML;
  }

}
