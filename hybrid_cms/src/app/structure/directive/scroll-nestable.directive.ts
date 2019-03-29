/**
 * Directive to scroll nestable
 */
import { Directive, ElementRef } from '@angular/core';


declare var $: any;
declare var jQuery: any;

@Directive({
  selector: '[appScrollNestable]'
})
export class ScrollNestableDirective {

  private nativeEle: any;
  constructor(el: ElementRef) {

    this.nativeEle = el.nativeElement;
    this.scorllNestable();

  }

  private scorllNestable(): void {

    // nestable drag event
    $('#nestable1').mousemove(function (e) {
      if ($(this.nativeEle) && !$('html, body').is(':animated')) {
        const bottom = $(window).height() - 50,
          top = 70,
          sCrollTop = $(window).scrollTop(),
          windowHeight = $(window).height(),
          documentHeight = $(document).height();
        // console.log(e.clientY, '----><---', bottom, '---<<< top', top, 'scrolltop--->>', sCrollTop);
        if (e.clientY > bottom && (sCrollTop + windowHeight < documentHeight - 100)) {

          $('html, body').animate({
            scrollTop: sCrollTop + 300
          }, 600);

        } else if (e.clientY < top && sCrollTop > 0) {

          $('html, body').animate({
            scrollTop: sCrollTop - 300
          }, 600);

        } else {
          // it clears the queue and the current animation jumps to its end value.
          $('html, body').finish();

        }
      }
    });
  }

}
