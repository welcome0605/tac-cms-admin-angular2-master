import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { TopBarService } from '../../components/top-bar/top-bar.service';
import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';

import { SharedService } from './../../shared.service';


declare var $: any;
declare var jQuery: any;
declare var swal: any;
declare var NProgress: any;

/**
 * interface designed for dicussion model
 * @version 1.0
 * @author
 */
export interface DicussionRes {

  data: DicussionSubRes[];

}
export interface DicussionSubRes {
  id?: number;
  sender_name: string;
  dicussion: string;
  status: '1' | '2' | '3';
  created_at: string,
  updated_at: string
}

@Component({
  selector: 'version-management',
  templateUrl: './version-management.component.html',
  styleUrls: ['./version-management.component.css']
})

export class VersionManagementComponent implements OnInit {


  @ViewChild('dicussion_scroll')
  private Dicussion_Scroll: ElementRef;

  public form: FormGroup;
  public dicussForm: FormGroup;

  private isSpinnerActive: boolean;
  private publishCounter: number;
  private publishStatus: number;
  private roleAdminActive: boolean;

  private firstAppPublishStatus: number;
  versionManagementData: any;
  rdata = [];
  is_error = false;
  error_message = '';
  success_message = '';
  is_success = false;
  id = '';
  json_file_url = '#';
  imagezip_url = '';
  rstatus: number | string;
  current_publish_version = '';
  appID: number;
  show_Publish_btn = false;
  statusList: any;
  cnt_app_name: string;
  // jcr 416
  is_access_app_operation = true;
  dicussionList: Array<any>;

  constructor(private commonService: CommonService,
    private fb: FormBuilder,
    private checkloginService: CheckloginService,
    private mS: MessageService,
    private exportBtnCurrentRef: ElementRef,
    private router: Router,
    private sharedService: SharedService,
		private alarmServce:TopBarService,) {
    // this.commonService.isAuthorizedRoute();
    this.statusList = [
    { 'status': 1, 'text': 'Work in Progress' },
    { 'status': 2, 'text': 'Processing' },
    { 'status': 3, 'text': 'Published' },
    { 'status': 4, 'text': 'Inactive' }];

    this.dicussForm = this.fb.group({
      dicussion_text: [null, Validators.compose([Validators.required])],
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
  /**
   * Method to fetch all application list and their status
   * @returns void
   */
  doFirst(): void {
    const handlerTime = Observable.timer(800)
    handlerTime.subscribe(() => {
      NProgress.start();
    })
    const appData = this.commonService.get_current_app_data();

    this.current_publish_version = appData.version;
    this.cnt_app_name = appData.app_name;

    // todo disbale new version function
    this.allowGenerateJson();

    this.commonService.postData({

      'appId': appData.app_unique_id,
      'id': JSON.stringify(appData.id),
      'appName': JSON.stringify(appData.app_name)

    }, 'getAppVersionData').subscribe(res => {

      this.rdata = JSON.parse(res);

      this.rstatus = this.rdata['status'];
      if (this.rstatus === 1 || this.rstatus === '1') {
        this.versionManagementData = this.rdata['data'];

        this.versionManagementData.forEach(element => {

          // set app publish text
          switch (parseInt(element.app_publish_status)) {
            case 1:
              element.app_publish_status_text = 'Work In Progress';
              break;
            case 2:
              element.app_publish_status_text = 'Processing';
              break;
            case 3:
              element.app_publish_status_text = 'Published';
              break;
            case 4:
              element.app_publish_status_text = 'Inactive';
              break;
            default:
              element.app_publish_status_text = 'Unknown';
              break;
          }

        });

        // set 1.0 version publish state
        this.firstAppPublishStatus = this.versionManagementData['0'].app_publish_status;
        // set button visibillity

        if (this.versionManagementData['0'].app_publish_status === 1
          && this.versionManagementData['0'].app_publish_counter === 0) {
          this.show_Publish_btn = true;

        } else {
          this.show_Publish_btn = false;
        }
        // set appID making current selection

        //  this.appID = this.versionManagementData['0'].id;
        const success_message = this.rdata['message'];
        handlerTime.subscribe(() => {
          NProgress.done();
        })
        // $(function () {
        //   $.notify({
        //     title: '',
        //     message: success_message
        //   }, {
        //       type: 'success'
        //     });
        // });

      } else {
        const error_message = this.rdata['message'];
        $(function () {
          $.notify({
            title: '',
            message: error_message
          }, {
              type: 'danger'
            });
        });
      }

    })
  }
  ngOnInit() {
    // fetch app specific data first
    this.doFirst();


    // fetch app dicussion
    /*setInterval(() => {
      this.fetchDicussion();
    }, 5000);*/
    // $(function () {

    // Handle error message
    $(document).on('click', '.alert-close', function () {
      $('.alert-close').hide();
    });

    // });

    this.form = this.fb.group({
      base_version: [null, Validators.compose([Validators.required])],
      new_version: [null, Validators.compose([Validators.required])]
    });

    if (this.commonService.isMessage()) {
      const success_message = this.commonService.getMessage();
      $(function () {
        $.notify({
          title: '',
          message: success_message
        }, {
            type: 'success'
          });
      });
      this.commonService.removeMessage();
    }

  }


  GenerateJson(appId) {

    const currentSelectBtnRef = document.getElementById(appId + '_export');
    currentSelectBtnRef.setAttribute('disabled', 'true');

    const appData = this.commonService.get_current_app_data();
    this.commonService.postData({

      'id': JSON.stringify(appId),
      'appName': JSON.stringify(appData.app_name)

    }, 'fastGenerateJson').subscribe(res => {

      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if (this.rstatus === 1 || this.rstatus === '1') {

        this.json_file_url = this.rdata['jsonFileDirectory'];
        // this.imagezip_url = this.rdata['imageZip'];

        const success_message = this.rdata['message'];
        currentSelectBtnRef.removeAttribute('disabled');
        // this.currentSelectedbtnRef.nativeElement(currentSelectBtnRef).disabled = false;
        window.open(this.json_file_url, 'windowname');
        // window.open(this.imagezip_url, 'windowname');

        $(function () {
          $.notify({
            title: '',
            message: success_message
          }, {
              type: 'success'
            });
        });
      } else {
        currentSelectBtnRef.removeAttribute('disabled');
        // this.currentSelectedbtnRef.nativeElement(currentSelectBtnRef).disabled = false;
        const error_message = this.rdata['message'];
        $(function () {
          $.notify({
            title: '',
            message: error_message
          }, {
              type: 'danger'
            });
        });
      }

    }, err => {
      currentSelectBtnRef.removeAttribute('disabled');
    })
  }

  generateNewJSON(form: NgForm) {

    const appData = JSON.parse(localStorage.getItem('currentAppData'));
    const appUniqId = appData.app_unique_id;
    const appId = JSON.stringify(appData.id);

    form.value.appUniqId = appUniqId;
    form.value.appId = appId;

    this.commonService.postData(form.value, 'generateNewJSON').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if (this.rstatus === 1 || this.rstatus === '1') {
        $('#selectversion').modal('hide');
        this.versionManagementData = this.rdata['data'];
        form.resetForm();
        const success_message = this.rdata['message'];
        $(function () {
          $.notify({
            title: '',
            message: success_message
          }, {
              type: 'success'
            });
        });

      } else {
        const error_message = this.rdata['message'];
        $('#selectversion').modal('hide');
        $(function () {
          $.notify({
            title: '',
            message: error_message
          }, {
              type: 'danger'
            });
        });
      }
      this.doFirst();
    },
      error => {
        this.rdata = JSON.parse(error._body);
        this.is_error = true;
        this.is_success = false;
        this.error_message = this.rdata['message'];

        const error_message = this.rdata['message'];
        $(function () {
          $.notify({
            title: '',
            message: error_message
          }, {
              type: 'danger'
            });
        });

      }

    );
  }

  publishVersion(uniqueId, Id, version) {
    // var appuniqueId = JSON.stringify(uniqueId);
    this.commonService.postData({ 'appId': Id, 'appUniqueId': uniqueId }, 'publishVersion').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if (this.rstatus === 1 || this.rstatus === '1') {
        this.versionManagementData = this.rdata['data'];
        const success_message = this.rdata['message'];
        this.current_publish_version = version;

        const postData = {
          'id': Id
        };
        this.commonService.postData(postData, 'getsingleappdata').subscribe(res => {
          const resdata = JSON.parse(res);
          const appData = resdata['data'];
          
          localStorage.setItem('currentAppData', JSON.stringify(appData));
          this.sharedService.emit_appdata(appData);

        });
        // fetch dicussion list for new selected app
        this.fetchDicussion();
        $(function () {
          $.notify({
            title: '',
            message: success_message
          }, {
              type: 'success'
            });
        });

      } else {
        const error_message = this.rdata['message'];
        $(function () {
          $.notify({
            title: '',
            message: error_message
          }, {
              type: 'danger'
            });
        });
      }

    },
      error => {
        this.rdata = JSON.parse(error._body);
        this.is_error = true;
        this.is_success = false;
        this.error_message = this.rdata['message'];

        const error_message = this.rdata['message'];
        $(function () {
          $.notify({
            title: '',
            message: error_message
          }, {
              type: 'danger'
            });
        });

      }

    );

  }

  uploadOnFTP(appId) {

    this.commonService.postData({

      'id': JSON.stringify(appId),

    }, 'uploadOnFTP').subscribe(res => {

      this.rdata = JSON.parse(res);
      // console.log(this.rdata);


    });
  }
  doChangeStatus(status: any) {

    return new Promise<boolean>((resolve, reject) => {
      // set current selected app version app id
      this.appID = this.appIdFetcher();
      this.commonService.postData({
        'id': this.appID,
        'status': status,
        'app_name' : this.cnt_app_name,
        'app_version' : this.current_publish_version
      }, 'changeAppPublishStatus').subscribe(res => {
        res = JSON.parse(res);

        if (res.hasOwnProperty('app_json')) {
          // console.log(res.app_json);
          this.commonService.set_current_app_publish_counter_data(JSON.stringify(res.app_json));
        }
        if (res.data.update_status === 1) {
          resolve(true);
        } else {
          reject(true);
        }

        //gjc service
        this.alarmServce.countEmail();
      });
    });
  }

  changeStatus(status: any) {

    // if (status === 2) {
    //   const swalTextObj = this.publishAgainSwalText();
    //   this.publishAppActual(swalTextObj);
    // } else {
    // if status is not 2
    const a = this.appDataPublishCounterFetcher();
    if (a) {
      this.publishStatus = a.publish_status;
    } else {
      const appData = this.commonService.get_current_app_data();
      this.publishStatus = appData.app_publish_status;
    }
    if (this.publishStatus === status) {
      return false
    } else {
      NProgress.start();
      swal({
        title: 'Are You Sure?',
        text: 'Are you sure you want to change the app`s status?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-default',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }, (isConfirm) => {
        // if user select awaiting status then do publish
        // if (status === 2) {
        //   this.publishAppActual();
        // } else {
        // if accept yes
        if (isConfirm) {
          this.doChangeStatus(status).then(d => {
            swal({
              title: 'Successful',
              text: 'Your Application Status Changed Successfully',
              type: 'success',
              confirmButtonClass: 'btn-success',
              confirmButtonText: 'Ok'
            });
            this.doFirst();
            NProgress.done();
          }).catch(d => {
            swal({
              title: 'Cancelled',
              text: 'No Changes occur',
              type: 'warning',
              confirmButtonClass: 'btn-warning',
              confirmButtonText: 'Ok'
            });
            NProgress.done();
          });

        } else {
          // swal({
          //     title: 'Cancelled',
          //     text: 'Not Open Advanced Options',
          //     type: 'error',
          //     confirmButtonClass: 'btn-danger'
          // });
          this.doFirst();
          NProgress.done();
        }
        // }

      });
    }
    // }
  }
  doPublish() {

    return new Promise<boolean>((resolve, reject) => {
      // fetch current login user data
      const currentLogin = this.currentUserfetcher();
      // set current selected app version app id
      this.appID = this.appIdFetcher();
      if (currentLogin && this.appID) {
        const preparePayload = {
          'id': this.appID,
          'first_name': currentLogin.first_name,
          'last_name': currentLogin.last_name,
          'email': currentLogin.email
        }

        if (preparePayload) {
          this.commonService.postData(preparePayload, 'publishAppInit').map(res => {
            return res = JSON.parse(res).body;
          })
            // .catch((error) => {
            // if (error.status === 500) {
            //   this.toggleSpinner();
            //   swal({
            //     title: 'Oops!',
            //     text: 'Something Went Wrong Please Try Again Later',
            //     // html: '<ul class="list-group">' + dd + '</ul>',
            //     type: 'error',
            //     confirmButtonClass: 'btn-danger',
            //     confirmButtonText: 'Ok'
            //   });
            // return Observable.throw(error);
            //  }
            // })
            .subscribe(res => {
              resolve(res);
            })
            //gjc service
            this.alarmServce.countEmail();
        } else {
          reject('payload not set');
        }
      }
    });

  }
  /**
   * Method to intiate publish app version
   * @returns void
   */
  publishApp(): void {

    // todo publish app

    // fetch counter val from storage
    const a = this.appDataPublishCounterFetcher();

    // if yes then set
    if (a) {

      this.publishCounter = a.publish_counter;

    } else {
      // if no then get it from appdata
      const appData = this.commonService.get_current_app_data();
      this.publishCounter = appData.app_publish_counter;

    }
    // check wheather user gonna  publish app for firsttime
    if (this.publishCounter === 0) {

      // call first time
      const swalTextObj = this.publishFirstSwalText();
      this.publishAppActual(swalTextObj);

    } else {
      // if not
      const swalTextObj = this.publishAgainSwalText();
      // determine as app version is published already
      this.publishAppActual(swalTextObj);

    }
  }
  /**
   * Method to retrive swal text
   */
  private publishFirstSwalText() {
    const swalTextObj = {
      showText: 'Are you sure you want to submit your app for publishing?',
      // tslint:disable-next-line:max-line-length
      successText: 'The App Publishing Process has began. We will update you once your app is available on the App Store and Google Play Store.'
    }
    return swalTextObj;
  }
  private publishAgainSwalText() {
    const swalTextObj = {
      showText: 'Are you sure you want to publish the changes to your live app?',
      successText: 'Your changes were successfully saved for your live app'
    }
    return swalTextObj;
  }
  /**
  * Method to retrive current app id
  */
  private appIdFetcher() {
    const appid = JSON.parse(localStorage.getItem('currentAppData'));
    return appid.id;
  }
  /**
   * Method to retrive current app publishCounter id
   */
  private appDataPublishCounterFetcher() {
    return this.commonService.get_current_app_publish_counter_data();
  }
  /**
   * Method to retrive current login user data
   */
  private currentUserfetcher() {
    const currentLogin = JSON.parse(localStorage.getItem('currentUser'));
    return currentLogin;
  }
  /**
   * Method to toggle  boolean spinner
   */
  private toggleSpinner() {
    // this.isSpinnerActive = !this.isSpinnerActive;
    this.mS.setSpinnerActive(this.isSpinnerActive = !this.isSpinnerActive);
    // console.log(this.isSpinnerActive);
  }
  /**
   * Method to allow access for admin to generate new json for normal user it won't
   */
  private allowGenerateJson() {
    const getUser = this.currentUserfetcher();
    if (getUser.role_id === 1) {
      this.roleAdminActive = true;
    } else {
      this.roleAdminActive = false;
    }
  }
  /**
   * Method to retrive general dicussion if have any
   * @param
   * @returns void
   */
  fetchDicussion(): void {
    const app = this.appIdFetcher();
    this.commonService.postData({ 'app_id': app }, 'getDicussionByAppID').subscribe(res => {
      const rdata = JSON.parse(res);

      if (rdata.status === 1 && rdata.data instanceof Array) {

        // this.versionManagementData = this.rdata['data'];
        this.dicussionList = rdata.data;
        // console.log(this.dicussionList);

      } else {
        const error_message = rdata.data;
        $.notify({
          title: '',
          message: error_message
        }, {
            type: 'warning'
          });

      }
    }, error => {
      console.log(error);
    });
  }
  /**
   * Method to store dicussion
   * @param form (NgForm)
   */
  onSubmit(form: NgForm): void {


    const currentLogin = this.currentUserfetcher();

    const appId = this.appIdFetcher();
    form.value.app_id = appId;
    form.value.email = currentLogin.email;
    form.value.role_id = currentLogin.role_id;

    console.log(form.value);

    this.commonService.postData(form.value, 'storeDicussion').subscribe(res => {
      this.rdata = JSON.parse(res);
      console.log(this.rdata);
      this.rstatus = this.rdata['data'].status;
      if (this.rstatus === 1) {

        // this.versionManagementData = this.rdata['data'];
        form.resetForm();
        this.fetchDicussion();

        this.Dicussion_Scroll.nativeElement.scrollTop = this.Dicussion_Scroll.nativeElement.scrollHeight + 120;

        console.log(this.Dicussion_Scroll.nativeElement.scrollTop);

        const success_message = this.rdata['data'].message;
        $(function () {
          $.notify({
            title: '',
            message: success_message
          }, {
              type: 'success'
            });
        });

      } else {
        const error_message = this.rdata['data'].message;
        $(function () {
          $.notify({
            title: '',
            message: error_message
          }, {
              type: 'danger'
            });
        });
      }

    }, error => {
      this.rdata = JSON.parse(error._body);
      this.is_error = true;
      this.is_success = false;
      this.error_message = this.rdata['data'].message;

      const error_message = this.error_message;
      $(function () {
        $.notify({
          title: '',
          message: error_message
        }, {
            type: 'danger'
          });
      });

    });
  }
  /**
  * Method to publish app
  * @param objSwal (object)
  */
  private publishAppActual(objSwal: any) {
   // e.target.disabled = true;
   // console.log(e);
    // NProgress.start();
    swal({
      title: 'Are You Sure?',
      text: objSwal.showText,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn-success',
      confirmButtonText: 'Continue',
      cancelButtonText: 'Cancel',
      closeOnConfirm: true,
      closeOnCancel: true
    }, (isConfirm) => {
      // if accept yes
      if (isConfirm) {
        // show some spinner
        this.toggleSpinner();
        // e.target.disabled = false;
        this.doPublish().then((d: any) => {
          // console.log(d);
          let element = '<p style=" font-size: 14px; margin-bottom: 0;">Before publishing your app, you must provide the following:</p>';
          if (d.hasOwnProperty('basic_info_required') || d.hasOwnProperty('menu_required')) {
            this.toggleSpinner();
            const promiseEle = new Promise(resolve => {
              for (const key in d.basic_info_required) {

                if (d.basic_info_required.hasOwnProperty(key)) {
                  element += '<p style="font-size: 14px; margin-bottom: 0;">' + d.basic_info_required[key] + '</p>';
                }
              }
              if (d.hasOwnProperty('menu_required')) {
                element += '<p style="font-size: 14px; margin-bottom: 0;">' + d.menu_required + '</p>';
              }

              resolve(element);

            })
            promiseEle.then(dd => {

              swal({
                title: 'Oops!',
                text: dd,
                html: true,
                type: 'warning',
                confirmButtonClass: 'btn-warning',
                confirmButtonText: 'Ok'
              });
            });

          } else {
            // store updated value of app inside storage
            this.commonService.set_current_app_publish_counter_data(JSON.stringify(d.handleUpdateAppData));
            // if spinner active then disabled
            this.toggleSpinner();

            swal({
              title: 'Successful',
              text: objSwal.successText,
              type: 'success',
              confirmButtonClass: 'btn-success',
              confirmButtonText: 'Ok'
            });
            this.doFirst();
            // NProgress.done();
          } // end else
        }).catch(d => {
          // console.log(d);
          this.doFirst();
          this.toggleSpinner();
          // NProgress.done();
        });

      } else {
        // swal({
        //     title: 'Cancelled',
        //     text: 'Not Open Advanced Options',
        //     type: 'error',
        //     confirmButtonClass: 'btn-danger'
        // });
        // NProgress.done();
        // reset status
        // e.target.disabled = false;
        this.doFirst();
      }
    });
  }

}


