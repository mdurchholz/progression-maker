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
      'key'   : this.parseNote(tree[1].path)
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

  public setKey( newKey:object ) { this.keySource.next( Object.assign(this.keySource.value,{ note:newKey['note'], scale:newKey['scale'] }) ); }

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


  public checkEnharmonic( note:any, opposite:boolean = false ) {
    var newNote = note,
        txtNote = this.formatNote(note);

    if( this.enharmonics[txtNote] ) {
        newNote = this.parseNote( this.enharmonics[txtNote] );
      // console.log( newNote );
    }

    // return opposite ? this.getKeyByValue(newNote,this.enharmonics) : newNote;
    return newNote;
  }


  public formatNote( note:object, html:boolean = false ) {
    var text = note['base'];

    if( note['semi'] ) {
      if( html ) {
        text += '<span class="symbol">'+note['semi'].replace('#', '&sharp;').replace('b', '&flat;')+'</span>';
      } else {
        text += note['semi'];
      }
    }

    return text;
  }


  public parseNote( note:string ) {
    var object = { note : { base:note.substr(0,1), semi:null }};

    if( note.length > 1 ) { object['note']['semi'] = note.substr(1,1); }

    return object;
  }


  public getNotePosition( checkNote:object ) {
    var position = null,
        chckNote = this.formatNote(checkNote);

    for(var i=0; i<this.getAllNotes.length; i++) {
      var note = this.getAllNotes[i];

      if( typeof note == 'object' ) {
        for(var j=0; j<note.length; j++) {
          if( note[j]==chckNote ) position = [i, j];
        }
    } else if( note==chckNote ) {
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
        getSemi  = getPosi[1],

        rearange = allNotes.slice(getStart).concat( allNotes.slice(0,getStart) );

    for( var i=0,position=0; i < getSteps.length; i++ ) {
        var newNote = rearange[position];

        if( typeof newNote === 'object' ) {
            newNote = rearange[position][getSemi];
        }

        newScale[i] = {
            technical : '',
            friendly  : this.parseNote( newNote )
        };

        position += getSteps[i];
    }
/*
    for( var note=0; note < rearange.length; note++ ) {
      if( typeof rearange[note] === 'object' )
        checkArr.push(rearange[note]);
    }

    for( var index=0; index < getScale.length; index++ ) {
      var noteStart  = allNotes[ position % allNotes.length ],
          noteCheck  = checkArr[ index ],
          // scaleNote  = this.parseNote( noteStart ),
          enharmonic = false;

         console.log( noteStart );

      if( typeof noteStart == 'object' ) {
        // for( var opt=0; opt<noteStart.length; opt++ ) {
        //   if( noteCheck == noteStart[opt].substr(0,1) ) {
        //     shrpFlat = opt;
        //     friendly['semi'] = noteStart[opt];
        //   }
        // }
      } else if( noteStart != noteCheck ) {
        var checkEnhar = this.getEnharmonics(noteStart, true);

        enharmonic = checkEnhar ? checkEnhar: noteCheck+(!shrpFlat?'##':'bb');
      }

      newScale.push({
         // 'friendly' : friendly,
        // 'enharmonic' : enharmonic
      });

      position += getScale[index];
    }
*/
    // console.log( newScale );

    return newScale;
  }
}




/*

input key


*/
