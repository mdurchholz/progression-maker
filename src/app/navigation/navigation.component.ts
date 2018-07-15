import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  public notes = [];

  constructor(private globalService: GlobalService) { }

  ngOnInit() {
    this.notes = this.globalService.getNotes();
  }

  testClick(){
      alert();
  }
}
