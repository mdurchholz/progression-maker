import { Component, OnInit } from '@angular/core';
// import { Router, NavigationEnd } from '@angular/router';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-wrap',
  templateUrl: './app-wrap.component.html',
  styleUrls: ['./app-wrap.component.scss']
})

export class AppWrapComponent implements OnInit {

  getKey:object;
  getKeyPosi:string;

  isFriendly:boolean;

  getLists:object;

  showTable:boolean;
  focusCell:string;
  focusRow:string;
  activeCell:number;
  activeCells:any;
  tableCells:object;

  constructor( public global:GlobalService ) { }

  ngOnInit() {

    this.global.appKey.subscribe(
      gKey => (
        this.getKey = gKey,
        this.getKeyPosi = this.global.getNoteID( gKey['note'] )
      )
    );

    this.global.isFriendly.subscribe( value => this.isFriendly = value );

    this.global.savedChordLists.subscribe( value2 => this.getLists = value2 );

    this.showTable = null;

    this.focusRow = null;

    this.focusCell = null;
    this.activeCell = null;
    this.activeCells = [];

    this.tableCells = this.getTableCells();
  }

  private checkFriendly( key:object ) {
    let getNotes = this.global.getScaleNotes(key),
        hasTech  = false;

    for(let note=0; note<getNotes.length; note++) {
      if( getNotes[note]['technical'] && !hasTech ) hasTech = true;
    }

    return hasTech;
  }

  private getTableCells() {
    let tables = [];

    for(let s=0;s<this.global.getAllScales.length;s++) {
      let scale = this.global.getAllScales[s],
          table = { scale:scale, notes:[] };

      for(let n=0;n<this.global.getAllNotes.length;n++) {
        let note = this.global.getAllNotes[n];

        if( typeof note === 'object' ) {
          for(let semi=0;semi<note.length;semi++) {
            table['notes'].push( this.getNoteCells( {note:note[semi],scale:scale} ) );
          }
        } else {
          table['notes'].push( this.getNoteCells( {note:note,scale:scale} ) );
        }
      }

      tables.push(table);
    }

    return tables;
  }

  public getInfoUrl() {
    if( this.global.isMinor(this.getKey['scale']) )
      return 'https://www.youtube.com/watch?v=icNB8nIPCYI&list=PLXmi76euGSyx5LrRF0_czqlJZJYOjwqgL&index=7';
    else
      return 'https://www.youtube.com/watch?v=7eptsTUo8kk&list=PLXmi76euGSyx5LrRF0_czqlJZJYOjwqgL&index=11';
  }

  public getNoteCells( key:object ) {
    let notes = this.global.getScaleNotes( key ),
        cells = [];

    for(let n=1; n<=notes.length; n++) {
      if(n<8) {
        let note = notes[n-1];

        cells.push( {root:this.global.getNoteID( note['friendly'] ),note:note} );
      }
    }

    return cells;
  }

  public noteCellClick( note:number, row:string, cell:number, base:object = null ) {
    let cell_ID = row +'-'+ cell;

    this.activeCell = ( this.activeCell == note && this.focusCell == cell_ID ) ? null : note;

    this.focusRow = !this.activeCell ? null : row;
    this.focusCell = !this.activeCell ? null : cell_ID;

    this.activeCells = [this.activeCell];

    if( base && this.activeCell ) for(let b in base) if( b ) this.activeCells.push( base[b].root );
  }

  public isActiveCell( note:any, single:boolean = true ) {
    return this.activeCells.includes(note);
  }

  public isFocusCell( cell:string ) {
    return this.focusCell == cell;
  }

  public isFocusRow( row:string ) {
    return this.focusRow == row;
  }

  public checkActive( note:number, scale:string ) {
    return +this.getKeyPosi==note && this.getKey['scale']==scale;
  }

  public checkSubActive( note:number, scale:string ) {
    if( this.getKey['scale']!=scale ) {
      let sub = note + (3 * (this.global.isMinor( scale ) ? 1 : -1));

      if( sub < 1 ) {
        sub += 12;
      } else if( sub > 12) {
        sub -= 12;
      }

      return parseInt(this.getKeyPosi) == sub;
    }

    return false;
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
}
