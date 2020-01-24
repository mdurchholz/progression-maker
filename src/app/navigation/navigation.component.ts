import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
// import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  newKey:object;
  hasSemi:boolean;
  allNotes:object;

  constructor( private global:GlobalService ) { }

  ngOnInit() {

    this.allNotes = this.global.getAllNotes;

    this.global.appKey.subscribe(
      gKey => (
        this.newKey  = { base:this.global.getNoteBase(gKey['note']), semi:this.global.getNoteSemi(gKey['note']), scale:gKey['scale'] },
        this.hasSemi = this.global.getNoteSemi(gKey['note']) !=='' ? true : false
      )
    );
  }

  baseButtonClick( base ) { this.newKey['base'] = base; }

  semiButtonClick( semi ) {
    if( !this.hasSemi ) {
      this.hasSemi = true;
  } else if( this.newKey['semi'] == semi ) {
      this.hasSemi = false;
    }

    this.newKey['semi'] = this.hasSemi ? semi : '';
  }

  changeMap( newKey ) {
    this.global.setKey( { note: this.global.checkEnharmonic(newKey['base']+newKey['semi']), scale:newKey['scale'] } );
  }

}
