import { Component, OnInit, AfterViewInit } from '@angular/core';

import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';

import { CustomValidators } from 'ng2-validation';
import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';
import { SharedService } from './../../shared.service';
import { Observable } from 'rxjs/Observable';


declare var $: any;
declare var jQuery: any;
declare var NProgress: any;


@Component({
  selector: 'app-users',
  templateUrl: './user-sign-in.component.html',
  styles: []
})

export class UserSignInComponent implements OnInit, AfterViewInit {

  public form: FormGroup;
  rdata = [];
  storeData = [];
  rstatus = '';
  error_message = '';
  is_success = false;
  success_message = '';
  is_error = false;
  subscription: Subscription;
  appData = [];
  //jcr 416
  // is_access_app_operation = true;

  constructor(private commonService: CommonService,
    private checkloginService: CheckloginService,
    private fb: FormBuilder,
    private router: Router,
    private sharedService: SharedService) {
    commonService.is_loggedin();
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
  }

  ngOnInit() {

    // this.errorHandle();

    if (localStorage.getItem("error_message") != null) {
      const data = JSON.parse(localStorage.getItem("error_message"));
      this.error_message = data;
      this.is_error = true;
      localStorage.removeItem('error_message');
      // this.checkloginService.emit_logout();
    }

    if (this.commonService.isMessage()) {
      this.is_success = true;
      this.success_message = this.commonService.getMessage();
      this.commonService.removeMessage();
    }

    this.logout();
    this.form = this.fb.group({
      password: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required, CustomValidators.email])]
    });

  }
  ngAfterViewInit(): void {
    $(function () {
      // Show/Hide Password
      // $('.password').password({
      //   eyeClass: '',
      //   eyeOpenClass: 'icmn-eye',
      //   eyeCloseClass: 'icmn-eye-blocked'
      // });

      // Switch to fullscreen
      $('.switch-to-fullscreen').on('click', function () {
        $('.cat__pages__login').toggleClass('cat__pages__login--fullscreen');
      })

      // Change BG
      $('.random-bg-image').on('click', function () {
        const min = 1, max = 5,
          next = Math.floor($('.random-bg-image').data('img')) + 1,
          final = next > max ? min : next;

        $('.random-bg-image').data('img', final);
        $('.cat__pages__login').data('img', final).css('backgroundImage', 'url(assets/modules/pages/common/img/login/' + final + '.jpg)');
      })

      // Handle error message
      $(document).on('click', '.alert-close', function () {
        $('.alert-close').hide();
      })

    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentAppData');
    this.commonService.remove_current_app_publish_counter_data();
    this.checkloginService.emit_logout();
  }

  onSubmit(form: NgForm) {
    NProgress.start();
    localStorage.clear();

    this.commonService.postData(form.value, 'login').subscribe(res => {
      // setTimeout(() => {

      // }, 1000);

      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      this.storeData = this.rdata['data'];

      if (this.rstatus == '1') {
        this.is_error = false;

        localStorage.setItem('currentUser', JSON.stringify(this.storeData));


        if (this.storeData['role_id'] == 2) {

          this.getAllAppDatalogic().subscribe(data => {
            form.resetForm();
            NProgress.done();
          }, err => {
            NProgress.done();
          })

        } else {
          
          this.checkloginService.emit_login();
          form.resetForm();
          NProgress.done();
          this.router.navigate(['/dashboard']);
        }
      } else {
        this.is_error = true;
        NProgress.done();
        this.error_message = this.rdata['message'];

        $(function () {
          $('.alert-close').show();
        });
      }
    }
    );
  }
  /**
   * Method to retrive all app data
   */
  getAllAppDatalogic(): Observable<any> {
    return Observable.create((observer) => {
      this.commonService.postData({paginum : 1}, 'getallappdata').subscribe(res => {

        this.rdata = JSON.parse(res);
        this.appData = this.rdata['data'];
        // If there is a only one App assigned to user then we redirect them to app screen page
        if (this.appData.length === 1) {
          const singleAppId = this.appData[0]['id'];
          const postData = {
            'id': singleAppId
          };
          this.getSingleAppData(postData).subscribe(data => {
            observer.next('success');
          }, err => {
            observer.throw(err);
          });

        } else {
          this.checkloginService.emit_login();
          observer.next('success');
          this.router.navigate(['/dashboard']);
        }

      });
    })

  }
  /**
   * Method to retrive app data by id
   * @param postData
   */
  getSingleAppData(postData: Object): Observable<any> {
    return Observable.create((observer) => {
      this.commonService.postData(postData, 'getsingleappdata').subscribe(res => {
        const resdata = JSON.parse(res);
        const singleAppData = resdata['data'];
        
        localStorage.setItem('currentAppData', JSON.stringify(singleAppData));
        this.sharedService.emit_appdata(singleAppData);
        
        // $('#vertical_left_menu').show();
        // $('#previewbar').show();
        this.checkloginService.emit_login();
        observer.next('navigate to screen');
        this.router.navigate(['/apps/screen']);
      }, err => {
        observer.throw(err);
      });
    })

  }

}
