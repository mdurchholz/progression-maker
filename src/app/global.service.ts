import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { Router } from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })
@Injectable()
export class GlobalService {

/*
  constructor( private router:Router ) { }

  public getPaths(){
    var tree = this.router.parseUrl(window.location.pathname).root.children.primary.segments;

    return {
      'scale' : tree[0].path,
      'key'   : this.noteStringToObject(tree[1].path)
    };
  }
*/

  constructor( ) { }

  public capitalize(str:string) { return str.charAt(0).toUpperCase() + str.slice(1); }

  enharmonics = { 'B#':'C', 'Cb':'B', 'E#':'F', 'Fb':'E' };

  getAllNotes = ['A',['A#','Bb'],'B','C',['C#','Db'],'D',['D#','Eb'],'E','F',['F#','Gb'],'G',['G#','Ab']];

  private keySource = new BehaviorSubject<object>({ note:{base:'C',semi:null}, scale:'major' });

  public appKey = this.keySource.asObservable();

  public getKey() { return this.appKey; }

  public setKey( newKey:object ) { this.keySource.next( Object.assign(this.keySource.value, newKey) ); }

  private getKeyByValue( value, object ) { return Object.keys(object).find(key => object[key] === value); }

  private getScaleSteps( scale:any ) {
    var steps = [];

    switch( scale ) {   // c d e f g a b c
      case 'major':steps = [2,2,1,2,2,2,1]; break;
                        // a b c d e f g a
      case 'minor':steps = [2,1,2,2,1,2,2]; break;
    }

    return steps;
  }

  public checkEnharmonic( note:object ) {
    var newNote = note,
        hasNote = this.enharmonics[ this.noteObjectToString(note) ];

    if( hasNote ) newNote = this.noteStringToObject( hasNote );

    return newNote;
  }

  public getEnharmonic( note:object ) {
    console.log('getEnharmonic note:'+note);

    var newNote  = this.noteObjectToString( note ),
        position = this.getNotePosition( note );

    if( typeof position === 'object' ) {
      newNote = this.getAllNotes[position[0]][position[1] ? 0 : 1];
    }else{

    }

    console.log('getEnharmonic newNote:'+newNote);

    return this.noteStringToObject( newNote );
  }


  // Object to string. Option to retun HTML
  public noteObjectToString( note:object, html:boolean = false ) {
    var text = note['base'],
        semi = note['semi'];

    if( semi ) {
      if( html ) {
        text += '<span class="symbol">'+semi.replace('#', '&sharp;').replace('b', '&flat;')+'</span>';
      } else {
        text += semi;
      }
    }

    return text;
  }


  // String to Note Object
  public noteStringToObject( newNote:string ) {
    var object = { base:newNote.substr(0,1), semi:null };

    if( newNote.substr(1,1) ) { object['semi'] = newNote.substr(1,1); }

    return object;
  }


  // Get array positioning of note object
  public getNotePosition( noteObject:object ) {
    var position = null,
        noteString = this.noteObjectToString(noteObject);

    for(var i=0; i<this.getAllNotes.length; i++) {
      var note = this.getAllNotes[i];

      if( typeof note == 'object' ) {
        for(var j=0; j<note.length; j++) {
          if( note[j]==noteString ) { position = [i, j]; }
        }
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

        getPosi  = this.getNotePosition( key['note'] ),
        getStart = getPosi[0],
        shrpFlat = getPosi[1] ? getPosi[1] : 0,

        rearange = allNotes.slice(getStart).concat( allNotes.slice(0,getStart) ),

        checkArr = [];

    for( var note=0; note < rearange.length; note++ ) {
      if( typeof rearange[note] !== 'object' && (checkArr.length < getSteps.length) ) {
        checkArr.push(rearange[note]);
    } else if( !note && !shrpFlat ) {
        checkArr.push( rearange[note][shrpFlat].substr(0,1) );
      }
    }

    for( var i=0,position=0; i < getSteps.length; i++ ) {
        var newNote = rearange[position],
            technical = null,
            friendly  = null;

        if( typeof newNote === 'object' ) newNote = rearange[position][shrpFlat];

        friendly = this.noteStringToObject(newNote);

        if( checkArr[i] != friendly['base'] ) {

            friendly = this.getEnharmonic( friendly );

            console.log('getScaleNotes change newNote '+(i+1)+': ', friendly);

            // technical = true;
        }

        newScale[i] = { technical:technical, friendly:friendly };

        position += getSteps[i];
    }

    console.log('getScaleNotes newScale: ', newScale);

    return newScale;
  }
}




/*

input key


*/
