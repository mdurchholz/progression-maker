import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  scale:string;
  getNotes:object;
  isMinor:boolean;

  constructor( public global:GlobalService ) { }

  ngOnInit() {

    this.global.appKey.subscribe(
      gKey => (
        this.scale = gKey['scale'],
        this.isMinor = this.scale=='minor',
        this.getNotes = this.global.getScaleNotes(gKey)
      )
    )
  }

  // Build note HTML of notes 1 - 7
  public noteOpts( details, i ) {
    var noteHTML = '<span class="spot">'+ (i==1 ? 'TONIC' : i) + '</span><span class="root">';

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

    return noteHTML + '</span>';
  }

  public note7Harmonic( details, i ) {
    var noteHTML = '<span class="spot">7<span class="type">(harmonic)</span></span><span class="root">';

    // Check for technical note
    if( details['technical'] ) noteHTML += '<span class="technical">'+this.global.noteStringToHtml( details['technical'] )+'</span>';

    noteHTML += '<span class="friendly">'+this.global.noteStringToHtml( details['friendly'] )+'</span><span class="symbol dim">&deg;</span></span>';

    return noteHTML;
  }

}
