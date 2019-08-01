import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { Router } from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })
@Injectable()
export class GlobalService {

  // constructor( private router:Router ) { }
  constructor( ) { }

  public capitalize(str:string) { return str.charAt(0).toUpperCase() + str.slice(1); }

  // public getPaths(){
  //   var tree = this.router.parseUrl(window.location.pathname).root.children.primary.segments;
  //
  //   return {
  //     'scale' : tree[0].path,
  //     'key'   : this.parseNote(tree[1].path)
  //   };
  // }

             //   c d e f g a b c
  getMajorScale = [2,2,1,2,2,2,1];

             //   a b c d e f g a
  getMinorScale = [2,1,2,2,1,2,2];


  getAllNotes = ['A',['A#','Bb'],'B','C',['C#','Db'],'D',['D#','Eb'],'E','F',['F#','Gb'],'G',['G#','Ab']];

  enharmonics = { 'B#':'C', 'Cb':'B', 'E#':'F', 'Fb':'E' };


  private keySource = new BehaviorSubject<any>({ note:{base:'C',semi:''}, scale:'major' });

  public appKey = this.keySource.asObservable();

  public getKey() { return this.appKey; }

  public setKey( newKey:any ) { this.keySource.next(Object.assign(this.keySource.value,{ note:newKey.note, scale:newKey.scale })); }

  public getKeyByValue( value, object ) { return Object.keys(object).find(key => object[key] === value); }

  public getEnharmonics( note:any, opposite:boolean = false )
  {
    var newNote = note,
        txtNote = note.base+note.semi;

    if( this.enharmonics[txtNote] )
    {
        newNote.base = this.enharmonics[txtNote];
        newNote.semi = '';
    }

    return newNote;
  }


  public parseNote( note:string )
  {
    if( note )
    {
      const base = note.substr(0,1).toUpperCase();

      console.log(base);

      if( this.getAllNotes.includes(base) )
      {
        const isFlat = note.substr(1,1).toLowerCase()=='b',
              isShrp = note.substr(1,1).toLowerCase()=='#';

        return {
          'base' : base,
          'semi' : isFlat ? 'b' : (isShrp ? '#' : '')
        };
      }
    }

    return 'false';
  }


  public formatNote( note:any )
  {
    var semi = note.semi,
        html = note.base;

    if( semi )
    {
      semi = semi.replace('b', '&#9837;').replace('#', '&#9839;');

      html += '<span class="symbol">'+semi+'</span>';
    }

    return html;
  }


  public getNotePosition( key:string )
  {
    var position = null;

    for(var i=0; i<this.getAllNotes.length; i++)
    {
      var note = this.getAllNotes[i];

      if( typeof note == 'object' )
      {
        for(var j=0; j<note.length; j++)
        {
          if( note[j]==key ) position = [i, j];
        }
      }
      else if( note==key )
      {
        position = [i];
      }
    }

    return position;
  }


  public getNotes( starting:string, scale:string )
  {
    var allNotes = this.getAllNotes,
        cntNotes = allNotes.length,

        newScale = [],
        getNote = this.parseNote( starting ),
        position = this.getNotePosition(getNote['base']+getNote['semi'])[0],

        shrpFlat = false,

        checkArr = [],
        checkPos = this.getNotePosition(getNote['base'])[0];
        // $rearange = array_mergearray_slice($allNotes,$checkPos), array_slice($allNotes,0,$checkPos));

    // console.log(parseNote['base']);
    // console.log(checkPos);

    return position;
  }

  /*
  function getNotes( $starting=null, $scale=null )
  {
      if( is_null($starting) || is_null($scale) ){ return false; }

      $allNotes = getAllNotes();
      $cntNotes = count($allNotes);

      $newScale = [];
      $parseNote = parseNote( $starting );
      $position = getNotePosition($parseNote['base'].$parseNote['semi'])[0];

      $shrpFlat = false;

      $checkArr = [];
      $checkPos = getNotePosition($parseNote['base'])[0];
      $rearange = array_merge(array_slice($allNotes,$checkPos), array_slice($allNotes,0,$checkPos));

      foreach( $rearange as $note ){ if( !is_array($note) ) array_push($checkArr, $note); }

      foreach( $scale as $index=>$step )
      {
          $note       = $allNotes[ $position % $cntNotes ];
          $noteCheck  = $checkArr[ $index ];
          $friendly   = $note;
          $enharmonic = false;

          if( is_array($note) )
          {
              foreach( $note as $opt=>$option )
              {
                  if( $noteCheck == parseNote($option)['base'] )
                  {
                      $shrpFlat = $opt;
                      $friendly = $note[$shrpFlat];
                  }
              }
          }
          else if( $note != $noteCheck )
          {
              $pKey = parseNote( $note );
              $pKey = $pKey['base'].$pKey['semi'];

              $enharmonic = getEnharmonics($pKey, true) ?: $noteCheck.($shrpFlat===0?'##':'bb');
          }

          array_push($newScale, [
              'options'    => $note,
              'friendly'   => $friendly,
              'enharmonic' => $enharmonic,
              'testing'    => $noteCheck
          ]);

          $position += $step;
      }

      return $newScale;
  // }
  */
}
