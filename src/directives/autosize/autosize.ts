import { ElementRef, HostListener,Directive,OnInit } from '@angular/core';

//https://competenepal.com/elastic-text-area-component-in-ionic-framework/

/**
 * Generated class for the AutosizeDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: 'ion-textarea[autosize]' // Attribute selector
})
export class AutosizeDirective implements OnInit{

  //this listens for the 'keyup'
  @HostListener('input', ['$event.target'])

  onInput(area:HTMLTextAreaElement):void{
    this.autosize();
  }

  constructor(public elementRef: ElementRef) {
    //console.log('Hello AutosizeDirective Directive');
  }

  //done when the components loads up, use a timeout
  //is suggested, if not something could be null.
  ngOnInit():void{
    setTimeout(()=> this.autosize(),0);
  }

  /*
  set the height to the scroll height,
  where the scroll height gives the overall height of the textarea required to view
  all the contents.

  autosize adjust to the content's size.

  */

  autosize():void{
    let area = this.elementRef.nativeElement.getElementsByTagName('textarea')[0];
    area.style.overflow = 'hidden';
    area.style.height = 'auto';
    area.style.height = area.scrollHeight + "px";
  }
}
