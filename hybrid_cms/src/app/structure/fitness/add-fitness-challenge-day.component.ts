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
declare var NProgress: any;
declare var swal: any;

@Component({
	selector: 'app-add-fitness-challenge-day',
	templateUrl: './add-fitness-challenge-day.component.html',
	styleUrls: []
})
export class AddFitnessChallengeDayComponent implements OnInit {
	public form: FormGroup;
	rdata = [];
	success_message = '';
	is_success = false;
	is_error = false;
	is_image_file = false;
	fileList: FileList;
	fitnessData = '';
	error_message = '';
	rstatus = '';
	editId = '';
	//jcr416
    is_access_app_operation = true;

	statusArray = [
		{
			"name": "Active",
			"key": 1
		},
		{
			"name": "In Active",
			"key": 2
		}
	];
	editIdArray = {
		'value': {
			'id': ''
		}
	};
	constructor(private commonService: CommonService, private fb: FormBuilder, private router: Router, private linkValue: ActivatedRoute) {
		this.commonService.isAuthorizedRoute();
		this.commonService.getData('fetchAllActiveFitnessChallenge').subscribe(res => {
			this.rdata = JSON.parse(res);
			this.fitnessData = this.rdata['data'];
		},
			error => {
				this.rdata = JSON.parse(error._body);
				this.is_error = true;
				this.is_success = false;
				this.error_message = this.rdata['message'];
			}
		);
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
		let self = this;

		let image = null;

		this.form = this.fb.group({
			challenge_id: ['', Validators.required],
			day_no: [null, Validators.required],
			title: [null, Validators.compose([Validators.required])],
			image: [image, Validators.required],
			video_url: [null, Validators.compose([Validators.required])],
			status: [1, Validators.compose([Validators.required])]
		});
		let drImageEvent = $('#image').dropify({
			//defaultFile:self.splash_screen_data['bc_image_original_url']
		});
		drImageEvent.on('dropify.beforeClear', function (event, element) {
			// return confirm("Do you really want to delete \"" + element.filename + "\" ?");
			self.removeImageFileChange(event);
		});

		$(function () {

			$('.draggable-element').arrangeable('destroy');
			$('.draggable-element').arrangeable();
		});
	}
	imagefileChange(event) {
		this.fileList = event.target.files;
		let file = event.target.files[0];
		this.form.controls['image'].setValue(event.target.files[0].name);
		this.is_image_file = false;
	}
	removeImageFileChange(event) {
		this.fileList = event.target.files;
		this.is_image_file = true;
		this.form.controls['image'].setValue(null);
	}
	onSubmit(form: NgForm) {
		// console.log(form.value);
		NProgress.start();
		let formData: FormData = new FormData();
		formData.append('day_no', form.value.day_no);
		formData.append('title', form.value.title);
		formData.append('video_url', form.value.video_url);
		formData.append('challenge_id', form.value.challenge_id);
		formData.append('status', form.value.status);
		if (this.fileList != null) {
			let file: File = this.fileList[0];
			formData.append('image', file);
		}
		this.commonService.filePostData(formData, 'addFitnessChallengeDay').subscribe(res => {
			NProgress.done();
			this.rdata = JSON.parse(res);
			this.rstatus = this.rdata['status'];
			if (this.rstatus == '1') {
				let success_message = this.rdata['message'];
				$(function () {
					$.notify({
						title: '',
						message: success_message
					}, {
							type: 'success'
						});
				});
				this.router.navigate(['/fitness-challenge-day']);
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

		}
		);
	}

}
