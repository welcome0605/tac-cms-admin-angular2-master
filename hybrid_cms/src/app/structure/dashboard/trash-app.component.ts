import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';

import { CommonService } from './../../common.service';
import { SharedService } from './../../shared.service';
declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
  selector: 'trashapp-page',
  templateUrl: './trash-app.component.html'
})

export class TrashAppComponent implements OnInit {
  public form: FormGroup;
  public editform: FormGroup;
  public deleteAppform = {
        'id':''
  };
  public restoreAppform = {
        'id':'',
        'status':'restore'
  };
  rdata = [];
  appData = [];
  rstatus = '';
  appname = null;
  app_id:number;
  constructor(private commonService: CommonService, private fb: FormBuilder,private router: Router,private sharedService: SharedService) {
    this.commonService.isAuthorizedRoute();
    this.appListing();
  }
  appListing()
  {
    this.commonService.getData('gettrashappdata').subscribe(res =>
      {
        this.rdata = JSON.parse(res);
        this.appData = this.rdata['data'];
      });
  }
  ngOnInit() {

    $("#mySidenav").css('display','none');

    this.form = this.fb.group({
      app_name: ['', Validators.compose([Validators.required])]
    });
    this.editform = this.fb.group({
      app_name: [this.appname, Validators.compose([Validators.required])]
    });

  }
   
 deleteApp(data)
  {
    var self = this;

    swal({
        title: "Are you sure?",
        text: "You will not be able to recover this record",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes, remove it",
        cancelButtonText: "Cancel",
        closeOnConfirm: false,
        closeOnCancel: true
      },
      function(isConfirm)
      {
        if (isConfirm)
        {
          self.deleteappdata(data);
          swal({
            title: "Deleted!",
            text: "App has been deleted.",
            type: "success",
            confirmButtonClass: "btn-success"
          });
        } else {
          swal({
            title: "Cancelled",
            text: "Your record is safe :)",
            type: "error",
            confirmButtonClass: "btn-danger"
          });
        }
    });
  }

  deleteappdata(data)
  {
    this.deleteAppform.id= data.id;
      this.commonService.postData(this.deleteAppform,'deleteapp').subscribe(res =>
    {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if(this.rstatus == '1')
      {
        this.appListing();
      }
      else
      {
        let error_message = this.rdata['message'];
          $(function() {
           $.notify({
            title: '',
            message: error_message
          },{
            type: 'danger'
          });
        });
      }

    });
  }

  restoreApp(data)
  {
    var self = this;

    swal({
        title: "Are you sure?",
        text: "You will not be able to recover this record",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes, restore it",
        cancelButtonText: "Cancel",
        closeOnConfirm: false,
        closeOnCancel: true
      },
      function(isConfirm)
      {
        if (isConfirm)
        {
          self.restoreappdata(data);
          swal({
            title: "Restored!",
            text: "App has been restored.",
            type: "success",
            confirmButtonClass: "btn-success"
          });
        } else {
          swal({
            title: "Cancelled",
            text: "Your record is safe :)",
            type: "error",
            confirmButtonClass: "btn-danger"
          });
        }
    });
  }

  restoreappdata(data)
  {
    this.restoreAppform.id= data.id;
      this.commonService.postData(this.restoreAppform,'updateappstatus').subscribe(res =>
    {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if(this.rstatus == '1')
      {
        this.appListing();
      }
      else
      {
        let error_message = this.rdata['message'];
          $(function() {
           $.notify({
            title: '',
            message: error_message
          },{
            type: 'danger'
          });
        });
      }

    });
  }

}

