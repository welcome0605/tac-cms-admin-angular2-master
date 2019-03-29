import { Component, OnInit } from '@angular/core';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'cat-page',
  templateUrl: './date-picker.html'
})

export class ComponentsDatePicker implements OnInit {
  ngOnInit() {

    $(function(){

      $('.datepicker-init').datetimepicker({
        widgetPositioning: {
          horizontal: 'left'
        },
        icons: {
          time: "fa fa-clock-o",
          date: "fa fa-calendar",
          up: "fa fa-arrow-up",
          down: "fa fa-arrow-down",
          previous: 'fa fa-arrow-left',
          next: 'fa fa-arrow-right'
        }
      });

      $('.datepicker-only-init').datetimepicker({
        widgetPositioning: {
          horizontal: 'left'
        },
        icons: {
          time: "fa fa-clock-o",
          date: "fa fa-calendar",
          up: "fa fa-arrow-up",
          down: "fa fa-arrow-down",
          previous: 'fa fa-arrow-left',
          next: 'fa fa-arrow-right'
        },
        format: 'LL'
      });

      $('.timepicker-init').datetimepicker({
        widgetPositioning: {
          horizontal: 'left'
        },
        icons: {
          time: "fa fa-clock-o",
          date: "fa fa-calendar",
          up: "fa fa-arrow-up",
          down: "fa fa-arrow-down",
          previous: 'fa fa-arrow-left',
          next: 'fa fa-arrow-right'
        },
        format: 'LT'
      });

      $('.datepicker-inline-init').datetimepicker({
        icons: {
          time: "fa fa-clock-o",
          date: "fa fa-calendar",
          up: "fa fa-arrow-up",
          down: "fa fa-arrow-down",
          previous: 'fa fa-arrow-left',
          next: 'fa fa-arrow-right'
        },
        inline: true,
        sideBySide: false
      });

      $('.timepicker-inline-init').datetimepicker({
        icons: {
          time: "fa fa-clock-o",
          date: "fa fa-calendar",
          up: "fa fa-arrow-up",
          down: "fa fa-arrow-down",
          previous: 'fa fa-arrow-left',
          next: 'fa fa-arrow-right'
        },
        format: 'LT',
        inline: true,
        sideBySide: false
      });

    })

  }
}

