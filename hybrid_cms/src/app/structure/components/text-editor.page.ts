import { Component, OnInit } from '@angular/core';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'cat-page',
  templateUrl: './text-editor.html'
})

export class ComponentsTextEditor implements OnInit {
  ngOnInit() {

    $(function() {
      $('.summernote').summernote({
        height: 350
      });
    });

  }
}

