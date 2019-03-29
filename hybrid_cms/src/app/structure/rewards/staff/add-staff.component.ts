import {Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { FormBuilder, FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

import { CommonService } from './../../../common.service';
import { CheckloginService } from './../../../checklogin.service';

@Component({
    selector: 'app-add-staff',
    templateUrl: './add-staff.component.html',
    styleUrls: ['./add-staff.component.css']
})
export class AddStaffComponent implements OnInit {
	form: FormGroup;
	appId: string;
	@ViewChild('addStaffBtn') addStaffBtnRef : ElementRef;
	//jcr 416
	is_access_app_operation = true;

	rolesArray = [
		{
			"name": "Staff",
			"key": 1
		},
		{
			"name": "Admin Staff",
			"key": 2
		}
	];
	constructor(
		private commonService: CommonService,
		private location: Location,
		private router: Router,
		private fb: FormBuilder
	) {
		this.commonService.isAuthorizedRoute();
		//jcr 416
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

	ngOnInit() {
		this.form = this.fb.group({
			username: [null, Validators.compose([Validators.required])],
			email: [null, Validators.compose([Validators.required])],
			first_name: '',
			last_name: '',
			role: 1,
			passcode: '',
			password: '',
			notification: false
		});
		this.appId = JSON.stringify(this.commonService.get_current_app_data().id);
	}

	onSubmit(form: NgForm) {
		this.addStaffBtnRef.nativeElement.disabled = true;
		form.value.app_id = this.appId;
		this.commonService.postData(form.value, 'addStaff').subscribe(res => {
				this.router.navigate(['/rewards/staff']);
				this.addStaffBtnRef.nativeElement.disabled = false;
			},
			error => {
				this.addStaffBtnRef.nativeElement.disabled = false;
			}
		);
	}

	goBack(): void {
		this.location.back();
	}
	
}
