import { Component, OnInit } from '@angular/core';
import { CommonService } from './../../common.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'previewbar',
  templateUrl: './preview.html',
})

export class PreviewComponment implements OnInit {
   currentAppData = [];
   self : any;
   isOpen : boolean;

  constructor(
    private commonService: CommonService,
    private _sanitizer: DomSanitizer,
  )
  {
    this.self = this;
    // this.iFrameUrl =  _sanitizer.bypassSecurityTrustResourceUrl(this.iFrameUrl);
  }

  ngOnInit() {
    // this.currentAppData = this.commonService.get_current_app_data();
    //   this.iFrameUrl = 'http://35.163.93.93/projects/'+this.currentAppData['app_code']+'/index.html';
    //   this.iFrameUrl =  this._sanitizer.bypassSecurityTrustResourceUrl(this.iFrameUrl);
    $("#mySidenav").css('width',"0px");
    this.isOpen = true;
    $(".tabbartext").on('click',function(){
      console.log(localStorage.getItem('currentAppData'));
      if (localStorage.getItem('currentAppData') == "null" || localStorage.getItem('currentAppData') == undefined) {
        $('.tabbar').css({'right':'-80px'});
        $("#mySidenav").css('width',"0");
        $('.tabbartext').css({'right':'-29px'});
        return;
      }
      if (typeof(this.isOpen) == 'undefined') {
        this.isOpen = true;
      }
      if (this.isOpen == true) {
        this.isOpen = false;
        $('.tabbar').css({'right':'360px'});
        $('.tabbartext').css({'right':'410px'});
        $("#mySidenav").css('width',"440px");
      } else {
        $("#mySidenav").css('width',"0");
        $('.tabbar').css({'right':'-80px'});
        $('.tabbartext').css({'right':'-29px'});
        this.isOpen = true;
      }
    });
  }

}
