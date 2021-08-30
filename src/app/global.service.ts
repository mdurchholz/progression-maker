import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { CookieService } from 'ngx-cookie-service';

@Injectable( )

export class GlobalService {

  // constructor( private cookieService:CookieService ) { }
  // this.cookieService.set(KEY,VALUE);
  // this.cookieService.get(KEY);

  /////////////////////////////////////////////////////////
  // Set Site Storage
  /////////////////////////////////////////////////////////
  private setStorage( key:string, value:any ) {
    var getStorage = this.checkStorage() ? this.checkStorage() : {};

    getStorage[key] = value;

    localStorage.setItem('_pm', JSON.stringify( getStorage ) );
  }
  /////////////////////////////////////////////////////////
  // If key, check for cookie/storage key. Else get site cookies/storage
  /////////////////////////////////////////////////////////
  private getStorage( key:string = '' ) {
    var getStorage = this.checkStorage();

    if( key.length ) {
      return (typeof getStorage !== 'undefined') ? getStorage[key] : undefined;
    } else {
      return getStorage;
    }
  }
  /////////////////////////////////////////////////////////
  // Check is cookie/storage object exists
  /////////////////////////////////////////////////////////
  private checkStorage() {
    var getStorage = localStorage.getItem('_pm')

    return getStorage ? JSON.parse(getStorage) : undefined;
  }
  /////////////////////////////////////////////////////////
  // Check to see is a cookie/storage key exists
  /////////////////////////////////////////////////////////
  private checkPastStorage( key:string, fallback:any ) {
    var storageChk = this.getStorage(key);

    return (typeof storageChk !== 'undefined') ? storageChk : fallback;
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
  // Set to true when you are building a progression
  /////////////////////////////////////////////////////////
  viewLists = false;
  /////////////////////////////////////////////////////////
  isBuilding = false;
  /////////////////////////////////////////////////////////
  newList = null;
  /////////////////////////////////////////////////////////
  activeNote = null;
  /////////////////////////////////////////////////////////
  public chordLists = this.checkPastStorage('savedChordLists', []);
  /////////////////////////////////////////////////////////
  public setChordLists( value:object = null ) {
    this.setStorage('savedChordLists', value);
  }
  /////////////////////////////////////////////////////////
  public beginList() {
    this.isBuilding = true;

    let list = this.chordLists;

    list.unshift({
      key : this.getStaticKey(),
      list : []
    });

    this.chordLists = list;
  }
  /////////////////////////////////////////////////////////
  public cancelList() {
    this.isBuilding = false;

    let list = this.chordLists;

    list.shift();

    this.chordLists = list;

    this.activeNote = null;
  }
  /////////////////////////////////////////////////////////
  public saveList() {
    this.setChordLists( this.chordLists );

    this.activeNote = null;

    this.isBuilding = false;
  }
  /////////////////////////////////////////////////////////
  public deleteList( position ) {
    let list = this.chordLists;

    list.splice(position, 1);

    this.setChordLists(list);
  }
  /////////////////////////////////////////////////////////


  /////////////////////////////////////////////////////////
  // Set/Get app key
  /////////////////////////////////////////////////////////
  public getStaticKey() { return this.checkPastStorage('musicKey', {note:'C',scale:'major'}); }
  /////////////////////////////////////////////////////////
  private keySource = new BehaviorSubject<object>( this.getStaticKey() );
  /////////////////////////////////////////////////////////
  public appKey = this.keySource.asObservable();
  /////////////////////////////////////////////////////////
  public getKey( object:string = null ) { var key = this.appKey.source['_value']; return object ? key[object] : key; }
  /////////////////////////////////////////////////////////
  public setKey( newKey:object ) {
    this.keySource.next( Object.assign(this.keySource.value, newKey) );

    this.appKey.subscribe(gKey=>( this.setStorage('musicKey', gKey) ));
  }
  /////////////////////////////////////////////////////////


  /////////////////////////////////////////////////////////
  // Set friendly status
  /////////////////////////////////////////////////////////
  private friendly = new BehaviorSubject<boolean>( this.checkPastStorage('isFriendly', true) );
  /////////////////////////////////////////////////////////
  public isFriendly = this.friendly.asObservable();
  /////////////////////////////////////////////////////////
  public setFriendly( isFriendly:boolean ) {
    this.friendly.next( isFriendly );
    this.setStorage('isFriendly', isFriendly);
  }
  /////////////////////////////////////////////////////////
  private getFriendly() { return this.isFriendly.source['_value'];  }
  /////////////////////////////////////////////////////////
  // If technical exists, hide if not friendly mode, otherwise always show
  /////////////////////////////////////////////////////////
  public showFriendly( note ) { return note['technical'] ? this.getFriendly() : true; }
  /////////////////////////////////////////////////////////
  // If technical exists and is not friendly mode
  /////////////////////////////////////////////////////////
  public showTechnical( note ) { return note['technical'] && !this.getFriendly(); }
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
  public isMinor( scale:string = null ){
      var isMinor;
      this.appKey.subscribe(
        gKey => (
          isMinor = (scale ? scale : gKey['scale']) == 'minor'
        )
      );
      return isMinor;
  }
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
  public getNoteID( note:string ) {
    return this.getNotePosition( note )[0] + 1;
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


/*
--MAJOR--
A  : A  Bm  C#m D  E  F#m G#dim
A# : A# Cm  Dm  D# F  Gm  Adim
Bb : Bb Cm  Dm  Eb F  Gm  Adim
B  : B  C#m D#m E  F# G#m A#dim
C  : C  Dm  Em  F  G  Am  Bdim
C# : C# D#m Fm  F# G# A#m Cdim
Db : Db Ebm Fm  Gb Ab Bbm Cdim
D  : D  Em  F#m G  A  Bm  C#dim
D# : D# Fm  Gm  G# A# Cm  Ddim
Eb : Eb Fm  Gm  Ab Bb Cm  Ddim
E  : E  F#m G#m A  B  C#m D#dim
F  : F  Gm  Am  Bb C  Dm  Edim
F# : F# G#m A#m B  C# D#m Fdim
Gb : Gb Abm Bbm B  Db Ebm Fdim
G  : G  Am  Bm  C  D  Em  F#dim
G# : G# A#m Cm  C# D# Fm  Gdim
Ab : Ab Bbm Cm  Db Eb Fm  Gdim

--MINOR--
A  : Am  Bdim  C  Dm  Em  F  G
A# : A#m Cdim  C# D#m Fm  F# G#
Bb : Bbm Cdim  Db Ebm Fm  Gb Ab
B  : Bm  C#dim D  Em  F#m G  A
C  : Cm  Ddim  Eb Fm  Gm  Ab Bb
C# : C#m D#dim E  F#m G#m A  B
Db : Dbm Ebdim E  Gbm Abm A  B
D  : Dm  Edim  F  Gm  Am  Bb C
D# : D#m Fdim  F# G#m A#m B  C#
Eb : Ebm Fdim  Gb Abm Bbm B  Db
E  : Em  F#dim G  Am  Bm  C  D
F  : Fm  Gdim  Ab Bbm Cm  Db Eb
F# : F#m G#dim A  Bm  C#m D  E
Gb : Gbm Abdim A  Bm  Dbm D  E
G  : Gm  Adim  Bb Cm  Dm  Eb F
G# : G#m A#dim B  C#m D#m E  F#
Ab : Abm Bbdim B  Dbm Ebm E  Gb
*/
