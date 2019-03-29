import { Component, OnInit } from '@angular/core';

import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';

import { CustomValidators } from 'ng2-validation';

import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';

declare var $: any;
declare var jQuery: any;

declare var NProgress: any;
declare var swal: any;

function matchCorrectPass() {
  // const hasExclamation = input.value !== this.o_password.value;
  return (input: FormControl) => {
    return /(?=.*\d)(?=.*)(?=.*[A-Z]).*/.test(input.value) ? null : {
      matchCorrectPass: {
        valid: false
      }
    };
  }
}
const password = new FormControl('', [Validators.required, Validators.minLength(6), matchCorrectPass()]);
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

@Component({
  selector: 'app-otp-form',
  templateUrl: './otp-form.component.html',
  styleUrls: []
})

export class OtpFormComponent implements OnInit {
  public form: FormGroup;
  public form1: FormGroup;
  rdata = [];
  success_message = '';
  is_success = false;
  is_error = false;
  error_message = '';
  showOtpForm = true;
  showPasswordForm = false;
  userId = '';
  rstatus:any;
  //jcr 416
  // is_access_app_operation = true;
  constructor(private commonService: CommonService, private fb: FormBuilder, private router: Router) 
  {
    //jcr 416
		// this.commonService.check_user_token_valid().subscribe(res => {
		// 	if(res == false) {
		// 	  this.router.navigate(['sign-in']);
		// 	} else {
		// 	  const currentuserdata = this.commonService.get_user_data();
		// 	  const userRole = currentuserdata.role_id;
		// 	  if (userRole !== 1) {
		// 		this.is_access_app_operation = false;
		// 	  }
		// 	}
		//   });
  }

  ngOnInit() {

    this.form = this.fb.group({
      otp: [null, Validators.compose([Validators.required, CustomValidators.otp])]
    });
    this.form1 = this.fb.group({
      new_passowrd: password,
      new_cnf_password: confirmPassword
    });

    $(function () {

      // Show/Hide Password
      $('.password').password({
        eyeClass: '',
        eyeOpenClass: 'icmn-eye',
        eyeCloseClass: 'icmn-eye-blocked'
      });

      // Switch to fullscreen
      $('.switch-to-fullscreen').on('click', function () {
        $('.cat__pages__login').toggleClass('cat__pages__login--fullscreen');
      })

      // Change BG
      $('.random-bg-image').on('click', function () {
        var min = 1, max = 5,
          next = Math.floor($('.random-bg-image').data('img')) + 1,
          final = next > max ? min : next;

        $('.random-bg-image').data('img', final);
        $('.cat__pages__login').data('img', final).css('backgroundImage', 'url(assets/modules/pages/common/img/login/' + final + '.jpg)');
      })

      //Handle error message
      $(document).on('click', '.alert-close', function () {
        $('.alert-close').hide();
      })

    });

  }

  onSubmit(form: NgForm)
  {
    NProgress.start();
    this.commonService.postData(form.value, 'otp').subscribe(res =>
    {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];

      if(this.rstatus == '1' || this.rstatus == 1)
      {
        NProgress.done();
        this.success_message = this.rdata['message'];
        this.userId = this.rdata['userId'];
        this.is_success = true;
        this.is_error = false;
        this.showOtpForm = false;
        this.showPasswordForm = true;
      }
      else
      {
        NProgress.done();
        this.is_error = true;
        this.is_success = false;
        this.error_message = this.rdata['message'];
        this.showOtpForm = true;
        this.showPasswordForm = false;
      }
    },
    error =>
    {
      NProgress.done();
      this.rdata = JSON.parse(error._body);
      this.error_message = this.rdata['message'];
      this.is_error = true;
      this.is_success = false;
      this.showOtpForm = true;
      this.showPasswordForm = false;
      $(function ()
      {
        $('.alert-close').show();
      });
    }
    );
  }

  onNewPasswordSubmit(form1: NgForm)
  {
    NProgress.start();
    form1.value.userId = this.userId;
    this.commonService.postData(form1.value, 'newPasswordUpdated').subscribe(res =>
    {
      NProgress.done();
      this.rdata = JSON.parse(res);
      this.is_error = false;
      this.is_success = true;
      this.success_message = this.rdata['message'];

      this.commonService.storeMessage(this.success_message);
      this.router.navigate(['/sign-in']);

    },
      error =>
      {
        NProgress.done();
        this.rdata = JSON.parse(error._body);
        this.is_error = true;
        this.is_success = false;
        this.error_message = this.rdata['message'];
        $(function () {
          $('.alert-close').show();
        });
      }
    );
  }



}
