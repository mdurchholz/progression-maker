import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})

export class NavigationComponent implements OnInit {

  getKey:object;
  newKey:object;
  hasSemi:boolean;

  isFriendly:boolean;

  showBtn:boolean;

  constructor( public global:GlobalService ) { }

  ngOnInit() {
    this.global.appKey.subscribe(
      gKey => (
        this.getKey = gKey,
        this.newKey = this.setNewKey( gKey ),
        this.hasSemi = this.global.getNoteSemi( gKey['note'] ) !=='' ? true : false
      )
    );

    this.global.isFriendly.subscribe( value => this.isFriendly = value );

    this.showBtn = false;
  }


  /////////////////////////////////////////////////////////
  //
  /////////////////////////////////////////////////////////
  public buttonClick( type:string, value:string = '' ) {

    if( this.global.isBuilding ) return;

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
        this.clearKeyChange();
        break;

      default:
        return false;
    }

    var object_1 = this.global.getKey(),
        object_2 = this.newKeyToObject();

    this.showBtn = ( object_1['note'] != object_2['note'] || object_1['scale'] != object_2['scale'] );
  }
  /////////////////////////////////////////////////////////


  /////////////////////////////////////////////////////////
  //
  /////////////////////////////////////////////////////////
  public setNewKey( key:object ) {
    return { base:this.global.getNoteBase(key['note']), semi:this.global.getNoteSemi(key['note']), scale:key['scale'] };
  }
  /////////////////////////////////////////////////////////


  /////////////////////////////////////////////////////////
  //
  /////////////////////////////////////////////////////////
  public newKeyToObject() {
    return {
      note  : this.global.checkEnharmonic(this.newKey['base']+this.newKey['semi']),
      scale : this.newKey['scale']
    };
  }
  /////////////////////////////////////////////////////////


  /////////////////////////////////////////////////////////
  //
  /////////////////////////////////////////////////////////
  public clearKeyChange() {
      this.newKey = this.setNewKey( this.global.getKey() );
  }


  /////////////////////////////////////////////////////////
  //
  /////////////////////////////////////////////////////////
  public newListToggle() {
    this.global.viewLists = !this.global.viewLists;

    if( this.global.viewLists )
    {
      // console.log('start new list');
    }
    else
    {
      // console.log('end new list');

      if( this.global.isBuilding ) this.global.cancelList();
    }
  }
  /////////////////////////////////////////////////////////


  /////////////////////////////////////////////////////////
  // Check if current key contains any technical notes
  /////////////////////////////////////////////////////////
  private keyHasTechnical( key:object ) {
    let getNotes = this.global.getScaleNotes(key),
        hasTech  = false;

    for(let note=0; note<getNotes.length; note++) {
      if( getNotes[note]['technical'] && !hasTech ) hasTech = true;
    }

    return hasTech;
  }
  /////////////////////////////////////////////////////////

}
