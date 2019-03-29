import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';

import { CommonService } from './../../common.service';
import { SharedService } from './../../shared.service';
import { PagerService } from '../contact/pagi/index';
import { Observable } from 'rxjs/Observable';
import { constants } from 'fs';
import 'rxjs/add/operator/map';
import * as _ from 'underscore';

declare var $: any;
declare var jQuery: any;
declare var NProgress: any
declare var swal: any;

function matchCorrectSpace() {
  // const hasExclamation = input.value !== this.o_password.value;
  return (input: FormControl) => {
    return /^[^-\s][a-zA-Z0-9_\s-]+.+$/.test(input.value) ? null : {
      matchCorrectSpace: {
        valid: false
      }
    };
  }
}

@Component({
  selector: 'dashboard-page',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.page.css'],
})

export class Dashboard implements OnInit {
  @ViewChild('creatFormBtn') creatFormBtnRef: ElementRef;
  public form: FormGroup;
  public editform: FormGroup;
  public trashAppform = {
    'id': '',
    'status': 'trash'
  };
  rdata = [];
  appData: any;
  appLength: number;
  rstatus = '';
  appname = null;
  app_id: number;
  is_access_app_operation = true;
  handleTimer: Observable<any>;

  //gjc0415 array of all items to be paged
  private allItems: any[];
  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];

  constructor(private commonService: CommonService, 
    private pagerService: PagerService,
    private fb: FormBuilder, 
    private router: Router, 
    private sharedService: SharedService) {
    this.commonService.check_user_token_valid().subscribe(res => {
      if(res == false) {
        this.router.navigate(['sign-in']);
      } else {
        const currentuserdata = this.commonService.get_user_data();
        const userRole = currentuserdata.role_id;
        if (userRole !== 1) {
          this.is_access_app_operation = false;
        }
      }
    });
  }
  
  appListing(paginum: number) {
    NProgress.start();
    this.commonService.postData({'paginum':paginum}, 'getallappdata').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.appData = this.rdata['data'];
      this.appLength = this.rdata['appLength'];

      //pagination
      this.setPage(paginum);
      setTimeout(()=>{
        NProgress.done();
      }, 1000)      
    });
  }
  
  getAppValue(appData) {
    this.app_id = appData.id;
    this.appname = appData.app_name;
    this.patchValueForm();
  }
  ngOnInit() {

    $("#mySidenav").css('display','none');
    $(function () {
      setTimeout(() => {
        $('[data-toggle=tooltip]').tooltip();
      }, 500);
    });
    // set form validator
    this.form = this.fb.group({
      app_name: ['', Validators.compose([Validators.required, matchCorrectSpace()])]
    });
    // intiallize editform validator
    this.editform = this.fb.group({
      app_name: [null, Validators.compose([Validators.required])]
    });
    
    // call app listing API
    this.appListing(1);
    // load data into editform
    this.patchValueForm();

    if (this.commonService.isMessage()) {
      const success_message = this.commonService.getMessage();
      $(function () {
        $.notify({
          title: '',
          message: success_message
        }, {
            type: 'danger'
          });
      });
      this.commonService.removeMessage();
    }
  }
  patchValueForm(): void {
    this.editform.patchValue({
      app_name: this.appname
    });
  }
  onSubmit(form: NgForm) {
    this.creatFormBtnRef.nativeElement.disabled = true;
    NProgress.start();
    this.commonService.postData(form.value, 'createapp').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      
      if (this.rstatus == '1') {
        const success_message = this.rdata['message'];
        this.commonService.postData({
          'id': this.rdata['app_id'],
          'appName': this.rdata['app_name'],
        }, 'fastGenerateJson').subscribe(res => {
          NProgress.done();
          form.resetForm();
          $('#appcreate').modal('toggle');
          
          $(function () {
            $.notify({
              title: '',
              message: success_message
            }, {
                type: 'success'
              });
          });
        }, err => {
        }, () => {
            console.log("launch emulator");
        })
        
        
        // this.commonService.getData('getallappdata').subscribe( res => {
        //   let rdata = JSON.parse(res);
        //   this.appData = rdata['data'];
        //   // $('#vertical_left_menu').show();
        // });
        this.appListing(1);
        this.creatFormBtnRef.nativeElement.disabled = false;
        NProgress.done();
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
        NProgress.done();
      }
    });
  }

  onEditSubmit(form: NgForm) {
    form.value.id = this.app_id;
    this.commonService.postData(form.value, 'editapp').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if (this.rstatus === '1') {
        form.resetForm();
        $('#appedit').modal('toggle');
        const success_message = this.rdata['message'];
        $(function () {
          $.notify({
            title: '',
            message: success_message
          }, {
              type: 'success'
            });
        });

        // this.commonService.getData('getallappdata').subscribe(res => {
        //   this.rdata = JSON.parse(res);
        //   this.appData = this.rdata['data'];
        // });
        this.appListing(1);
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

  navigateApp(data) {
    
    NProgress.start();
    
    const postData = {
      'id': data.id
    };
    this.commonService.postData(postData, 'getsingleappdata').subscribe(res => {
      const resdata = JSON.parse(res);
      const appData = resdata['data'];
      
      localStorage.setItem('currentAppData', JSON.stringify(appData));
      this.sharedService.emit_appdata(appData);
      
      // $('#vertical_left_menu').show();
      // $('#previewbar').show();
      NProgress.done();
      this.router.navigate(['/apps/screen']);
    });
  }

  deleteApp(data) {

    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn-danger',
      confirmButtonText: 'Yes, remove it',
      cancelButtonText: 'Cancel',
      closeOnConfirm: false,
      closeOnCancel: true
    }, (isConfirm) => {
      if (isConfirm) {
        // call api to delete app
        this.trashapp(data);

        localStorage.setItem('currentAppData', null);
        this.sharedService.emit_appdata(null);

        // $('#vertical_left_menu').hide();
        // $('#previewbar').hide();
        swal({
          title: 'Deleted!',
          text: 'App has been deleted.',
          type: 'success',
          confirmButtonClass: 'btn-success'
        });
      } else {
        swal({
          title: 'Cancelled',
          text: 'Your record is safe :)',
          type: 'error',
          confirmButtonClass: 'btn-danger'
        });
      }
    });
  }

  trashapp(data) {
    this.trashAppform.id = data.id;
    this.commonService.postData(this.trashAppform, 'updateappstatus').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if (this.rstatus == '1') {
        this.appListing(1);
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

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
        return;
    }

    // get pager object from service
    this.pager = this.pagerService.getPager(this.appLength, page, 12);
    // get current page of items
    //this.pagedItems = this.cTicket_array_data.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}

