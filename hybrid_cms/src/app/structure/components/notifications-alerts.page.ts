import { Component, OnInit } from '@angular/core';
declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
  selector: 'cat-page',
  templateUrl: './notifications-alerts.html'
})

export class ComponentsNotificationsAlerts implements OnInit {
  ngOnInit() {

    $(function(){

      // Sweet Alert
      $('.swal-btn-basic').click(function(e){
        e.preventDefault();
        swal("Here's a message!");
      });

      $('.swal-btn-text').click(function(e){
        e.preventDefault();
        swal({
          title: "Here's a message!",
          text: "It's pretty, isn't it?"
        });
      });

      $('.swal-btn-success').click(function(e){
        e.preventDefault();
        swal({
          title: "Good job!",
          text: "You clicked the button!",
          type: "success",
          confirmButtonClass: "btn-success",
          confirmButtonText: "Success"
        });
      });

      $('.swal-btn-warning').click(function(e){
        e.preventDefault();
        swal({
            title: "Are you sure?",
            text: "Your will not be able to recover this file!",
            type: "warning",
            showCancelButton: true,
            cancelButtonClass: "btn-default",
            confirmButtonClass: "btn-warning",
            confirmButtonText: "Remove",
            closeOnConfirm: false
          },
          function(){
            swal({
              title: "Deleted!",
              text: "File has been deleted",
              type: "success",
              confirmButtonClass: "btn-success"
            });
          });
      });

      $('.swal-btn-cancel').click(function(e){
        e.preventDefault();
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this imaginary file!",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Yes, remove it",
            cancelButtonText: "Cancel",
            closeOnConfirm: false,
            closeOnCancel: false
          },
          function(isConfirm) {
            if (isConfirm) {
              swal({
                title: "Deleted!",
                text: "Your imaginary file has been deleted.",
                type: "success",
                confirmButtonClass: "btn-success"
              });
            } else {
              swal({
                title: "Cancelled",
                text: "Your imaginary file is safe :)",
                type: "error",
                confirmButtonClass: "btn-danger"
              });
            }
          });
      });

      $('.swal-btn-custom-img').click(function(e){
        e.preventDefault();
        swal({
          title: "Sweet!",
          text: "Here's a custom image.",
          confirmButtonClass: "btn-success",
          imageUrl: 'assets/modules/dummy-assets/common/img/avatars/1.jpg'
        });
      });

      $('.swal-btn-info').click(function(e){
        e.preventDefault();
        swal({
          title: "Are you sure?",
          text: "Your will not be able to recover this imaginary file!",
          type: "info",
          showCancelButton: true,
          cancelButtonClass: "btn-default",
          confirmButtonText: "Info",
          confirmButtonClass: "btn-primary"
        });
      });


      // Bootstrap Notify
      $('#notify-basic').on('click', function() {
        $.notify("Hello World");
      });

      $('#notify-passing-title').on('click', function() {
        $.notify({
          title: "Welcome:",
          message: "This plugin has been provided to you by Robert McIntosh aka mouse0270"
        });
      });

      $('#notify-passing-html').on('click', function() {
        $.notify({
          title: "<strong>Welcome:</strong> ",
          message: "This plugin has been provided to you by Robert McIntosh aka <a href=\"https://twitter.com/Mouse0270\" target=\"_blank\">@mouse0270</a>"
        });
      });

      $('#notify-url').on('click', function() {
        $.notify({
          message: "Check out my twitter account by clicking on this notification!",
          url: "https://twitter.com/Mouse0270"
        });
      });

      $('#notify-icomoon-premuim').on('click', function() {
        $.notify({
          icon: 'icmn-database',
          message: "Everyone loves font icons! Use them in your notification!"
        });
      });

      $('#notify-fontawesome').on('click', function() {
        $.notify({
          icon: 'fa fa-star',
          title: 'Title',
          message: "Everyone loves font icons! Use them in your notification!"
        });
      });

      $('#notify-center').on('click', function() {
        $.notify({
          icon: 'font-icon font-icon-warning',
          title: '<strong>Heads up!</strong>',
          message: 'You can use any of bootstraps other alert styles as well by default.'
        },{
          placement: {
            align: "center"
          }
        });
      });

      $('#notify-bottom').on('click', function() {
        $.notify({
          icon: 'font-icon font-icon-warning',
          title: '<strong>Heads up!</strong>',
          message: 'You can use any of bootstraps other alert styles as well by default.'
        },{
          placement: {
            from: "bottom"
          }
        });
      });

      $('#notify-bottom-center').on('click', function() {
        $.notify({
          icon: 'font-icon font-icon-warning',
          title: '<strong>Heads up!</strong>',
          message: 'You can use any of bootstraps other alert styles as well by default.'
        },{
          placement: {
            from: "bottom",
            align: "center"
          }
        });
      });

      $('#notify-default').on('click', function() {
        $.notify({
          title: '<strong>Heads up!</strong>',
          message: 'You can use any of bootstraps other alert styles as well by default.'
        },{
          type: 'default'
        });
      });

      $('#notify-primary').on('click', function() {
        $.notify({
          title: '<strong>Heads up!</strong>',
          message: 'You can use any of bootstraps other alert styles as well by default.'
        },{
          type: 'primary'
        });
      });

      $('#notify-secondary').on('click', function() {
        $.notify({
          title: '<strong>Heads up!</strong>',
          message: 'You can use any of bootstraps other alert styles as well by default.'
        },{
          type: 'secondary'
        });
      });

      $('#notify-success').on('click', function() {
        $.notify({
          title: '<strong>Heads up!</strong>',
          message: 'You can use any of bootstraps other alert styles as well by default.'
        },{
          type: 'success'
        });
      });

      $('#notify-warning').on('click', function() {
        $.notify({
          title: '<strong>Heads up!</strong>',
          message: 'You can use any of bootstraps other alert styles as well by default.'
        },{
          type: 'warning'
        });
      });

      $('#notify-danger').on('click', function() {
        $.notify({
          title: '<strong>Heads up!</strong>',
          message: 'You can use any of bootstraps other alert styles as well by default.'
        },{
          type: 'danger'
        });
      });

      $('#notify-info').on('click', function() {
        $.notify({
          title: '<strong>Heads up!</strong>',
          message: 'You can use any of bootstraps other alert styles as well by default.'
        },{
          type: 'info'
        });
      });

    });

  }
}

