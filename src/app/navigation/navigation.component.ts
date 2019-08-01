import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
// import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  notes:object;
  newKey:object;
  hasSemi:boolean;

  constructor( private global:GlobalService ) { }

  ngOnInit() {
    this.notes = this.global.getAllNotes;

    this.global.appKey.subscribe(
      gKey => (
        this.newKey  = gKey,
        this.hasSemi = gKey.note.semi ? true : false
      )
    );
  }

  semiButtons( type ) {
    if( !this.hasSemi )
      this.hasSemi = true;
    else if( this.newKey['note']['semi'] == type )
      this.hasSemi = false;

    this.newKey['note']['semi'] = this.hasSemi ? type : '';
  }

  changeMap( newKey ) {

    newKey.note = this.global.getEnharmonics(newKey.note);

    this.global.setKey( newKey );

    // this.router.navigate([scale+'/'+key+semi]);
  }
}
