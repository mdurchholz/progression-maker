import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

             //   c d e f g a b c
  getMajorScale = [2,2,1,2,2,2,1];

             //   a b c d e f g a
  getMinorScale = [2,1,2,2,1,2,2];


  getAllNotes = ['A',['A#','Bb'],'B','C',['C#','Db'],'D',['D#','Eb'],'E','F',['F#','Gb'],'G',['G#','Ab']];


  getEnharmonics( note:string = null, opposite:boolean = false )
  {
    function getKeyByValue(value, object) { return Object.keys(object).find(key => object[key] === value); }

    const notes = {
        'B#' : 'C',
        'Cb' : 'B',

        'E#' : 'F',
        'Fb' : 'E'
    };

    if( note && opposite ) return getKeyByValue(note,notes);

    return note ? notes[note] : notes;
  }


  parseKey( key:string )
  {
    if( key )
    {
      const count = key.length,
            base  = key.substr(0,1).toUpperCase();

      if( this.getAllNotes.includes(base) )
      {
        const flatT  = key.substr(1,4).toLowerCase(),
              shrpT  = key.substr(1,5).toLowerCase(),
              flatS  = flatT.substr(0,1),
              shrpS  = shrpT.substr(0,1),
              isFlat = flatT=='flat'  || flatS=='b',
              isShrp = shrpT=='sharp' || shrpS=='#';

        return {
          'base' : base,
          'semi' : isFlat ? 'b'    : (isShrp ? '#'     : ''),
          'text' : isFlat ? 'flat' : (isShrp ? 'sharp' : '')
        };
      }
    }

    return 'false';
  }


  formatNote( note:string, semi:string )
  {
    if( semi )
    {
        semi.replace('b', '&#9837;');
        semi.replace('#', '&#9839;');

        semi = '<span class="symbol">'+semi+'</span>';
    }

    return note+semi;
  }


  capitalize(str:string) { return str.charAt(0).toUpperCase() + str.slice(1); }

}
