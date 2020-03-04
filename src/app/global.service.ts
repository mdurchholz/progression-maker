import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable( )

export class GlobalService {

  constructor( private cookieService:CookieService ) { }

  /////////////////////////////////////////////////////////
  // Set Site Cookies
  /////////////////////////////////////////////////////////
  private setCookie(key:string, value:any) {
    var getCookie = this.checkCookie() ? this.checkCookie() : {};

    getCookie[key] = value;

    this.cookieService.set( '_pm', JSON.stringify( getCookie ) );
  }
  /////////////////////////////////////////////////////////
  // If key, check for cookie key. Else get site cookies
  /////////////////////////////////////////////////////////
  private getCookie(key:string = '') {
    var getCookie = this.checkCookie();

    if( key.length ) {
      return (typeof getCookie !== 'undefined') ? getCookie[key] : undefined;
    } else {
      return getCookie;
    }
  }
  /////////////////////////////////////////////////////////
  // Check is cookie object exists
  /////////////////////////////////////////////////////////
  private checkCookie() {
    var getCookie = this.cookieService.get('_pm');

    return getCookie ? JSON.parse(getCookie) : undefined;
  }
  /////////////////////////////////////////////////////////
  // Check to see is a cookie key exists
  /////////////////////////////////////////////////////////
  private checkPastCookie(key:string, fallback:any) {
    var cookieChk = this.getCookie(key);

    return (typeof cookieChk !== 'undefined') ? cookieChk : fallback;
  }
  /////////////////////////////////////////////////////////


  /////////////////////////////////////////////////////////
  // An object of enharmonic strings.
  /////////////////////////////////////////////////////////
  enharmonics = { 'B#':'C', 'Cb':'B', 'E#':'F', 'Fb':'E' };
  /////////////////////////////////////////////////////////
  // An array of all notes possible. The 2D array is a combination of enharmonic options.
  /////////////////////////////////////////////////////////
  getAllNotes = ['A',['A#','Bb'],'B','C',['C#','Db'],'D',['D#','Eb'],'E','F',['F#','Gb'],'G',['G#','Ab']];
  /////////////////////////////////////////////////////////
  getAllScales = ['major', 'minor'];
  /////////////////////////////////////////////////////////


  /////////////////////////////////////////////////////////
  // Set/Get app key
  /////////////////////////////////////////////////////////
  private keySource = new BehaviorSubject<object>( this.checkPastCookie('musicKey', {note:'C',scale:'major'}) );
  /////////////////////////////////////////////////////////
  public appKey = this.keySource.asObservable();
  /////////////////////////////////////////////////////////
  public getKey( object:string = null ) { var key = this.appKey.source['_value']; return object ? key[object] : key; }
  /////////////////////////////////////////////////////////
  public setKey( newKey:object ) {
      this.keySource.next( Object.assign(this.keySource.value, newKey) );

      this.setCookie('musicKey', this.getKey());
  }
  /////////////////////////////////////////////////////////


  /////////////////////////////////////////////////////////
  // Set friendly status
  /////////////////////////////////////////////////////////
  private friendly = new BehaviorSubject<boolean>( this.checkPastCookie('isFriendly', true) );
  /////////////////////////////////////////////////////////
  public isFriendly = this.friendly.asObservable();
  /////////////////////////////////////////////////////////
  public setFriendly( isFriendly:boolean ) {
      this.friendly.next( isFriendly );

      this.setCookie('isFriendly', isFriendly);
  }
  /////////////////////////////////////////////////////////


  /////////////////////////////////////////////////////////
  // Get the base note
  /////////////////////////////////////////////////////////
  public getNoteBase( note:string ) { return note.substr(0,1); }
  /////////////////////////////////////////////////////////
  // Get the half note symbol, if any
  /////////////////////////////////////////////////////////
  public getNoteSemi( note:string ) { return note.substr(1,(note.length-1)); }
  /////////////////////////////////////////////////////////
  // Check if key is in minor
  /////////////////////////////////////////////////////////
  public isMinor( scale:string = null ){ return (scale ? scale : this.getKey('scale')) == 'minor'; }
  /////////////////////////////////////////////////////////


  /////////////////////////////////////////////////////////
  // Get an array of scale steps
  /////////////////////////////////////////////////////////
  private getScaleSteps( scale:any ) {
    switch( scale ) {    // c d e f g a b c
      case 'major' : return [2,2,1,2,2,2,1]; break;
                         // a b c d e f g a
      case 'minor' : return [2,1,2,2,1,2,2]; break;
    }
  }
  /////////////////////////////////////////////////////////


  /////////////////////////////////////////////////////////
  // Get a key inside an object by the value of th key
  /////////////////////////////////////////////////////////
  private getKeyByValue( value, object ) { return Object.keys(object).find(key => object[key] === value); }
  /////////////////////////////////////////////////////////
  // Check to see if the note has an enharmonic
  /////////////////////////////////////////////////////////
  public checkEnharmonic( note:string, opposite:boolean = false ) {
    var newNote = note,
        hasNote = opposite ? this.getKeyByValue(newNote,this.enharmonics) : this.enharmonics[newNote];

    if( hasNote ) newNote = hasNote;

    return newNote;
  }
  /////////////////////////////////////////////////////////


  /////////////////////////////////////////////////////////
  // String to HTML
  /////////////////////////////////////////////////////////
  public noteStringToHtml( note:string ) {
    var text = '<span class="base">'+this.getNoteBase(note)+'</span>',
        semi = this.getNoteSemi(note).replace('#', '&#9839;').replace(/b/g, '&#9837;');

    if( semi ) text += '<span class="symbol">'+semi+'</span>';

    return text;
  }
  /////////////////////////////////////////////////////////


  /////////////////////////////////////////////////////////
  // Get array positioning of note
  /////////////////////////////////////////////////////////
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
  /////////////////////////////////////////////////////////


  /////////////////////////////////////////////////////////
  // Get an object of technical/friendly notes of a scale
  /////////////////////////////////////////////////////////
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

    for( var step=0, i=1; step < getSteps.length; step++, i++ ) {
      var getNote   = allNotes[ position % allNotes.length ],
          noteCheck = checkArr[ step ],
          options   = { technical:null, friendly:getNote, extension:null };

      if( typeof getNote === 'object' ) {
        if (!shrpFlat) for(var opt=0;opt<getNote.length;opt++) { if( noteCheck == this.getNoteBase(getNote[opt]) ) shrpFlat = opt; }

        options['friendly'] = getNote[shrpFlat];
      } else if( getNote != noteCheck ) {
        var enharmonic = this.checkEnharmonic(getNote, true);

        options['technical'] = (enharmonic != getNote) ? enharmonic : noteCheck+(!shrpFlat ? '𝄪' : 'bb');
      }

      // Check for minor or diminished chords
      if( ( this.isMinor( key['scale'] ) && (i==1 || i==4 || i==5)) ||
          (!this.isMinor( key['scale'] ) && (i==2 || i==3 || i==6))  )
      {
        options['extension'] = {class:'minor', html:'m'};
      }
      else if( ( this.isMinor( key['scale'] ) && (i==2) ) ||
               (!this.isMinor( key['scale'] ) && (i==7) ) )
      {
        options['extension'] = {class:'dim', html:'&deg;'};
      }

      newScale[step] = options;

      if( (step == (getSteps.length-1)) && this.isMinor() ) {
          newScale.push({ technical:options['technical'], friendly:options['friendly'], extension:{class:'dim', html:'&deg;'} });
      }

      position += getSteps[step];
    }

    return newScale;
  }
  /////////////////////////////////////////////////////////
}
