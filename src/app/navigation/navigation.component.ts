import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  public notes = [];

  constructor(private global: GlobalService) { }

  ngOnInit() {
    this.notes = this.global.getAllNotes;
  }

  testClick(){
      alert();
  }
}
