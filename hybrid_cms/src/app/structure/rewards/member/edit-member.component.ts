import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

import { CommonService } from './../../../common.service';
import { CheckloginService } from './../../../checklogin.service';
import { Observable } from 'rxjs/Observable';

declare var $: any;
declare var jQuery: any;
declare var swal: any;
declare var NProgress: any;

@Component({
	selector: 'app-edit-member',
	templateUrl: './edit-member.component.html',
	styles: []
})
export class EditMemberComponent implements OnInit {
	@ViewChild('addMemberForm') addMemberFormRef: NgForm;
	@ViewChild('addMemberBtn') addMemberBtnRef: ElementRef;

	form: FormGroup;
	editId = '';
	appId: string;
	rdata;
	// jcr 416
	is_access_app_operation = true;

	constructor(
		private commonService: CommonService,
		private fb: FormBuilder,
		private router: Router,
		private linkValue: ActivatedRoute) {
		this.commonService.isAuthorizedRoute();	
		this.editId = this.linkValue.snapshot.params.id;
		this.form = this.fb.group({
			username: [null, Validators.compose([Validators.required])],
			email: [null, Validators.compose([Validators.required])],
			first_name: '',
			last_name: '',
			point: 0
		});
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
		NProgress.start();
		this.appId = JSON.stringify(this.commonService.get_current_app_data().id);
		this.commonService.postData({id: this.editId}, 'fetchMemberById').subscribe(res => {
			this.rdata = JSON.parse(res);
			this.form.patchValue({
				username: this.rdata['username'],
				email: this.rdata['email'],
				first_name: this.rdata['first_name'],
				last_name: this.rdata['last_name'],
				role: this.rdata['point']
			});
			NProgress.done();
		}, error => {
			NProgress.done();
		});
	}

	onSubmit(form: NgForm) {
		this.onSubmitObservable(form, false)
			.subscribe();
	}

	onSubmitObservable(form: NgForm, canDeactivate: boolean): Observable<any> {
		return Observable.create((observer) => {
			this.addMemberBtnRef.nativeElement.disabled = true;
			form.value.id = this.editId;
			form.value.app_id = this.appId;
			this.commonService.postData(form.value, 'updateMember').subscribe(res => {
				this.router.navigate(['/rewards/member']);
				this.addMemberBtnRef.nativeElement.disabled = false;
			},
			error => {
				this.addMemberBtnRef.nativeElement.disabled = false;
			});
		});
	}
}