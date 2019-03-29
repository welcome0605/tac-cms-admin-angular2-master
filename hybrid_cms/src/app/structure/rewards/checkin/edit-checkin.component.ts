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
	selector: 'app-edit-checkin',
	templateUrl: './edit-checkin.component.html',
	styles: []
})
export class EditCheckinComponent implements OnInit {
	@ViewChild('editCheckinBtn') editCheckinBtnRef: ElementRef;

	form: FormGroup;
	editId = '';
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
			status: 0,
			note: ''
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
		this.commonService.postData({id: this.editId}, 'fetchCheckinById').subscribe(res => {
			this.rdata = JSON.parse(res);
			this.form.patchValue({
				status: this.rdata['status'],
				note: this.rdata['note']
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
			this.editCheckinBtnRef.nativeElement.disabled = true;
			form.value.id = this.editId;
			this.commonService.postData(form.value, 'updateCheckin').subscribe(res => {
				this.router.navigate(['/rewards/checkin']);
				this.editCheckinBtnRef.nativeElement.disabled = false;
			},
			error => {
				this.editCheckinBtnRef.nativeElement.disabled = false;
			});
		});
	}
}