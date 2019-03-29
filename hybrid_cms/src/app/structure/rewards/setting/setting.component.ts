import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';

import { CommonService } from './../../../common.service';
import { CheckloginService } from './../../../checklogin.service';
import { Observable } from 'rxjs/Observable';

import { ColorPickerService, Rgba } from 'ngx-color-picker';
import { S3Service } from './../../../s3.service';
import { environment } from './../../../../environments/environment';

declare var $: any;
declare var jQuery: any;
declare var swal: any;
declare var NProgress: any;

const defaultImage = environment.defaultIcon;

let defaultImageCreate = (src) => {
  var img = document.createElement('img');
  img.src = src;
  return img;
};

@Component({
	selector: 'app-reward-settings',
	templateUrl: './setting.component.html',
	styleUrls: ['./setting.component.css']
})
export class RewardSettingComponent implements OnInit {
	@ViewChild('app_background_image') app_background_image_ref: ElementRef;
	form: FormGroup;
	editId = '';
	rdata;
	rstatus;
	postCount: any;
	postBusy : any;
	PreSettingData = {};
	SettingData = {};
	rewardsCount: number;
	//jcr 416
	is_access_app_operation = true;

	public tempColor = {
		'value': '#ff0000'
	};

	public tmpSelect = 2;
	public appId : any;
	public fontFamilyData = [];

	constructor(
		private commonService: CommonService,
		private fb: FormBuilder,
		private router: Router,
		private s3Service: S3Service,
		private cpService: ColorPickerService,
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
		NProgress.start();
		this.resetAllSettingData();		
		this.appId = JSON.stringify(this.commonService.get_current_app_data().id);
		this.commonService.postData({app_id: this.appId}, 'getReviewSetting').subscribe(res => {
			this.rdata = JSON.parse(res);
			if (this.rdata.data.length != 0) {
				this.SettingData = JSON.parse(this.rdata.data[0].json);
				this.commonService.postData({'app_id': this.appId}, 'fetchAllBonuses').subscribe(res => {
					let bonuses = JSON.parse(res)['data'];
					this.rewardsCount = bonuses.filter(bonus => bonus.active == 1).length;
					if (this.rewardsCount > 1) {
						this.SettingData['Punch_Card_System']['User_Punch_Card_System']['Type'] = 2;
					}
				}, error => {
					this.rdata = JSON.parse(error._body);
			        console.log(this.rdata['message']);
			        this.rewardsCount = -1;
				});
			}
			NProgress.done();
		}, error => {
			NProgress.done();
		});
		this.fontFamilyData = [];
        this.commonService.getData('getFontData').subscribe(res => {
            this.fontFamilyData = JSON.parse(res);
		})
		
		this.PreSettingData = this.SettingData;
		console.log(this.PreSettingData);
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

	beforeChange($event: NgbTabChangeEvent) {
    	if ($event.nextId == 'tab-rewards-card') {
    		setTimeout(() => {
    			const drBackImage = $('#app_background_image').dropify({
					defaultFile: this.SettingData['Rewards_Card']['Background_Image'],
					messages: {
						'default': 'Drag and drop a file here or click',
						'replace': 'Drag and drop or click to replace',
						'remove': 'Remove',
						'error': ''
					},
					error: {
						'fileSize': 'The file size is too big ({{ value }} max).',
						'minWidth': 'The image width is too small ({{ value }}px min).',
						'maxWidth': 'The image width is too big ({{ value }}px max).',
						'minHeight': 'The image height is too small ({{ value }}px min).',
						'maxHeight': 'The image height is too big ({{ value }}px max).',
						'imageFormat': 'The image format is not allowed ({{ value }} only).'
					},
					tpl: {
						wrap: '<div class="dropify-wrapper"></div>',
						loader: '<div class="dropify-loader"></div>',
						message: '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
						preview: '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
						filename: '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
						clearButton: '<button type="button" class="dropify-clear">{{ remove }}</button>',
						errorLine: '<p class="dropify-error">{{ error }}</p>',
						errorsContainer: '<div class="dropify-errors-container">Please upload image between 100 to 500 dimensions</div>'
					}
				});

				drBackImage.on('dropify.afterClear', (event, element) => {
			      this.clearDropifyElement('app_background_image');
			    });

				const drHeaderImage = $('#app_header_image').dropify({
					defaultFile: this.SettingData['Rewards_Card']['Header_Image'],
					messages: {
						'default': 'Drag and drop a file here or click',
						'replace': 'Drag and drop or click to replace',
						'remove': 'Remove',
						'error': ''
					},
					error: {
						'fileSize': 'The file size is too big ({{ value }} max).',
						'minWidth': 'The image width is too small ({{ value }}px min).',
						'maxWidth': 'The image width is too big ({{ value }}px max).',
						'minHeight': 'The image height is too small ({{ value }}px min).',
						'maxHeight': 'The image height is too big ({{ value }}px max).',
						'imageFormat': 'The image format is not allowed ({{ value }} only).'
					},
					tpl: {
						wrap: '<div class="dropify-wrapper"></div>',
						loader: '<div class="dropify-loader"></div>',
						message: '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
						preview: '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
						filename: '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
						clearButton: '<button type="button" class="dropify-clear">{{ remove }}</button>',
						errorLine: '<p class="dropify-error">{{ error }}</p>',
						errorsContainer: '<div class="dropify-errors-container">Please upload image between 100 to 500 dimensions</div>'
					}
				});

				drHeaderImage.on('dropify.afterClear', (event, element) => {
			      this.clearDropifyElement('app_header_image');
			    });

				const drIconImage = $('#app_icon_image').dropify({
					defaultFile: this.SettingData['Rewards_Card']['Icon_Image'],
					messages: {
						'default': 'Drag and drop a file here or click',
						'replace': 'Drag and drop or click to replace',
						'remove': 'Remove',
						'error': ''
					},
					error: {
						'fileSize': 'The file size is too big ({{ value }} max).',
						'minWidth': 'The image width is too small ({{ value }}px min).',
						'maxWidth': 'The image width is too big ({{ value }}px max).',
						'minHeight': 'The image height is too small ({{ value }}px min).',
						'maxHeight': 'The image height is too big ({{ value }}px max).',
						'imageFormat': 'The image format is not allowed ({{ value }} only).'
					},
					tpl: {
						wrap: '<div class="dropify-wrapper"></div>',
						loader: '<div class="dropify-loader"></div>',
						message: '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
						preview: '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
						filename: '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
						clearButton: '<button type="button" class="dropify-clear">{{ remove }}</button>',
						errorLine: '<p class="dropify-error">{{ error }}</p>',
						errorsContainer: '<div class="dropify-errors-container">Please upload image between 100 to 500 dimensions</div>'
					}
				});	

				drIconImage.on('dropify.afterClear', (event, element) => {
			      this.clearDropifyElement('app_icon_image');
			    });
    		});
    	} else if ($event.nextId == 'tab-login-register') {
    		setTimeout(() => {
    			const drLoginIconImage = $('#app_login_icon_image').dropify({
					defaultFile: this.SettingData['Login_Register']['Icon_Image'],
					messages: {
						'default': 'Drag and drop a file here or click',
						'replace': 'Drag and drop or click to replace',
						'remove': 'Remove',
						'error': ''
					},
					error: {
						'fileSize': 'The file size is too big ({{ value }} max).',
						'minWidth': 'The image width is too small ({{ value }}px min).',
						'maxWidth': 'The image width is too big ({{ value }}px max).',
						'minHeight': 'The image height is too small ({{ value }}px min).',
						'maxHeight': 'The image height is too big ({{ value }}px max).',
						'imageFormat': 'The image format is not allowed ({{ value }} only).'
					},
					tpl: {
						wrap: '<div class="dropify-wrapper"></div>',
						loader: '<div class="dropify-loader"></div>',
						message: '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
						preview: '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
						filename: '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
						clearButton: '<button type="button" class="dropify-clear">{{ remove }}</button>',
						errorLine: '<p class="dropify-error">{{ error }}</p>',
						errorsContainer: '<div class="dropify-errors-container">Please upload image between 100 to 500 dimensions</div>'
					}
				});

				drLoginIconImage.on('dropify.afterClear', (event, element) => {
			      this.clearDropifyElement('app_login_icon_image');
			    });
    		});
    	}
    }

	ngOnInit() {
		
		// background-image-dropify
		// app_background_image

		//init image cropping

		let bottom_html = "<input type='file' id='fileInput' name='files[]'/ accept='image/*'><canvas id='myCanvas' style='display:none;'></canvas><div id='modal'></div><div id='preview'><div class='buttons'><div class='cancel' style='background-size: 100% 100%;'></div><div class='ok' style='background-size: 100% 100%;'></div></div></div>";
        if (typeof($('#preview').html()) == 'undefined') {
        	$('body').append(bottom_html);
		}		
	}
	
	onSubmit(form: NgForm) {
		this.onSubmitObservable(form, false)
			.subscribe();
	}

	onSubmitObservable(form: NgForm, canDeactivate: boolean): Observable<any> {
		return Observable.create((observer) => {
			
		});
	}

	ChangeColorPicker($event, value) {
		console.log($event);
		console.log(value);
		this.splitPropString($event,value);
		
	}

	ChangeTextModel($event, value) {
		
		console.log($event);
		this.splitPropString($event,value);
	}

	ChangeSelectModel($event, value) {
		console.log($event);
		this.splitPropString($event,value);
	}

	appBackGroundFileChange ($event) {
		$('.background-image-dropify').simpleCropper(320,560);
	}

	appHeaderFileChange ($event) {
		$('.header-image-dropify').simpleCropper(320,80);
	}

	appIconFileChange ($event) {
		$('.icon-image-dropify').simpleCropper(128,128);
	}

	appLoginIconFileChange ($event) {
		$('.login-icon-image-dropify').simpleCropper(256,256);
	}

	splitPropString ($event,value: any) {
		let str: string = String(value);
		let pathArray =  str.split("/");
		if (pathArray.length == 1) {
			this.SettingData[pathArray[0]] = $event
		} else if (pathArray.length == 2) {
			this.SettingData[pathArray[0]][pathArray[1]] = $event
		} else if (pathArray.length == 3) {
			this.SettingData[pathArray[0]][pathArray[1]][pathArray[2]] = $event
		}
	}

	resetAllSettingData() {
		this.SettingData = {
			Punch_Card_System: {
				User_Punch_Card_System: {
					Type: "1",
				},
				Style: {
					Type: "1",
					Fill_Color: "#2998d2",
					Outline_Color: "#2998d2",
				}
			},
			Points_Per_Check_In: {
				Minimum: 1,
				Maximum: 10,
				Increment: 1,
			},
			Rewards_Card: {
				Background_Color: "#ffffff",
				Background_Image: defaultImage,
				Header_Image: defaultImage,
				Icon_Image: defaultImage,
				Points_Punch_Text: {
					Font_Size: 30,
					Color: "#eb0323",
					 Font:"Holtwood One SC",
				},
				Points_Card_Check_In_Name: {
					Singular:"Point",
					Plural:"Points",
				},
				Punch_Card_Check_In_Name: {
					Singular:"Stamp",
					Plural:"Stamps",
				},
				Punch_Card_Message: {
					Text: "UNTIL YOUR NEXT REWARD",
					Font_Size: 15,
					Color: "#000000",
					 Font:"Open Sans",
				},
				Point_Card_Message: {
					Text: "Earned and not yet used",
					Font_Size: 13,
					Color: "#1e73be",
					 Font:"Raleway",
				},
				Rewards_Earned_Message: {
					Singular: "REWARD EARNED",
					Plural: "REWARDS EARNED",
					Font_Size: 16,
					Color: "#1e73be",
					 Font:"Open Sans",
				},
			},
			Rewards_List: {
				Background_Color: "#ffffff",
				Total_Points: {
					Font_Size: 10,
					Color: "#ffffff",
					Background_Color: "#eb0323",
					Font:"Open Sans",
					Punch_Message_Singular:"Unused Punch",
					Punch_Message_Plural:"Unused Punches",
					Point_Message_Singular:"Unused Point",
					Point_Message_Plural:"Unused Points",
				},
				Total_Remaining_Balance: {
					Font_size: 15,
					Color: "#565656",
					Font:"Open Sans",
				},
				Reward_Title: {
					Font_size: 15,
					Color: "#565656",
					 Font:"Open Sans",
				},
				Reward_Description: {
					Font_size: 15,
					Color: "#565656",
					 Font:"Open Sans",
				},
				Reward_Cost: {
					Font_size: 15,
					Color: "#999999",
					 Font:"Open Sans",
				},
				Line_Separator: {
					Color: "#e8e6e9",
					Thickness: 1,
				},
				Arrow: {
					Color: "#5b5e5e",
				},
			},
			Redemption_History: {
				Background_Color: "#ffffff",
				Header_Text: {
					Text: "Redemption History",
					Font_Size: 25,
					Color: "#ffffff",
					Background_Color: "#eb0323",
					 Font:"Open Sans",
				},
				Reward_Title: {
					Font_size: 15,
					Color: "#565656",
					 Font:"Open Sans",
				},
				Reward_Description: {
					Font_size: 12,
					Color: "#565656",
					 Font:"Open Sans",
				},
				Reward_Cost: {
					Font_size: 11,
					Color: "#999999",
					 Font:"Open Sans",
				},
				Redeem_Date: {
					Font_size: 13,
					Color: "#565656",
					 Font:"Open Sans",
				},
				Line_Separator: {
					Color: "#e8e6e9",
					Thickness:"1",
				}
			},
			Login_Register: {
				Icon_Image: defaultImage,
				Background_Color: "#f5f6f7",
				Title_Login: {
					Text: "LOGIN",
					Font_size: 24,
					Color: "#5b5a5a",
					 Font:"Roboto",
				},
				Title_Register: {
					Text: "REGISTER",
					Font_size: 24,
					Color: "#5b5a5a",
					 Font:"Roboto",
				},
				Title_Reset_Password: {
					Text: "FORGOT PASSWORD",
					Font_size: 24,
					Color: "#5b5a5a",
					 Font:"Roboto",
				},
				Login_Button: {
					Background_Color : "#eb0323",
				},
				Register_Button: {
					Background_Color : "#eb0323",
				},
				Reset_Password_Button: {
					Background_Color : "#eb0323",
				},
				New_Account_Button: {
					Background_Color : "#ffffff",
				},
				Back_To_Login_Button: {
					Background_Color : "#ffffff",
				},
				New_Member_Email_Subject: {
					Text : "Welcome to the Rewards Program!",
				},
				New_Member_Email_Message: {
					Text : "",
				},
			},
			Settings: {
				Gear_Icon: {
					Color: "#000000",
				},
				Background_Color: "#ffffff",
				Redemption_History_Button: {
					Text: "Redemption History",
					Font_Size: 17,
					Color: "#ffffff",
					Background_Color: "#eb0323",
					Font:"Open Sans",
				},
				Logout_Button: {
					Text: "Logout",
					Font_Size: 17,
					Color: "#ffffff",
					Background_Color: "#eb0323",
					 Font:"Open Sans",
				},
			},
			Messages: {		
				CASHIER: {
					Text: "PLEASE HAND YOUR DEVICE TO THE CASHIER",
					Font_Size: 40,
					Color: "#26c17b",
					 Font:"Open Sans",
				},
				CHECKIN_SUCCESSFUL: {
					Singular: "STAMP SUCCESSFUL",
					Plural: "STAMPS  SUCCESSFUL",
					Font_Size: 40,
					Color: "#26c17b",
					 Font:"Open Sans",
				},
				CHECKIN_FAILED: {
					Text: "STAMP FAILED",
					Font_Size: 40,
					Color: "#26c17b",
					 Font:"Open Sans",
				},
				REDEEM_SUCCESSFUL: {
					Text: "REDEEM SUCCESSFUL",
					Font_Size: 40,
					Color: "#26c17b",
					 Font:"Open Sans",
				},
				REDEEM_FAILED: {
					Text: "REDEEM FAILED",
					Font_Size: 40,
					Color: "#26c17b",
					 Font:"Open Sans",
				},
			},
			Buttons: {			
				CHECK_IN: {
					Text: "STAMP ME",
					Font_Size: 20,
					Color: "#ffffff",
					Background_Color: "#eb0323",
					Font:"Open Sans",
				},
				REDEEM: {
					Text: "REDEEM",
					Font_Size: 20,
					Color: "#ffffff",
					Background_Color: "#eb0323",
					Font:"Open Sans",
				},
				REDEEM_UNSELECTABLE: {
					Text: "REDEEM",
					Font_Size: 20,
					Color: "#ffffff",
					Background_Color: "#c0c0c0",
					 Font:"Open Sans",
				},
				REDEEM_REWARDS_EARNED: {
					Text: "REDEEM",
					Font_Size: 20,
					Color: "#ffffff",
					Background_Color: "#eb0323",
					 Font:"Open Sans",
				},
				CONTINUE: {
					Text: "CONTINUE",
					Font_Size: 20,
					Color: "#ffffff",
					Background_Color: "#eb0323",
					 Font:"Open Sans",
				},
				BACK: {
					Text: "BACK",
					Font_Size: 20,
					Color: "#ffffff",
					Background_Color: "#eb0323",
					 Font:"Open Sans",
				},
				TRY_AGAIN: {
					Text: "TRY AGAIN",
					Font_Size: 20,
					Color: "#ffffff",
					Background_Color: "#eb0323",
					 Font:"Open Sans",
				},
			},

		};
	}

	clearDropifyElement(id) {
		debugger;
		let drEvent = $(`#${id}`).dropify();
		drEvent.on('dropify.afterClear', (event, element) => {
			this.clearDropifyElement(id);
		});

		drEvent = drEvent.data('dropify');
		drEvent.resetPreview();
		// if (!byRemoveBtn) {
		// 	drEvent.clearElement();	
		// }
		drEvent.settings.defaultFile = defaultImage;
		drEvent.destroy();
		drEvent.init();			
	}

	clearDropify() {
		debugger;

		if ($('#app_background_image')[0]) {
			this.clearDropifyElement('app_background_image');
		}
		
		if ($('#app_header_image')[0]) {
			this.clearDropifyElement('app_header_image');
		}

		if ($('#app_icon_image')[0]) {
			this.clearDropifyElement('app_icon_image');
		}

		if ($('#app_login_icon_image')[0]) {
			this.clearDropifyElement('app_login_icon_image');
		}
	}

	FastGenerateJson() {
        const appData = this.commonService.get_current_app_data();
        NProgress.start();
        $(function () {
            $.notify({
                title: '',
                message: "Refresh Preview Data",
            }, {
                type: 'success'
            });
        });
        this.commonService.postData({
    
            'id': JSON.stringify(appData.id),
            'appName': JSON.stringify(appData.app_name)
    
        }, 'fastGenerateJson').subscribe(res => {
            NProgress.done();
            this.rdata = JSON.parse(res);
            this.rstatus = this.rdata['status'];

            if (this.rstatus === 1 || this.rstatus === '1') {
                //gjc 0515
                // this.msgService.setSpinnerActive(false);
                $(function () {
                    $.notify({
                        title: '',
                        message: "Successfully saved"
                    }, {
                            type: 'success'
                        });
                });
            } else {

            }
    
        }, err => {
          
        }, () => {
            // console.log('obsever completed');
            // console.log("launch emulator");
            let currentAppData = this.commonService.get_current_app_data();
            let iFrameUrl = `${environment.baseUrl}/projects/${currentAppData['app_code']}/index.html`;
            //let iFrameUrl = 'http://192.168.100.112:1204/projects/'+this.currentAppData['app_code']+'/index.html';
            $('#native_preview').attr('src',iFrameUrl);
        })
        // this.appstylestatusArray[0] = 0;
        // this.appstylestatusArray[1] = 0;
        // console.log(this.appstylestatusArray);
    }

	postAllSettingData () {
		NProgress.start();
		const self = this;
		self.postCount = 0;
		self.postBusy = false;
		var interval = setInterval(() => {
			
			if ($('#app_background_image')[0] && $('#app_background_image')[0].isChanged && self.postCount == 0) {
				if (self.postBusy == true) {
					return;
				}
				self.postBusy = true;
				this.FastGenerateJson();
				let base64File = $('.background-image-dropify').converter2Base64();
				this.s3Service.uploadBase64(base64File)
				.subscribe(
					res => {	
						console.log(res['data'].Location);
						self.SettingData['Rewards_Card']['Background_Image'] = 	res['data'].Location;					
						self.postCount = 1;
						self.postBusy = false;
					},
					err => {
						// this.errorMsg = 'Could not upload image.';
						self.SettingData['Rewards_Card']['Background_Image'] = "";
						self.postCount = 1;
						self.postBusy = false;
					}
				);
			} else {
				this.FastGenerateJson();
				if (self.postCount == 0) {
					self.postCount = 1;
				}
				if ($('#app_header_image')[0] && $('#app_header_image')[0].isChanged && self.postCount == 1) {
					if (self.postBusy == true) {
						return;
					}
					self.postBusy = true;
					let base64File = $('.header-image-dropify').converter2Base64();
					this.s3Service.uploadBase64(base64File)
					.subscribe(
						res => {	
							console.log(res['data'].Location);
							self.SettingData['Rewards_Card']['Header_Image'] = 	res['data'].Location;					
							self.postCount = 2;
							self.postBusy = false;
						},
						err => {
							// this.errorMsg = 'Could not upload image.';
							self.SettingData['Rewards_Card']['Header_Image'] = "";
							self.postCount = 2;
							self.postBusy = false;
						}
					);
				} else {
					if (self.postCount == 1) {
						self.postCount = 2;
					}
					if ($('#app_icon_image')[0] && $('#app_icon_image')[0].isChanged && self.postCount == 2) {
						if (self.postBusy == true) {
							return;
						}
						self.postBusy = true;
						let base64File = $('.icon-image-dropify').converter2Base64();
						this.s3Service.uploadBase64(base64File)
						.subscribe(
							res => {	
								console.log(res['data'].Location);
								self.SettingData['Rewards_Card']['Icon_Image'] = 	res['data'].Location;					
								self.postCount = 3;
								self.postBusy = false;
							},
							err => {
								// this.errorMsg = 'Could not upload image.';
								self.SettingData['Rewards_Card']['Icon_Image'] = "";
								self.postCount = 3;
								self.postBusy = false;
							}
						);
					} else {
						if (self.postCount == 2) {
							self.postCount = 3;
						}
						if ($('#app_login_icon_image')[0] && $('#app_login_icon_image')[0].isChanged && self.postCount == 3) {
							if (self.postBusy == true) {
								return;
							}
							self.postBusy = true;
							let base64File = $('.login-icon-image-dropify').converter2Base64();
							this.s3Service.uploadBase64(base64File)
							.subscribe(
								res => {	
									console.log(res['data'].Location);
									self.SettingData['Login_Register']['Icon_Image'] = 	res['data'].Location;					
									self.postCount = 4;
									self.postBusy = false;
								},
								err => {
									// this.errorMsg = 'Could not upload image.';
									self.SettingData['Login_Register']['Icon_Image'] = "";
									self.postCount = 4;
									self.postBusy = false;
								}
							);
						} else {
							self.postCount = 4;
							self.postBusy = false;
							const SettingBuffer = {
								value: {
									app_id: this.appId,
									json: JSON.stringify(this.SettingData),
								}
							};
							this.commonService.postData(SettingBuffer.value, 'saveReviewSetting').subscribe(res => {
								
								
								console.log(res);
							},
							error => {
								
								console.log(error);
							});
							clearInterval(interval);
							NProgress.done();
						}
					}
				}
			}
		},100);

		
		
	}

	

	

	
}