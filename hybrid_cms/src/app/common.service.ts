import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
// import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { PricingsubRes } from './structure/strip-packages/pricing';
import { UserSignUpReq } from './structure/users/user-sign-up.component';
import { MessageService } from './message.service';
import * as FontFamilyConstant from './structure/constants/font-family-const';

import { environment } from './../environments/environment';

declare var $: any;
declare var swal: any;
declare var NProgress: any;

interface SwalParams {
  title: string,
  msg: string,
  type: string,
  goto?: string
}
@Injectable()
export class CommonService {

  // apiUrl = 'http://hybridcms.inexture.com/api/';
  // apiUrl = 'http://34.214.147.112/cms_backend/public/api/';
     // apiUrl = 'http://35.163.93.93/api/';
 apiUrl = environment.apiUrl;
  // apiUrl = 'http://192.168.100.119:8000/api/';
  // apiUrl = '${environment.baseUrl}/api/';

  // apiUrl = 'http://cmsbackend.theappcompany.com/api/';

  // apiUrl = 'http://localhost/cms-nick/cms_backend/public/api/';


  is_error = false;
  error_message = '';
  childCssData: any;
  youtubeJsonData: any;
  fontFamilyType: any;

  subscriptionData: Array<{}>;

  constructor(private http: Http,
    private router: Router,
    private mS: MessageService,
    private httpClient: HttpClient) {
    this.getFontFamilyType();
  }

  postData(data, methodName) {
    let body = '';
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        body += key + '=' + data[key] + '&';
      }
    }

    let token = '';
    if (this.get_user_data()) {
      token = '?token=' + this.get_user_data()['token'];
    }

    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.apiUrl + methodName + token, body, {
      headers: headers
    }).map(res => res['_body'])
      .catch((error) => {
        // maybe add in the future if the code is 403 then send him to login otherwise send him elsewhere
        if (NProgress.isStarted()) {
          NProgress.done();
        }
        if (error.status === 401) {

          const errorJson = JSON.parse(error._body);
          const params: SwalParams = {
            title: 'Unauthorized',
            msg: errorJson.access,
            type: 'warning',
            goto: '/sign-in'
          }
          this.swalPopUp(params);
        } else if (error.status === 500) {

          const params: SwalParams = {
            title: 'Oops!',
            msg: 'Something Went Wrong',
            type: 'error',
            goto: '/contact-us'
          }
          this.swalPopUp(params);
          // swal({
          //   title: 'Oops!',
          //   text: 'Something Went Wrong',
          //   type: 'error',
          //   confirmButtonClass: 'btn-danger',
          //   confirmButtonText: 'Ok',
          //   closeOnConfirm: true
          // }, (isConfirm) => {
          //   if (isConfirm) {
          //     this.router.navigate(['/contact-us']);
          //   }
          // });

        }
        return Observable.throw(error);
      });
  }

  filePostData(data, methodName) {
    let token = '';
    if (this.get_user_data()) {
      token = '?token=' + this.get_user_data()['token'];
    }
    return this.http.post(this.apiUrl + methodName + token, data)
      .map(res => res['_body'])
      .catch((error) => {
        // maybe add in the future if the code is 403 then send him to login otherwise send him elsewhere
        // if (error.status === 401) {
        //   localStorage.removeItem('currentUser');
        //   localStorage.removeItem('currentAppData');
        //   // localStorage.setItem("error_message", JSON.stringify('Your token has been expired'));
        //   this.router.navigate(['sign-in']);
        // }
        if (NProgress.isStarted()) {
          NProgress.done();
        }
        if (error.status === 401) {
          const errorJson = JSON.parse(error._body);
          const params: SwalParams = {
            title: 'Unauthorized',
            msg: errorJson.access,
            type: 'warning',
            goto: '/sign-in'
          }
          this.swalPopUp(params);

        } else if (error.status === 500) {

          const params: SwalParams = {
            title: 'Oops!',
            msg: 'Something Went Wrong',
            type: 'error',
            goto: '/contact-us'
          }
          this.swalPopUp(params);

        }
        return Observable.throw(error);
      });
  }

  getFontFamilyType(): void {
    this.fontFamilyType = FontFamilyConstant.default;
    // const headers = new HttpHeaders();
    // headers.append('Content-Type', 'application/x-www-form-urlencoded');
    // let token = '';
    // if (this.get_user_data()) {
    //   token = '?token=' + this.get_user_data()['token'];
    // }
    // this.httpClient.get(this.apiUrl + 'getFontData' + token, { headers: headers }).subscribe(res => {
    //   this.fontFamilyType = res;
    // });
    // console.log(FontFamilyConstant.default);
  }

  getData(methodName) {
    // check subscription method
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let token = '';
    if (this.get_user_data()) {
      token = '?token=' + this.get_user_data()['token'];
    }

    return this.http.get(this.apiUrl + methodName + token, {
      headers: headers
    })
      .map(res => res['_body'])
      .catch((error) => {
        if (NProgress.isStarted()) {
          NProgress.done();
        }
        // console.log(error)
        // maybe add in the future if the code is 403 then send him to login otherwise send him elsewhere
        // if (error.status === 401) {
        //   localStorage.removeItem('currentUser');
        //   // localStorage.setItem("error_message", JSON.stringify('Your token has been expired'));
        //   this.router.navigate(['sign-in']);
        // } else if (error._body.Type === 'error') {
        //   // confirm('slow network detected');
        // }
        if (error.status === 401) {
          const errorJson = JSON.parse(error._body);

          const params: SwalParams = {
            title: 'Unauthorized',
            msg: errorJson.access,
            type: 'warning',
            goto: '/sign-in'
          }
          this.swalPopUp(params);

        } else if (error.status === 500) {

          const params: SwalParams = {
            title: 'Oops!',
            msg: 'Something Went Wrong',
            type: 'error',
            goto: '/contact-us'
          }
          this.swalPopUp(params);

        }

        return Observable.throw(error);
      })

  }

  private handleErrorObservable(error: Response | any) {
    return Observable.throw(error || error);
  }

  get_user_data() {
    if (localStorage.getItem('currentUser') != null) {
      return JSON.parse(localStorage.getItem('currentUser'));
    }
  }

  check_user_token_valid(): Observable<boolean> {
    let currentuser = localStorage.getItem('currentUser');
    if (currentuser == null) {
      localStorage.removeItem('currentUser');
      return Observable.of(false);
    }
    return Observable.create((observer) => {

      let formData = new FormData();       
      formData.append('token', JSON.parse(currentuser)['token']);
      
      this.postData(formData, 'is_valid_token').subscribe(res => {            
        let status = JSON.parse(res)['status'] ? true : false; // 1: valid
        if (!status) {
          localStorage.removeItem('currentUser');
        }
        observer.next(status);
      }, err => {
        localStorage.removeItem('currentUser');
        observer.next(false);
      });
    })
  }

  is_login() {
    if (localStorage.getItem('currentUser') != null) {
      return true;
    }
  }

  storeMessage(message) {
    localStorage.setItem('success_message', JSON.stringify(message));
  }

  isMessage() {
    if (localStorage.getItem('success_message') != null) {
      return true;
    }
  }

  getMessage() {
    return JSON.parse(localStorage.getItem('success_message'));
  }

  removeMessage() {
    localStorage.removeItem('success_message');
  }

  is_loggedin() {
    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['/dashboard']);
    }
  }

  get_current_app_data() {
    if (localStorage.getItem('currentAppData') != null) {
      return JSON.parse(localStorage.getItem('currentAppData'));
    } else {
      return null;
    }
  }

  set_current_app_publish_counter_data(data: any): void {
    localStorage.setItem('currentAppPublishCounterData', data);
  }
  get_current_app_publish_counter_data() {

    if (localStorage.getItem('currentAppPublishCounterData') != null && localStorage.getItem('currentAppPublishCounterData') != "undefined") {
      return JSON.parse(localStorage.getItem('currentAppPublishCounterData'));
    }
    return null;
  }

  remove_current_app_publish_counter_data(): void {
    if (localStorage.getItem('currentAppPublishCounterData') != null) {
      localStorage.removeItem('currentAppPublishCounterData');
    }
  }
  isAuthorizedRoute() {
    const currentuserdata = this.get_user_data();
    const userRole = currentuserdata.role_id;
    if (userRole !== 1) {
      this.storeMessage('Access denied.');
      this.router.navigate(['/dashboard']);
    }
  }

  getCurrentUserInfo(){
    const currentuserdata = this.get_user_data();
    return currentuserdata;
  }

  /**
   * Handler to set plan for checkout
   * @param {PricingsubRes) plan
   */
  setBasicPlan(plan: PricingsubRes) {
    // if plan set already
    if (localStorage.getItem('active_plan')) {
      // remove plan exisiting
      localStorage.removeItem('active_plan');
      // set plan
      localStorage.setItem('active_plan', JSON.stringify(plan));

    } else {
      // if not set plan
      localStorage.setItem('active_plan', JSON.stringify(plan));
    }
  }
  /**
   * Handler to get plan for checkout
   * @return {Observable<PricingsubRes>}
   */
  /*getBasicPlan(): PricingsubRes {
    if (localStorage.getItem('active_plan')) {
      // return basic plan if set
      return JSON.parse(localStorage.getItem('active_plan'));
    } else {
      return null;
    }
  }*/
  getBasicPlan(methodName: string) {
    return this.http.get(this.apiUrl + methodName)
      .map(res => res['_body'])
      .catch((error) => {
        // maybe add in the future if the code is 403 then send him to login otherwise send him elsewhere
        if (error.status === 401) {
          localStorage.removeItem('currentUser');
          // localStorage.setItem("error_message", JSON.stringify('Your token has been expired'));
          this.router.navigateByUrl('\sign-in');
        }
        return Observable.throw(error);
      });

  }
  /**
   * Handler to check plan is set returns true if set otherwise false
   * @returns{boolean}
   */
  isSetBasicPlan(): boolean {
    if (localStorage.getItem('active_plan')) {
      return true;
    } else { return false; }
  }
  /**
   * Handler to remove plan
   */
  removeBasicPlan(): void {
    if (localStorage.getItem('active_plan')) {
      // remove active plan if needed
      localStorage.removeItem('active_plan');
    }
  }
  /**
   * custom post request data
   *
   */
  CustomPostData(data: UserSignUpReq, methodName) {
    let body = '';

    // tslint:disable-next-line:forin
    for (const key in data.form.value) {
      body += key + '=' + data.form.value[key] + '&';
    }
    body += 'stripe_token=' + data.token + '&';
    body += 'basic_plan_id=' + data.plan.id + '&';
    body += 'basic_plan_price=' + data.plan.pa_price + '&';
    body += 'basic_plan_name=' + data.plan.pa_name + '&';
    body += 'is_refer=' + data.is_refer;



    let token = '';
    if (this.get_user_data()) {
      token = '?token=' + this.get_user_data()['token'];
    }

    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.apiUrl + methodName + token, body, {
      headers: headers
    })
      .map(res => res['_body'])
      .catch((error) => {
        if (NProgress.isStarted()) {
          NProgress.done();
        }
        // maybe add in the future if the code is 403 then send him to login otherwise send him elsewhere
        // if (error.status === 401) {
        //   localStorage.removeItem('currentUser');
        //   // localStorage.setItem("error_message", JSON.stringify('Your token has been expired'));
        //   this.router.navigate(['sign-in']);
        // }
        if (error.status === 401) {
          const errorJson = JSON.parse(error._body);
          const params: SwalParams = {
            title: 'Unauthorized',
            msg: errorJson.access,
            type: 'warning',
            goto: '/sign-in'
          }
          this.swalPopUp(params);
        } else if (error.status === 500) {

          const params: SwalParams = {
            title: 'Oops!',
            msg: 'Something Went Wrong',
            type: 'error',
            goto: '/contact-us'
          }
          this.swalPopUp(params);
        }
        return Observable.throw(error);
      });
  }

  custompostData(data, methodName) {
    const body = data;
    let token = '';
    if (this.get_user_data()) {
      token = '?token=' + this.get_user_data()['token'];
    }

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(this.apiUrl + methodName + token, body, {
      headers: headers
    })
      .map(res => res['_body'])
      .catch((error) => {
        // maybe add in the future if the code is 403 then send him to login otherwise send him elsewhere
        // if (error.status === 401) {
        //   localStorage.removeItem('currentUser');
        //   // localStorage.setItem("error_message", JSON.stringify('Your token has been expired'));
        //   this.router.navigate(['sign-in']);
        // }
        if (NProgress.isStarted()) {
          NProgress.done();
        }
        if (error.status === 401) {
          const errorJson = JSON.parse(error._body);

          const params: SwalParams = {
            title: 'Unauthorized',
            msg: errorJson.access,
            type: 'warning',
            goto: '/sign-in'
          }

          this.swalPopUp(params);

        } else if (error.status === 500) {


          const params: SwalParams = {
            title: 'Oops!',
            msg: 'Something Went Wrong',
            type: 'error',
            goto: '/contact-us'
          }
          this.swalPopUp(params);

        }
        return Observable.throw(error);
      });
  }

  getVideoInfo(key, playlistId) {

    this.http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails,snippet&maxResults=20&key=' + key + '&playlistId=' + playlistId)
      .map(res => {
        res.json();
        this.youtubeJsonData = res['_body'];
      }).subscribe(
      data => console.log(data),
      error => console.log(error),
      () => console.log('Fine !')
      );
  }

  /**
   * Method to set subscription data
   * @param data Array<{}>
   */
  subscrptionSetter(data: Array<{}>) {
    this.subscriptionData = data;
  }
  /**
   * Method to get subscription data
   * @returns subscriptionData: Array<{}>
   */
  subscriptionGetter(): Array<{}> {
    return this.subscriptionData;
  }
  /**
   * Method to popup swal
   * @param data: SwalParams
   */
  swalPopUp(data: SwalParams): void {
    this.mS.setSpinnerActive(false);
    swal({
      title: data.title,
      text: data.msg,
      type: data.type,
      confirmButtonClass: 'btn-warning',
      confirmButtonText: 'Ok',
      closeOnConfirm: true
    }, (isConfirm) => {
      if (isConfirm) {

        // console.log(data.goto);

        // this.router.navigateByUrl('../sign-in').then(nav => {
        //   console.log(nav); // true if navigation is successful


        // }, err => {
        //   console.log(err) // when there's an error
        // });
        if (data.goto === '/sign-in') {
          // console.log('inside sign in');
          localStorage.removeItem('currentAppData');
          localStorage.removeItem('currentUser');
          (<any>window).location.href = data.goto;
        } else {
          // console.log('inside else');
          this.router.navigate([data.goto]);
        }

        // localStorage.setItem("error_message", JSON.stringify('Your token has been expired'));
      }

    })
  }
  requestAlbum(userID) 
    {  
        return new Promise(resolve => 
        {
            this.http.get("http://photos.googleapis.com/data/feed/api/user/"+userID+"?alt=json")
            .subscribe(data => 
            { 
                resolve(JSON.parse(data['_body']));
            }, 
            error => 
            {
                console.log(JSON.stringify(error.json()));                                  
            });

        });        
    }

    requestPhoto(albumId,userId) 
    {   
        return new Promise(resolve => 
        {            
            this.http.get("http://photos.googleapis.com/data/feed/api/user/"+userId+"/albumid/"+albumId+"?alt=json")
            .subscribe(data => 
            {
               resolve(JSON.parse(data['_body']));
            }, error => 
            {
                console.log(JSON.stringify(error.json()));                                  
            });

        });        
    }

}
