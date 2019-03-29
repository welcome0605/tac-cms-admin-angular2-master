import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

import { CommonService } from './../../../common.service';
import { CheckloginService } from './../../../checklogin.service';
import { S3Service } from './../../../s3.service';

import { Observable } from 'rxjs/Observable';

declare var $: any;
declare var jQuery: any;
declare var swal: any;
declare var NProgress: any;

@Component({
	selector: 'app-edit-bonus',
	templateUrl: './edit-bonus.component.html',
	styles: []
})
export class EditBonusComponent implements OnInit {
	@ViewChild('addBonusForm') addBonusFormRef: NgForm;
	@ViewChild('addBonusBtn') addBonusBtnRef: ElementRef;
	@ViewChild('fileInput') fileInputRef: ElementRef;

	form: FormGroup;
	appId: string;
	editId = '';
	rdata;
	// jcr 416 
	is_access_app_operation = true;
	constructor(
		private commonService: CommonService,
		private fb: FormBuilder,
		private router: Router,
		private linkValue: ActivatedRoute,
		private s3Service: S3Service
	) {
		this.commonService.isAuthorizedRoute();	
		this.editId = this.linkValue.snapshot.params.id;
		this.form = this.fb.group({
			name: [null, Validators.compose([Validators.required])],
			description: '',
			cost: 0,
			image: ''
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

		let bottom_html = "<input type='file' id='fileInput' name='files[]'/ accept='image/*'><canvas id='myCanvas' style='display:none;'></canvas><div id='modal'></div><div id='preview'><div class='buttons'><div class='cancel' style='background-size: 100% 100%;'></div><div class='ok' style='background-size: 100% 100%;'></div></div></div>";
	    if (typeof($('#preview').html()) == 'undefined') {
	      $('body').append(bottom_html);
	    }

		this.appId = JSON.stringify(this.commonService.get_current_app_data().id);
		this.commonService.postData({id: this.editId}, 'fetchBonusById').subscribe(res => {
			this.rdata = JSON.parse(res);
			this.form.patchValue({
				name: this.rdata['name'],
				description: this.rdata['description'],
				cost: this.rdata['cost'],
				image: this.rdata['image']
			});

			$('.dropify').dropify({
				defaultFile: this.rdata['image'],
				messages: {
	                'default': 'Drag and drop a file here or click',
	                'replace': 'Drag and drop or click to replace',
	                'remove': 'Remove',
	                'error': ''
	            }
			});

			NProgress.done();
		}, error => {
			NProgress.done();
		});
	}

	onSubmit(form: NgForm) {
		NProgress.start();
		this.fileUploadObservable().subscribe((res) => {
			if (!res.unchanged)
				form.value.image = res ? res['data'].Location : '';
			this.addBonusBtnRef.nativeElement.disabled = true;
			form.value.id = this.editId;
			this.commonService.postData(form.value, 'updateBonus').subscribe(res => {
					this.router.navigate(['/rewards']);
					this.addBonusBtnRef.nativeElement.disabled = false;
				},
				error => {
					this.addBonusBtnRef.nativeElement.disabled = false;
				}
			);

			NProgress.done();
		});
	}

	private fileUploadObservable(): Observable<any> {
		return Observable.create(observer => {
			if (this.fileInputRef.nativeElement.isChanged) {
		    	let base64File = $('.image-dropify').converter2Base64();
				this.s3Service.uploadBase64(base64File)
					.subscribe(
						res => {						
							observer.next(res);
						},
						err => {
							// this.errorMsg = 'Could not upload image.';
							observer.next();
						}
					);
				this.s3Service.deleteFileByUrl(this.rdata['image']);
		    } else {
		    	observer.next({ unchanged: true });
		    }
		});
	}

	imageFileChange(event) {
        $('.image-dropify').simpleCropper(256,256);
    }
}