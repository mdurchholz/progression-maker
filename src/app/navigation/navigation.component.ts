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
  isFriendly:boolean;
  showFriendly:boolean;

  constructor( private global:GlobalService ) { }

  ngOnInit() {
    this.global.appKey.subscribe(
      gKey => (
        this.newKey = { base:this.global.getNoteBase(gKey['note']), semi:this.global.getNoteSemi(gKey['note']), scale:gKey['scale'] },
        this.hasSemi = this.global.getNoteSemi(gKey['note']) !=='' ? true : false,
        this.showFriendly = this.checkFriendly(gKey)
      )
    );

    this.global.isFriendly.subscribe( value => this.isFriendly = value );
  }

  private baseButtonClick( base ) { this.newKey['base'] = base; }

  private semiButtonClick( semi ) {
    if( !this.hasSemi )
      this.hasSemi = true;
    else if( this.newKey['semi'] == semi )
      this.hasSemi = false;

    this.newKey['semi'] = this.hasSemi ? semi : '';
  }

  private friendlyButtonClick( isFriendly ) { this.global.setFriendly(isFriendly); }

  private changeMap( newKey ) {
    this.global.setKey({
        note  : this.global.checkEnharmonic(newKey['base']+newKey['semi']),
        scale : newKey['scale']
    });
  }

  private checkFriendly( key:object ) {
    var getNotes = this.global.getScaleNotes(key),
        hasTech  = false;

    for(var note=0; note<getNotes.length; note++) {
      if( getNotes[note]['technical'] && !hasTech ) hasTech = true;
    }
    return hasTech;
  }

}
