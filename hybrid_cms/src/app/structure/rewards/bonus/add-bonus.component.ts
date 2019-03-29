import {Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

import { CommonService } from './../../../common.service';
import { CheckloginService } from './../../../checklogin.service';
import { S3Service } from './../../../s3.service';

import { Observable } from 'rxjs/Observable';

declare var $: any;
declare var jQuery: any;
declare var NProgress: any;
declare var swal: any;

@Component({
    selector: 'app-add-bonus',
    templateUrl: './add-bonus.component.html',
    styleUrls: ['./add-bonus.component.css']
})
export class AddBonusComponent implements OnInit {
	form: FormGroup;
	appId: string;
	//jcr 416
	is_access_app_operation = true;

	@ViewChild('addBonusBtn') addBonusBtnRef : ElementRef;
	@ViewChild('fileInput') fileInputRef: ElementRef;
	
	constructor(
		private commonService: CommonService,
		private location: Location,
		private router: Router,
		private fb: FormBuilder,
		private s3Service: S3Service
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

		let bottom_html = "<input type='file' id='fileInput' name='files[]'/ accept='image/*'><canvas id='myCanvas' style='display:none;'></canvas><div id='modal'></div><div id='preview'><div class='buttons'><div class='cancel' style='background-size: 100% 100%;'></div><div class='ok' style='background-size: 100% 100%;'></div></div></div>";
	    if (typeof($('#preview').html()) == 'undefined') {
	      $('body').append(bottom_html);
	    }
	    
		this.appId = JSON.stringify(this.commonService.get_current_app_data().id);
		this.form = this.fb.group({
			name: [null, Validators.compose([Validators.required])],
			description: '',
			cost: 0,
			image: ''
		});
		$('.dropify').dropify({
			messages: {
                'default': 'Drag and drop a file here or click',
                'replace': 'Drag and drop or click to replace',
                'remove': 'Remove',
                'error': ''
            }
		});
	}

	onSubmit(form: NgForm) {
		NProgress.start();
		this.fileUploadObservable().subscribe((res) => {
			form.value.image = res ? res['data'].Location : '';
			this.addBonusBtnRef.nativeElement.disabled = true;
			form.value.app_id = this.appId;
			this.commonService.postData(form.value, 'addBonus').subscribe(res => {
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
		    } else {
		    	observer.next();
		    }
		});
	}

	goBack(): void {
		this.location.back();
	}

	imageFileChange(event) {
        $('.image-dropify').simpleCropper(256,256);
        
        // this.mainHeaderImgName = event.target.files[0].name;
        // this.menuLocationFormBoolRef = true;
        // this.genralImageChangeFlag = true;
        // let tempData = this.mainHeaderImgName.split('.');
        // // this.dropifyAppIconHeaderSize
        // setTimeout(() => {
        //     if (this.dropifyAppIconHeaderSize != false) {
        //         if ((tempData[1] == 'png' || tempData[1] == 'jpeg' || tempData[1] == 'jpg')) {
        //             // this.homescreenSubmit();
        //         }
        //     } else {
        //         this.dropifyAppIconHeaderSize = true;
        //     }
        // }, 1000)
    }
	
}
