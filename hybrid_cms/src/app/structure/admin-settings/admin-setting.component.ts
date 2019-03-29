import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { FormBuilder, FormGroup, Validators, FormControl, NgForm, NgModel } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';
import { CanComponentDeactivate } from './../../can-deactivate-guard.service';
import { Observable } from 'rxjs/Observable';
import { S3Service } from './../../s3.service';

declare var NProgress: any;
declare var $: any;
declare var jQuery: any;
declare var swal: any;


function matchCorrectSpace() {
  // const hasExclamation = input.value !== this.o_password.value;
  return (input: FormControl) => {
    return /^[^-\s][a-zA-Z0-9_\s-]+.+$/.test(input.value) ? null : {
      matchCorrectSpace: {
        valid: false
      }
    };
  }
}

const spaceCheck = new FormControl('', Validators.compose([Validators.required, matchCorrectSpace()]));


@Component({
  selector: 'admin-setting',
  templateUrl: './admin-setting.component.html',
  styleUrls: ['./admin-setting.css'],
})

export class AdminSettingComponent implements OnInit, CanComponentDeactivate {

  @ViewChild('basicInformationForm') adminSettingsForm: NgForm;
  @ViewChild('adminSaveBtn') adminSaveBtnRef: ElementRef;
  
  public asform: FormGroup;  
  rdata: any;
  resData: any;  
  currentAppData: any;  
  basic_information_data: any;  
  rstatus: any;
  basic_information_section_data: any;
  is_superadmin: boolean;

  public ios_app_id = "";
  public andr_app_id = "";
  public ios_appstore_id = "";
  public firebase_id_iOS = "";
  public server_key_iOS = "";
  public firebase_ios_plist = "";
  public firebase_id_android = "";
  public server_key_android = "";
  public firebase_android_json = "";

  loading: boolean = false;
  is_access_app_operation = true;

  constructor(
    private commonService: CommonService, 
    private fb: FormBuilder, 
    private router: Router, 
    private linkValue: ActivatedRoute, 
    private s3Service: S3Service,) {
    
    this.commonService.isAuthorizedRoute();
    this.is_superadmin = false;
    var currentuser = this.commonService.getCurrentUserInfo();
    
    if (currentuser.email == "admin@theappcompany.com") {
      this.is_superadmin = true; 
    }
    this.currentAppData = this.commonService.get_current_app_data();
    // const appData = JSON.parse(localStorage.getItem('currentAppData'));
    console.log(this.currentAppData);
    const appData = this.commonService.get_current_app_data();

    this.basic_information_data = this.currentAppData['basicDetail']['basic_information'];
    this.basic_information_section_data = JSON.parse(this.basic_information_data['section_json_data']);

    this.asform = this.fb.group({
      firebase_id_iOS: ['', Validators.compose([Validators.required, matchCorrectSpace()])],
      firebase_id_android: ['', Validators.compose([Validators.required, matchCorrectSpace()])],
      ios_app_id: ['', Validators.compose([Validators.required, matchCorrectSpace()])],
      andr_app_id: ['', Validators.compose([Validators.required, matchCorrectSpace()])],
      ios_appstore_id: ['', Validators.compose([Validators.required, matchCorrectSpace()])],
      server_key_iOS: ['', Validators.compose([Validators.required])],
      server_key_android: ['', Validators.compose([Validators.required])]      
      // firebase_id_iOS: ['', ''],
      // firebase_id_android: ['', ''],
      // ios_app_id: ['', ''],
      // andr_app_id: ['', ''],
      // server_key_iOS: ['', ''],
      // server_key_android: ['', '']
    });

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
    
    $("#mySidenav").css('display','');
    $(function () {
      $('.message_body').summernote({
        height: 200
        // placeholder: 'write here...'
      });

      $('[data-toggle=tooltip]').tooltip();
    });

    this.getAdminSettingData();

  }

  public filePlistSelect(event) {

    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
    
      reader.onloadend = () => {

        NProgress.start();
        const fileName = this.currentAppData['app_code']+"/adminsetting/"+file.name;

        const fileData = { 
          'file':reader.result.split(',')[1],
          'name':fileName
        };

        this.s3Service.uploadFirebase(fileData)
					.subscribe(
						res => {
              this.firebase_ios_plist = res['data'].Location;
              $('.firebase_ios_plist_file_value').val(file.name);
              NProgress.done();
            },
            err => {
              NProgress.done();
            }
          );        
      };
    }

  } 

  public clickFireBaseiosPlist() {
    $('#firebase_ios_plist_file').click();
  }

  public clickFireBaseAndroidJson() {
    $('#firebase_android_json_file').click();
  }

  public fileJsonSelect(event) {

    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onloadend = () => {

        NProgress.start();
        const fileName = this.currentAppData['app_code']+"/adminsetting/"+file.name;

        const fileData = { 
          'file':reader.result.split(',')[1],
          'name':fileName
        };

        this.s3Service.uploadFirebase(fileData)
					.subscribe(
						res => {
              this.firebase_android_json = res['data'].Location;
              $('.firebase_android_json_file_value').val(file.name);
              NProgress.done();
            },
            err => {
              NProgress.done();
            }
          );        
      };
    }

  } 

  /**
   * Method to retrive promise appdata
   * @returns Promise<any>
   */
  getCureentAppDataPromise(): Promise<any> {
    return new Promise((resolve, reject) => {
      const appData = this.commonService.get_current_app_data();
      if (appData !== null) {
        resolve(appData);
      } else {
        reject();
      }
    })
  }
  /**
   * Method to retrive adminsetting data for current app
   * @returns void
   */
  getAdminSettingData(): void {
    this.getCureentAppDataPromise().then((d) => {
      this.commonService.postData(d, 'getAdminSettingData').subscribe(res => {

        this.resData = JSON.parse(res);

        if (this.resData.length != 0) {
          
          if(this.resData[0].hasOwnProperty('ios_app_id')){
            this.ios_app_id = this.resData[0]['ios_app_id'];  
          }else{
            this.ios_app_id ="";
          }

          if(this.resData[0].hasOwnProperty('andr_app_id')){
            this.andr_app_id = this.resData[0]['andr_app_id'];  
          }else{
            this.andr_app_id ="";
          }

          if(this.resData[0].hasOwnProperty('ios_appstore_id')) {
            this.ios_appstore_id = this.resData[0]['ios_appstore_id'];
          }else {
            this.ios_appstore_id = "";
          }

          if(this.resData[0].hasOwnProperty('firebase_id_iOS')){
            this.firebase_id_iOS = this.resData[0]['firebase_id_iOS'];  
          }else{
            this.firebase_id_iOS ="";
          }


          if(this.resData[0].hasOwnProperty('server_key_iOS')){
            this.server_key_iOS = this.resData[0]['server_key_iOS'];  
          }else{
            this.server_key_iOS ="";
          }

          if(this.resData[0].hasOwnProperty('firebase_ios_plist')){
            this.firebase_ios_plist = this.resData[0]['firebase_ios_plist'];  
          }else{
            this.firebase_ios_plist ="";
          }

          if(this.resData[0].hasOwnProperty('firebase_id_android')){
            this.firebase_id_android = this.resData[0]['firebase_id_android'];  
          }else{
            this.firebase_id_android ="";
          }

          if(this.resData[0].hasOwnProperty('server_key_android')){
            this.server_key_android = this.resData[0]['server_key_android'];  
          }else{
            this.server_key_android ="";
          }

          if(this.resData[0].hasOwnProperty('firebase_android_json')){
            this.firebase_android_json = this.resData[0]['firebase_android_json'];  
          }else{
            this.firebase_android_json ="";
          }                    
        }
        this.patchValues();
      })
    })
  }
  /**
   * TODO to set asform data after fetch data form api
   * @returns void
   */
  patchValues(): void {
    this.asform.patchValue({
      ios_app_id: this.ios_app_id,
      andr_app_id:this.andr_app_id,
      ios_appstore_id:this.ios_appstore_id,
      firebase_id_iOS:this.firebase_id_iOS,
      server_key_iOS:this.server_key_iOS,      
      firebase_id_android:this.firebase_id_android,
      server_key_android:this.server_key_android,       
    })

  }

  adminSettingSubmit(form: NgForm) {
    this.adminSettingSubmitObserver(form).subscribe(d => {
    }, err => {
    })
  }

  adminSettingSubmitObserver(form: NgForm) {
    return Observable.create((observer) => {
      NProgress.start();
      this.adminSaveBtnRef.nativeElement.disabled = true;
      const appData = this.commonService.get_current_app_data();
      // form.value.app_unique_id = appData.id;

      let formData = {
        'app_unique_id': appData.id,
        'ios_app_id': form.value.ios_app_id,
        'andr_app_id': form.value.andr_app_id,
        'ios_appstore_id': form.value.ios_appstore_id,
        'firebase_id_iOS': form.value.andr_app_id,
        'server_key_iOS': form.value.server_key_iOS,
        'firebase_ios_plist': this.firebase_ios_plist,
        'firebase_id_android': form.value.firebase_id_android,
        'server_key_android': form.value.server_key_android,
        'firebase_android_json': this.firebase_android_json
      }

      this.commonService.postData(formData, 'saveAdminSettingData').subscribe(res => {
        // console.log(res);
        this.rdata = JSON.parse(res);
        if (this.rdata['status'] === 1) {
          const success_message = this.rdata['message'];
          NProgress.done();
          $(function () {
            $.notify({
              title: '',
              message: success_message
            }, {
                type: 'success'
              });
          });
          // set form as markaspristine
          observer.next(success_message);
          observer.complete();
          this.asform.markAsPristine();
          this.adminSaveBtnRef.nativeElement.disabled = false;
        } else {
          NProgress.done();
          observer.complete();
          // set form as markaspristine
          this.asform.markAsPristine();
          this.adminSaveBtnRef.nativeElement.disabled = false;
        }
      })
    })
  }

  getPlistFileName(){
    if(!(this.firebase_ios_plist) || this.firebase_ios_plist.length <= 0 )
      return "";
    let index = this.firebase_ios_plist.lastIndexOf('/');
    if(index < 0) {
      index = this.firebase_ios_plist.lastIndexOf('\\');
    }
    return this.firebase_ios_plist.substr(index+1, this.firebase_ios_plist.length);
  }

  getJsonFileName(){
    if(!(this.firebase_android_json) || this.firebase_android_json.length <= 0 )
      return "";
    let index = this.firebase_android_json.lastIndexOf('/');
    if( index < 0)
      index = this.firebase_android_json.lastIndexOf('\\');
    return this.firebase_android_json.substr(index+1, this.firebase_android_json.length);
  }

  /**
   * canDeactive method implementation
   * @returns boolean | Promise<boolean> | Observable<boolean>
   */
  canDeactivate(): boolean | Promise<boolean> | Observable<boolean> {
    if (this.asform.dirty) {
      return new Promise<boolean>((resolve, reject) => {
        swal({
          title: 'You didn`t save!',
          text: 'You have unsaved changes, would you like to save?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonClass: 'btn-success',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          closeOnConfirm: true,
          closeOnCancel: true
        }, (isConfirm) => {
          // if accept yes
          if (isConfirm) {
            // console.log(this.biform.dirty);
            if (this.asform.dirty) {
              this.adminSettingSubmitObserver(this.adminSettingsForm).subscribe(d => {
                resolve(true);
              }, err => {
                resolve(false);
              })
            } else {
              resolve(true);
            }
          } else {
            resolve(true);
          }
        });
      });
    } else {
      return true;
    }
  }
}
