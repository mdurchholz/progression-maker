import { Component, OnInit } from '@angular/core'; // Input
// import { Router, NavigationEnd } from '@angular/router';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-wrap',
  templateUrl: './app-wrap.component.html',
  styleUrls: ['./app-wrap.component.scss']
})

export class AppWrapComponent implements OnInit {

  // Inherit value from parent tempalte
  // @Input() i : number;

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
        this.getKeyPosi = this.global.getNoteID( gKey['note'] ),
        this.title = this.formatHeading(gKey)
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


  /////////////////////////////////////////////////////////
  // Capitalize the first letter of a string
  /////////////////////////////////////////////////////////
  private capitalize(str:string) { return str.charAt(0).toUpperCase() + str.slice(1); }
  /////////////////////////////////////////////////////////
  // Format heading HTML
  /////////////////////////////////////////////////////////
  public formatHeading( getKey ) { return this.global.noteStringToHtml(getKey.note) + ' ' + this.capitalize(getKey.scale) + ' Chord Map'; }
  /////////////////////////////////////////////////////////


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

}
