import { Component, OnInit } from '@angular/core';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'cat-page',
  templateUrl: './nestable.html'
})

export class ComponentsNestable implements OnInit {
  ngOnInit() {

    $(function(){

      $('#nestable1').nestable();

      $('#nestable2').nestable();

    });

  }
}

