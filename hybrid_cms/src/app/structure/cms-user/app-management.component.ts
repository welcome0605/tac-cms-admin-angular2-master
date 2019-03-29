import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';

declare var $: any;
declare var jQuery: any;
declare var swal: any;

const password = new FormControl('', Validators.required);

@Component({
  selector: 'app-management',
  templateUrl: './app-management.component.html',
  styles: []
})
export class AppManagementComponent implements OnInit {
  public form: FormGroup;
  rdata = [];
  success_message = '';
  is_success = false;
  is_error = false;
  error_message = '';
  rstatus = '';
  appData = [];
  userData = [];
  appUserAssignData = [];
  is_access_app_operation: boolean = true;

  public deleteAppAssignUserform = {
    'value': {
      'id': ''
    }
  };


  constructor(private commonService: CommonService, private fb: FormBuilder, private router: Router, private linkValue: ActivatedRoute) {
    this.commonService.isAuthorizedRoute();
    this.getallapp();
    this.getallusers();
    this.getAppAssignUserData();

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

  getallapp() {
    this.commonService.getData('getallapp').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.appData = this.rdata['data'];
    });
  }

  getallusers() {
    this.commonService.getData('getallusers').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.userData = this.rdata['data'];
    });
  }

  ngOnInit() {
    $("#mySidenav").css('display','none');
    this.form = this.fb.group({
      app_basic_id: [null, Validators.compose([Validators.required])],
      user_id: [null, Validators.compose([Validators.required])]
    });
  }

  onSubmit(form: NgForm) {


    this.commonService.postData(form.value, 'saveassignuser').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if (this.rstatus == '1') {
        this.is_success = true;
        this.is_error = false;
        form.resetForm();
        this.getAppAssignUserData();
        this.getallapp();
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

  getAppAssignUserData() {
    this.commonService.getData('appassignuserdata').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.appUserAssignData = this.rdata['data'];
    });
  }

  removeAppAssignUser(data) {
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
      function (isConfirm) {
        if (isConfirm) {
          self.deleteAppAssignUser(data);
          swal({
            title: "Deleted!",
            text: "App assigned user removed successfully.",
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

  deleteAppAssignUser(id) {
    this.deleteAppAssignUserform.value.id = id;
    this.commonService.postData(this.deleteAppAssignUserform.value, 'deleteassignuser').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if (this.rstatus == '1') {
        this.is_success = true;
        this.is_error = false;
        this.getAppAssignUserData();
        this.getallapp();
      }
      else {
        let error_message = this.rdata['message'];
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

}
