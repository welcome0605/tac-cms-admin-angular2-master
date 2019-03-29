import { Component, OnInit } from '@angular/core';
declare var $: any;
declare var jQuery: any;


@Component({
  selector: 'cat-page',
  templateUrl: './slider.html'
})

export class ComponentsSlider implements OnInit {
  ngOnInit() {

    $(function(){

      $("#slider-1").ionRangeSlider({
        min: 0,
        max: 100,
        from: 50,
        step: 10,
        grid: true,
        grid_num: 10
      });

      $("#slider-2").ionRangeSlider();


      $("#slider-3").ionRangeSlider({
        type: "double",
        min: 0,
        max: 100,
        from: 20,
        from_min: 10,
        from_max: 30,
        from_shadow: true,
        to: 80,
        to_min: 70,
        to_max: 90,
        to_shadow: true,
        grid: true,
        grid_num: 10
      });

      $("#slider-4").ionRangeSlider({
        from: 30,
        to: 60,
        type: 'double'
      });

    });

  }
}

