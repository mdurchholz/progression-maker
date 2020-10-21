import { Component, Input, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @Input() list : object;
  @Input() i : number;

  constructor( public global:GlobalService ) { }

  ngOnInit() {

  }

  public deleteList( position ) {
    let list = this.global.getChordLists();

    list.splice(position, 1);

    this.global.setChordLists(list);
  }

}
