import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-wrap',
  templateUrl: './app-wrap.component.html',
  styleUrls: ['./app-wrap.component.scss']
})
export class AppWrapComponent implements OnInit {

  constructor( private global:GlobalService ) { }

  ngOnInit() { }

}
