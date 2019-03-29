import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Validators, FormControl,NgForm } from '@angular/forms';

import { CustomValidators } from 'ng2-validation';
import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';

declare var $: any;
declare var jQuery: any;

declare var NProgress: any;
declare var swal: any;

@Component({
  selector: 'user-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: []
})

export class ForgotPasswordComponent implements OnInit
{
  public form: FormGroup;
  model = {email:""};
  post:any;
  rdata = [];
  storeData = [];
  rstatus:any;
  error_message = '';
  is_success = false;
  success_message = '';
  is_error = false;
  //jcr 416
  // is_access_app_operation = true;

  constructor(private commonService: CommonService, private checkloginService: CheckloginService, private fb: FormBuilder, private router: Router) {
    commonService.is_loggedin();
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
      email: [null, Validators.compose([Validators.required, CustomValidators.email])]
    });

    $(function() {

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
      $(document).on('click', '.alert-close', function() {
        $('.alert-close').hide();
      })

    });

  }

  onSubmit(form: NgForm)
  {
    this.commonService.postData(form.value,'forgotpassword').subscribe(res =>
      {
        NProgress.start();
        this.rdata = JSON.parse(res);
        this.rstatus = this.rdata['status'];
        if(this.rstatus == '1' || this.rstatus == 1)
        {
          NProgress.done();
          this.is_success = true;
          this.is_error = false;
          this.success_message = this.rdata['message'];
          this.router.navigate(['/otp']);
        }
        else
        {
          NProgress.done();
          this.is_error = true;
          this.error_message = this.rdata['message'];
          $(function() {
            $('.alert-close').show();
          });
        }
      }
    );
  }


}
