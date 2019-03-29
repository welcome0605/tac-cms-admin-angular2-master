import { Component, OnInit } from '@angular/core';
declare var $: any;
declare var jQuery: any;


@Component({
  selector: 'cat-page',
  templateUrl: './carousel.html'
})

export class ComponentsCarousel implements OnInit {
  ngOnInit() {

    $(function(){

      $('#owl1').owlCarousel({
        loop:true,
        margin:10,
        responsive:{
          0: {
            items:1
          },
          600: {
            items:2
          },
          1000: {
            items:4
          }
        }
      });

      $('#owl2').owlCarousel({
        stagePadding: 50,
        loop:true,
        margin:10,
        responsive:{
          0:{
            items:1
          },
          600:{
            items:2
          },
          1000:{
            items:3
          }
        }
      });

      $('#owl3').owlCarousel({
        items:4,
        lazyLoad:true,
        loop:true,
        margin:10,
        responsive:{
          0:{
            items:1
          },
          600:{
            items:2
          },
          1000:{
            items:4
          }
        }
      });

      $('#owl4').owlCarousel({
        items:1,
        margin:10,
        autoHeight:true
      });

      $('#owl5').owlCarousel({
        items:1,
        merge:true,
        loop:true,
        margin:10,
        video:true,
        lazyLoad:true,
        center:true,
        responsive:{
          480:{
            items:2
          },
          600:{
            items:4
          }
        }
      });

    });

  }
}

