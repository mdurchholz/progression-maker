import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor( private router:Router ) {

  }
  
  public capitalize(str:string) { return str.charAt(0).toUpperCase() + str.slice(1); }

  public getPaths(){
    var tree = this.router.parseUrl(window.location.pathname).root.children.primary.segments;

    return {
      'scale' : tree[0].path,
      'key'   : this.parseKey(tree[1].path)
    };
  }

                    //   c d e f g a b c
  public getMajorScale = [2,2,1,2,2,2,1];

                    //   a b c d e f g a
  public getMinorScale = [2,1,2,2,1,2,2];


  public getAllNotes = ['A',['A#','Bb'],'B','C',['C#','Db'],'D',['D#','Eb'],'E','F',['F#','Gb'],'G',['G#','Ab']];


  public getEnharmonics( note:string = null, opposite:boolean = false )
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


  public parseKey( key:string )
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


  public formatNote( note:string, semi:string )
  {
    if( semi )
    {
        semi.replace('b', '&#9837;').replace('#', '&#9839;');

        semi = '<span class="symbol">'+semi+'</span>';
    }

    return note+semi;
  }
}
