import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';

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

  constructor( public global:GlobalService ) { }

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

  public semiButtonClick( semi ) {
    if( !this.hasSemi )
      this.hasSemi = true;
    else if( this.newKey['semi'] == semi )
      this.hasSemi = false;

    this.newKey['semi'] = this.hasSemi ? semi : '';
  }

  public changeMap( newKey ) {
    var key = {
        note  : this.global.checkEnharmonic(newKey['base']+newKey['semi']),
        scale : newKey['scale']
    };

    this.global.setKey(key);
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
