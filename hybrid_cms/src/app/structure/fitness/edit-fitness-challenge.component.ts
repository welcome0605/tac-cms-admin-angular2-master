import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
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
	selector: 'app-edit-fitness-challenge',
	templateUrl: './edit-fitness-challenge.component.html',
	styleUrls: []
})
export class EditFitnessChallengeComponent implements OnInit 
{
	public form: FormGroup;
	rdata = [];
	success_message = '';
	is_image_file = false;
	is_success = false;
	is_error = false;
	error_message =  '';
	bodyText = "";
	editId = '';
	rstatus = '';
	//jcr 416
	is_access_app_operation = true;
	fileList: FileList;
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
			'id':''
		}
	};
	constructor(private commonService: CommonService, private fb: FormBuilder, private router: Router, private linkValue: ActivatedRoute) 
	{ 
		this.commonService.isAuthorizedRoute();
		this.editId = this.linkValue.snapshot.params.id;
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

	ngOnInit() 
	{

		let image = null;
		let self = this;
		this.form = this.fb.group({
			title: [null, Validators.compose([Validators.required])],
			image: [image, Validators.compose([Validators.required])],
			description : [null,Validators.required],
			video_url: [null, Validators.compose([Validators.required])],
			price : [null,Validators.required],
			status: [1, Validators.compose([Validators.required])]
		});


		$(function(){

			$('.draggable-element').arrangeable('destroy');
			$('.draggable-element').arrangeable();
		});
		this.editIdArray.value.id = this.editId;
		this.commonService.postData(this.editIdArray.value,'fetchFitnessChallengeById').subscribe(res =>
		{
			this.rdata = JSON.parse(res);
			this.is_success = true;
			this.is_error = false;
			$(function() {
				$('#description').summernote({
					height: 200
				});
			});
			let drImageEvent = $('#image').dropify({
				defaultFile:this.rdata['image_url']
			});
			drImageEvent.on('dropify.beforeClear', function(event, element)
			{
				// return confirm("Do you really want to delete \"" + element.filename + "\" ?");
				self.removeImageFileChange(event);
			});
			this.form = this.fb.group({
				title: [this.rdata['title'], Validators.compose([Validators.required])],
				image: [this.rdata['image'], Validators.compose([Validators.required])],
				video_url: [this.rdata['video_url'], Validators.compose([Validators.required])],
				description : [this.rdata['description'],Validators.required],
				price : [this.rdata['price'],Validators.required],
				status: [this.rdata['status'], Validators.compose([Validators.required])]
			});

		});
	}
	imagefileChange(event)
	{
		this.fileList = event.target.files;
		let file = event.target.files[0];
		this.form.controls['image'].setValue(event.target.files[0].name);
		this.is_image_file = false;
	}
	removeImageFileChange(event)
	{
		this.fileList = event.target.files;
		this.is_image_file = true;
		this.form.controls['image'].setValue(null);
	}
	onSubmit(form : NgForm)
	{
		NProgress.start();
		let formData:FormData = new FormData();
		formData.append('title',form.value.title);
		formData.append('video_url',form.value.video_url);
		formData.append('price',form.value.price);
		formData.append('status',form.value.status);
		if(this.fileList != null) {
			let file: File = this.fileList[0];
			formData.append('image',file);
		}
		let old_image = '';
		if(this.rdata['image'] != null)
		{
			old_image = this.rdata['image'];
		}

		formData.append('old_image',old_image);

		let description = $('#description').summernote('code');
		formData.append('id',this.rdata['id']);
		formData.append('description',description);
		this.commonService.filePostData(formData,'updateFitnessChallenge').subscribe(res =>
		{
			NProgress.done();
			this.rdata = JSON.parse(res);
			this.rstatus = this.rdata['status'];
			if(this.rstatus == '1')
			{
				let success_message = this.rdata['message'];
				$(function() {
					$.notify({
						title: '',
						message: success_message
					},{
						type: 'success'
					});
				});
				this.router.navigate(['/fitness-challenge']);
			}
			else
			{
				let error_message = this.rdata['message'];
				$(function() {
					$.notify({
						title: '',
						message: error_message
					},{
						type: 'danger'
					});
				});
			}

		}
		);
	}

}
