import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

                       // c d e f g a b c
  getMajorScale(){ return [2,2,1,2,2,2,1]; }

                       // a b c d e f g a
  getMinorScale(){ return [2,1,2,2,1,2,2]; }


  getNotes(){ return ['A',['A#','Bb'],'B','C',['C#','Db'],'D',['D#','Eb'],'E','F',['F#','Gb'],'G',['G#','Ab']]; }
}
