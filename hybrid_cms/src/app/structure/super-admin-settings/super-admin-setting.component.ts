import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';

declare var NProgress: any;
declare var $: any;
declare var jQuery: any;
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
  selector: 'super-admin-setting',
  templateUrl: './super-admin-setting.component.html',
  styles: []
})
export class SuperAdminSettingComponent implements OnInit {
  public saform: FormGroup;
  @ViewChild('adminSaveBtn') adminSaveBtnRef : ElementRef;
  emailId: any;
  firebaseId: any;
  rdata: any;

  constructor(private commonService: CommonService, private fb: FormBuilder, private router: Router, private linkValue: ActivatedRoute) {
    this.saform = this.fb.group({
      email: [null, Validators.compose([Validators.required, matchCorrectSpace()])]
    });
  }
  ngOnInit() {
    $("#mySidenav").css('display','none');

    this.commonService.getData('getSuperAdminSettingData').subscribe(res => {
      const responseData = JSON.parse(res);
      // console.log(res['id']);
      // console.log(res.length);

      for (let i = 0; i < responseData.length; ++i) {
        // console.log(responseData[i]['app_super_admin_json_data']);
        const mainJsonData = JSON.parse(responseData[i]['app_super_admin_json_data']);
        console.log(mainJsonData);
        this.emailId = mainJsonData['email'];        
        this.patchValue();
      }


      // this.resData = JSON.parse(res);
      // this.emailId = this.resData[0]['plystore_url'];

    })



  }
  patchValue() {
    this.saform.patchValue({
      email: this.emailId,
    })
  }
  superAdminSettingSubmit(form: NgForm) {
    // console.log(form.value.email);
    const jsonData = [{
      email: form.value.email}]
    NProgress.start();
    this.adminSaveBtnRef.nativeElement.disabled = true;
    this.commonService.postData(form.value, 'saveSuperAdminSettingData').subscribe(res => {
      NProgress.done();
      // console.log(res);
      this.rdata = JSON.parse(res);
      if (this.rdata['status'] == '1') {
        const success_message = this.rdata['message'];
        $(function () {
          $.notify({
            title: '',
            message: success_message
          }, {
              type: 'success'
            });
        });
        this.adminSaveBtnRef.nativeElement.disabled = false;
      } else {
        this.adminSaveBtnRef.nativeElement.disabled = false;
      }
    })


  }
}

