import { Component, OnInit } from '@angular/core';
import { SharedService } from './../../shared.service';
import { CommonService } from './../../common.service';
import { TopBarService } from '../top-bar/top-bar.service';
import { Router } from '@angular/router';
import { MessageService } from './../../message.service';
import { Subscription } from 'rxjs/Subscription';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'cat-menu-left',
  templateUrl: './menu-left-vertical.component.html',
	styleUrls: ['./menu-left-component.css']
  
})
export class MenuLeftComponent implements OnInit {
  is_app_name = false;
  select_app_name = '';
  select_app_icon_url = '';
  select_app_data = [];
  is_access_menu = true;
  is_display_app_menu = true;
  appData = [];
  rdata = [];
  showDashboardOption = true;
  appName: any;
  imgUrl: any;
  contact_number: number;
  emails_number: number;


  constructor(private commonService: CommonService,
    private alarmServce: TopBarService,
    private sharedService: SharedService,
    private router: Router,
    private msgService: MessageService) {

    const currentuserdata = this.commonService.get_user_data();
    const userRole = currentuserdata.role_id;

    this.setHeaderMain();

    if (userRole !== 1) {
      this.is_access_menu = false;
      this.commonService.postData({paginum : 1},'getallappdata').subscribe(res => {
        this.rdata = JSON.parse(res);
        this.appData = this.rdata['data'];
        // If there is a only one App assigned to user then we redirect them to app screen page
        if (this.appData.length === 1) {
          this.showDashboardOption = false;
        }
      });

    }
    this.select_app_data = this.commonService.get_current_app_data();

    if (this.select_app_data) {
      this.is_app_name = true;
      this.is_display_app_menu = true;
      this.select_app_name = this.select_app_data['app_name'];
      this.select_app_icon_url = this.select_app_data['basicDetail']['app_icon']['app_icon_thumb_url'];
    }

    if(userRole == 1){
      this.commonService.getData('unreadTickets').subscribe(res => {
        let rdata = JSON.parse(res)['data'];
        this.contact_number = rdata;
      });
      
      this.commonService.getData('fetchAllEmailTemplate').subscribe(res => {
        let rdata = JSON.parse(res)['data'].filter(email => {
          return email.readable == 0;
        });
        this.emails_number = rdata.length;
      });

      this.alarmServce.cntEmail$.subscribe((data) => {
          this.emails_number = data; // And he have data here too!
          console.log("menu-ts email///////////= ", this.emails_number);
        }
      );
      
      this.alarmServce.cntTicket$.subscribe((data) => {
          this.contact_number = data; // And he have data here too!
          console.log("menu-ts ticket///////////= ", this.contact_number);
        }
      );
    }
  }
  ngOnInit() {
    this.msgService.sendMessage('delete');

    this.sharedService.getAppDataEmittedValue().subscribe(
      title => {
        if (title == null) {
          this.select_app_data = [];
          this.is_app_name = false;
          this.is_display_app_menu = false;
          this.select_app_name = '';
          this.select_app_icon_url = '';
        } else {
          this.select_app_data = title;
          this.is_app_name = true;
          this.is_display_app_menu = true;
          this.select_app_name = this.select_app_data['app_name'];
          this.select_app_icon_url = this.select_app_data['basicDetail']['app_icon']['app_icon_thumb_url'];  
        }
        
      }
    );

    $(function () {

      // scripts for "menu-left" module

      /////////////////////////////////////////////////////////////////////////////////////////
      // add backdrop

      $('.cat__menu-left').after('<div class="cat__menu-left__backdrop cat__menu-left__action--backdrop-toggle"><!-- --></div>');

      /////////////////////////////////////////////////////////////////////////////////////////
      // submenu

      $('.cat__menu-left__submenu > a').on('click', function () {

        if ($('body').hasClass('cat__config--vertical') || $('body').width() < 768) {

          var parent = $(this).parent(),
            opened = $('.cat__menu-left__submenu--toggled');

          if (!parent.hasClass('cat__menu-left__submenu--toggled') && !parent.parent().closest('.cat__menu-left__submenu').length)
            opened.removeClass('cat__menu-left__submenu--toggled').find('> .cat__menu-left__list').slideUp(200);

          parent.toggleClass('cat__menu-left__submenu--toggled');
          parent.find('> .cat__menu-left__list').slideToggle(200);

        }

      });

      // remove submenu toggle class when viewport back to full view
      $(window).on('resize', function () {
        if ($('body').hasClass('cat__config--horizontal') || $('body').width() > 768) {
          $('.cat__menu-left__submenu--toggled').removeClass('cat__menu-left__submenu--toggled').find('> .cat__menu-left__list').attr('style', '');
        }
      });


      /////////////////////////////////////////////////////////////////////////////////////////
      // custom scroll init

      if ($('body').hasClass('cat__config--vertical')) {
        if (!(/Mobi/.test(navigator.userAgent)) && jQuery().jScrollPane) {
          $('.cat__menu-left__inner').each(function () {
            $(this).jScrollPane({
              contentWidth: '0px',
              autoReinitialise: true,
              autoReinitialiseDelay: 100
            });
            var api = $(this).data('jsp'),
              throttleTimeout;
            $(window).bind('resize', function () {
              if (!throttleTimeout) {
                throttleTimeout = setTimeout(function () {
                  api.reinitialise();
                  throttleTimeout = null;
                }, 50);
              }
            });
          });
        }
      }


      /////////////////////////////////////////////////////////////////////////////////////////
      // toggle menu

      $('.cat__menu-left__action--menu-toggle').on('click', function () {
        if ($('body').width() < 768) {
          $('body').toggleClass('cat__menu-left--visible--mobile');
        } else {
          $('body').toggleClass('cat__menu-left--visible');
        }
      })

      $('.cat__menu-left__action--backdrop-toggle').on('click', function () {
        $('body').removeClass('cat__menu-left--visible--mobile');
      })


      /////////////////////////////////////////////////////////////////////////////////////////
      // colorful menu

      var colorfulClasses = 'cat__menu-left--colorful--primary cat__menu-left--colorful--secondary cat__menu-left--colorful--primary cat__menu-left--colorful--default cat__menu-left--colorful--info cat__menu-left--colorful--success cat__menu-left--colorful--warning cat__menu-left--colorful--danger cat__menu-left--colorful--yellow',
        colorfulClassesArray = colorfulClasses.split(' ');

      function setColorfulClasses() {
        $('.cat__menu-left__list--root > .cat__menu-left__item').each(function () {
          var randomClass = colorfulClassesArray[Math.floor(Math.random() * colorfulClassesArray.length)];
          $(this).addClass(randomClass);
        })
      }

      function removeColorfulClasses() {
        $('.cat__menu-left__list--root > .cat__menu-left__item').removeClass(colorfulClasses);
      }

      if ($('body').hasClass('cat__menu-left--colorful')) {
        setColorfulClasses();
      }

      $('body').on('setColorfulClasses', function () {
        setColorfulClasses();
      });

      $('body').on('removeColorfulClasses', function () {
        removeColorfulClasses();
      });


    });

  }

  closeApp() {
    localStorage.setItem('currentAppData', null);
    this.sharedService.emit_appdata(null);

    this.msgService.sendMessage('delete');
    this.commonService.remove_current_app_publish_counter_data();
    // $('#vertical_left_menu').hide();
    // $('#previewbar').hide();
    $(".tabbartext").click();
    this.router.navigate(['/dashboard']);
  }

  setHeader() {
    this.msgService.sendMessage('delete');
  }

  setHeaderMain() {
    if (this.commonService.get_current_app_data() != null) {
      this.appName = this.commonService.get_current_app_data();
      this.imgUrl = this.appName['basicDetail']['app_icon']['app_icon_thumb_url'];
      this.msgService.sendMessage(this.imgUrl);
    }
  }

}
