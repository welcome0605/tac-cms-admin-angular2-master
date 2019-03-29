import { Component, OnInit, AfterViewInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CustomValidators } from 'ng2-validation';
import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';
import { PricingsubRes, API_GET_PACKAGES, PricingRes } from './../strip-packages/pricing';
import { timeout } from 'rxjs/operator/timeout';
import { Observable } from 'rxjs/Observable';
import { forEach } from '@angular/router/src/utils/collection';



declare var $: any;
declare var jQuery: any;
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

const password = new FormControl('', [Validators.required, Validators.minLength(6), matchCorrectPass()]);
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

export interface UserSignUpReq {
  form: NgForm,
  plan: PricingsubRes,
  token: string,
  is_refer: string
}

interface CheckEmailApp {
  email: string,
  app_name: string
}



@Component({
  selector: 'app-users-sign-up',
  templateUrl: './user-sign-up.component.html',
  styles: ['body { padding: 0px !important;}']
})
export class UserSignUpComponent implements OnInit, AfterViewInit {
  public form: FormGroup;
  public customform: FormGroup;
  private customActive: boolean
  rdata = [];
  rstatus = '';
  success_message = '';
  is_success = false;
  is_error = false;
  is_loading = false; // todo request made show spinner
  is_plan_set = false; // todo check plan is set
  button_disable = false; // todo disable sign up button
  is_mob_false = false;
  error_message = '';
  public static_refer_ac = 'theappcompany';
  public static_refer_ma = 'marketamerica';
  private postPrepare: UserSignUpReq;
  private is_refer: string;
  private email_exist: {
    status: boolean,
    text: string
  };
  private app_name_exist: {
    status: boolean,
    text: string
  };
  plan: string;
  plan_uid: string;

  packagesList: any;

  plan_form_unique_id: string;

  setting_plan: any;
  // set recommmanded plan
  recommand_plan = 'W06_oe';
  // set pk key
  private pk_key = 'pk_test_Y86bGyUafOaq8DUBJMRoOrTA';
  // jcr 416
  // is_access_app_operation = true;

  constructor(private commonService: CommonService,
    private checkloginService: CheckloginService,
    private router: Router,
    private mS: MessageService,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder) {
    // this.customActive = true;
    commonService.is_loggedin();
    // //jcr 416
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
  ngAfterViewInit(): void {
    $('#us-phone-mask-input').mask('(000) 000-0000', { placeholder: '(__) __-____' });
  }
  ngOnInit() {
    this.email_exist = {
      status: false,
      text: ''
    }
    this.app_name_exist = {
      status: false,
      text: ''
    }
    this.showPlan();
    this.loadStripPackages();
    this.form = this.fb.group({
      first_name: [null, Validators.compose([Validators.required])],
      last_name: [null, Validators.compose([Validators.required])],
      // photo: [null, Validators.compose([Validators.required])],
      term_condition: [false, Validators.requiredTrue],
      password: password,
      cnf_password: confirmPassword,
      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      mob_number: [null, Validators.compose([Validators.required, Validators.minLength(14)])],
      app_name: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30)])],
      // app_category: [null, Validators.required],
      // app_description: [null, Validators.required]

    });
    // custom form init
    this.customform = this.fb.group({
      name: [null, Validators.required],
      email: [null, Validators.required],
      budget: [null],
      app_desc: [null, Validators.required]

    });

    $(function () {
      // Show/Hide Password
      $('.password').password({
        eyeClass: '',
        eyeOpenClass: 'icmn-eye',
        eyeCloseClass: 'icmn-eye-blocked'
      });

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

      $(document).on('click', '.alert-close', function () {
        $('.alert-close').hide();
      })
    });

  }

  // mobileNoCheck($event) {
  //   this.phoneNumberErrFlag = false;
  //   if ($event.length < 14) {
  //     this.mobileNumberErrLen = true;
  //     this.basicFormCheck();
  //   } else {
  //     this.mobileNumberErrLen = false;
  //     this.basicFormCheck();
  //   }

  // }

  // set plan
  setPlan(d): void {
    $(function () {
      $('#us-phone-mask-input').mask('(000) 000-0000', { placeholder: '(__) __-____' });
    });
    // console.log(d);
    this.plan_form_unique_id = d;
    // this.showPlan();
    if (this.packagesList || this.packagesList.length > 0) {
      const filterPlan = this.packagesList.filter((data) => {
        return data.unique_id === d;
      })
      this.setting_plan = filterPlan[0];
      // set custom form active
      if (this.setting_plan.pa_name === 'Custom') {
        this.customActive = true;
      } else {
        this.customActive = false;
      }
      // set plan selection true
      this.is_plan_set = false;
    }
  }

  showPlan(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (!this.plan_form_unique_id) {
        this.plan_uid = params['set'];
      } else {
        this.plan_uid = this.plan_form_unique_id;
      }
      // set reference
      if (params['source']) {
        const current_ref = params['source'];
        if (current_ref === this.static_refer_ac || current_ref === this.static_refer_ma) {
          // this.is_refer = 1;
          if (current_ref === this.static_refer_ac) {
            this.is_refer = this.static_refer_ac;
          } else {
            this.is_refer = this.static_refer_ma;
          }
        } else {
          this.is_refer = this.static_refer_ac;
        }
      } else {
        this.is_refer = this.static_refer_ac;
      }
      // let rand = '';
      // for (let index = 0; index < 7; index++) {
      //   rand += Math.floor(Math.random() * 100).toString();
      // }
      // console.log(this.is_refer);
    });
    if (this.plan_uid !== undefined || this.plan_form_unique_id) {
      const method = 'packages/' + this.plan_uid;

      this.commonService.getBasicPlan(method).subscribe(d => {

        d = JSON.parse(d);
        if (d.data && d.data !== null) {
          this.setting_plan = d.data;
          this.plan = this.setting_plan.pa_name;
          this.plan_form_unique_id = this.setting_plan.unique_id;
        } else {
          this.is_plan_set = true;
        }

      });
    } else {
      this.is_plan_set = true;
    }
  }

  /**
   * load all avilable active package
   *
  */
  loadStripPackages() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    this.http.get<PricingRes>(API_GET_PACKAGES, { headers: headers })
      .subscribe(res => {
        this.packagesList = res.data;
        // console.log(res);
      });
  }

  postData(form: UserSignUpReq) {
    this.commonService.CustomPostData(form, 'signup').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if (this.rstatus === '1') {
        this.is_error = false;
        this.is_success = true;
        form.form.resetForm();
        this.is_loading = false;
        this.success_message = this.rdata['message'];
        this.mS.setSpinnerActive({ active: true, text: this.success_message });
        this.button_disable = true;
        // set timeout to redirect to sign-in page
        const delayHide = Observable.timer(4000);
        delayHide.subscribe(() => {
          // clear spinner
          this.mS.setSpinnerActive(false);
          this.router.navigate(['/sign-in']);
        })
        // setTimeout(() => {

        // }, 3000);
        // remove plan from storage
        this.commonService.removeBasicPlan();
      } else {
        this.is_error = true;
        this.is_success = false;
        this.error_message = this.rdata['message'];
        this.mS.setSpinnerActive({ active: true, text: this.error_message });
        const delayHide = Observable.timer(4000);
        delayHide.subscribe(() => {
          this.mS.setSpinnerActive(this.is_success);
        });
        this.is_loading = false;
        this.button_disable = false;

        $(function () {
          $('.alert-close').show();
        });
      }
    });

  }

  // chkPh(event): void {
  //   // console.log(event.length, event);
  //   if (event.length < 14 || event.length > 14) {
  //     this.is_mob_false = true;
  //   } else {
  //     this.is_mob_false = false;
  //   }
  // }
  checkValidationOnServer(bodyPayload: CheckEmailApp) {
    return new Promise((resolve, reject) => {
      this.checkexist(bodyPayload).subscribe(res => {
        // check email or app name is not exist
        if (res.email === null && res.app_name === null) {
          // check if true then false
          if (this.email_exist.status || this.app_name_exist.status) {
            this.email_exist.status = false;
            this.app_name_exist.status = false;
          }
          resolve(true);
        } else {
          // console.log(res);
          if (res.email !== null) {
            this.email_exist.status = true;
            this.email_exist.text = res.email;
          }
          if (res.app_name !== null) {
            this.app_name_exist.status = true;
            this.app_name_exist.text = res.app_name;
          }
          reject(res);
        }

      }, err => {
        // console.log(err);
        reject(err);
      })
    })
  }
  onSubmit(form: NgForm) {
    const prepareJson: CheckEmailApp = {
      email: form.value.email,
      app_name: form.value.app_name
    }
    // call fun to check app name email data exist or not
    this.checkValidationOnServer(prepareJson).then((success) => {
      // show spinner
      this.is_loading = true;
      this.mS.setSpinnerActive({ active: this.is_loading, text: 'Please Wait for a while' });

      const data = this.setting_plan;

      const handler = (<any>window).StripeCheckout.configure({
        key: this.pk_key,
        image: 'assets/modules/dummy-assets/common/img/logo-inverse.png',
        locale: 'auto',
        token: (token, args) => {

          // prepare post data
          this.postPrepare = {
            'form': form, // form data
            'plan': data, // current package selection
            'token': token.id, // token ID
            'is_refer': this.is_refer
          };
          setTimeout(() => {
            this.is_loading = true;
            this.mS.setSpinnerActive({ active: this.is_loading, text: 'Please Wait Your Transaction is being Proceed' });
            this.button_disable = true;
            this.postData(this.postPrepare);
          }, 500);

        },
        // hadnler fun when strip checkout open
        opened: () => {
          //
        },
        closed: () => {
          this.is_loading = false;
          this.mS.setSpinnerActive(this.is_loading);
        }
      });

      handler.open({
        name: data.pa_name,
        description: '$' + data.pa_price,
        amount: data.pa_price * 100,
        email: form.value['email'],
        allowRememberMe: false,
      });
      // Close Checkout on page navigation:
      (<any>window).addEventListener('popstate', () => {
        handler.close();
      });

    }).catch((err) => {
      // if already email exist or any 500 or 403 handler code
    })
  }

  /**
   * Method to check email or app name exist
   * @param data CheckEmailApp
   * @returns Observable<CheckEmailApp>
   */
  checkexist(data: CheckEmailApp): Observable<any> {
    return Observable.create(observe => {

      this.commonService.postData(data, 'checkemailappexist').subscribe(res => {
        // console.log(res)
        observe.next(JSON.parse(res))
      }, err => {
        observe.error(err)
      })
    })
  }
  sendCustom(f: NgForm): void {
    this.mS.setSpinnerActive({ active: true, text: 'Please Wait for a while' });
    this.commonService.postData(f.value, 'sendCustomMail').map(res => { return JSON.parse(res) }).subscribe(res => {
      const handleTimer = Observable.timer(2000);


      if (res.status === 1) {
        this.mS.setSpinnerActive({ active: true, text: res.message });
        handleTimer.subscribe(() => {
          this.mS.setSpinnerActive(false);
        })
        f.form.reset();
      } else {
        this.mS.setSpinnerActive({ active: true, text: 'Oops Something Wrong Happen! Please Try Again Later' });
        handleTimer.subscribe(() => {
          this.mS.setSpinnerActive(false);
        })
      }

    }, err => {
      // console.log(err);
    })
    // alert('In Progress');

  }

}
