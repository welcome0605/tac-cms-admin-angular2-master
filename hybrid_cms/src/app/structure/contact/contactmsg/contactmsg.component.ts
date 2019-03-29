import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from './../../../common.service';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { CheckloginService } from './../../../checklogin.service';
import { SharedService } from './../../../shared.service';
import { TopBarService } from '../../../components/top-bar/top-bar.service';
import { Observable } from 'rxjs/Observable';
import { constants } from 'fs';
import { PagerService } from '../pagi/index'
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import * as _ from 'underscore';
/**
 * interface designed for dicussion  model
 * @version 1.0
 * @author
 */
export interface DicussionRes {

  data: DicussionSubRes[];

}
export interface DicussionSubRes {
  id?: number;
  sender_name: string;
  dicussion: string;
  status: '1' | '2' | '3';
  created_at: string,
  updated_at: string
}
// declare var
declare var $: any;
declare var jQuery: any;
declare var swal: any;
declare var NProgress: any;
@Component({
    selector: 'app-contactmsg',
    templateUrl: './contactmsg.component.html',
    styleUrls: ['./contactmsg.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ContactmsgComponent implements OnInit {

  @ViewChild('dicussion_scroll')
  private Dicussion_Scroll: ElementRef;

  isAppAssign: boolean;
  private dicussForm: FormGroup;
  private dicussionList: Array<any>;
  private rdata: any;
  private CertificateStatus: any;
  public ticketId: any;
  public user_first_name: any;
  public user_last_name: any;
  public ticket_subject: any;
  private cMSg_attach_url: any;
  private cMSg_create_time: any;
  private cMsg_sender_id: any;
  public cMsg_array_data: any[];
  navMsgLinks: any[];
  public form: FormGroup;
  public is_msg_Admin: boolean;
  public sel_ticket_state: any;
  rstatus = '';
  public usingChar: any;
  public user_email_msg: any;
  public user_full_name: string;

   // array of all items to be paged
   private allItemsMsg: any[];
   // pager object
   pagerMsg: any = {};
   // paged items
   pagedItemsMsg: any[];

  constructor(private fb: FormBuilder, 
    private commonService: CommonService, 
    private alarmServce:TopBarService,
    private route: Router, 
    private pagerService: PagerService, 
    private http: Http) {
    this.dicussForm = this.fb.group({
      dicussion_text: [null, Validators.compose([Validators.required])],
    });
    this.navMsgLinks = [
      {
        label: 'contact-message',
        path: '/contact-message',
        index: 0
      },];
  }

  ngOnInit() {
    this.user_full_name = this.commonService.get_user_data()['first_name']+" "+this.commonService.get_user_data()['last_name'];
    this.form = this.fb.group({
      msg_content: ['', Validators.compose([Validators.required])],
      attach_url: ['', Validators.compose([Validators.required])]
      //can to add
    });
    this.msgListing();
    // this.cMsg_array_data = [
    //   {
    //     "attach_msg_url":"",
    //     "created_at":"2018-03-15 08:30:51",
    //     "id":15,
    //     "msg_content":"123123123",
    //     "sender_id":1,
    //     "ticket_id":3,
    //     "updated_at":"2018-03-15 08:30:51"
    //   }
    // ];
  }

  onSubmit(form: NgForm){
    if(form.value.msg_content == null || form.value.msg_content == ""){
      return;
    }
    this.cMSg_create_time = new Date();
    var reply_url = 'ticket/'+this.ticketId+'/reply';
    this.commonService.postData(
      {
        sender_name:this.user_full_name,
        msg_content:form.value.msg_content
      }, reply_url ).subscribe(res => {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if (this.rstatus == '1') {
        const success_message = this.rdata['message'];
        $(function () {
          $.notify({
            title: '',
            message: success_message
          }, {
              type: 'success'
            });
        });
      }
      else {
        const error_message = this.rdata['message'];
        $(function () {
          $.notify({
            title: '',
            message: error_message
          }, {
              type: 'danger'
            });
        });
      }
    });
    //refresh write panel
    $("#edit_msg").val('');
    //reload msg list
    this.msgListing();
  }

  msgListing(){
    var service_url = "ticket/"+this.ticketId;
    //first read
    this.commonService.getData(service_url).subscribe(res => {
      this.rdata = JSON.parse(res);
      this.cMsg_array_data = this.rdata['reply'];
        if(this.cMsg_array_data.length == 0){
          return;
        }
        else{
          //pagination
          if(this.commonService.get_user_data()['role_id'] == 1 && this.sel_ticket_state != 1){
            //update ticket state to open
            var update_ticket_url = 'ticketStateChange/'+this.ticketId;
            this.commonService.postData(
              {
                state:0
              }, update_ticket_url).subscribe(res => {
              this.rdata = JSON.parse(res);
              this.rstatus = this.rdata['status'];
              if (this.rstatus == '1') {
                //gjc service
                this.alarmServce.countTicket();
                console.log("state change success");
              }
              else {
                console.log("state change faild");
              }
            });
          }
          this.setPageMsg(1);
        }
    });
    // again interval
    var interval = setInterval(() => {
      if(!this.commonService.get_user_data()){
        clearInterval(interval);
        return;
      }
      this.commonService.getData(service_url).subscribe(res => {
        this.rdata = JSON.parse(res);
        this.cMsg_array_data = this.rdata['reply'];
          if(this.cMsg_array_data.length == 0){
            return;
          }
          else{
            //pagination
            this.setPageMsg(1);
          }
      });
    }, 15000);
  }

  setPageMsg(page: number) {
    if (page < 1 || page > this.pagerMsg.totalPages) {
        return;
    }

    // get pager object from service
    this.pagerMsg = this.pagerService.getPager(this.cMsg_array_data.length, page);
    // get current page of items
    this.pagedItemsMsg = this.cMsg_array_data.slice(this.pagerMsg.startIndex, this.pagerMsg.endIndex + 1);
  }

  calculateTimeMsg(modifyTime: any){
    var modifyYear  = parseInt(modifyTime.toString().substring(0,4));
    var modifyMonth = parseInt(modifyTime.toString().substring(5,7));
    var modifyDate  = parseInt(modifyTime.toString().substring(8,10));
    var modifyHour  = parseInt(modifyTime.toString().substring(11,13));
    var modifyMin   = parseInt(modifyTime.toString().substring(14,16));

    var currentDate = new Date();
    var curMonth  = currentDate.getMonth()+1;
    var curDate   = currentDate.getDate();
    var curYear   = currentDate.getFullYear();
    var curHour   = parseInt(currentDate.toString().substring(16,18));
    var curMin    = parseInt(currentDate.toString().substring(19,21));
    let strAgo;
    //year
    if(curYear - modifyYear == 0){
      //month
      if(curMonth - modifyMonth == 0){
        //day
        if(curDate - modifyDate == 0){
          //hour
          if(curHour - modifyHour == 0){
            //min
            if(curMin - modifyMin == 0){
              strAgo = "1 minute ago";
            }
            else if(curMin - modifyMin < 0){
              //error
            }
            else if(curMin - modifyMin == 1){
              strAgo = "1 minute ago";
            }
            else{
              strAgo = curMin - modifyMin + "minutes ago";
            }
          }
          else if(curHour - modifyHour < 0){
            //error
          }
          else if(curHour - modifyHour == 1){
            strAgo = "1 hour ago";
          }
          else{
            strAgo = curHour - modifyHour + "hours ago";
          }
        }
        else if(curDate - modifyDate < 0){
          //error
        }
        else if(curDate - modifyDate == 1){
          strAgo = "1 day ago";
        }
        else{
          strAgo = curDate - modifyDate + "days ago";
        }
      }
      else if(curMonth - modifyMonth < 0){
        //error
      }
      else if(curMonth - modifyMonth == 1){
        strAgo = "1 month ago";
      }
      else{
        strAgo = curMonth - modifyMonth + "months ago";
      }
    }
    else if(curYear - modifyYear < 0){
      //error
    }
    else if(curYear - modifyYear == 1){
      strAgo = "1 year ago";
    }
    else{
      strAgo = curYear - modifyYear + "years ago";
    }
    return strAgo;
  }

  pad(num: number, size: number) {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }
}
