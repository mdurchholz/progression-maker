import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable( )


export class GlobalService {

  constructor( private cookieService:CookieService ) { }

  // Get a key inside an object by the value of th key
  private getKeyByValue( value, object ) { return Object.keys(object).find(key => object[key] === value); }

  enharmonics = { 'B#':'C', 'Cb':'B', 'E#':'F', 'Fb':'E' };

  getAllNotes = ['A',['A#','Bb'],'B','C',['C#','Db'],'D',['D#','Eb'],'E','F',['F#','Gb'],'G',['G#','Ab']];

  // Set/Get app key
  public keySource = new BehaviorSubject<object>( this.checkPastKey() );
  public appKey = this.keySource.asObservable();
  public getKey( object:string = null ) { var key = this.appKey.source['_value']; return object ? key[object] : key; }
  public setKey( newKey:object ) {
      this.keySource.next( Object.assign(this.keySource.value, newKey) );

      this.cookieService.set( 'musicKey', JSON.stringify( this.getKey() ) );
  }
  public checkPastKey() {
    var cookieChk = this.cookieService.get('musicKey');

    return cookieChk ? JSON.parse( cookieChk ) : { note:'C', scale:'major' };
  }


  // Set friendly status
  public friendly  = new BehaviorSubject<boolean>( this.checkPastFriendly() );
  public isFriendly = this.friendly.asObservable();
  public setFriendly( isFriendly:boolean ) {
      this.friendly.next( isFriendly );

      this.cookieService.set( 'isFriendly', JSON.stringify( isFriendly ) );
  }
  public checkPastFriendly() {
    var cookieChk = this.cookieService.get('isFriendly');

    return cookieChk ? JSON.parse( cookieChk ) : true;
  }


  // Get the base note
  public getNoteBase( note:string ) { return note.substr(0,1); }

  // Get the half note symbol, if any
  public getNoteSemi( note:string ) { return note.substr(1,(note.length-1)); }

  // Check if key is in minor
  public isMinor(){ return this.getKey('scale') == 'minor'; }


  // Get an array of scale steps
  private getScaleSteps( scale:any ) {
    var steps = [];

    switch( scale ) {   // c d e f g a b c
      case 'major':steps = [2,2,1,2,2,2,1]; break;
                        // a b c d e f g a
      case 'minor':steps = [2,1,2,2,1,2,2]; break;
    }

    return steps;
  }


  // Check to see if the note has an enharmonic
  public checkEnharmonic( note:string, opposite:boolean = false ) {
    var newNote = note,
        hasNote = opposite ? this.getKeyByValue(newNote,this.enharmonics) : this.enharmonics[newNote];

    if( hasNote ) newNote = hasNote;

    return newNote;
  }


  // Object to string. Option to retun HTML
  public noteStringToHtml( note:string ) {
    var text = this.getNoteBase(note),
        semi = this.getNoteSemi(note).replace('#', '&#9839;')
                                     .replace(/b/g, '&#9837;');

    if( semi ) text += '<span class="symbol">'+semi+'</span>';

    return text;
  }


  // Get array positioning of note
  public getNotePosition( noteString:string ) {
    var position = null;

    for(var i=0; i<this.getAllNotes.length; i++) {
      var note = this.getAllNotes[i];

      if( typeof note == 'object' ) {
        for(var j=0; j<note.length; j++){ if( note[j]==noteString ) position = [i, j]; }
      } else if( note==noteString ) {
        position = [i];
      }
    }

    return position;
  }


  public getScaleNotes( key:object ) {

    var allNotes = this.getAllNotes,
        getSteps = this.getScaleSteps( key['scale'] ),

        newScale = [],
        position = this.getNotePosition( key['note'] )[0],

        shrpFlat = null,

        checkArr = [],
        checkPos = this.getNotePosition( this.getNoteBase(key['note']) ),
        rearange = allNotes.slice(checkPos).concat( allNotes.slice(0,checkPos) );

    // Create array of ascending base notes in order to check for technical notes
    for( var note=0; note < rearange.length; note++ ) { if( typeof rearange[note] !== 'object' ) checkArr.push(rearange[note]); }

    for( var step=0; step < getSteps.length; step++ ) {
      var getNote   = allNotes[ position % allNotes.length ],
          noteCheck = checkArr[ step ],
          friendly  = getNote,
          technical = null;

      if( typeof getNote === 'object' ) {
        if (!shrpFlat) {
          for(var opt=0;opt<getNote.length;opt++) {
              if( noteCheck == this.getNoteBase(getNote[opt]) ) shrpFlat = opt;
          }
        }

        friendly = getNote[shrpFlat];
      } else if( getNote != noteCheck ) {
        var enharmonic = this.checkEnharmonic(getNote, true);

        technical = (enharmonic != getNote) ? enharmonic : noteCheck+(!shrpFlat ? '𝄪' : 'bb');
      }

      newScale[step] = { technical:technical, friendly:friendly };

      position += getSteps[step];
    }

    return newScale;
  }
}
