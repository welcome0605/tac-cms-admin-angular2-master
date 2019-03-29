import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';

import { CustomValidators } from 'ng2-validation';
import { CommonService } from './../../common.service';
import { MessageService } from './../../message.service';
import { CanComponentDeactivate } from './../../can-deactivate-guard.service';
import { Observable } from 'rxjs/Observable';



declare var $: any;
declare var jQuery: any;
declare var NProgress: any;
declare var swal: any;
function matchCorrectPass() {
  // const hasExclamation = input.value !== this.o_password.value;
  return (input: FormControl) => {
    return /(?=.*\d)(?=.*)(?=.*[A-Z]).*/.test(input.value) ? null : {
      matchCorrectPass: {
        valid: false
      }
    };
  }
}

function NotEqualToOldPass(oldPwd: FormControl) {
  // const hasExclamation = input.value !== this.o_password.value;
  return (input: FormControl) => {
    return input.value !== oldPwd.value ? null : {
      NotEqualToOldPass: {
        valid: false
      }
    };
  }

}

@Component({
  selector: 'app-profile-component',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit, CanComponentDeactivate {
  @ViewChild('profileForm') profileFormRef: NgForm;
  @ViewChild('changePasswordForm') changePasswordFormRef: NgForm;
  @ViewChild('accountSettingdBtn') accountSettingdBtnRef: ElementRef;
  @ViewChild('updatePwdBtn') updatePwdBtnRef: ElementRef;
  

  public form: FormGroup;
  public cpform: FormGroup;
  post: any;
  userData = [];
  rdata = [];
  storeData = [];
  rstatus = '';
  //jcr 416
  // is_access_app_operation = true;

  o_password = new FormControl(null, Validators.compose([Validators.required, Validators.minLength(6)]));
  n_password = new FormControl('', [Validators.required, Validators.minLength(6), NotEqualToOldPass(this.o_password), matchCorrectPass()]);
  cn_password = new FormControl('', CustomValidators.equalTo(this.n_password));

  constructor(private commonService: CommonService, private msgService: MessageService, private fb: FormBuilder, private router: Router) {
    this.commonService.check_user_token_valid().subscribe(res => {
      if(res == false) {
        this.router.navigate(['sign-in']);
      } else {
        this.userData = this.commonService.get_user_data();
      }
    })
    //jcr 416
		// this.commonService.check_user_token_valid().subscribe(res => {
		// 	if(res == false) {
		// 	  this.router.navigate(['sign-in']);
		// 	} else {
		// 	  const currentuserdata = this.commonService.get_user_data();
		// 	  const userRole = currentuserdata.role_id;
		// 	  if (userRole !== 1) {
		// 		this.is_access_app_operation = false;
		// 	  }
		// 	}
		//   });
    // console.log(this.userData);
  }

  ngOnInit() {
    this.form = this.fb.group({
      first_name: [this.userData['first_name'], Validators.compose([Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+')])],
      last_name: [this.userData['last_name'], Validators.compose([Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+')])],
      email: [this.userData['email'], Validators.compose([Validators.required, CustomValidators.email])]
    });

    this.cpform = this.fb.group({
      o_password: this.o_password,
      n_password: this.n_password,
      cn_password: this.cn_password
    });

  }
  onSubmit(form: NgForm): void {
    this.onSubmitObservable(form).subscribe((d) => {

    }, (d) => {

    })
  }
  /**
   * Observable onSubmit method
   * @param form (Ngform)
   */
  onSubmitObservable(form: NgForm): Observable<any> {
    return Observable.create((observer) => {
      NProgress.start();
      this.accountSettingdBtnRef.nativeElement.disabled = true;
      this.commonService.postData(form.value, 'editprofile').subscribe(res => {
        this.rdata = JSON.parse(res);
        this.rstatus = this.rdata['status'];
        if (this.rstatus == '1') {
          const success_message = this.rdata['message'];
          $(function () {
            $.notify({
              title: '',
              message: success_message
            }, {
                type: 'success'
              });
          });
          this.storeData = this.rdata['data'];
          const username = this.rdata['data']['first_name'] + ' ' + this.rdata['data']['last_name'];
          localStorage.setItem('currentUser', JSON.stringify(this.storeData));
          // complete progress bar and notify subscriber
          this.form.markAsPristine();
          NProgress.done();
          this.msgService.setCurrentProfile(this.storeData);
          observer.next(success_message);
          observer.complete();
          this.accountSettingdBtnRef.nativeElement.disabled = false;          
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
          NProgress.done();
          this.form.markAsPristine();
          observer.throw(error_message);
          this.accountSettingdBtnRef.nativeElement.disabled = false;                    
        }

      });
    })

  }
  onSubmitChangePassword(form: NgForm) {
    this.onSubmitChangePasswordObservable(form).subscribe((d) => {

    }, (d) => {

    })
  }

  onSubmitChangePasswordObservable(cpform: NgForm) {
    return Observable.create((observer) => {
      cpform.value.email = this.userData['email'];
      this.updatePwdBtnRef.nativeElement.disabled = true;
      this.commonService.postData(cpform.value, 'changepassword').subscribe(res => {
        cpform.resetForm();
        this.rdata = JSON.parse(res);
        this.rstatus = this.rdata['status'];
        if (this.rstatus == '1') {
          const success_message = this.rdata['message'];
          $(function () {
            $.notify({
              title: '',
              message: success_message
            }, {
                type: 'success'
              });
          });
          this.cpform.markAsPristine();
          observer.next(success_message);
          observer.complete();
          this.updatePwdBtnRef.nativeElement.disabled = false;
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
          this.cpform.markAsPristine();
          observer.throw(error_message);
          this.updatePwdBtnRef.nativeElement.disabled = false;        
        }
      });
    })

  }
  /**
* canDeactivate implementation
*/
  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    if (this.form.dirty || this.cpform.dirty) {
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
        },
          (isConfirm) => {
            // if accept yes
            if (isConfirm) {
              if (this.form.dirty) {
                this.onSubmitObservable(this.profileFormRef).subscribe((d) => {
                  resolve(true);
                }, (d) => {
                  resolve(false);
                });
              }
              if (this.cpform.dirty && this.cpform.valid) {
                this.onSubmitChangePasswordObservable(this.changePasswordFormRef).subscribe((d) => {
                  resolve(true);

                }, (d) => {
                  resolve(false);
                })
              } else {
                NProgress.done();
                this.cpform.markAsPristine();
                resolve(false);
              }


            } else {
              resolve(true);
            }
          })
      })
    } else {
      return true;
    }
  }

}
