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
  showBtn:boolean;

  constructor( public global:GlobalService ) { }

  ngOnInit() {
    this.global.appKey.subscribe(
      gKey => (
        this.newKey = this.setNewKey( gKey ),
        this.hasSemi = this.global.getNoteSemi( gKey['note'] ) !=='' ? true : false
      )
    );

    this.showBtn = false;
  }

  public buttonClick( type:string, value:string = '' ) {
    switch (type) {
      case 'note':
        this.newKey['base'] = value;
        break;

      case 'semi':
        if( !this.hasSemi )
          this.hasSemi = true;
        else if( this.newKey['semi'] == value )
          this.hasSemi = false;

        this.newKey['semi'] = this.hasSemi ? value : '';
        break;

      case 'scale':
        this.newKey['scale'] = value;
        break;

      case 'submit':
        if(this.showBtn) this.global.setKey( this.newKeyToObject() );
        break;

      case 'clear':
        this.newKey = this.setNewKey( this.global.getKey() );
        break;

      default:
        return false;
    }

    var object_1 = this.global.getKey(),
        object_2 = this.newKeyToObject();

    this.showBtn = ( object_1['note'] != object_2['note'] || object_1['scale'] != object_2['scale'] );
  }

  public setNewKey( key:object ) {
    return { base:this.global.getNoteBase(key['note']), semi:this.global.getNoteSemi(key['note']), scale:key['scale'] };
  }

  public newKeyToObject() {
    return {
      note  : this.global.checkEnharmonic(this.newKey['base']+this.newKey['semi']),
      scale : this.newKey['scale']
    };
  }

  public newListToggle() {
    this.global.viewLists = !this.global.viewLists

    if( this.global.viewLists )
    {
      console.log('start new list');
      this.global.newChordList = [];
    }
    else
    {
      this.global.newChordList = null;

      this.global.viewLists = false;
    }
  }

}
