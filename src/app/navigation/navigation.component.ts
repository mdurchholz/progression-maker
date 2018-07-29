import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { GlobalService } from '../global.service';

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  public notes = [];
  public scale = '';
  public key = {};
  private hasSemi;

  constructor(private global:GlobalService, private router:Router) {
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.notes = this.global.getAllNotes;
    this.scale = this.global.getPaths()['scale'];
    this.key   = this.global.getPaths()['key'];
    this.hasSemi = this.key['text'] ? true : false;
  }

  semiButtons( semi ) {
         if(   !this.hasSemi   ) this.hasSemi = true;
    else if( this.key['text'] == semi ) this.hasSemi = false;

    this.key['text'] = this.hasSemi ? semi : '';
  }

  changeMap( scale, key, semi ) {
    this.router.navigate([scale+'/'+key+semi]);
  }
}
