import { Directive, Component, OnInit, Input, ElementRef } from '@angular/core';
import { GlobalService } from '../global.service';

@Directive({
  selector: '[template-host]'
})
export class HostDirective{

  @Input('template-host') set templateHtml(value){
    this.hostElement.innerHTML = value;
  }

  private hostElement:HTMLElement;

  constructor(elementRef:ElementRef){
    this.hostElement = elementRef.nativeElement;
  }
}

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  scale:string;
  getNotes:object;
  isMinor:boolean;

  constructor( private global:GlobalService ) { }

  ngOnInit() {

    this.global.appKey.subscribe(
      gKey => (
        this.scale = gKey['scale'],
        this.isMinor = this.scale=='minor',
        this.getNotes = this.global.getScaleNotes(gKey)
      )
    )
  }

  // Build note HTML
  private noteOpts( details, i ) {
    var noteHTML = '<span class="spot">'+ (i==1 ? 'TONIC' : i) + (i==8 ? '<span class="type">(harmonic)</span>':'') + '</span><span class="root">';

    // Check for technical note
    if( details['technical'] ) {
        var technical = '<span class="technical">'+this.global.noteStringToHtml( details['technical'] )+'</span>';

        noteHTML += technical;
    }

    // Add friendly note
    var friendly = '<span class="friendly">'+this.global.noteStringToHtml( details['friendly'] )+'</span>';

    noteHTML += friendly;

    // Check for minor or diminished chords
    if( ( this.isMinor && (i==1 || i==4 || i==5)) ||
        (!this.isMinor && (i==2 || i==3 || i==6))  )
      noteHTML += '<span class="chord-type minor">m</span>';
    else if( (this.isMinor && i==2) || (!this.isMinor && i==7 ) )
      noteHTML += '<span class="chord-type dim">&deg;</span>';

    noteHTML += '</span>';

    // if( this.isMinor && i==Object.keys(this.getNotes).length) {
    //   noteHTML += '</div><div id="note-7-harmonic" class="note test">'+
    //                 '<span class="spot">'+i+'<span class="type">(harmonic)</span></span>'+
    //                 '<span class="root">'+
    //                   (technical?technical:'') + friendly +
    //                   '<span class="symbol dim">&deg;</span>'+
    //                 '</span>'+
    //               '</div>';
    // }


    return noteHTML;

/*
    <?php if($isMinor && $i==count($getScale)): ?>
    <div id="note-7-harmonic" class="note">
    	<span class="spot">7<span class="type">(harmonic)</span></span>
    	<span class="root"><?php echo formatNote($note['friendly']); ?><span class="symbol dim">&deg;</span></span>
    </div>
    <?php endif; endforeach; ?>
*/
  }

}
