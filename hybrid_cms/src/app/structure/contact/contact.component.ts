import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from './../../common.service';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';

import { SharedService } from './../../shared.service';
import { TopBarService } from '../../components/top-bar/top-bar.service';
import { Observable } from 'rxjs/Observable';
import { constants } from 'fs';
import { ContactmsgComponent } from './contactmsg/contactmsg.component';
import { PagerService } from './pagi/index'
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
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  // styleUrls: ['./bootstrap.css', './contact.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ContactComponent implements OnInit {

  @ViewChild('dicussion_scroll')
  private Dicussion_Scroll: ElementRef;

  isAppAssign: boolean;
  private dicussForm: FormGroup;
  private dicussionList: Array<any>;
  private rdata: any;
  private SelectedStatus: any;
  private addToTicketList: any;
  private cTicket_id;
  private cTicket_subject: any;
  private cTicket_body: any;
  private cTicket_department: any;
  private cTicket_priority: any;
  private cTicket_attach_url: any;
  private cTicket_create_time: any;
  private cTicket_array_data: any[];
  private cTicket_input_data: any[];
  private cTicket_get_length: any;
  public form: FormGroup;
  public formStatus: FormGroup;
  public is_Admin: boolean;
  handleTimer: Observable<any>;
  department: any[];
  priority: any[];
  state: any[];
  status_select: string[];
  ticketCreater: string;
  curEmail: any;
  curTime: any;
  public changeClick: boolean;
  public emptyTicket: boolean;
  public user_full_name: string;
  rstatus = '';// array of all items to be paged

  // array of all items to be paged
  private allItems: any[];
  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];

  constructor(private fb: FormBuilder,
    private commonService: CommonService,
    private pagerService: PagerService,
    private alarmServce: TopBarService,
    private route: Router,
    private http: Http,) {
      this.dicussForm = this.fb.group({
        dicussion_text: [null, Validators.compose([Validators.required])],
      });
    
  }

  ngOnInit() {
    this.user_full_name = this.commonService.get_user_data()['first_name']+" "+this.commonService.get_user_data()['last_name'];
    $("#mySidenav").css('display','none');
    this.currentUserfetcher();
    this.SelectedStatus = 3; // display all state 
    this.department = ['General Support', 'Sales', 'Reboot', 'other'];
    this.status_select = ['Open', 'Closed', 'NewReply', 'All'];

    this.state = ['Open', 'Closed', 'New', 'All'];
    this.priority = ['Low', 'Normal', 'High']; //[{id: '1', name: 'High'},{id: '2', name: 'Normal'},{id: '3', name: 'Low'}]
    this.curTime = new Date();
    this.changeClick = true;
    this.emptyTicket = false;

    this.form = this.fb.group({
      ticket_subject: ['', Validators.compose([Validators.required])],
      ticket_body: ['', Validators.compose([Validators.required])],
      ticket_department: ['', Validators.compose([Validators.required])],
      ticket_priority: ['', Validators.compose([Validators.required])],
      ticket_attach_url: ['', Validators.compose([Validators.required])]
    });
    this.formStatus = this.fb.group({
      search_state: ['', Validators.compose([Validators.required])]
    });
    //call all tickets in database
    this.ticketsListing(1);
  }
  /**
  * Method to retrive current login user data
  */
  public currentUserfetcher() {
    const currentLogin = JSON.parse(localStorage.getItem('currentUser'));
    ContactmsgComponent.prototype.user_first_name = currentLogin.first_name;
    ContactmsgComponent.prototype.user_last_name = currentLogin.last_name;
    ContactmsgComponent.prototype.user_email_msg = currentLogin.email;
    this.curEmail = currentLogin.email;
    if(this.curEmail == "admin@theappcompany.com"){
      this.is_Admin = true;
      ContactmsgComponent.prototype.is_msg_Admin = true;
    }
    else{
      this.is_Admin = false;
      ContactmsgComponent.prototype.is_msg_Admin = false;
    }
  }
  /**
   * Method to show/hide contact us view
   */
  showView(): void {
    const app = this.commonService.get_current_app_data();
    if (app && app.hasOwnProperty('app_assign')) {
      if (app.app_assign) {
        this.isAppAssign = app.app_assign;
      } else {
        this.isAppAssign = app.app_assign
      }

    } else {
      // do something if app data not set in storage
    }
  }

  itemSelected(stateForm: NgForm){
      switch(stateForm.value.search_state){
        case 'Open':
        this.SelectedStatus = 0;
        break;
        case 'Closed':
        this.SelectedStatus = 1;
        break;
        case 'NewReply':
        this.SelectedStatus = 2;
        break;
        case 'All':
        this.SelectedStatus = 3;
        break;
      }
  }

  onSubmit(form: NgForm){
    let create_ticket_id;
    let priority_lv;
    let department_content;
    //format priority
    switch(form.value.ticket_priority){
      case 'Low':
        priority_lv = 0;
        break;
      case 'Normal':
        priority_lv = 1;
        break;
      case 'High':
        priority_lv = 2;
        break;
      default:
        priority_lv = 0;
        break;
    }
    //format department
    if(form.value.ticket_department == '')
    {
      department_content = "General Support";
    }
    else
    {
      department_content = form.value.ticket_department;
    }
    //get current time
    this.cTicket_create_time = new Date();
    //create data in api
    this.commonService.postData(
      {
        sender_name:this.user_full_name,
        subject:form.value.ticket_subject,
        body: form.value.ticket_body,
        department: department_content,
        priority: priority_lv
      }, 'ticket').subscribe(res => {
      this.rdata = JSON.parse(res);

      this.rstatus      = this.rdata['status'];
      create_ticket_id  = this.rdata['ticket_id'];
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
        //add msg
        var reply_url = 'ticket/'+create_ticket_id+'/reply';
        this.commonService.postData(
          {
            sender_name:this.user_full_name,
            msg_content:form.value.ticket_body
          }, reply_url ).subscribe(res => {
          this.rdata = JSON.parse(res);
          this.rstatus = this.rdata['status'];
          if (this.rstatus == '1') {
            // reload contact-us
            this.ticketsListing(1);
            const success_message = this.rdata['message'];
            $(function () {
              $.notify({
                title: '',
                message: success_message
              }, {
                  type: 'success'
                });
            });
          } else {
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
    //gjc service
    this.alarmServce.countTicket();
    //refresh modal
    $("#idSubject").val('');
    $("#idBody").val('');
    $("#createticket").modal('hide');
  }

  ticketsListing(paginum: number) {
    this.commonService.postData(
      {
        'paginum' : paginum
      },
      'tickets').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.cTicket_array_data = this.rdata['data'];
      this.cTicket_get_length = this.rdata['allData'];
      this.setPage(paginum);
      if(this.cTicket_array_data.length == 0){
        this.emptyTicket = true;
      }
    });
    //first call alarm
    let mUnreadTicket = 0;
    if(!this.commonService.get_user_data()){
      clearInterval(interval);
      return;
    }
    this.commonService.getData('unreadTickets').subscribe(res => {
      this.rdata = JSON.parse(res);
      mUnreadTicket = this.rdata['data'];
        if(mUnreadTicket != 0 && this.commonService.get_user_data()['role_id'] == 1){
          const alram_message = "There are "+mUnreadTicket+" unread tickets.";
          $(function () {
            $.notify({
              title: '',
              message: alram_message
            }, {
                type: 'success'
              });
          });
        }
      this.emptyTicket = false;
    });
    
    var interval = setInterval(() => {
      this.commonService.postData(
        {
          'paginum' : paginum
        },
        'tickets').subscribe(res => {
        this.rdata = JSON.parse(res);
        this.cTicket_array_data = this.rdata['data'];
        this.cTicket_get_length = this.rdata['allData'];
        this.setPage(paginum);
        if(this.cTicket_array_data.length == 0){
          this.emptyTicket = true;
        }
      });
      //first call alarm
      let mUnreadTicket = 0;
      if(!this.commonService.get_user_data()){
        clearInterval(interval);
        return;
      }
      this.commonService.getData('unreadTickets').subscribe(res => {
        this.rdata = JSON.parse(res);
        mUnreadTicket = this.rdata['data'];
          if(mUnreadTicket != 0 && this.commonService.get_user_data()['role_id'] == 1){
            //gjc service
            this.alarmServce.countTicket();
            const alram_message = "There are "+mUnreadTicket+" unread tickets.";
            $(function () {
              $.notify({
                title: '',
                message: alram_message
              }, {
                  type: 'success'
                });
            });
          }
        this.emptyTicket = false;
      });
      //get current time
      this.cTicket_create_time = new Date();
    }, 60000);
  }

  getMsgOfTicket(sel_ticket_id:any, sel_subject:any, sel_state:any){
    ContactmsgComponent.prototype.ticketId = sel_ticket_id;
    ContactmsgComponent.prototype.ticket_subject = sel_subject;
    ContactmsgComponent.prototype.sel_ticket_state = sel_state;
  }

  deleteTicket(del_ticket_id:any){
    var service_url = "delTicket/"+del_ticket_id;
    this.commonService.getData(service_url).subscribe(res => {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
        if (this.rstatus == '1') {
          //reload tickets
          this.ticketsListing(1);
          //gjc service
          this.alarmServce.countTicket();
          const success_message = this.rdata['message'];
          $(function () {
            $.notify({
              title: '',
              message: success_message
            }, {
                type: 'success'
              });
          });
        } else {
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
  }

  changeArrwDir(){
    if(this.changeClick){this.changeClick = false;}
    else{this.changeClick = true;}
  }

  closedStateTicket(sel_ticket_id:any, sel_state:any){
    var update_ticket_url = 'ticketStateChange/'+sel_ticket_id;
    this.commonService.postData(
      {
        state:1
      }, update_ticket_url).subscribe(res => {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if (this.rstatus == '1') {
        //gjc service
        this.alarmServce.countTicket();
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
    // reload contact-us
    this.ticketsListing(1);
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
        return;
    }

    // get pager object from service
    this.pager = this.pagerService.getPager(this.cTicket_get_length, page);
    // get current page of items
    //this.pagedItems = this.cTicket_array_data.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  calculateTime(modifyTime: any){
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