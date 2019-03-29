import { Component, OnInit } from '@angular/core';

import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';

import { CustomValidators } from 'ng2-validation';
import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';
import { SharedService } from './../../shared.service';


declare var $: any;
declare var jQuery: any;

declare var NProgress: any;


@Component({
  selector: 'app-users',
  templateUrl: './privacy-policy.component.html',
  styles: []
})

export class PrivacyPolicyComponent implements OnInit
{
  public form: FormGroup;
  rdata = [];
  storeData = [];
  rstatus = '';
  error_message = '';
  is_success = false;
  success_message = '';
  is_error = false;
  subscription: Subscription;
  appData = [];
  //jcr 416
  // is_access_app_operation = true;

  constructor(private commonService: CommonService, private checkloginService: CheckloginService, private fb: FormBuilder, private router: Router,private sharedService: SharedService)
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

    
    $(function() {
      // Show/Hide Password
      

    });

  }
  
}
