import { Component, OnInit, ViewChild, ElementRef, Self } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';
import { CanComponentDeactivate } from './../../can-deactivate-guard.service';
import { Observable } from 'rxjs/Observable';

import { ColorPickerService, Rgba } from 'ngx-color-picker';
import { concat } from 'rxjs/operator/concat';
import { Console } from '@angular/core/src/console';
import { setTimeout } from 'timers';
import { TemplateParseError } from '@angular/compiler';
import { stagger } from '@angular/animations/src/animation_metadata';
import { SelectControlValueAccessor } from '@angular/forms/src/directives/select_control_value_accessor';

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

@Component({
  selector: 'push-notification',  
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.css'],
})

export class PushNotificationComponent implements OnInit, CanComponentDeactivate {

  // @ViewChild('basicInformationForm') pushNotificationForm: NgForm;
  @ViewChild('fireInformationForm') firebaseForm: NgForm;
  @ViewChild('saveBtn') saveBtnRef: ElementRef;
  
  public asform: FormGroup;
  public toform: FormGroup;

  playstoreUrl: any;
  version: any;
  bundleId: any;
  firebase_id: any;
  rdata: any;
  resData: any;
  
  item: Object = {};
  forceupdate_message: any;
  forceupdateData: any;
  
  currentAppData: any;
  basic_information_data: any;
  rstatus: any;
  googleJson: any;
  basic_information_section_data: any;
  is_superadmin: boolean;

  firebase_color : any;
  sound_flag: any;
  expires_value : any;
  expires_type : any; 
  firebase_title: any;
  firebase_text: any;
  app_id: any;
  allNotificationData: any;
  ios_check:any;
  android_check:any;
  all_type_check:any;
  no_check:boolean;
  allData:any;
  count:any;
  app_type: 4;
  app_type_string:any;
  is_compose:boolean;
  loading:any;
  id:any;
  selected_item_count: any;
  checkboxValue:boolean;
  checked_elements:any[] = [];
  d:any;
  p: number = 1;

  public push_device_kind = 2;
  //jcr 416
  is_access_app_operation = true;

  constructor(
    private commonService: CommonService, 
    private fb: FormBuilder, 
    private router: Router, 
    private linkValue: ActivatedRoute, 
    private cpService: ColorPickerService) {

    // push notification can view with general user gjc 0511
    // this.commonService.isAuthorizedRoute();
    this.is_superadmin = false;
    var currentuser = this.commonService.getCurrentUserInfo();
    
    if (currentuser.email == "admin@theappcompany.com") {
      this.is_superadmin = true; 
    }
    this.currentAppData = this.commonService.get_current_app_data();
    console.log(this.currentAppData);
    const appData = this.commonService.get_current_app_data();
    this.app_id = appData['id'];
    
    console.log(appData);

    this.basic_information_data = this.currentAppData['basicDetail']['basic_information'];
    this.basic_information_section_data = JSON.parse(this.basic_information_data['section_json_data']);
    //For all notification data
    //this.allNotificationData = this.commonService.getAllPushNotificationData();
    //  console.log(this.google_analytic_section_data);
    this.asform = this.fb.group({
      app_id: ['', ''],
      ios_check: ['', ''],
      android_check: ['', ''],
      all_type_check: ['', ''],
      title: ['', ''],
      dexcription: ['', ''],
      // firebase_color : ['', ''],
      // sound_flag: ['', ''],
      // expires_value : ['', ''],
      // expires_type : ['', ''],
    });

    this.toform = this.fb.group({
      firebase_id:['', ''],
      analytics_id:['', ''],
      crashlytics_id:['', ''],
    });
   
    this.is_compose = false;    
    this.firebase_text = '';
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
    this.firebase_color = "#203E78"; 
    this.sound_flag = "default";
    this.expires_value = 2;
    this.expires_type = 1;
    $("#mySidenav").css('display','');
    $(function () {
      $('.message_body').summernote({
        height: 200
        // placeholder: 'write here...'
      });

      $('[data-toggle=tooltip]').tooltip();
    });
    
    this.GetNotifications(4);
    this.selected_item_count = 0;
    this.checkboxValue = true;
    
  }

  onLoad()
  {
    if($('#loader').css("display", "none") && $('#all_messages').css("display", "inline") && $('#text_count').css("display", "flex")){
      $('#loader').css("display", "block");
      $('#all_messages').css("display", "none");
      $('#text_count').css("display", "none");
    }
    // this.loading = setTimeout(this.showPage, 3000);
  }
  
  showPage()
  {
    $('#loader').css("display", "none");
    $('#all_messages').css("display", "inline");
    $('#text_count').css("display", "flex");
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
   * TODO to set asform data after fetch data form api
   * @returns void
   */
  patchValues(): void {
    this.asform.patchValue({
    //   firebase_id: this.firebase_id,
    //   server_key: this.server_key,
    //   firebase_title: this.firebase_title,
    //   firebase_text: this.firebase_text,
    //   firebase_color : this.firebase_color,
    //   sound_flag: this.sound_flag,
    //   expires_value : this.expires_value,
    //   expires_type : this.expires_type,
    })
  }

  pushNotificationSubmit(form: NgForm) {
    this.pushNotificationSubmitObserver(form).subscribe(d => {

    }, err => {

    })
  }

  pushNotificationSubmitObserver(form: NgForm) {
    return Observable.create((observer) => {
      NProgress.start();
      //this.saveBtnRef.nativeElement.disabled = true;
      this.d = new Date().toLocaleString();
      const FireBaseBuffer = {
        value: {
          app_id: this.currentAppData['id'],
          device_k:this.push_device_kind,
          notify_title: this.firebase_title,
          notify_text: this.firebase_text,
        }
      };

      $('#send_preview').modal("hide");
      this.is_compose = false;
      
      this.commonService.postData(FireBaseBuffer.value, 'saveNotification').subscribe(res => {
        
        this.rdata = JSON.parse(res);
        this.rstatus = this.rdata['status'];
        NProgress.done();
        let message = this.rdata['message'];
        if (this.rstatus == '1') {
          $(function () {
            $.notify({
              title: '',
              message: message
            }, {
                type: 'success'
              });
          });
          this.commonService.postData(FireBaseBuffer.value, 'notification/send_token').subscribe(res => {
            debugger;
            // this.rdata = JSON.parse(res);
            // this.rstatus = this.rdata['status'];
            // NProgress.done();
            // let message = this.rdata['message'];
            // if (this.rstatus == '0') {
            //   const error_message = message;
            //   $(function () {
            //     $.notify({
            //       title: '',
            //       message: "Sending Push Notification Failed!"
            //     }, {
            //         type: 'danger'
            //       });
            //   });
            // }
            // else {
            //   $(function () {
            //     $.notify({
            //       title: '',
            //       message: message
            //     }, {
            //         type: 'success'
            //       });
            //   });
            // }
          });
        } else {
          const error_message = message;
          $(function () {
            $.notify({
              title: '',
              message: "Notification Save Failed!"
            }, {
                type: 'danger'
              });
          });
        }
        observer.complete();

        //this.toform.markAsPristine();
        //this.saveBtnRef.nativeElement.disabled = false;

        this.GetNotifications(this.app_type);
      });
    
      // const a = this.commonService.get_current_app_data();
      // form.value.app_unique_id = a.id;
      // console.log(form.value);
      // console.log("Insert DB sucessfully...OK");  
      // this.GetAllMessages("All Messages");
      this.SetPushNotiValueInit();
    })
  }

  SetPushNotiValueInit(){
    this.firebase_text = '';
    this.firebase_title = '';
    this.ios_check = true;
    this.android_check = false;
    this.push_device_kind = 2;
  }

  firebaseSettingSubmit(form: NgForm) {
    this.firebaseSettingSubmitObserver(form).subscribe(d => {
    }, err => {
    })
  }

  firebaseSettingSubmitObserver(form: NgForm) {
    return Observable.create((observer) => {
      NProgress.start();
      this.saveBtnRef.nativeElement.disabled = true;
      console.log(form);
     // this.firebaseOnsubmit();
     // this.googleAnalyticOnSubmit(form);
      // const a = JSON.parse(localStorage.getItem("currentAppData"));
      const a = this.commonService.get_current_app_data();
      form.value.app_unique_id = a.id;
      // console.log(form.value);
      console.log(form.value);
      this.commonService.postData(form.value, 'saveAdminSettingData').subscribe(res => {

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
          this.toform.markAsPristine();
          this.saveBtnRef.nativeElement.disabled = false;
          
        } else {
          NProgress.done();
          observer.complete();
          // set form as markaspristine
          this.toform.markAsPristine();
          this.saveBtnRef.nativeElement.disabled = false;
        }
        this.FastGenerateJson(form.value);
      })
     
    })
  }

  FastGenerateJson(data) {
    $('.loadingbar').css('display','');
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

      'firebase_id': data['firebase_id'],
      'analytics_id': data['analytics_id'],
      'crashlytics_id': data['crashlytics_id'],
      'id':data['app_unique_id']

    }, 'fastGenerateJson').subscribe(res => {
        NProgress.done();
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if (this.rstatus === 1 || this.rstatus === '1') {
        console.log("firebase setting OK..");
      } else {
        console.log("firebase Setting faild.");
      }

    }, err => {
      
    }, () => {
        // console.log('obsever completed');
        console.log("launch emulator");
    //     if (this.previewLoading == true) {
    //         let iFrameUrl = 'http://35.163.93.93/projects/'+this.currentAppData['app_code']+'/index.html';
    //         //let iFrameUrl = 'http://192.168.100.112:1204/projects/'+this.currentAppData['app_code']+'/index.html';
    //         $('#native_preview').attr('src',iFrameUrl);
    //     } 
    //     this.previewLoading = false;
    // //     let currentAppData = this.commonService.get_current_app_data();
    
    })
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
          // if (isConfirm) {
          //   // console.log(this.biform.dirty);
          //   if (this.asform.dirty) {
          //     this.pushNotificationSubmitObserver(this.pushNotificationForm).subscribe(d => {
          //       resolve(true);
          //     }, err => {
          //       resolve(false);
          //     })
          //   } else {
          //     resolve(true);
          //   }
          // } else {
          //   resolve(true);
          // }
        });
      });
    } else {
      return true;
    }
  }
  ChangeColorPicker ($event) {
    console.log($event);
    this.firebase_color = $event;
  }

  
  public changeASDevice(event) {
    console.log(this.push_device_kind);
  }

  public changeiOSDevice(event) {   
     
    if(this.ios_check && this.android_check) {
      this.push_device_kind = 3;
    }else if(this.ios_check) {
      this.push_device_kind = 2;
    }else if(this.android_check){
      this.push_device_kind = 1;
    }
  }

  public changeAndroidDevice(event){
    
    if(this.ios_check && this.android_check) {
      this.push_device_kind = 3;
    }else if(this.ios_check) {
      this.push_device_kind = 2;
    }else if(this.android_check){
      this.push_device_kind = 1;
    }
  }

  GetiosMessages($type){
    this.selected_item_count = 0;
    this.onLoad();
    const temp = {'app_id': this.app_id};
    this.commonService.postData(temp, "getAlliosData").subscribe(res => {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if (this.rstatus == '1') {
        this.allData = this.rdata.data;
        this.count = this.rdata.data.length;
        this.app_type = $type;
      } else {
        const error_message = this.rdata['message'];
      }
    });
  }

  GetAndroidMessages($type){
    this.selected_item_count = 0;
    this.onLoad();
    const temp = {'app_id': this.app_id};
    this.commonService.postData(temp, "getAllAndroidData").subscribe(res => {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if (this.rstatus == '1') {
        this.allData = this.rdata.data;
        this.count = this.rdata.data.length;
        this.app_type = $type;
      } else {
        const error_message = this.rdata['message'];
      }
    });
  }

  // GetWebMessages($type){
  //   this.selected_item_count = 0;
  //   this.onLoad();
  //   const temp = {'app_id': this.app_id};
  //   this.commonService.postData(temp, "getAllWebData").subscribe(res => {
  //     this.rdata = JSON.parse(res);
  //     this.rstatus = this.rdata['status'];
  //     if (this.rstatus == '1') {
  //       this.allData = this.rdata.data;
  //       this.count = this.rdata.data.length;
  //       this.app_type = $type;
  //     } else {
  //       const error_message = this.rdata['message'];
  //     }
  //   });
  // }

  setAppTypeString(type) {
    if(type == 4) {
      this.app_type_string = "All Notifications";
    }else if( type == 1 ) {
      this.app_type_string = "Android Notifications";
    }else if( type == 2 ) {
      this.app_type_string = "iOS Notifications";
    }else if( type == 3 ) {
      this.app_type_string = "All App Type Notifications";
    }
  }

  getSelectedActiveClass(type) {
    if(type == this.app_type){
      return "active";
    }else {
      return "";
    }
  }

  GetNotifications(type){

    this.app_type = type;

    this.setAppTypeString(type);

    this.selected_item_count = 0;
    this.onLoad();
    const temp = {'app_id': this.app_id, 'device_k':type};
    
    this.commonService.postData(temp, "getNotification").subscribe(res => {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      
      if (this.rstatus == '1') {
        this.allData = this.rdata.data;
        this.count = this.rdata.data.length;
        const message = this.rdata['message'];        

        $(function () {
          $.notify({
            title: '',
            message: message
          }, {
              type: 'success'
            });
        });

      } else if (this.rstatus == '0') {        

        this.allData = [];
        this.count = this.rdata.data.length;

        const message = this.rdata['message'];

        $(function () {
          $.notify({
            title: '',
            message: message
          }, {
              type: 'warning'
            });
        });

      }

      this.showPage();

    });
  }

  changeScreen()
  {
    this.SetPushNotiValueInit();
    if(this.is_compose == false)
      this.is_compose = true;
    else
      this.is_compose = false;
  }

  deleteConfirm(data)
  {
    const self = this;
    
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this record",
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "btn-danger",
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel",
      closeOnConfirm: true,
      closeOnCancel: true
    },
      function (isConfirm) {
        if (isConfirm) {
          self.deleteCheckedData(self.checked_elements);
        } else {
        }
      }
    );
      
  }

  deleteCheckedData(data)
  {

    this.onLoad();

    let selectedPushArray = [];
    for(let i = 0; i < data.length; i++) {      
      selectedPushArray.push({'id': data[i]});      
    }
    
    let reqData = {'ids':JSON.stringify(selectedPushArray)};

    this.commonService.postData(reqData,"delNotification").subscribe(res => {
      NProgress.start();
      this.rdata = JSON.parse(res);
      console.log(this.rdata);
      this.rstatus = this.rdata['status'];

      let message = "Deleting PushNotifactions Failed";
      if(this.rdata.hasOwnProperty('message')) {
        message = this.rdata['message'];
      }

      if(this.rstatus == '1')
      {

        // let allData = this.allData;
        // for(let i = 0; i < allData.length; i++ ){
        //   if(this.checked_elements.indexOf(allData[i].id ) >= 0){
        //     delete allData[i];            
        //   }
        // }

        // this.allData = allData;
        // this.count = this.allData.length;

        this.GetNotifications(this.app_type);
        
        $(function () {
          $.notify({
            title: '',
            message: message
          }, {
              type: 'success'
            });
        });

        this.selected_item_count = 0;
        this.checked_elements = [];

      }else {
        // console.log("faild");
        $(function () {
          $.notify({
            title: '',
            message: message
          }, {
              type: 'warning'
            });
        });
      }
      
      NProgress.done();
    });
    
  }
  Init()
  {
    $('.message_content').css("background-color", "#fff");
    $(".select_item").prop("checked", false);
    $('.select_item').css("display", "none");
    this.checked_elements.length = 0;
    this.selected_item_count = 0;

  }

  check_item($event, $id)
  {
    if($event.target.checked){
      this.checkboxValue = true;
      this.selected_item_count+=1;
      this.checked_elements.push($id);
      $('#' + $id).css("background-color", "#a7d8ff6b");
    }
    else
    {
      this.checkboxValue = false;
      this.selected_item_count-=1;
      const index: number = this.checked_elements.indexOf($id);
      if (index !== -1) {
          this.checked_elements.splice(index, 1);
      }
      $('#' + $id).css("background-color", "#fff");
    }
    
    if(this.selected_item_count != 0) {
      $('.select_item').css("display", "inline");
    }
    else if(this.selected_item_count == 0) {
      $('.select_item').css("display", "none");
    }
  }



 
}

