import { Component, OnInit } from '@angular/core';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'cat-page',
  templateUrl: './tooltips-popovers.html'
})

export class ComponentsTooltipsPopovers implements OnInit {
  ngOnInit() {

    $(function () {

      $("[data-toggle=popover]").popover();
      $("[data-toggle=popover-hover]").popover({
        trigger: 'hover'
      });

      $("[data-toggle=tooltip]").tooltip();

    });

  }
}

