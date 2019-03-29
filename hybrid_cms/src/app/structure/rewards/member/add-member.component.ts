import {Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { FormBuilder, FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

import { CommonService } from './../../../common.service';
import { CheckloginService } from './../../../checklogin.service';

@Component({
    selector: 'app-add-member',
    templateUrl: './add-member.component.html',
    styleUrls: ['./add-member.component.css']
})
export class AddMemberComponent implements OnInit {
	form: FormGroup;
	appId: string;
	@ViewChild('addMemberBtn') addMemberBtnRef : ElementRef;
	//jcr 416
	is_access_app_operation = true;

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
		this.appId = JSON.stringify(this.commonService.get_current_app_data().id);
		this.form = this.fb.group({
			username: [null, Validators.compose([Validators.required])],
			email: [null, Validators.compose([Validators.required])],
			first_name: '',
			last_name: '',
			password: '',
			notification: false
		});
	}

	onSubmit(form: NgForm) {
		this.addMemberBtnRef.nativeElement.disabled = true;
		form.value.app_id = this.appId;
		this.commonService.postData(form.value, 'addMember').subscribe(res => {
				this.router.navigate(['/rewards/member']);
				this.addMemberBtnRef.nativeElement.disabled = false;
			},
			error => {
				this.addMemberBtnRef.nativeElement.disabled = false;
			}
		);
	}

	goBack(): void {
		this.location.back();
	}
	
}
