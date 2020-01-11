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
          this.newKey  = gKey,
          this.hasSemi = gKey['note']['semi'] ? true : false
      )
    );
  }

  baseButtonClick( base ) {
    this.newKey['note']['base'] = base;
  }

  semiButtonClick( semi ) {
    if( !this.hasSemi ) {
      this.hasSemi = true;
  } else if( this.newKey['note']['semi'] == semi ) {
      this.hasSemi = false;
    }

    this.newKey['note']['semi'] = this.hasSemi ? semi : '';
  }

  changeMap( changeKey ) {
    changeKey['note'] = this.global.checkEnharmonic( changeKey['note'] );

    this.global.setKey( changeKey );
  }

}
