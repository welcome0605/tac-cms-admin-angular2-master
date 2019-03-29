import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/observable/throw';

import { CommonService } from './../../common.service';
import { SharedService } from './../../shared.service';
import { CanComponentDeactivate } from './../../can-deactivate-guard.service';
import { MessageService } from './../../message.service';
import { from } from 'rxjs/observable/from';
import { observeOn } from 'rxjs/operator/observeOn';
import { sample } from 'rxjs/operator/sample';
import { setTimeout } from 'timers';
import { S3Service } from './../../s3.service';

import { environment } from '../../../environments/environment';

declare var $: any;
declare var jQuery: any;

declare var NProgress: any;
declare var swal: any;

const defaultImage = `${environment.baseUrl}/upload/appicon/original/default.png`;

let loadingImageCreate = (src) => {
    var img = document.createElement('img');
    img.src = src;
    img.className = "loading";
    img.style.top = "-50%";
    img.style.background = "transparent";
    return img;
};

let defaultImageCreate = (src) => {
  var img = document.createElement('img');
  img.src = src;
  return img;
};

let sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

let setVariableWithKeyValue = (obj,is, value) => {
  if (typeof is == 'string')
      return setVariableWithKeyValue(obj,is.split('.'), value);
  else if (is.length==1 && value!==undefined)
      return obj[is[0]] = value;
  else if (is.length==0)
      return obj;
  else
      return setVariableWithKeyValue(obj[is[0]],is.slice(1), value);
}

@Component({
  selector: 'cat-page',
  templateUrl: './screen.component.html',
})

export class AppsScreenComponent implements OnInit, OnDestroy, CanComponentDeactivate {

  @ViewChild('basicInformationForm') basicInfo_form: NgForm;
  @ViewChild('AppIconForm') appicon_form: NgForm;
  @ViewChild('splashScreenForm') splashScreen_form: NgForm;
  @ViewChild('sponsorSplashForm') sponsorSplash_form: NgForm;

  @ViewChild('AddScreenShotForm1') AddScreenShot_form1: NgForm;
  @ViewChild('AddScreenShotForm2') AddScreenShot_form2: NgForm;
  @ViewChild('AddScreenShotForm3') AddScreenShot_form3: NgForm;
  @ViewChild('AddScreenShotForm4') AddScreenShot_form4: NgForm;
  @ViewChild('AddScreenShotForm5') AddScreenShot_form5: NgForm;

  @ViewChild('AddIpadScreenShotForm1') AddIpadScreenShot_form1: NgForm;
  @ViewChild('AddIpadScreenShotForm2') AddIpadScreenShot_form2: NgForm;
  @ViewChild('AddIpadScreenShotForm3') AddIpadScreenShot_form3: NgForm;
  @ViewChild('AddIpadScreenShotForm4') AddIpadScreenShot_form4: NgForm;
  @ViewChild('AddIpadScreenShotForm5') AddIpadScreenShot_form5: NgForm;

  // @ViewChild('AddIpadScreenShotForm') AddIpadScreenShot_form: NgForm;
  @ViewChild('appIconSave') appIconSaveRef: ElementRef;
  @ViewChild('appSplashSave') appSplashSaveRef: ElementRef;
  @ViewChild('appSponsorSplashSave') appSponsorSplashSaveRef: ElementRef;
  @ViewChild('appInformationSave') appInformationSaveRef: ElementRef;
  @ViewChild('screenShotSave') screenShotSaveSaveRef: ElementRef;
  @ViewChild('iphnSaveOrderBtn') iphnSaveOrderBtnRef: ElementRef;
  @ViewChild('ipadBtnSave') ipadBtnSaveRef: ElementRef;
  @ViewChild('ipadBtnSaveMain') ipadBtnSaveMainRef: ElementRef;



  // dirty state form ref for app icon
  public boolAppIconForm: boolean;
  // dirty state form ref for splash screen
  public boolSplashScreenForm: boolean;
  // dirty state form ref for sponser splash screen
  public boolSponserSplashScreenForm: boolean;
  // dirty state form ref for sponsor splash time
  public boolSponsorSplashTime: boolean;
  // dirty state form ref for screenshot
  public boolScreenShotForm: boolean;
  // dirty state form ref for ipad screenshot
  public boolIpadScreenShotForm: boolean;

  public sponsorsplashform: FormGroup;

  public addscreenshotform1: FormGroup;
  public addscreenshotform2: FormGroup;
  public addscreenshotform3: FormGroup;
  public addscreenshotform4: FormGroup;
  public addscreenshotform5: FormGroup;

  public addipadscreenshotform1: FormGroup;
  public addipadscreenshotform2: FormGroup;
  public addipadscreenshotform3: FormGroup;
  public addipadscreenshotform4: FormGroup;
  public addipadscreenshotform5: FormGroup;

  public addPreviewImg: FormGroup;
  public spscreenform: FormGroup;
  public biform: FormGroup;
  public appiconform: FormGroup;
  public gaform: FormGroup;

  contact_us_able : any;

  fontFamilyVar: any;
  fontSizeVar: any;
  industryData: any = null;
  appNameLengthErrMsg: any;
  appDescLengthErrMsg: any;
  categoryDataFlag: any;
  mobileNumberErrLen: any;
  emailErrCheck: any;
  urlErrCheck: any;
  disableGenralFlag: any;
  marketingUrlErrCheck: any;
  marketing_website: any;
  appLengthCnt: any;
  app_keyword: any;
  appNameSpaceCheck: any;
  promotionalTextSpaceCheck: any;
  appKeywordSpaceCheck: any;
  appDescriptionSpaceCheck: any;
  biformFlag: any;
  flag1 = false;
  event1 : any;

  //rstatus: any;
  public removeScreenShotform = {
    'value': {
      'id': '',
      'add_screenshot': '',
      'order': '',
      'sort_id': ''
    }
  };

  public changeOrderScreenShotform = {
    'value': {
      'id': '',
      'order_data': '',
      'app_id': ''
    }
  };

  public changeOrderIpadScreenShotform = {
    'value': {
      'id': '',
      'order_data': '',
      'app_id': ''
    }
  };

  public removeIpadScreenShotform = {
    'value': {
      'id': '',
      'add_screenshot': '',
      'order': '',
      'sort_id' : '' 
    }
  };

  // public spsplashform: FormGroup;

  currentAppData = [];
  rdata: any;
  storeData = [];
  rstatus = '';
  fileList: FileList;
  ScreenShotFileList = [];
  IPAScreenShotFileList = [];
  app_icon_data = '';
  splash_screen_data = '';
  sponsor_splash_data = '';
  basic_information_data = '';
  google_analytic_data = '';
  add_screenshot_data = [];
  add_ipad_screenshot_data = [];
  splash_screen_section_data = '';
  app_icon_section_data = '';
  sponsor_splash_section_data = '';
  basic_information_section_data = [];
  google_analytic_section_data = [];
  add_screenshot_section_data = [];
  add_ipad_screenshot_section_data = [];
  add_screenshot_list_data = [];
  screenshot_before_buffer = [];
  IPAscreenshot_before_buffer = [];
  add_screenshot_list_ipad_data = [];

  arrayrowconverter = [];
  IPAarrayrowconverter = [];

  industryTypeData: any;
  categoryTypeData: any;
  priceTypeData: any;

  fileName = '';
  is_file = false;
  is_bcImage_file = false;
  is_ssImage_file = false;
  is_assImage_file = false;
  is_as_IpadImage_file = false;
  emptyFileMsg = '';
  is_remove_screenshot_after_submit = false;
  is_remove_ipad_screenshot_after_submit = false;
  imageData: any;
  appImgUrl: any;
  splashImgUrl: any;
  sponsorSplashImgData: any;
  
  downloadButtonFlag: any;
  buttonFlagImgDownload: any;
  buttonFlagIpadImgDownload: any;
  downloadImgButtonFlag: any;
  splashImgUrlFlag: any;
  appIndustryData: any;
  appIconUrl: any;
  priceData: any;
  categoryData: any = null;
  c: any;
  app_industry: any;
  app_category: any;
  app_price: any;
  langData: any;
  defaultLangData: any = null;
  secondryData: any;
  primaryData: any;
  mobileNumberErrCheck: any;
  appCnt: any;
  appDesLengthCnt: any;
  appDesCnt: any;
  appPromCnt: any;
  appPromLengthCnt: any;
  appPromLengthErrMsg: any;
  valueCategoryData: any;
  valueSecondryData: any;
  keywordCount: any;
  selectedFields: any;
  supportUrlErr: any;
  phoneNumberErrFlag: any;
  keywordErrMsg: any;
  appKeywordCnt: number;
  tempappKeywordCnt: number;
  appKeywordLengthCnt = true;
  appKeywordcLengthErrMsg: any;
  lenCount: any;
  mainKeywordLength = 100;
  fileListIcon: any;
  fileListSponsor: any;
  iconSave: any;
  blankSpaceAppName: any;
  blankSpacePramotionalText: any;
  blankSpaceDescriptionText: any;

  bDirtyAppScreen = false;
  bDirtyIPAScreen = false;

  // set basic info

  tagArrayCharlen: number;

  tagKeyCharArr: string[];
  background_image_error = false;
  sponsor_splash_image_error = false;
  app_icon_error = true;
  add_screenshot_image_error = false;
  keywordReqMsgFlag: any;
  is_superadmin: any;

  someting_posted:any;
  processed_image_dropify_array = [];

  upload_limiter: number = 0;
  upload_queue = [];
  processing_queue = [];
  subject: Subject<any>;
  subscription: Subscription;
  old_icon1 = '';
  global_image_dropify1: any;

  putUploadAppDataToQueue(fileData, image_dropify, settingKeys, message) {
      this.subject.next({fileData, image_dropify, settingKeys, message});
  }

  checkUploadAppDataQueue(): Observable<any> {
      return this.subject.asObservable();
  }

  constructor(private commonService: CommonService,
    private fb: FormBuilder,
    private route: Router,
    private http: Http,
    private changeDetectionRef: ChangeDetectorRef,
    private sharedService: SharedService,
    private msgService: MessageService,
    private s3Service: S3Service) {
    this.appKeywordCnt = 100;
    this.tempappKeywordCnt = 100;
    this.lenCount = '';
    this.emailErrCheck = true;
    this.appLengthCnt = false;
    this.appPromLengthCnt = false;
    this.appDesLengthCnt = false;
    this.appKeywordLengthCnt = false;
    this.langData = [];
    this.currentAppData = this.commonService.get_current_app_data();
    // confirm
    console.log("this.currentAppData",this.currentAppData);

    this.is_superadmin = false;
    var currentuser = this.commonService.getCurrentUserInfo();
    
    if (currentuser.email == "admin@theappcompany.com") {
      this.is_superadmin = true; 
    }
    // this.is_superadmin = false; 
    this.app_icon_data = this.currentAppData['basicDetail']['app_icon'];

    this.appImgUrl = this.app_icon_data['app_icon_original_url'];
    if (this.appImgUrl.indexOf('default') !== -1) {
      this.downloadImgButtonFlag = false;
    } else {
      this.downloadImgButtonFlag = true;
    }
    for (let i =0; i< 5; i++) {
      this.arrayrowconverter[i] = i + 1;
      this.IPAarrayrowconverter[i] = i + 1;
    }
    $('html, body').scrollTop(0);

    this.app_icon_section_data = JSON.parse(this.app_icon_data['section_json_data']) || {};
    this.splash_screen_data = this.currentAppData['basicDetail']['splash_screen'];
    this.splashImgUrl = this.splash_screen_data['bc_image_original_url'];
    if (this.splashImgUrl.indexOf('default') != -1) {
      this.splashImgUrlFlag = false;
    } else {
      this.splashImgUrlFlag = true;
    }
    this.splash_screen_section_data = JSON.parse(this.splash_screen_data['section_json_data']);

    this.sponsor_splash_data = this.currentAppData['basicDetail']['sponsor_splash'];
    this.sponsorSplashImgData = this.sponsor_splash_data['sponsorsplash_image_original_url'];

    if (this.sponsorSplashImgData.indexOf('default') != -1) {
      this.downloadButtonFlag = false;
    } else {
      this.downloadButtonFlag = true;
    }
    this.sponsor_splash_section_data = JSON.parse(this.sponsor_splash_data['section_json_data']);

    this.basic_information_data = this.currentAppData['basicDetail']['basic_information'];
    this.basic_information_section_data = JSON.parse(this.basic_information_data['section_json_data']);
    console.log("this.basic_information_section_data",this.basic_information_section_data);
    debugger

    this.google_analytic_data = this.currentAppData['basicDetail']['google_analytic'];
    this.google_analytic_section_data = JSON.parse(this.google_analytic_data['section_json_data']);
    this.add_screenshot_data = this.currentAppData['basicDetail']['add_screenshot'];

    this.msgService.sendMessage(this.currentAppData['basicDetail']['app_icon']['app_icon_thumb_url']);

    if (this.add_screenshot_data['add_screenshot_data'].length == 0) {
      this.buttonFlagImgDownload = true;
    } else {
      this.buttonFlagImgDownload = false;
    }

    this.add_screenshot_section_data = JSON.parse(this.add_screenshot_data['section_json_data']);
    this.add_screenshot_list_data = this.add_screenshot_data['add_screenshot_data'];
    this.screenshot_before_buffer = this.add_screenshot_list_data;

    this.add_ipad_screenshot_data = this.currentAppData['basicDetail']['add_ipad_screenshot'];

    if (this.add_ipad_screenshot_data['add_screenshot_data'].length == 0) {
      this.buttonFlagIpadImgDownload = true;
    } else {
      this.buttonFlagIpadImgDownload = false;
    }

    for (let i = 0; i < 5; i++) {
      if (!this.add_screenshot_data['add_screenshot_data'][i])
      {
        this.add_screenshot_data['add_screenshot_data'][i] = {
          add_screenshot_original_url: ''
        };
      }
      if (!this.add_ipad_screenshot_data['add_screenshot_data'][i])
      {
        this.add_ipad_screenshot_data['add_screenshot_data'][i] = {
          add_screenshot_original_url: ''
        };
      }
    }

    this.add_ipad_screenshot_section_data = JSON.parse(this.add_ipad_screenshot_data['section_json_data']);
    this.add_screenshot_list_ipad_data = this.add_ipad_screenshot_data['add_screenshot_data'];
    this.IPAscreenshot_before_buffer = this.add_screenshot_list_ipad_data;

    const iconData = this.currentAppData['basicDetail']['app_icon'];
    const app_icon = iconData.app_icon_thumb_url;
    if (app_icon) {
      this.appIconUrl = app_icon;
    }

    if (this.currentAppData['app_name']) {
      this.appLengthCnt = true;
      this.appCnt = 29 - this.currentAppData['app_name'].length;
    }

    this.subject = new Subject<any>();

    this.subscription = this.checkUploadAppDataQueue().subscribe(async options => {
      //remove previous one from upload_queue 
      options.id = Math.random();
      let {fileData, image_dropify, settingKeys, message, id} = options;
      
      this.upload_queue = this.upload_queue.filter(queued_data => {
        return queued_data.settingKeys != settingKeys;
      });
      
      // if it's in processing_queue, sign as useless.

      let previous_one_in_processing = this.processing_queue.filter(queued_data => {
        return queued_data.settingKeys == settingKeys;
      });
      if (previous_one_in_processing.length > 0)
      {
        this.processing_queue[this.processing_queue.indexOf(previous_one_in_processing[0])].useless = true;
      }

      this.upload_queue.push(options);
      for(;;) {
        // if($(".dropify-preview .dropify-render .loading").length > 0) {
          // document.getElementById("btnSaveAll").setAttribute('disabled', 'disabled');
        // }
        // if upload_queue not include the options, judge as removed, and finish process.
        if (!this.upload_queue.filter(queued_data => {
          return queued_data.id == id;
        })) {
          break;
        } else if (this.processing_queue.length > 0) {
          await sleep(2000);
          continue;
        }
        else {
          if (this.upload_queue.filter(queued_data => {
            return queued_data.id == id;
          }).length == 0) {
            return;
          }

          this.upload_queue = this.upload_queue.filter(queued_data => {
            return queued_data.id != options.id;
          });
          this.processing_queue.push(options);

          s3Service.uploadAppData(fileData).subscribe(
            res => {
              $(".dropify-render img.loading:first", image_dropify).remove();
              if (!this.processing_queue[this.processing_queue.length - 1].useless) {
                $(".dropify-render img", image_dropify)[0].src = res['data'].Location;
                setVariableWithKeyValue(this, settingKeys, res['data'].Location);

                $.notify({
                  title: '',
                  message: message
                }, {
                    type: 'success'
                });
              } 
            },
            async err => {
              $(".dropify-render img.loading:first", image_dropify).remove();
              if (!this.processing_queue[this.processing_queue.length - 1].useless) {
                $('.dropify-clear', image_dropify).click();
                setVariableWithKeyValue(this, settingKeys, defaultImage);
                $.notify({
                  title: '',
                  message: "Image Upload failed as bad network connection."
                }, {
                    type: 'danger'
                });
              }
              await sleep(1000);
            },
            () => {
              if (!this.processing_queue[this.processing_queue.length - 1].useless) {
                $('.dropify-clear', image_dropify).show();
              } else {
                console.log("Processed as useless");
              }
              this.processing_queue.shift();
            }
          );
          break;
        }
      }
      return;
    });

  }

  ngOnInit() {
    $("#mySidenav").css('display','');
    let iFrameUrl = `${environment.baseUrl}/projects/${this.currentAppData['app_code']}/index.html`;
    
    $('.loadingbar').css('display','');
    $('#native_preview').attr('src',iFrameUrl);
    $('.frame_prev').on('load',function(){
      $('.loadingbar').css('display','none');
      console.log('load the iframe')
    });

    this.commonService.getData('getLangData').subscribe(res => {
      // console.log('js data: ');
      res = JSON.parse(res);
      for (let i = 0; i < res.length; ++i) {
        this.langData.push(res[i]['name']);
      }
    });

    // current component ref
    const self = this;

    let app_description = '';
    let contact_email = '';
    let default_language = '';

    let official_website = '';
    let copy_right = '';
    let app_price = '';
    let phone_number = '';
    let no_sec_display = '';
    let google_key = '';
    let is_bc_image = false;
    let bcimageInput = null;
    let ssimageInput = null;
    let imageInput = null;
    let app_category = null;
    let app_industry = '';
    let app_promotional = '';
    let app_keywords = '';

    this.processed_image_dropify_array = [];
    this.upload_limiter = 0;

    let bottom_html = "<input type='file' id='fileInput' name='files[]'/ accept='image/*'><canvas id='myCanvas' style='display:none;'></canvas><div id='modal'></div><div id='preview'><div class='buttons'><div class='cancel' style='background-size: 100% 100%;'></div><div class='ok' style='background-size: 100% 100%;'></div></div></div>";
    if (typeof($('#preview').html()) == 'undefined') {
      $('body').append(bottom_html);
    }

    $('#app_icon').on('change',function(){
      $('.app-icon-file-dropify').simpleCropper(1024,1024);
    }).on('changed', event => {

      setTimeout(() => { 
        this.event1 = event;
        const image_dropify = $(event.target).closest('.app-icon-file-dropify');
        this.global_image_dropify1 = image_dropify;

        
        let base64File = image_dropify.converter2Base64();

        if (!base64File || this.processed_image_dropify_array.includes(image_dropify[0].id))
          return;
        this.processed_image_dropify_array.push(image_dropify[0].id);

        const fileName = this.currentAppData['app_code']+"/setting/app_icon" + Math.random() + ".png";

        let old_app_icon = '';
        if (this.app_icon_section_data != null && this.app_icon_section_data['app_icon']) {
          let currentOldAppIcon = this.app_icon_section_data['app_icon'];
          let indexSubStr = currentOldAppIcon.indexOf(this.currentAppData['app_code']+"/setting/app_icon");
          if( indexSubStr >= 0){
            old_app_icon = currentOldAppIcon.substr(indexSubStr,currentOldAppIcon.length);
          }
        }
        this.old_icon1 = old_app_icon;
        console.log(this.old_icon1 ,"----asdfasdfasdfasdfadsf----",fileName);
        const fileData = { 
          'image':base64File,
          'name':fileName,
          'old_file_name': old_app_icon
        };

        
        let referenceNode = $(".dropify-render img", image_dropify)[0];
        referenceNode.parentNode.insertBefore(loadingImageCreate("/assets/images/loading.gif"), referenceNode.nextSibling);

        $('.dropify-clear', image_dropify).hide();

        this.putUploadAppDataToQueue(fileData, image_dropify, 'app_icon_section_data.app_icon', 'App Icon uploaded');
        // this.s3Service.uploadAppData(fileData)
        //   .subscribe(
        //     res => {
        //       $(".dropify-render img", image_dropify)[0].src = res['data'].Location;
        //       $(".dropify-render img.loading", image_dropify).remove();
        //       this.app_icon_section_data['app_icon'] = res['data'].Location;
        //       $.notify({
        //         title: '',
        //         message: "App Icon uploaded"
        //       }, {
        //           type: 'success'
        //       });
        //     },
        //     err => {
              
        //       $(".dropify-render img.loading", image_dropify).remove();
        //       $('.dropify-clear', image_dropify).click();
        //       this.app_icon_section_data['app_icon'] = defaultImage;
              
        //       $.notify({
        //         title: '',
        //         message: "Image Upload failed as bad network connection."
        //       }, {
        //           type: 'danger'
        //       });
        //       sleep(1000);
        //     }, 
        //     () => {
        //       $('.dropify-clear', image_dropify).show();
              
        //     }
        //   )
        }, 1000
      );
      
    });

    $('#background_image').on('change',function(){
      $('.background-image-dropify').simpleCropper(1242,2208);
    }).on('changed', event => {
      setTimeout(() => {
        const image_dropify = $(event.target).closest('.background-image-dropify');
        let base64File = image_dropify.converter2Base64();
        if (!base64File || this.processed_image_dropify_array.includes(image_dropify[0].id))
          return;
        this.processed_image_dropify_array.push(image_dropify[0].id);
          
        const fileName = this.currentAppData['app_code']+"/setting/spalshscreen" + Math.random() + ".png";

        const fileData = { 
          'image':base64File,
          'name':fileName,
          'old_file_name': this.splashImgUrl ? this.splashImgUrl.split("amazonaws.com/")[1] : ''
        };
        let referenceNode = $(".dropify-render img", image_dropify)[0];
        referenceNode.parentNode.insertBefore(loadingImageCreate("/assets/images/loading.gif"), referenceNode.nextSibling);
        $('.dropify-clear', image_dropify).hide();

        this.putUploadAppDataToQueue(fileData, image_dropify, 'splashImgUrl', 'Splash screen uploaded');

        // this.s3Service.uploadAppData(fileData)
        //   .subscribe(
        //     res => {
        //       $(".dropify-render img", image_dropify)[0].src = res['data'].Location;
        //       $(".dropify-render img.loading", image_dropify).remove();
        //       this.splashImgUrl = res['data'].Location;
        //       $.notify({
        //         title: '',
        //         message: "Splash screen uploaded"
        //       }, {
        //           type: 'success'
        //       });
        //     },
        //     err => {
              
        //       $(".dropify-render img.loading", image_dropify).remove();
        //       $('.dropify-clear', image_dropify).click();
        //       this.splashImgUrl = defaultImage;

        //       $.notify({
        //         title: '',
        //         message: "Image Upload failed as bad network connection."
        //       }, {
        //           type: 'danger'
        //       });
        //     }, () => {
        //       $('.dropify-clear', image_dropify).show();
              
        //     }
        //   )
        }, 1000
      );      
        
    });

    $('#sponsor_splash_image').on('change',function(){
      $('.sponsor-splash-image-dropify').simpleCropper(1242,2208);
    }).on('changed', event => {
      setTimeout(() => {
        
        const image_dropify = $(event.target).closest('.sponsor-splash-image-dropify');
        let base64File = image_dropify.converter2Base64();
        if (!base64File || this.processed_image_dropify_array.includes(image_dropify[0].id))
          return;
        this.processed_image_dropify_array.push(image_dropify[0].id);
        
        const fileName = this.currentAppData['app_code']+"/setting/sponsor_splashscreen" + Math.random() + ".png";

        const fileData = { 
          'image':base64File,
          'name':fileName,
          'old_file_name': this.sponsorSplashImgData ? this.sponsorSplashImgData.split("amazonaws.com/")[1] : ''
        };
        let referenceNode = $(".dropify-render img", image_dropify)[0];
        referenceNode.parentNode.insertBefore(loadingImageCreate("/assets/images/loading.gif"), referenceNode.nextSibling);
        $('.dropify-clear', image_dropify).hide();

        this.putUploadAppDataToQueue(fileData, image_dropify, 'sponsorSplashImgData', 'Sponser splash screen uploaded');
        }, 1000
      );
        
    });
    debugger;
    for(let i = 1; i < 6; i++) {
      $(`#add_screenshot_image${i}`).on('change',function(){
        $(`.add-screenshot-dropify${i}`).simpleCropper(1242,2208);
      }).on('changed', event => {
        setTimeout(() => {
          debugger;
          const image_dropify = $(event.target).closest(`.add-screenshot-dropify${i}`);
          let base64File = image_dropify.converter2Base64();

          if (!base64File || this.processed_image_dropify_array.includes(image_dropify[0].id))
            return;
          this.processed_image_dropify_array.push(image_dropify[0].id);

          const fileName = this.currentAppData['app_code']+"/setting/screenshot"+i+Math.random() + ".png";

          const fileData = { 
            'image':base64File,
            'name':fileName,
            'old_file_name': this.add_screenshot_data['add_screenshot_data'][i -1]['add_screenshot_original_url'] ? this.add_screenshot_data['add_screenshot_data'][i -1]['add_screenshot_original_url'].split("amazonaws.com/")[1] : ''
          };

          let referenceNode = $(".dropify-render img", image_dropify)[0];
          referenceNode.parentNode.insertBefore(loadingImageCreate("/assets/images/loading.gif"), referenceNode.nextSibling);
          $('.dropify-clear', image_dropify).hide();

          this.putUploadAppDataToQueue(fileData, image_dropify, `add_screenshot_data.add_screenshot_data.${i-1}.add_screenshot_original_url`, `Screenshot ${i} uploaded`);
          }, 1000
        );        
      });

      $(`#add_ipad_screenshot${i}`).on('change',function(){
        $(`.add-ipad-screenshot-dropify${i}`).simpleCropper(2048,2737);
      }).on('changed', event => {
        setTimeout(() => {
          
          const image_dropify = $(event.target).closest(`.add-ipad-screenshot-dropify${i}`);
          let base64File = image_dropify.converter2Base64();

          if (!base64File || this.processed_image_dropify_array.includes(image_dropify[0].id))
            return;
          this.processed_image_dropify_array.push(image_dropify[0].id);
          
          const fileName = this.currentAppData['app_code']+"/setting/ipa_screenshot"+i + Math.random() + ".png";

          const fileData = { 
            'image':base64File,
            'name':fileName,
            'old_file_name': this.add_ipad_screenshot_data['add_screenshot_data'][i-1]['add_screenshot_original_url'] ? this.add_ipad_screenshot_data['add_screenshot_data'][i-1]['add_screenshot_original_url'].split("amazonaws.com/")[1] : ''
          };
          
          let referenceNode = $(".dropify-render img", image_dropify)[0];
          referenceNode.parentNode.insertBefore(loadingImageCreate("/assets/images/loading.gif"), referenceNode.nextSibling);
          $('.dropify-clear', image_dropify).hide();

          this.putUploadAppDataToQueue(fileData, image_dropify, `add_ipad_screenshot_data.add_screenshot_data.${i-1}.add_screenshot_original_url`, `Ipad Screenshot ${i} uploaded`);
          }, 1000
        );
      });

    }

    // $(function () {

    $('.message_body').summernote({
      height: 200
      // placeholder: 'write here...'
    });

    $('[data-toggle=tooltip]').tooltip();

    setTimeout(() => {
      // $('.nav-item a[href="#splashscreen"]').tab('show');

      $('#app_keywords_tag').tagEditor({
        placeholder: 'Enter App Keywords',
        onChange: (field, editor, tags) => {
          const keywordValue = tags.length;
          this.lenCount = 100 - keywordValue;
          //  self.keywordFun(this.lenCount);
          // self.keywordCharCount(tags);
          self.countkeywordLen(tags);
          this.biform.markAsDirty();
          this.biform.controls['app_keywords'].markAsTouched();

          if (keywordValue == 0) {
            this.biform.controls['app_keywords'].setErrors({'required': true});
          } else {
            this.biform.controls['app_keywords'].setErrors(null);
          }
          this.changeDetectionRef.detectChanges();
        },
        beforeTagSave: (field, editor, tags, tag, val) => {
          this.addKeywordCount(val);
        },
        beforeTagDelete: (field, editor, tags, val) => {
          self.countkeywordLen(tags);
          // this.removeKeywordCount(val);
        }
      });

      jQuery('.select2-tags').on(
        'change',
        (e) => {
          // this._selectedFields = jQuery(e.target).val();

          // this._keywordCount = 100 - this._selectedFields.length;
          // console.log(this._keywordCount);
          // this._countFun();

        });

      $('#appicon .dropify-clear').html('X');
      // $('#us-phone-mask-input').value();
      jQuery('.select2-tags').select2();
      jQuery('.select2-tags').on(
        'change',
        (e) => {
          // this._selectedFields = jQuery(e.target).val();

          // this._keywordCount = 100 - this._selectedFields.length;
          // console.log(this._keywordCount);
          // this._countFun();

        });

      $('#us-phone-mask-input').mask('(000) 000-0000', { placeholder: '(___) ___-____' });
      $('.selectpicker').selectpicker('refresh');
      $('.select2-tags').select2({
        tags: true,
        tokenSeparators: [',', ' ']
      });

    }, 500);
    // });


    this.commonService.getData('getBasicInfo').subscribe(res => {
      res = JSON.parse(res);
      this.industryTypeData = res['industry_type'];
      this.categoryTypeData = res['category_type'];
      this.priceTypeData = res['price_type'];

      // this.app_industry = this.industryTypeData[0]['name'];
      // this.app_category = this.categoryTypeData[0]['name'];
      // this.app_price = this.priceTypeData[0]['name'];
    });


    // if(this.valueCategoryData == undefined){
    // this.valueCategoryData = false;
    // }
    // if(this.appPromLengthErrMsg == undefined){
    // this.appPromLengthErrMsg = true;
    // }
    // if(this.appDescLengthErrMsg == undefined){
    // this.appDescLengthErrMsg = true;
    // }
    // if(this.appKeywordcLengthErrMsg == undefined){
    // this.appKeywordcLengthErrMsg = true;
    // }
    // if(this.supportUrlErr == undefined){
    // this.supportUrlErr = true;
    // }
    // if(this.phoneNumberErrFlag == undefined){
    // this.phoneNumberErrFlag = true
    // }

    if (this.basic_information_section_data != null) {
      this.valueCategoryData = true;
      this.appPromLengthErrMsg = false;
      this.appDescLengthErrMsg = false;
      this.appKeywordcLengthErrMsg = false;
      this.supportUrlErr = false;
      this.phoneNumberErrFlag = false;
      this.disableGenralFlag = true;

      if (this.basic_information_section_data.hasOwnProperty('app_description')) {
        app_description = this.basic_information_section_data['app_description'];
        this.appDesLengthCnt = true;
        this.appDesCnt = 4000 - app_description.length;
      }
      if (this.basic_information_section_data.hasOwnProperty('contact_email')) {
        contact_email = this.basic_information_section_data['contact_email'];
      }
      if (this.basic_information_section_data.hasOwnProperty('default_language')) {
        default_language = this.basic_information_section_data['default_language'];
        this.defaultLangData = this.basic_information_section_data['default_language'];
      }
      if (this.basic_information_section_data.hasOwnProperty('app_keywords')) {
        app_keywords = this.basic_information_section_data['app_keywords'];
        this.appKeywordLengthCnt = true;
        this.appKeywordCnt = 100 - app_keywords.length;
        const splitApp_keywords = app_keywords.split(',');
        this.countkeywordLen(splitApp_keywords);
        // console.log(app_keywords.split(','));
        // var a = [];
        // this.c = this.basic_information_section_data['app_keyword'].split(',');
      }
      if (this.basic_information_section_data.hasOwnProperty('official_website')) {
        official_website = this.basic_information_section_data['official_website'];
      }
      if (this.basic_information_section_data.hasOwnProperty('copy_right')) {
        copy_right = this.basic_information_section_data['copy_right'];
      }
      if (this.basic_information_section_data.hasOwnProperty('app_price')) {
        app_price = this.basic_information_section_data['app_price'];
        this.priceData = app_price;
        this.app_price = app_price;
      }
      if (this.basic_information_section_data.hasOwnProperty('phone_number')) {
        phone_number = this.basic_information_section_data['phone_number'];
      }

      if (this.basic_information_section_data.hasOwnProperty('app_category')) {
        app_category = this.basic_information_section_data['app_category'];
        this.categoryData = app_category;
        this.app_category = app_category;
      }
      if (this.basic_information_section_data.hasOwnProperty('app_industry')) {
        app_industry = this.basic_information_section_data['app_industry'];
        this.industryData = app_industry;
        this.app_industry = this.basic_information_section_data['app_industry'];
      }
      if (this.basic_information_section_data.hasOwnProperty('marketing_website')) {
        this.marketing_website = this.basic_information_section_data['marketing_website'];
      }
      if (this.basic_information_section_data.hasOwnProperty('app_promotional')) {
        app_promotional = this.basic_information_section_data['app_promotional'];
        this.appPromLengthCnt = true;
        this.appPromCnt = 170 - app_promotional.length;
      }
    } else {
      const userData = JSON.parse(localStorage.getItem('currentUser'));
      contact_email = userData.email;
      copy_right = '© 2017 The APP Company';
      this.defaultLangData = "English (U.S.)";
      default_language = "English (U.S.)";
    }


    if (this.sponsor_splash_section_data != null) {
      if (this.sponsor_splash_section_data.hasOwnProperty('no_sec_display')) {
        no_sec_display = this.sponsor_splash_section_data['no_sec_display'];
      }
      ssimageInput = this.sponsor_splash_section_data['sponsorsplash_image'];
    }

    if (this.google_analytic_section_data != null) {
      if (this.google_analytic_section_data.hasOwnProperty('google_key')) {
        google_key = this.google_analytic_section_data['google_key'];
      }
    }

    if (this.splash_screen_section_data != null) {
      const is_bc_image_string = this.splash_screen_section_data['is_bc_image'];
      if (is_bc_image_string == 'true') {
        is_bc_image = true;
      }
      bcimageInput = this.splash_screen_section_data['bc_image'];
    }

    if (this.app_icon_section_data != null) {
      imageInput = this.app_icon_section_data['app_icon'];
    }

    //  Background Image in Dropify

    let drBCImageEvent = $('#background_image').dropify({
      defaultFile: self.splash_screen_data['bc_image_original_url'],
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
        errorsContainer: '<div class="dropify-errors-container">The image uploaded is not (1242x2208), please upload your image in these dimensions</div>'
      }
    });

    drBCImageEvent.on('dropify.beforeClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      self.removeBCFileChange(event);
    });

    drBCImageEvent.on('dropify.afterClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      $(".dropify-render", element.preview[0])[0].appendChild(defaultImageCreate(defaultImage));
      element.preview.show();
    });

    drBCImageEvent.on('dropify.error.minWidth', function (event, element) {
      self.removeBCFileError(event);
      // reset dirty state
      self.boolSplashScreenForm = false;

    });
    drBCImageEvent.on('dropify.error.maxWidth', function (event, element) {
      self.removeBCFileError(event);
      // reset dirty state
      self.boolSplashScreenForm = false;
    });
    drBCImageEvent.on('dropify.error.minHeight', function (event, element) {
      self.removeBCFileError(event);
      // reset dirty state
      self.boolSplashScreenForm = false;
    });
    drBCImageEvent.on('dropify.error.maxHeight', function (event, element) {
      self.removeBCFileError(event);
      // reset dirty state
      self.boolSplashScreenForm = false;
    });

    //  Sponsor Splash Image in Dropify

    const drssImageEvent = $('#sponsor_splash_image').dropify({
      defaultFile: self.sponsor_splash_data['sponsorsplash_image_original_url'],
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
        errorsContainer: '<div class="dropify-errors-container">The image uploaded is not (1242x2208), please upload your image in these dimensions</div>'
      }
    });

    drssImageEvent.on('dropify.beforeClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      self.removeSSFileChange(event);
    });

    drssImageEvent.on('dropify.afterClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      $(".dropify-render", element.preview[0])[0].appendChild(defaultImageCreate(defaultImage));
      element.preview.show();
    });

    drssImageEvent.on('dropify.error.minWidth', function (event, element) {
      self.removeSSFileError(event);
      // reset dirty state

      self.boolSponserSplashScreenForm = false;
    });
    drssImageEvent.on('dropify.error.maxWidth', function (event, element) {
      self.removeSSFileError(event);
      // reset dirty state
      self.boolSponserSplashScreenForm = false;
    });
    drssImageEvent.on('dropify.error.minHeight', function (event, element) {
      self.removeSSFileError(event);
      // reset dirty state
      self.boolSponserSplashScreenForm = false;
    });
    drssImageEvent.on('dropify.error.maxHeight', function (event, element) {
      self.removeSSFileError(event);
      // reset dirty state
      self.boolSponserSplashScreenForm = false;
    });

    //  App Icon

    // 'error':   'Ooops, something wrong happended.'
    const drEvent = $('#app_icon').dropify({
      defaultFile: self.app_icon_data['app_icon_original_url'],
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
        errorsContainer: '<div class="dropify-errors-container">The image uploaded is not (1024x1024), please upload your image in these dimensions</div>'
      }
    });

    drEvent.on('dropify.beforeClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      self.removeFileChange(event);
    });

    drEvent.on('dropify.afterClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      $(".dropify-render", element.preview[0])[0].appendChild(defaultImageCreate(defaultImage));
      element.preview.show();
    });

    drEvent.on('dropify.error.minWidth', function (event, element) {
      self.removeAppIconError(event);
      // reset bool app icon dirty state if not valid
      self.boolAppIconForm = false;
    });

    drEvent.on('dropify.error.maxWidth', function (event, element) {
      self.removeAppIconError(event);
      // reset bool app icon dirty state if not valid
      self.boolAppIconForm = false;
    });

    drEvent.on('dropify.error.minHeight', function (event, element) {
      self.removeAppIconError(event);
      // reset bool app icon dirty state if not valid
      self.boolAppIconForm = false;
    });

    drEvent.on('dropify.error.maxHeight', function (event, element) {
      self.removeAppIconError(event);
      // reset bool app icon dirty state if not valid
      self.boolAppIconForm = false;
    });

    // Add Screenshot Image
    const screenshotDropifySetting1 = {
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
        errorsContainer: '<div class="dropify-errors-container">The image uploaded is not (1242x2208), please upload your image in these dimensions</div>'
      }
    };
    var asssort1 = self.getSortIDByArray(self.add_screenshot_section_data,1); 
    if(asssort1 != -1){
      screenshotDropifySetting1['defaultFile'] = self.add_screenshot_list_data[asssort1]['add_screenshot_thumb_url'];
    }

    const drassImageEvent1 = $('#add_screenshot_image1').dropify(screenshotDropifySetting1);

    drassImageEvent1.on('dropify.beforeClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      self.removeASSFileChange(event,1);
    });
    drassImageEvent1.on('dropify.afterClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      $(".dropify-render", element.preview[0])[0].appendChild(defaultImageCreate(defaultImage));
      element.preview.show();
    });

    drassImageEvent1.on('dropify.error.minWidth', function (event, element) {
      self.removeASSFileError(event);
      // reset dirty
      self.boolScreenShotForm = false;
    });
    drassImageEvent1.on('dropify.error.maxWidth', function (event, element) {
      self.removeASSFileError(event);
      // reset dirty
      self.boolScreenShotForm = false;
    });
    drassImageEvent1.on('dropify.error.minHeight', function (event, element) {
      self.removeASSFileError(event);
      // reset dirty
      self.boolScreenShotForm = false;
    });
    drassImageEvent1.on('dropify.error.maxHeight', function (event, element) {
      self.removeASSFileError(event);
      // reset dirty
      self.boolScreenShotForm = false;
    });

    const screenshotDropifySetting2 = {
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
        errorsContainer: '<div class="dropify-errors-container">The image uploaded is not (1242x2208), please upload your image in these dimensions</div>'
      }
    }

    var asssort2 = self.getSortIDByArray(self.add_screenshot_section_data,2); 
    if(asssort2 != -1){
      screenshotDropifySetting2['defaultFile'] = self.add_screenshot_list_data[asssort2]['add_screenshot_thumb_url'];
    }

    const drassImageEvent2 = $('#add_screenshot_image2').dropify(screenshotDropifySetting2);

    drassImageEvent2.on('dropify.beforeClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      self.removeASSFileChange(event,2);
    });
    drassImageEvent2.on('dropify.afterClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      $(".dropify-render", element.preview[0])[0].appendChild(defaultImageCreate(defaultImage));
      element.preview.show();
    });

    drassImageEvent2.on('dropify.error.minWidth', function (event, element) {
      self.removeASSFileError(event);
      // reset dirty
      self.boolScreenShotForm = false;
    });
    drassImageEvent2.on('dropify.error.maxWidth', function (event, element) {
      self.removeASSFileError(event);
      // reset dirty
      self.boolScreenShotForm = false;
    });
    drassImageEvent2.on('dropify.error.minHeight', function (event, element) {
      self.removeASSFileError(event);
      // reset dirty
      self.boolScreenShotForm = false;
    });
    drassImageEvent2.on('dropify.error.maxHeight', function (event, element) {
      self.removeASSFileError(event);
      // reset dirty
      self.boolScreenShotForm = false;
    });

    const screenshotDropifySetting3 = {
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
        errorsContainer: '<div class="dropify-errors-container">The image uploaded is not (1242x2208), please upload your image in these dimensions</div>'
      }
    }

    var asssort3 = self.getSortIDByArray(self.add_screenshot_section_data,3); 
    if(asssort3 != -1){
      screenshotDropifySetting3['defaultFile'] = self.add_screenshot_list_data[asssort3]['add_screenshot_thumb_url'];
    }

    const drassImageEvent3 = $('#add_screenshot_image3').dropify(screenshotDropifySetting3);

    drassImageEvent3.on('dropify.beforeClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      self.removeASSFileChange(event,3);
    });
    drassImageEvent3.on('dropify.afterClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      $(".dropify-render", element.preview[0])[0].appendChild(defaultImageCreate(defaultImage));
      element.preview.show();
    });

    drassImageEvent3.on('dropify.error.minWidth', function (event, element) {
      self.removeASSFileError(event);
      // reset dirty
      self.boolScreenShotForm = false;
    });
    drassImageEvent3.on('dropify.error.maxWidth', function (event, element) {
      self.removeASSFileError(event);
      // reset dirty
      self.boolScreenShotForm = false;
    });
    drassImageEvent3.on('dropify.error.minHeight', function (event, element) {
      self.removeASSFileError(event);
      // reset dirty
      self.boolScreenShotForm = false;
    });
    drassImageEvent3.on('dropify.error.maxHeight', function (event, element) {
      self.removeASSFileError(event);
      // reset dirty
      self.boolScreenShotForm = false;
    });

    const screenshotDropifySetting4 = {
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
        errorsContainer: '<div class="dropify-errors-container">The image uploaded is not (1242x2208), please upload your image in these dimensions</div>'
      }
    }

    var asssort4 = self.getSortIDByArray(self.add_screenshot_section_data,4); 
    if(asssort4 != -1){
      screenshotDropifySetting4['defaultFile'] = self.add_screenshot_list_data[asssort4]['add_screenshot_thumb_url'];
    }

    const drassImageEvent4 = $('#add_screenshot_image4').dropify(screenshotDropifySetting4);

    drassImageEvent4.on('dropify.beforeClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      self.removeASSFileChange(event,4);
    });
    drassImageEvent4.on('dropify.afterClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      $(".dropify-render", element.preview[0])[0].appendChild(defaultImageCreate(defaultImage));
      element.preview.show();
    });

    drassImageEvent4.on('dropify.error.minWidth', function (event, element) {
      self.removeASSFileError(event);
      // reset dirty
      self.boolScreenShotForm = false;
    });
    drassImageEvent4.on('dropify.error.maxWidth', function (event, element) {
      self.removeASSFileError(event);
      // reset dirty
      self.boolScreenShotForm = false;
    });
    drassImageEvent4.on('dropify.error.minHeight', function (event, element) {
      self.removeASSFileError(event);
      // reset dirty
      self.boolScreenShotForm = false;
    });
    drassImageEvent4.on('dropify.error.maxHeight', function (event, element) {
      self.removeASSFileError(event);
      // reset dirty
      self.boolScreenShotForm = false;
    });

    const screenshotDropifySetting5 = {
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
        errorsContainer: '<div class="dropify-errors-container">The image uploaded is not (1242x2208), please upload your image in these dimensions</div>'
      }
    }

    var asssort5 = self.getSortIDByArray(self.add_screenshot_section_data,5); 
    if(asssort5 != -1){
      screenshotDropifySetting5['defaultFile'] = self.add_screenshot_list_data[asssort5]['add_screenshot_thumb_url'];
    }

    const drassImageEvent5 = $('#add_screenshot_image5').dropify(screenshotDropifySetting5);

    drassImageEvent5.on('dropify.beforeClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      self.removeASSFileChange(event,5);
    });
    drassImageEvent5.on('dropify.afterClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      $(".dropify-render", element.preview[0])[0].appendChild(defaultImageCreate(defaultImage));
      element.preview.show();
    });

    drassImageEvent5.on('dropify.error.minWidth', function (event, element) {
      self.removeASSFileError(event);
      // reset dirty
      self.boolScreenShotForm = false;
    });
    drassImageEvent5.on('dropify.error.maxWidth', function (event, element) {
      self.removeASSFileError(event);
      // reset dirty
      self.boolScreenShotForm = false;
    });
    drassImageEvent5.on('dropify.error.minHeight', function (event, element) {
      self.removeASSFileError(event);
      // reset dirty
      self.boolScreenShotForm = false;
    });
    drassImageEvent5.on('dropify.error.maxHeight', function (event, element) {
      self.removeASSFileError(event);
      // reset dirty
      self.boolScreenShotForm = false;
    });


    // Add Ipad Screenshot Image
    const IPAscreenshotDropifySetting1 = {
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
        errorsContainer: '<div class="dropify-errors-container">The image uploaded is not (2048x2732), please upload your image in these dimensions</div>'
      }
    }

    var IPAasssort1 = self.getSortIDByArray(self.add_ipad_screenshot_section_data,1); 
    if(IPAasssort1 != -1){
      IPAscreenshotDropifySetting1['defaultFile'] = self.add_screenshot_list_ipad_data[IPAasssort1]['add_screenshot_thumb_url'];
    }

    let drIpadImageEvent1 = $('#add_ipad_screenshot1').dropify(IPAscreenshotDropifySetting1);

    drIpadImageEvent1.on('dropify.beforeClear', function (event, element) {
      self.removeAssIpadImgChange(event,1);
    });
    drIpadImageEvent1.on('dropify.afterClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      $(".dropify-render", element.preview[0])[0].appendChild(defaultImageCreate(defaultImage));
      element.preview.show();
    });

    drIpadImageEvent1.on('dropify.error.minWidth', function (event, element) {
      self.removeAssIpadError(event);
      // reset dirty
      self.boolIpadScreenShotForm = false;
    });
    drIpadImageEvent1.on('dropify.error.maxWidth', function (event, element) {
      self.removeAssIpadError(event);
      // reset dirty
      self.boolIpadScreenShotForm = false;
    });
    drIpadImageEvent1.on('dropify.error.minHeight', function (event, element) {
      self.removeAssIpadError(event);
      // reset dirty
      self.boolIpadScreenShotForm = false;
    });
    drIpadImageEvent1.on('dropify.error.maxHeight', function (event, element) {
      self.removeAssIpadError(event);
      // reset dirty
      self.boolIpadScreenShotForm = false;
    });

    const IPAscreenshotDropifySetting2 = {
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
        errorsContainer: '<div class="dropify-errors-container">The image uploaded is not (2048x2732), please upload your image in these dimensions</div>'
      }
    }

    var IPAasssort2 = self.getSortIDByArray(self.add_ipad_screenshot_section_data,2); 
    if(IPAasssort2 != -1){
      IPAscreenshotDropifySetting2['defaultFile'] = self.add_screenshot_list_ipad_data[IPAasssort2]['add_screenshot_thumb_url'];
    }

    let drIpadImageEvent2 = $('#add_ipad_screenshot2').dropify(IPAscreenshotDropifySetting2);

    drIpadImageEvent2.on('dropify.beforeClear', function (event, element) {
      self.removeAssIpadImgChange(event,2);
    });
    drIpadImageEvent2.on('dropify.afterClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      $(".dropify-render", element.preview[0])[0].appendChild(defaultImageCreate(defaultImage));
      element.preview.show();
    });

    drIpadImageEvent2.on('dropify.error.minWidth', function (event, element) {
      self.removeAssIpadError(event);
      // reset dirty
      self.boolIpadScreenShotForm = false;
    });
    drIpadImageEvent2.on('dropify.error.maxWidth', function (event, element) {
      self.removeAssIpadError(event);
      // reset dirty
      self.boolIpadScreenShotForm = false;
    });
    drIpadImageEvent2.on('dropify.error.minHeight', function (event, element) {
      self.removeAssIpadError(event);
      // reset dirty
      self.boolIpadScreenShotForm = false;
    });
    drIpadImageEvent2.on('dropify.error.maxHeight', function (event, element) {
      self.removeAssIpadError(event);
      // reset dirty
      self.boolIpadScreenShotForm = false;
    });

    const IPAscreenshotDropifySetting3 = {
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
        errorsContainer: '<div class="dropify-errors-container">The image uploaded is not (2048x2732), please upload your image in these dimensions</div>'
      }
    }

    var IPAasssort3 = self.getSortIDByArray(self.add_ipad_screenshot_section_data,3); 
    if(IPAasssort3 != -1){
      IPAscreenshotDropifySetting3['defaultFile'] = self.add_screenshot_list_ipad_data[IPAasssort3]['add_screenshot_thumb_url'];
    }
    let drIpadImageEvent3 = $('#add_ipad_screenshot3').dropify(IPAscreenshotDropifySetting3);

    drIpadImageEvent3.on('dropify.beforeClear', function (event, element) {
      self.removeAssIpadImgChange(event,3);
    });
    drIpadImageEvent3.on('dropify.afterClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      $(".dropify-render", element.preview[0])[0].appendChild(defaultImageCreate(defaultImage));
      element.preview.show();
    });

    drIpadImageEvent3.on('dropify.error.minWidth', function (event, element) {
      self.removeAssIpadError(event);
      // reset dirty
      self.boolIpadScreenShotForm = false;
    });
    drIpadImageEvent3.on('dropify.error.maxWidth', function (event, element) {
      self.removeAssIpadError(event);
      // reset dirty
      self.boolIpadScreenShotForm = false;
    });
    drIpadImageEvent3.on('dropify.error.minHeight', function (event, element) {
      self.removeAssIpadError(event);
      // reset dirty
      self.boolIpadScreenShotForm = false;
    });
    drIpadImageEvent3.on('dropify.error.maxHeight', function (event, element) {
      self.removeAssIpadError(event);
      // reset dirty
      self.boolIpadScreenShotForm = false;
    });

    const IPAscreenshotDropifySetting4 = {
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
        errorsContainer: '<div class="dropify-errors-container">The image uploaded is not (2048x2732), please upload your image in these dimensions</div>'
      }
    }

    var IPAasssort4 = self.getSortIDByArray(self.add_ipad_screenshot_section_data,4); 
    if(IPAasssort4 != -1){
      IPAscreenshotDropifySetting4['defaultFile'] = self.add_screenshot_list_ipad_data[IPAasssort4]['add_screenshot_thumb_url'];
    }

    let drIpadImageEvent4 = $('#add_ipad_screenshot4').dropify(IPAscreenshotDropifySetting4);

    drIpadImageEvent4.on('dropify.beforeClear', function (event, element) {
      self.removeAssIpadImgChange(event,4);
    });
    drIpadImageEvent4.on('dropify.afterClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      $(".dropify-render", element.preview[0])[0].appendChild(defaultImageCreate(defaultImage));
      element.preview.show();
    });

    drIpadImageEvent4.on('dropify.error.minWidth', function (event, element) {
      self.removeAssIpadError(event);
      // reset dirty
      self.boolIpadScreenShotForm = false;
    });
    drIpadImageEvent4.on('dropify.error.maxWidth', function (event, element) {
      self.removeAssIpadError(event);
      // reset dirty
      self.boolIpadScreenShotForm = false;
    });
    drIpadImageEvent4.on('dropify.error.minHeight', function (event, element) {
      self.removeAssIpadError(event);
      // reset dirty
      self.boolIpadScreenShotForm = false;
    });
    drIpadImageEvent4.on('dropify.error.maxHeight', function (event, element) {
      self.removeAssIpadError(event);
      // reset dirty
      self.boolIpadScreenShotForm = false;
    });

    const IPAscreenshotDropifySetting5 = {
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
        errorsContainer: '<div class="dropify-errors-container">The image uploaded is not (2048x2732), please upload your image in these dimensions</div>'
      }
    }

    var IPAasssort5 = self.getSortIDByArray(self.add_ipad_screenshot_section_data,5); 
    if(IPAasssort5 != -1){
      IPAscreenshotDropifySetting5['defaultFile'] = self.add_screenshot_list_ipad_data[IPAasssort5]['add_screenshot_thumb_url'];
    }

    let drIpadImageEvent5 = $('#add_ipad_screenshot5').dropify(IPAscreenshotDropifySetting5);

    drIpadImageEvent5.on('dropify.beforeClear', function (event, element) {
      self.removeAssIpadImgChange(event,5);
    });
    drIpadImageEvent5.on('dropify.afterClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      $(".dropify-render", element.preview[0])[0].appendChild(defaultImageCreate(defaultImage));
      element.preview.show();
    });

    drIpadImageEvent5.on('dropify.error.minWidth', function (event, element) {
      self.removeAssIpadError(event);
      // reset dirty
      self.boolIpadScreenShotForm = false;
    });
    drIpadImageEvent5.on('dropify.error.maxWidth', function (event, element) {
      self.removeAssIpadError(event);
      // reset dirty
      self.boolIpadScreenShotForm = false;
    });
    drIpadImageEvent5.on('dropify.error.minHeight', function (event, element) {
      self.removeAssIpadError(event);
      // reset dirty
      self.boolIpadScreenShotForm = false;
    });
    drIpadImageEvent5.on('dropify.error.maxHeight', function (event, element) {
      self.removeAssIpadError(event);
      // reset dirty
      self.boolIpadScreenShotForm = false;
    });


    // FormController  Manage

    this.appiconform = this.fb.group({
      imageInput: [imageInput, Validators.required]
    });

    this.spscreenform = this.fb.group({
      is_bc_image: [is_bc_image, Validators.compose([Validators.required])],
      bcimageInput: [bcimageInput, Validators.required]
    });

    this.sponsorsplashform = this.fb.group({
      no_sec_display: [no_sec_display, Validators.compose([Validators.required, Validators.maxLength(4)])],
      ssimageInput: [ssimageInput, Validators.required]
    });

    this.gaform = this.fb.group({
      google_key: [google_key, Validators.compose([Validators.required])]
    });


    this.biform = this.fb.group({
      app_name: [this.currentAppData['app_name'], Validators.compose([Validators.required])],
      app_promotional: [app_promotional, Validators.compose([Validators.required])],
      app_description: [app_description, Validators.compose([Validators.required])],
      default_language: [default_language, ''],
      app_category: [this.app_category, ''],
      app_industry: [this.app_industry, ''],
      app_keywords: [app_keywords, Validators.compose([Validators.required])],
      // app_keywords: [app_keywords, ''],
      official_website: [official_website, Validators.compose([Validators.required])],
      marketing_website: [this.marketing_website, ''],
      
      copy_right: [copy_right, Validators.compose([Validators.required])],
      app_price: [this.app_price, ''],
      phone_number: [phone_number, ''],
      contact_email: [contact_email, '']
    });

    this.addscreenshotform1 = this.fb.group({
      assimageInput: [null, Validators.required]
    });

    this.addscreenshotform2 = this.fb.group({
      assimageInput: [null, Validators.required]
    });

    this.addscreenshotform3 = this.fb.group({
      assimageInput: [null, Validators.required]
    });

    this.addscreenshotform4 = this.fb.group({
      assimageInput: [null, Validators.required]
    });

    this.addscreenshotform5 = this.fb.group({
      assimageInput: [null, Validators.required]
    });

    this.addipadscreenshotform1 = this.fb.group({
      asIpadImageInput: [null, Validators.required]
    });
    this.addipadscreenshotform2 = this.fb.group({
      asIpadImageInput: [null, Validators.required]
    });
    this.addipadscreenshotform3 = this.fb.group({
      asIpadImageInput: [null, Validators.required]
    });
    this.addipadscreenshotform4 = this.fb.group({
      asIpadImageInput: [null, Validators.required]
    });
    this.addipadscreenshotform5 = this.fb.group({
      asIpadImageInput: [null, Validators.required]
    });

    this.addPreviewImg = this.fb.group({
      previewImg: [null, Validators.required]
    });

    $(function () {
      $('.draggable-element').arrangeable('destroy');
      $('.draggable-element').arrangeable();
    });

  }

  ngOnDestroy() {
    this.upload_queue = [];
    if (this.processing_queue[0]) {
      this.processing_queue[0].useless = true;
    }
    this.subscription.unsubscribe();
  }

  /**
  * canDeactivate implementation
  */
  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    /**
  * if basic information form have unsaved changes guard active
  */
    // console.log('biform', this.biform.dirty, 'boolappicon', this.boolAppIconForm
    //   , 'boolsplashscreen', this.boolSplashScreenForm,
    //   'boolsponsersplash', this.boolSponserSplashScreenForm
    //   , 'boolscreenshot', this.boolScreenShotForm,
    //   'boolipadscreenshot', this.boolIpadScreenShotForm);
    if (this.biform.dirty
      || this.boolAppIconForm
      || this.boolSplashScreenForm
      || this.boolSponserSplashScreenForm
      || this.boolSponsorSplashTime
      || this.boolScreenShotForm
      || this.boolIpadScreenShotForm || $(".dropify-preview .dropify-render .loading").length > 0) {
      return new Promise<boolean>((resolve, reject) => {
        swal({
          title: 'You didn`t save!',
          text: 'Unsaved changes or Image uploading is detected, would you like to continue?',
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
              resolve(true);
            } else {
              this.save_all();
              resolve(true);
            }
          });
      });
    } else {
      return true;
    }


    // return true;
  }

  removeFileChange(event) {
    this.fileList = event.target.files;
    this.is_file = true;
    this.appiconform.controls['imageInput'].setValue(null);

    this.boolAppIconForm = true;
    this.app_icon_section_data['app_icon'] = '';
  }

  removeAppIconError(event) {
    this.fileList = event.target.files;
    this.appiconform.controls['imageInput'].setValue(null);
  }

  removeBCFileChange(event) {
    this.fileList = event.target.files;
    this.is_bcImage_file = true;
    this.spscreenform.controls['bcimageInput'].setValue(null);

    this.boolSplashScreenForm = true;
    this.splashImgUrl = '';
  }

  removeBCFileError(event) {
    this.fileList = event.target.files;
    this.spscreenform.controls['bcimageInput'].setValue(null);
  }

  bcfileChange(event) {

    this.fileList = null;
    this.fileList = event.target.files;
    const file = event.target.files[0];
    this.spscreenform.controls['bcimageInput'].setValue(event.target.files[0].name);
    this.is_bcImage_file = false;
    // set dirty bool
    this.boolSplashScreenForm = true;
  }

  removeSSFileChange(event) {
    this.fileList = event.target.files;
    this.is_ssImage_file = true;
    this.sponsorsplashform.controls['ssimageInput'].setValue(null);

    this.boolSponserSplashScreenForm = true;
    this.sponsorSplashImgData = '';
  }

  removeSSFileError(event) {
    this.fileList = event.target.files;
    this.sponsorsplashform.controls['ssimageInput'].setValue(null);
  }

  sponsorfileChange(event) {
    this.fileListSponsor = event.target.files;
    // let file = event.target.files[0];ScreenShotFileList
    this.sponsorsplashform.controls['ssimageInput'].setValue(event.target.files[0].name);
    this.is_ssImage_file = false;
    // set dirty
    this.boolSponserSplashScreenForm = true;
  }

  //time kkk
  sponsorsplashtimeChange(event) {
    //this.sponsorsplashform.controls['no_sec_display'].setValue(event.target.files[0].name);
    this.boolSponsorSplashTime = true;
  }

  appIconFileChange(event) {
    // if ($(".dropify-preview .dropify-render .loading").length > 0) {
    //       document.getElementById("btnSaveAll").setAttribute('disabled', 'disabled');
    // }

    this.fileListIcon = event.target.files;
    // let file = event.target.files[0];
    this.appiconform.controls['imageInput'].setValue(event.target.files[0].name);
    this.is_file = false;

    // set dirty state true
    this.boolAppIconForm = true;
  }

  addScreenShotFileChanges(event,id) {
    let selID = $(event.target).attr('id');
    selID = "addscreenshotform"+selID.substr(-1);
    // this.fileList = null;
    this.ScreenShotFileList[id] = event.target.files[0];
    this.bDirtyAppScreen = true;
    // let file = event.target.files[0];
    // this.addscreenshotform1.controls['assimageInput'].setValue(event.target.files[0].name);
    this[selID].controls['assimageInput'].setValue(event.target.files[0].name);
    // this.is_assImage_file = false;
    // this.is_remove_screenshot_after_submit = false;
    // set dirty state true
    this.boolScreenShotForm = true;
  }

  addPadScreenShotFileChanges(event,id) {
    let selID = $(event.target).attr('id');
    selID = "addipadscreenshotform"+selID.substr(-1);
    // this.fileList = null;
    this.ScreenShotFileList[id] = event.target.files[0];
    this.bDirtyAppScreen = true;
    // let file = event.target.files[0];
    // this.addscreenshotform1.controls['assimageInput'].setValue(event.target.files[0].name);
    this[selID].controls['asIpadImageInput'].setValue(event.target.files[0].name);
    // this.is_assImage_file = false;
    // this.is_remove_screenshot_after_submit = false;
    // set dirty state true
    this.boolScreenShotForm = true;
  }

  removeASSFileChange(event,id) {
    
    let selID = $(event.target).attr('id');
    selID = "addscreenshotform"+selID.substr(-1);
    this.removeASSById(id);

    this.fileList = event.target.files;
    if (!this.is_remove_screenshot_after_submit) {
      this.is_assImage_file = true;
    }
    this[selID].controls['assimageInput'].setValue(null);

    this.boolScreenShotForm = true;
    this.add_screenshot_data['add_screenshot_data'][id -1]['add_screenshot_original_url'] = '';
  }
  removeASSFileError(event) {
    this.fileList = event.target.files;
    // this.addscreenshotform1.controls['assimageInput'].setValue(null);
  }

  removeAssIpadImgChange(event,id) {
    let selID = $(event.target).attr('id');
    selID = "addipadscreenshotform"+selID.substr(-1);
    this.removeIPAASSById(id);
    this.fileList = event.target.files;
    if (!this.is_remove_ipad_screenshot_after_submit) {
      this.is_as_IpadImage_file = true;
    }

    this.boolIpadScreenShotForm = true;
    this.add_ipad_screenshot_data['add_screenshot_data'][id-1]['add_screenshot_original_url'] = '';
  }

  removeAssIpadError(event) {
    this.fileList = event.target.files;
    this.addipadscreenshotform1.controls['asIpadImageInput'].setValue(null);
  }

  splashScreenSubmit(form: NgForm) {
    this.splashScreenSubmitObservable(form).subscribe(d => {

    }, err => {

    }, () => {

    })
  }


  splashScreenSubmitObservable(form: NgForm): Observable<string> {
    return Observable.create((observer) => {

      this.splashImgUrlFlag = true;
      NProgress.start();
      
      let formData = new FormData();       
      formData.append('splash_screen_url', this.splashImgUrl);
      formData.append('id', this.splash_screen_data['id']);
      formData.append('app_id', this.commonService.get_current_app_data().id);
      formData.append('is_bc_image', form.value.is_bc_image);

      this.commonService.filePostData(formData, 'splashscreen').subscribe(res => {
        this.someting_posted = true;
        NProgress.done();                
        this.rdata = JSON.parse(res);
        this.rstatus = this.rdata['status'];

        if (this.rstatus === '1') {
          this.currentAppData['basicDetail']['splash_screen']['bc_image_thumb_url'] = this.rdata['data']['bc_image_thumb_url'];
          this.currentAppData['basicDetail']['splash_screen']['bc_image_original_url'] = this.rdata['data']['bc_image_original_url'];
          this.currentAppData['basicDetail']['splash_screen']['section_json_data'] = this.rdata['data']['section_json_data'];
          this.splash_screen_data = this.currentAppData['basicDetail']['splash_screen'];
          this.splash_screen_section_data = JSON.parse(this.splash_screen_data['section_json_data']);

          localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
          this.sharedService.emit_appdata(this.currentAppData);

          const success_message = this.rdata['message'];
          
          this.boolSplashScreenForm = false;
          observer.next(success_message);
          if (this.rdata.hasOwnProperty('change') && this.rdata.change === true) {
            this.contact_us_able = true;                  
          }
          observer.complete();
          // this.appSplashSaveRef.nativeElement.disabled = false;
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
          observer.error(error_message);
          // this.appSplashSaveRef.nativeElement.disabled = false;
        }
        this.FastGenerateJson();
      }, err => {
        NProgress.done();
        observer.error('Cannot register Splash Screen to DB');
      });
    })
  }
  sponsorSplashSubmit(form: NgForm) {
    this.sponsorSplashSubmitObservable(form).subscribe(d => {

    }, err => {

    }, () => {

    })
  }
//kkk
  sponsorSplashSubmitObservable(form: NgForm): Observable<string> {
    return Observable.create((observer) => {

      this.downloadButtonFlag = true;
      NProgress.start();
      // this.appSponsorSplashSaveRef.nativeElement.disabled = true;
      
      let formData: FormData = new FormData();
      formData.append('no_sec_display', form.value.no_sec_display);
      formData.append('id', this.sponsor_splash_data['id']);          
      formData.append('sponsorsplash_image', this.sponsorSplashImgData);

      this.commonService.filePostData(formData, 'sponsorsplash').subscribe(res => {
        this.someting_posted = true;
        NProgress.done();
        this.rdata = JSON.parse(res);
        this.rstatus = this.rdata['status'];

        if (this.rstatus == '1') {
          this.currentAppData['basicDetail']['sponsor_splash']['sponsorsplash_image_thumb_url'] = this.rdata['data']['sponsorsplash_image_thumb_url'];
          this.currentAppData['basicDetail']['sponsor_splash']['sponsorsplash_image_original_url'] = this.rdata['data']['sponsorsplash_image_original_url'];
          this.currentAppData['basicDetail']['sponsor_splash']['section_json_data'] = this.rdata['data']['section_json_data'];
          this.sponsor_splash_data = this.currentAppData['basicDetail']['sponsor_splash'];
          this.sponsor_splash_section_data = JSON.parse(this.sponsor_splash_data['section_json_data']);

          localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
          this.sharedService.emit_appdata(this.currentAppData);

          const success_message = this.rdata['message'];
          this.boolSponserSplashScreenForm = false;
          this.boolSponsorSplashTime = false;
          observer.next(success_message);
          observer.complete();
          // this.appSponsorSplashSaveRef.nativeElement.disabled = false;
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
          observer.error(error_message);
          // this.appSponsorSplashSaveRef.nativeElement.disabled = false;
        }
        this.FastGenerateJson();  
      });     
    })
  }

  FastGenerateJson() {
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

      'id': JSON.stringify(appData.id),
      'appName': JSON.stringify(appData.app_name)

    }, 'fastGenerateJson').subscribe(res => {
        NProgress.done();
        this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if ( this.rstatus === '1') {
        
      } else {

      }

    }, err => {
      
    }, () => {
        // console.log('obsever completed');
        console.log("launch emulator");
        
        let iFrameUrl = `${environment.baseUrl}/projects/${this.currentAppData['app_code']}/index.html`;
        //let iFrameUrl = 'http://192.168.100.112:1204/projects/'+this.currentAppData['app_code']+'/index.html';
        $('#native_preview').attr('src',iFrameUrl);
        
    //     let currentAppData = this.commonService.get_current_app_data();
    
    })
  }
  downloadImg() {
    var img_buffer = [];
    if (this.add_screenshot_data['add_screenshot_data'].length == 0) {
      this.buttonFlagImgDownload = true;
    } else {
      this.buttonFlagImgDownload = false;
      for (let i = 0; i < this.add_screenshot_data['add_screenshot_data'].length; ++i) {
        // this.screenShortData.push(this.add_screenshot_data['add_screenshot_data'][i]['add_screenshot_original_url']);
        img_buffer[i] = this.add_screenshot_data['add_screenshot_data'][i]['add_screenshot_original_url'];
      }
    }
    var download_count = 0;
    var interval = setInterval(() => {
      const link = document.createElement('a');
      link.setAttribute('download', null);
      link.style.display = 'none';
      link.setAttribute('href', img_buffer[download_count]);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      download_count++;
      if (download_count == img_buffer.length) {
        clearInterval(interval);
      }
    },3000);
  }

  removeASSById(id) {

    if (this.add_screenshot_section_data != null && typeof(this.add_screenshot_section_data) != 'undefined' && typeof(this.add_screenshot_section_data.length) != 'undefined' ) {
      for (let i = 0; i < this.add_screenshot_section_data.length; i++) {
        let datas  = this.add_screenshot_section_data[i];
        if (typeof(datas.sort_id)  == 'undefined') {
          var datak = this.add_screenshot_list_data[i];
          this.removeScreenShot(datak);
        }
      }

      var sort_id = this.getSortIDByArray(this.add_screenshot_section_data,id); 
      if (sort_id != -1) {
        var data = this.add_screenshot_list_data[sort_id];
        this.removeScreenShot(data);
      }
    }
     
  }

  removeIPAASSById(id) {
    if (this.add_ipad_screenshot_section_data != null && typeof(this.add_ipad_screenshot_section_data) != 'undefined' && typeof(this.add_ipad_screenshot_section_data.length) != 'undefined') {
      for (let i = 0; i < this.add_ipad_screenshot_section_data.length; i++) {
        let datas  = this.add_ipad_screenshot_section_data[i];
        if (typeof(datas.sort_id)  == 'undefined') {
          var datak = this.add_screenshot_list_ipad_data[i];
          this.removeIpadScreenShot(datak);
        }
      }
      var sort_id = this.getSortIDByArray(this.add_ipad_screenshot_section_data,id); 
      if (sort_id != -1) {
        var data = this.add_screenshot_list_ipad_data[sort_id];
        this.removeIpadScreenShot(data);
      }
    }
  }

  downloadIpadImg() {

    var img_buffer = [];
    if (this.add_ipad_screenshot_data['add_screenshot_data'].length == 0) {
      this.buttonFlagIpadImgDownload = true;
    } else {
      this.buttonFlagIpadImgDownload = false;
      for (let i = 0; i < this.add_ipad_screenshot_data['add_screenshot_data'].length; ++i) {
        //this.screenShortIpadData.push(this.add_ipad_screenshot_data['add_screenshot_data'][i]['add_screenshot_original_url']);
        img_buffer[i] = this.add_ipad_screenshot_data['add_screenshot_data'][i]['add_screenshot_original_url']
      }
    }
    var download_count = 0;
    var interval = setInterval(() => {
      const link = document.createElement('a');
      link.setAttribute('download', null);
      link.style.display = 'none';
      link.setAttribute('href', img_buffer[download_count]);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      download_count++;
      if (download_count == img_buffer.length) {
        clearInterval(interval);
      }
    },3000);
  }

  basicInformatoinSubmit(form: NgForm) {
    this.basicInformatoinSubmitObservable(form).subscribe(d => {

    }, err => {

    })
  }
  /**
   * Observable fun while submit basicinformation data
   * @param form
   * @returns Observable<string>
   */
  basicInformatoinSubmitObservable(form: NgForm) {
    return Observable.create((observer) => {
      // this.appInformationSaveRef.nativeElement.disabled = true;
      console.log("controls",this.biform.controls);
      debugger
      this.app_category = this.categoryTypeData[0]['name'];
      this.app_price = this.priceTypeData[0]['name'];

      form.value.id = this.basic_information_data['id'];
      form.value.app_id = this.currentAppData['id'];
      form.value.app_keywords = $('#app_keywords_tag').val();

      if (form.value.app_industry) {

      } else {
        form.value.app_industry = this.app_industry;
      }

      if (form.value.app_category) {
      } else {
        form.value.app_category = this.app_category;
      }

      if (form.value.app_price) {

      } else {
        form.value.app_price = this.app_price;
      }

      if (form.value.default_language) {

      } else {
        form.value.default_language = this.langData[0];
      }

      // if((this.appNameLengthErrMsg == false || this.appNameLengthErrMsg == undefined)
      // && (this.appDescLengthErrMsg == false || this.appDescLengthErrMsg == undefined)
      // && (this.appPromLengthErrMsg == false || this.appPromLengthErrMsg == undefined)
      // && (this.categoryDataFlag == false || this.categoryDataFlag == undefined)
      // && (this.mobileNumberErrLen == false || this.mobileNumberErrLen == undefined)
      // && (this.emailErrCheck == true || this.emailErrCheck == undefined)
      // && (this.urlErrCheck == true || this.urlErrCheck == undefined)
      // && (this.marketingUrlErrCheck == true || this.marketingUrlErrCheck == undefined)
      // && this.valueCategoryData == true
      // )
      // {
      // this.disableGenralFlag = true;
      // }else{
      // this.disableGenralFlag = false;
      // }

      if (this.valueCategoryData === undefined) {
        this.valueCategoryData = false;
        // observer.error('Category required');
      }
      if (this.appPromLengthErrMsg === undefined) {
        this.appPromLengthErrMsg = true;
        // observer.error('Promotional Text required');
      }
      if (this.appDescLengthErrMsg === undefined) {
        this.appDescLengthErrMsg = true;
        // observer.error('App Description required');
      }
      if (this.appKeywordcLengthErrMsg === undefined) {
        this.appKeywordcLengthErrMsg = true;
        // observer.error('Keywords required');
      }
      if (this.supportUrlErr === undefined) {
        this.supportUrlErr = true;
        // observer.error('Support URL required');
      }
      if (this.phoneNumberErrFlag === undefined) {
        this.phoneNumberErrFlag = true;
        // observer.error('Phone Number required');
      }

      // app_keywords  && (this.appKeywordcLengthErrMsg == false || this.appKeywordcLengthErrMsg == undefined)


      if (this.tempappKeywordCnt === 100) {
        this.keywordReqMsgFlag = true;
        // observer.error('Keywords Count is on Maximum.');
      } else {
        this.keywordReqMsgFlag = false;
      }

      const controls = this.biform.controls;
      console.log("controls",controls);
      let invalid = [];
      for (const name in controls) {
          if (controls[name].invalid) {
              invalid.push(name);
          }
      }

      // if (this.biform.valid) {
      if (invalid.length < 1) {

        if ((this.appNameLengthErrMsg == false || this.appNameLengthErrMsg == undefined)
          && (this.appNameSpaceCheck == false || this.appNameSpaceCheck == undefined)
          && (this.promotionalTextSpaceCheck == false || this.promotionalTextSpaceCheck == undefined)
          && (this.appKeywordSpaceCheck == false || this.appKeywordSpaceCheck == undefined)
          && (this.appDescriptionSpaceCheck == false || this.appDescriptionSpaceCheck == undefined)
          && (this.appDescLengthErrMsg == false || this.appDescLengthErrMsg == undefined)
          && (this.appPromLengthErrMsg == false || this.appPromLengthErrMsg == undefined)
          && (this.categoryDataFlag == false || this.categoryDataFlag == undefined)
          && (this.mobileNumberErrLen == false || this.mobileNumberErrLen == undefined)
          && (this.emailErrCheck == true || this.emailErrCheck == undefined)
          && (this.urlErrCheck == true || this.urlErrCheck == undefined)
          && (this.marketingUrlErrCheck == true || this.marketingUrlErrCheck == undefined)
          && this.valueCategoryData == true
          && this.keywordReqMsgFlag == false
        ) {

          this.disableGenralFlag = true;
          NProgress.start();
          this.commonService.postData(form.value, 'basicinformation').subscribe(resBs => {
            
            this.someting_posted = true;
            NProgress.done();

            this.rdata = JSON.parse(resBs);
            this.rstatus = this.rdata['status'];
            if (this.rstatus == '1') {
              this.currentAppData['basicDetail']['basic_information']['section_json_data'] = this.rdata['data']['section_json_data'];
              this.basic_information_data = this.currentAppData['basicDetail']['basic_information'];
              this.basic_information_section_data = JSON.parse(this.basic_information_data['section_json_data']);
              // debugger;
              // localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
              // this.sharedService.emit_appdata(this.currentAppData);

              const postData = {
                'id': this.currentAppData['id']
              };
              this.commonService.postData(postData, 'getsingleappdata').subscribe(res => {
                const resdata = JSON.parse(res);
                const appData = resdata['data'];
                
                localStorage.setItem('currentAppData', JSON.stringify(appData));
                this.sharedService.emit_appdata(appData);
              });

              const success_message = this.rdata['message'];
              this.biform.markAsPristine();
              observer.next(success_message);
              // $(function () {
              //   $.notify({
              //     title: '',
              //     message: success_message
              //   }, {
              //       type: 'success'
              //     });
              // });

              if (this.rdata.hasOwnProperty('change') && this.rdata.change === true) {
                this.contact_us_able = true;
                // swal({
                //   title: 'Please Contact Us',
                //   text: 'These changes require approval from Apple and Google. Please contact us to get this updated for you.',
                //   type: 'warning',
                //   confirmButtonClass: 'btn-success',
                //   confirmButtonText: 'Ok',
                //   closeOnConfirm: true
                // }, (isConfirm) => {
                //   if (isConfirm) {
                //     observer.next('redirect to contact us');
                //     this.route.navigate(['contact-us']);
                //   }
                // });
              }
              // set form as pristine after save it
              form.form.markAsPristine();
              // this.appInformationSaveRef.nativeElement.disabled = false;
            } else {
              const error_message = this.rdata['message'];
              observer.error(error_message);
              // $(function () {
              //   $.notify({
              //     title: '',
              //     message: error_message
              //   }, {
              //       type: 'danger'
              //     });
              // });
              // set form as pristine after save it
              form.form.markAsPristine();
              // this.appInformationSaveRef.nativeElement.disabled = false;
            }
          }, err => {
            observer.error('Basic Information Save failed');
          });

        } else {

          this.disableGenralFlag = false;
          observer.complete('Save Performed');
        }

        if (this.valueCategoryData == undefined) {
          this.valueCategoryData = false;
        }
        if (this.appPromLengthErrMsg == undefined) {
          this.appPromLengthErrMsg = true;
        }
        
      } else {
        this.disableGenralFlag = false;
        // const controls = this.biform.controls;
        // const invalid = [];
        // for (const name in controls) {
        //     if (controls[name].invalid) {
        //         invalid.push(name);
        //     }
        // }
        
        console.log(JSON.stringify(invalid));
        // observer.error('Invalid form control(s) exist');
        observer.next("");
      }

      
    })

  }

  onSubmitAppIcon(form: NgForm) {
    this.onSubmitAppIconObservable().subscribe(d => {

    }, err => {

    }, () => {

    })

  }

  onSubmitAppIconObservable(): Observable<string> {
    return Observable.create((observer) => {

      this.downloadImgButtonFlag = true;
      NProgress.start();
            
      const formData: FormData = new FormData();
      formData.append('app_icon', this.app_icon_section_data['app_icon']);
      formData.append('id', this.app_icon_data['id']);
      formData.append('app_id', this.commonService.get_current_app_data().id);                          
      this.commonService.filePostData(formData, 'appicon').subscribe(res => {
        this.someting_posted = true;
        NProgress.done();

        this.rdata = JSON.parse(res);
        this.rstatus = this.rdata['status'];
        if (this.rstatus == '1') {
          this.currentAppData['basicDetail']['app_icon']['app_icon_thumb_url'] = this.rdata['data']['app_icon_thumb_url'];
          this.currentAppData['basicDetail']['app_icon']['app_icon_original_url'] = this.rdata['data']['app_icon_original_url'];
          this.currentAppData['basicDetail']['app_icon']['section_json_data'] = this.rdata['data']['section_json_data'];
          this.app_icon_data = this.currentAppData['basicDetail']['app_icon'];
          this.app_icon_section_data = JSON.parse(this.app_icon_data['section_json_data']);

          localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
          this.sharedService.emit_appdata(this.currentAppData);

          const success_message = this.rdata['message'];

          this.msgService.sendMessage(this.currentAppData['basicDetail']['app_icon']['app_icon_thumb_url']);

          this.boolAppIconForm = false;
          observer.next(success_message);
          if (this.rdata.hasOwnProperty('change') && this.rdata.change === true) {
            this.contact_us_able = true;
          }
          const iconData = this.currentAppData['basicDetail']['app_icon'];
          const app_icon = iconData.app_icon_thumb_url;
          if (app_icon) {
            this.appIconUrl = app_icon;
          }
          observer.complete();
          // this.appIconSaveRef.nativeElement.disabled = false;
        } else {
          const error_message = this.rdata['message'];
          
          observer.error(error_message);
          // this.appIconSaveRef.nativeElement.disabled = false;
        }
      }, err => {
        NProgress.done();
        observer.error('Cannot register App Icon to DB');
      });  
    })
  }

  onSubmitAddScreenShotObservable(id,order) {

    return Observable.create(async (observer) => {

      this.buttonFlagImgDownload = false;
      NProgress.start();
      // this.screenShotSaveSaveRef.nativeElement.disabled = true;
      const self = this;
      const formData: FormData = new FormData();

      if (self.ScreenShotFileList[id] != null) {
        self.ScreenShotFileList[id] = null;
      }
          
      formData.append('sort_id', String(id));
      formData.append('order', String(order));
      formData.append('id', this.add_screenshot_data['id']);              
      formData.append('app_id', this.commonService.get_current_app_data().id);
      formData.append('screenshot_url', this.add_screenshot_data['add_screenshot_data'][id -1]['add_screenshot_original_url']);
      
      console.log(`sort_id: ${id}, order: ${order}, id: ${this.add_screenshot_data['id']}, app_id: ${this.commonService.get_current_app_data().id}, screenshot_url: ${this.add_screenshot_data['add_screenshot_data'][id -1]['add_screenshot_original_url']}`);

      await sleep(1000 * (order - 1));
      console.log(`save screenshot ${order}`);
      this.commonService.filePostData(formData, 'addscreenshot').subscribe(res => {
        this.someting_posted = true;
        NProgress.done();
        this.rdata = JSON.parse(res);
        this.rstatus = this.rdata['status'];
        if (this.rstatus == '1') {
          this.currentAppData['basicDetail']['add_screenshot']['section_json_data'] = this.rdata['data']['section_json_data'];
          this.currentAppData['basicDetail']['add_screenshot']['add_screenshot_data'] = this.rdata['data']['add_screenshot_data'];
          this.currentAppData['basicDetail']['add_screenshot']['order'] = this.rdata['data']['order'];

          this.add_screenshot_data = this.currentAppData['basicDetail']['add_screenshot'];
          this.add_screenshot_section_data = JSON.parse(this.add_screenshot_data['section_json_data']);
          this.add_screenshot_list_data = this.add_screenshot_data['add_screenshot_data'];

          localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
          this.sharedService.emit_appdata(this.currentAppData);

          const success_message = this.rdata['message'];
          
          $('.draggable-element').arrangeable('destroy');
          $('.draggable-element').arrangeable();
          self.is_remove_screenshot_after_submit = true;
          $('#add_screenshot_group .dropify-clear').click();
          
          this.boolScreenShotForm = false;
          observer.next(success_message);
          observer.complete();
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
          observer.error(error_message);
        }
        // this.screenShotSaveSaveRef.nativeElement.disabled = false;
      }, err => {
        const error_message = 'Cannot save Screenshot to DB';
        $(function () {
          $.notify({
            title: '',
            message: error_message
          }, {
              type: 'danger'
            });
        });
        observer.error(error_message);
      });
    })

  }

  googleAnalyticOnSubmit(form: NgForm) {
    this.googleAnalyticOnSubmitObservable(form).subscribe(d => {

    }, err => {

    }, () => { })
  }

  googleAnalyticOnSubmitObservable(form: NgForm) {
    return Observable.create((observer) => {
      NProgress.start();
      form.value.id = this.google_analytic_data['id'];
      this.commonService.postData(form.value, 'googleanalytic').subscribe(res => {
        this.someting_posted = true;
        NProgress.done();
        this.rdata = JSON.parse(res);
        this.rstatus = this.rdata['status'];
        if (this.rstatus == '1') {
          this.currentAppData['basicDetail']['google_analytic']['section_json_data'] = this.rdata['data']['section_json_data'];
          this.google_analytic_data = this.currentAppData['basicDetail']['google_analytic'];
          this.google_analytic_section_data = JSON.parse(this.basic_information_data['section_json_data']);

          localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
          this.sharedService.emit_appdata(this.currentAppData);

          observer.complete();
          const success_message = this.rdata['message'];
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
      });
    })
  }

  removeScreenShot(data) {
    const self = this;
    this.removeScreenShotform.value.add_screenshot = data.add_screenshot;
    this.removeScreenShotform.value.order = data.order;
    this.removeScreenShotform.value.sort_id = data.sort_id;
    this.removeScreenShotform.value.id = this.add_screenshot_data['id'];
    NProgress.start();

    this.commonService.postData(this.removeScreenShotform.value, 'removescreenshot').subscribe(res => {
      this.someting_posted = true;
      NProgress.done();
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if (this.rstatus == '1') {
          this.currentAppData['basicDetail']['add_screenshot']['section_json_data'] = this.rdata['data']['section_json_data'];
          this.currentAppData['basicDetail']['add_screenshot']['add_screenshot_data'] = this.rdata['data']['add_screenshot_data'];
          this.currentAppData['basicDetail']['add_screenshot']['order'] = this.rdata['data']['order'];
          this.add_screenshot_data = this.currentAppData['basicDetail']['add_screenshot'];
          this.add_screenshot_section_data = JSON.parse(this.add_screenshot_data['section_json_data']);
          this.add_screenshot_list_data = this.add_screenshot_data['add_screenshot_data'];

          localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
          this.sharedService.emit_appdata(this.currentAppData);

          $.notify({
            title: '',
            message: "Screenshot removed success"
          }, {
              type: 'success'
          });
        $(function () {
          $('.draggable-element').arrangeable('destroy');
          $('.draggable-element').arrangeable();
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
    });
  }
  
  onSubmitAddIpadScreenShotObservable(id,order): Observable<string> {
    
    return Observable.create(async (observer) => {
      this.buttonFlagIpadImgDownload = false;
      NProgress.start();
      // this.ipadBtnSaveMainRef.nativeElement.disabled = true;
      const self = this;

      const formData: FormData = new FormData();
      if (this.IPAScreenShotFileList[id] != null) {
        this.IPAScreenShotFileList[id] = null;
      }

      formData.append('sort_id', String(id));
      formData.append('order', String(order));
      formData.append('id', this.add_ipad_screenshot_data['id']);              
      formData.append('app_id', this.commonService.get_current_app_data().id);
      formData.append('screenshot_url', this.add_ipad_screenshot_data['add_screenshot_data'][id-1]['add_screenshot_original_url']);

      await sleep(1000 * order);
      this.commonService.filePostData(formData, 'addipadscreenshot').subscribe(res => {
        this.someting_posted = true;
        NProgress.done();
        this.rdata = JSON.parse(res);
        this.rstatus = this.rdata['status'];
        if (this.rstatus == '1') {
          this.currentAppData['basicDetail']['add_ipad_screenshot']['section_json_data'] = this.rdata['data']['section_json_data'];
          this.currentAppData['basicDetail']['add_ipad_screenshot']['add_screenshot_data'] = this.rdata['data']['add_screenshot_data'];
          this.currentAppData['basicDetail']['add_ipad_screenshot']['order'] = this.rdata['data']['order'];

          this.add_ipad_screenshot_data = this.currentAppData['basicDetail']['add_ipad_screenshot'];
          this.add_ipad_screenshot_section_data = JSON.parse(this.add_ipad_screenshot_data['section_json_data']);
          this.add_screenshot_list_ipad_data = this.add_ipad_screenshot_data['add_screenshot_data'];

          localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
          this.sharedService.emit_appdata(this.currentAppData);

          const success_message = this.rdata['message'];
          // reset all dirty state
          this.boolIpadScreenShotForm = false;
          observer.next(success_message);
          // $(function () {
          //   $.notify({
          //     title: '',
          //     message: success_message
          //   }, {
          //       type: 'success'
          //     });
            $('.draggable-element').arrangeable('destroy');
            $('.draggable-element').arrangeable();
            self.is_remove_ipad_screenshot_after_submit = true;
            $('#add_ipad_screenshot_group .dropify-clear').click();
          // })
          if (this.rdata.hasOwnProperty('change') && this.rdata.change === true)
          {
            this.contact_us_able = true;
          //   swal({
          //     title: 'Please Contact Us',
          //     text: 'These changes require approval from Apple and Google. Please contact us to get this updated for you.',
          //     type: 'warning',
          //     confirmButtonClass: 'btn-success',
          //     confirmButtonText: 'Ok',
          //     closeOnConfirm: true
          //   }, (isConfirm) => {
          //     if (isConfirm) {
          //       observer.next('redirect to contact us');
          //       this.route.navigate(['contact-us']);
          //     }
          //   });
          }
          observer.complete();
          // this.ipadBtnSaveMainRef.nativeElement.disabled = false;
        }  else {
          const error_message = this.rdata['message'];
          $(function () {
            $.notify({
              title: '',
              message: error_message
            }, {
                type: 'danger'
              });
          });
          observer.error(error_message);
        }
      }, err => {
        const error_message = 'Failed to add ipad screenshot';
        $(function () {
          $.notify({
            title: '',
            message: error_message
          }, {
              type: 'danger'
            });
        });
        NProgress.done();
        observer.error(error_message);
      });
    })

  }

  removeIpadScreenShot(data) {
    NProgress.start();
    const self = this;
    this.removeIpadScreenShotform.value.add_screenshot = data.add_screenshot;
    this.removeIpadScreenShotform.value.order = data.order;
    this.removeIpadScreenShotform.value.sort_id = data.sort_id;
    this.removeIpadScreenShotform.value.id = this.add_ipad_screenshot_data['id'];

    this.commonService.postData(this.removeIpadScreenShotform.value, 'removeipadscreenshot').subscribe(res => {
      NProgress.done();
      this.someting_posted = true;
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if (this.rstatus == '1') {

        this.currentAppData['basicDetail']['add_ipad_screenshot']['section_json_data'] = this.rdata['data']['section_json_data'];
        this.currentAppData['basicDetail']['add_ipad_screenshot']['add_screenshot_data'] = this.rdata['data']['add_screenshot_data'];
        this.currentAppData['basicDetail']['add_ipad_screenshot']['order'] = this.rdata['data']['order'];

        this.add_ipad_screenshot_data = this.currentAppData['basicDetail']['add_ipad_screenshot'];
        this.add_ipad_screenshot_section_data = JSON.parse(this.add_ipad_screenshot_data['section_json_data']);
        this.add_screenshot_list_ipad_data = this.add_ipad_screenshot_data['add_screenshot_data'];

        localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
        this.sharedService.emit_appdata(this.currentAppData);

        $.notify({
          title: '',
          message: "Screenshot removed success"
        }, {
            type: 'success'
        });
        $(function () {
          $('.draggable-element').arrangeable('destroy');
          $('.draggable-element').arrangeable();
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
    });
  }

  changeAddScreenShotOrder(data) {
    NProgress.start();
    // this.iphnSaveOrderBtnRef.nativeElement.disabled = true;
    this.changeOrderScreenShotform.value.order_data = data;
    this.changeOrderScreenShotform.value.id = this.add_screenshot_data['id'];
    this.changeOrderScreenShotform.value.app_id = this.commonService.get_current_app_data().id;

    this.commonService.postData(this.changeOrderScreenShotform.value, 'changescreenshotorder').subscribe(res => {
      this.someting_posted = true;
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];

      if (this.rstatus == '1') {
        this.currentAppData['basicDetail']['add_screenshot']['section_json_data'] = this.rdata['data']['section_json_data'];
        this.currentAppData['basicDetail']['add_screenshot']['add_screenshot_data'] = this.rdata['data']['add_screenshot_data'];
        this.add_screenshot_data = this.currentAppData['basicDetail']['add_screenshot'];
        this.add_screenshot_section_data = JSON.parse(this.add_screenshot_data['section_json_data']);
        this.add_screenshot_list_data = this.add_screenshot_data['add_screenshot_data'];

        localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
        this.sharedService.emit_appdata(this.currentAppData);

        const success_message = this.rdata['message'];
        NProgress.done();
        // $(function () {
        //   $.notify({
        //     title: '',
        //     message: success_message
        //   }, {
        //       type: 'success'
        //     });
          $('.draggable-element').arrangeable('destroy');
          $('.draggable-element').arrangeable();
        // });
        if (this.rdata.hasOwnProperty('change') && this.rdata.change === true) {
          // swal({
          //   title: 'Please Contact Us',
          //   text: 'These changes require approval from Apple and Google. Please contact us to get this updated for you.',
          //   type: 'warning',
          //   confirmButtonClass: 'btn-success',
          //   confirmButtonText: 'Ok',
          //   closeOnConfirm: true
          // },
          //   (isConfirm) => {
          //     if (isConfirm) {
          //       this.route.navigate(['contact-us']);
          //     }
          //   });
          this.contact_us_able = true;
        }
        // this.iphnSaveOrderBtnRef.nativeElement.disabled = false;
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
        // this.ipadBtnSaveRef.nativeElement.disabled = false;
      }
    });
  }

  changeAddScreenShotOrderObservable(data): Observable<string> {
    return Observable.create( (observer) => {

      NProgress.start();
      // this.iphnSaveOrderBtnRef.nativeElement.disabled = true;
      this.changeOrderScreenShotform.value.order_data = data;
      this.changeOrderScreenShotform.value.id = this.add_screenshot_data['id'];
      this.changeOrderScreenShotform.value.app_id = this.commonService.get_current_app_data().id;

      this.commonService.postData(this.changeOrderScreenShotform.value, 'changescreenshotorder').subscribe(res => {
        this.someting_posted = true;
        this.rdata = JSON.parse(res);
        this.rstatus = this.rdata['status'];

        if (this.rstatus == '1') {
          this.currentAppData['basicDetail']['add_screenshot']['section_json_data'] = this.rdata['data']['section_json_data'];
          this.currentAppData['basicDetail']['add_screenshot']['add_screenshot_data'] = this.rdata['data']['add_screenshot_data'];
          this.add_screenshot_data = this.currentAppData['basicDetail']['add_screenshot'];
          this.add_screenshot_section_data = JSON.parse(this.add_screenshot_data['section_json_data']);
          this.add_screenshot_list_data = this.add_screenshot_data['add_screenshot_data'];

          localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
          this.sharedService.emit_appdata(this.currentAppData);

          const success_message = this.rdata['message'];
          NProgress.done();
          
          $('.draggable-element').arrangeable('destroy');
          $('.draggable-element').arrangeable();
          if (this.rdata.hasOwnProperty('change') && this.rdata.change === true) {
            this.contact_us_able = true;
          }
          observer.next(success_message);
          observer.complete();
        } else {
          NProgress.done();
          const error_message = this.rdata['message'];
          $(function () {
            $.notify({
              title: '',
              message: error_message
            }, {
                type: 'danger'
              });
          });

          observer.error(error_message);
          // this.ipadBtnSaveRef.nativeElement.disabled = false;
        }
      }, err => {
        observer.error('Error happened on changescreenshotorder.');
      });
    });
  }

  changeAddScreenFunc() {
    var self = this;
    let orderArray = [];
    $(function () {
      $('#my_screen .draggable-element').each(function () {
        orderArray.push($(this).attr('attr.data-id'));
      });
      var count_change = 0;
      for (let i = 0; i < orderArray.length; i++) {
        if (orderArray[i] == (i+1)) {
          count_change++;
        }
        $('#my_screen .draggable-element').eq(i).attr('attr.data-id',i + 1);
      }
      if (count_change != orderArray.length) {
        self.changeAddScreenShotOrder(orderArray);
      }
    });
  }

  onChangeAddScreenObservable() {
    var self = this;
    let orderArray = [];
    
    $('#my_screen .draggable-element').each(function () {
      orderArray.push($(this).attr('attr.data-id'));
    });
    var count_change = 0;
    for (let i = 0; i < orderArray.length; i++) {
      if (orderArray[i] == (i+1)) {
        count_change++;
      }
      $('#my_screen .draggable-element').eq(i).attr('attr.data-id',i + 1);
    }
    if (count_change != orderArray.length) {
      return self.changeAddScreenShotOrderObservable(orderArray);
    } else {
      return Observable.of('');
    }
    
  }

  getOrderData() {
     this.changeAddScreenFunc();
  }

  changeAddScreenShotIpadOrder(data) {
    NProgress.start();
    this.changeOrderIpadScreenShotform.value.order_data = data;
    this.changeOrderIpadScreenShotform.value.id = this.add_ipad_screenshot_data['id'];
    this.changeOrderIpadScreenShotform.value.app_id = this.commonService.get_current_app_data().id;
    // this.ipadBtnSaveRef.nativeElement.disabled = true;
    this.commonService.postData(this.changeOrderIpadScreenShotform.value, 'changeipadscreenshotorder').subscribe(res => {
      this.someting_posted = true;
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if (this.rstatus == '1') {
        this.currentAppData['basicDetail']['add_ipad_screenshot']['section_json_data'] = this.rdata['data']['section_json_data'];
        this.currentAppData['basicDetail']['add_ipad_screenshot']['add_screenshot_data'] = this.rdata['data']['add_screenshot_data'];

        this.add_ipad_screenshot_data = this.currentAppData['basicDetail']['add_ipad_screenshot'];
        this.add_ipad_screenshot_section_data = JSON.parse(this.add_ipad_screenshot_data['section_json_data']);
        this.add_screenshot_list_ipad_data = this.add_ipad_screenshot_data['add_screenshot_data'];


        localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
        this.sharedService.emit_appdata(this.currentAppData);

        NProgress.done();
        const success_message = this.rdata['message'];
        // $(function () {
        //   $.notify({
        //     title: '',
        //     message: success_message
        //   }, {
        //       type: 'success'
        //     });
          $('.draggable-element').arrangeable('destroy');
          $('.draggable-element').arrangeable();
        // });

        if (this.rdata.hasOwnProperty('change') && this.rdata.change === true) {
          this.contact_us_able = true;
          // swal({
          //   title: 'Please Contact Us',
          //   text: 'These changes require approval from Apple and Google. Please contact us to get this updated for you.',
          //   type: 'warning',
          //   confirmButtonClass: 'btn-success',
          //   confirmButtonText: 'Ok',
          //   closeOnConfirm: true
          // },
          //   (isConfirm) => {
          //     if (isConfirm) {
          //       this.route.navigate(['contact-us']);
          //     }
          //   });
        }
        // this.ipadBtnSaveRef.nativeElement.disabled = false;
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
        // this.ipadBtnSaveRef.nativeElement.disabled = false;
      }
    });
  }

  
  changeAddScreenShotIpadOrderObservable(data): Observable<string> {
    return Observable.create( observer => {
      NProgress.start();
      this.changeOrderIpadScreenShotform.value.order_data = data;
      this.changeOrderIpadScreenShotform.value.id = this.add_ipad_screenshot_data['id'];
      this.changeOrderIpadScreenShotform.value.app_id = this.commonService.get_current_app_data().id;
      // this.ipadBtnSaveRef.nativeElement.disabled = true;
      this.commonService.postData(this.changeOrderIpadScreenShotform.value, 'changeipadscreenshotorder').subscribe(res => {
        this.someting_posted = true;
        this.rdata = JSON.parse(res);
        this.rstatus = this.rdata['status'];
        if (this.rstatus == '1') {
          this.currentAppData['basicDetail']['add_ipad_screenshot']['section_json_data'] = this.rdata['data']['section_json_data'];
          this.currentAppData['basicDetail']['add_ipad_screenshot']['add_screenshot_data'] = this.rdata['data']['add_screenshot_data'];

          this.add_ipad_screenshot_data = this.currentAppData['basicDetail']['add_ipad_screenshot'];
          this.add_ipad_screenshot_section_data = JSON.parse(this.add_ipad_screenshot_data['section_json_data']);
          this.add_screenshot_list_ipad_data = this.add_ipad_screenshot_data['add_screenshot_data'];

          localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
          this.sharedService.emit_appdata(this.currentAppData);
          
          NProgress.done();
          const success_message = this.rdata['message'];
          
          $('.draggable-element').arrangeable('destroy');
          $('.draggable-element').arrangeable();

          if (this.rdata.hasOwnProperty('change') && this.rdata.change === true) {
            this.contact_us_able = true;
          }
          NProgress.done();
          observer.next(success_message);
          observer.complete();
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
          observer.error(error_message);
        }
      }, err => {
        observer.error('Error happened on changeipadscreenshotorder');
      });
    });
  }

  changeAddScreenShotIpadFunc() {
    var self = this;
    let orderArray = [];
    $(function () {
      $('#my_screen_ipad .draggable-element').each(function () {
        orderArray.push($(this).attr('attr.data-id'));
      });
      var count_change = 0;
      for (let i = 0; i < orderArray.length; i++) {
        if (orderArray[i] == (i+1)) {
          count_change++;
        }
        $('#my_screen_ipad .draggable-element').eq(i).attr('attr.data-id',i + 1);
      }
      if (count_change != orderArray.length) {
        self.changeAddScreenShotIpadOrder(orderArray);
      }
    });
  }

  onChangeAddScreenShotIpadObservable() {
    var self = this;
    let orderArray = [];
    
    $('#my_screen_ipad .draggable-element').each(function () {
      orderArray.push($(this).attr('attr.data-id'));
    });
    var count_change = 0;
    for (let i = 0; i < orderArray.length; i++) {
      if (orderArray[i] == (i+1)) {
        count_change++;
      }
      $('#my_screen_ipad .draggable-element').eq(i).attr('attr.data-id',i + 1);
    }
    if (count_change != orderArray.length) {
      return self.changeAddScreenShotIpadOrderObservable(orderArray);
    } else {
      return Observable.of('');
    }
  }

  getIpadOrderScreenData() {
     this.changeAddScreenShotIpadFunc();
  }


  lengthCount($event, name) {

    if (name == 'appName') {
      const a = $event;
      this.appLengthCnt = true;
      if (!a.replace(/\s/g, '').length) {
        this.appNameSpaceCheck = true;
        this.basicFormCheck();
      } else {
        this.appNameSpaceCheck = false;
        this.basicFormCheck();
      }
      if (a.length == '1') {
        if (a[0] == ' ') {
          this.blankSpaceAppName = true;
        }
      } else {
        this.blankSpaceAppName = false;
      }

      if (a.length === 30) {
        this.appCnt = 30 - a.length;
        this.appNameLengthErrMsg = false;
        this.basicFormCheck();
      } else {
        this.appCnt = 30 - a.length;
        this.appNameLengthErrMsg = false;
        this.basicFormCheck();
      }
    }

    if (name === 'pramotionalText') {
      const a = $event;

      if (!a.replace(/\s/g, '').length) {
        this.promotionalTextSpaceCheck = true;
        this.basicFormCheck();
      } else {
        this.promotionalTextSpaceCheck = false;
        this.basicFormCheck();
      }

      if (a.length == '1') {
        if (a[0] == ' ') {
          this.blankSpacePramotionalText = true;
        }
      } else {
        this.blankSpacePramotionalText = false;
      }

      if (a.length === 170) {

        this.appPromCnt = 170 - a.length;
        this.appPromLengthCnt = true;
        this.appPromLengthErrMsg = false;
        this.basicFormCheck();
      } else {

        this.appPromCnt = 170 - a.length;
        this.appPromLengthCnt = true;
        this.appPromLengthErrMsg = false;
        this.basicFormCheck();
      }
    }

    if (name == 'appDescription') {
      const a = $event;
      if (!a.replace(/\s/g, '').length) {
        this.appDescriptionSpaceCheck = true;
        this.basicFormCheck();
      } else {
        this.appDescriptionSpaceCheck = false;
        this.basicFormCheck();
      }

      if (a.length == '1') {
        if (a[0] == ' ') {
          this.blankSpaceDescriptionText = true;
        }
      } else {
        this.blankSpaceDescriptionText = false;
      }

      if (a.length == 4000) {

        this.appDesCnt = 4000 - a.length;
        this.appDesLengthCnt = true;
        this.appDescLengthErrMsg = false;
        this.basicFormCheck();
      } else {

        this.appDesCnt = 4000 - a.length;
        this.appDesLengthCnt = true;
        this.appDescLengthErrMsg = false;
        this.basicFormCheck();
      }
    }

    if (name === 'appKeyword') {
      var a = $event;

      if (!a.replace(/\s/g, '').length) {
        this.appKeywordSpaceCheck = true;
        this.basicFormCheck();
      } else {
        this.appKeywordSpaceCheck = false;
        this.basicFormCheck();
      }
      if (a.length === 100) {

        this.appKeywordCnt = 100 - a.length;
        this.appKeywordLengthCnt = true;
        this.appKeywordcLengthErrMsg = false;
        this.basicFormCheck();
      } else {

        this.appKeywordCnt = 100 - a.length;
        this.appKeywordLengthCnt = true;
        this.appKeywordcLengthErrMsg = false;
        this.basicFormCheck();
      }
    }


  }

  appCategoryCheck($event) {
    this.valueCategoryData = true;
    this.primaryData = $event;
    if (this.secondryData == this.primaryData) {
      this.categoryDataFlag = true;
      this.basicFormCheck();
    } else {
      this.categoryDataFlag = false;
      this.basicFormCheck();
    }
  }

  appSecondryData($event) {
    this.secondryData = $event;
    if (this.secondryData == this.primaryData) {
      this.categoryDataFlag = true;
      this.basicFormCheck();
    } else {
      this.categoryDataFlag = false;
      this.basicFormCheck();
    }

  }

  mobileNoCheck($event) {
    this.phoneNumberErrFlag = false;
    if ($event.length < 14) {
      this.mobileNumberErrLen = true;
      this.basicFormCheck();
    } else {
      this.mobileNumberErrLen = false;
      this.basicFormCheck();
    }

  }
  emailCheck($event) {

    const re = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (re.test($event)) {
      this.emailErrCheck = true;
      this.basicFormCheck();
    } else {
      this.emailErrCheck = false;
      this.basicFormCheck();
    }
  }

  urlCheck($event, name) {
    this.supportUrlErr = false;
    var re = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|www\.)[a-z0-9A-Z]+([\-\.]{1}[a-z0-9A-Z]+)*\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
    if (name == 'officialwebsite') {
      if (re.test($event)) {
        this.urlErrCheck = true;
        this.basicFormCheck();
      } else {
        this.urlErrCheck = false;
        this.basicFormCheck();
      }
    }

    if (name == 'marketing') {
      if (re.test($event)) {
        this.marketingUrlErrCheck = true;
        this.basicFormCheck();
      } else {
        this.marketingUrlErrCheck = false;
        this.basicFormCheck();
      }
      if ($event.length < 1) {
        this.marketingUrlErrCheck = true;
        this.basicFormCheck();
      }
    }

  }

  basicFormCheck() {
    // console.log('marketingUrlErrCheck: ' + this.marketingUrlErrCheck);
    if (this.biform.valid) {


      // if((this.appNameLengthErrMsg == false || this.appNameLengthErrMsg == undefined)
      //     && (this.appDescLengthErrMsg == false || this.appDescLengthErrMsg == undefined)
      //     && (this.appPromLengthErrMsg == false || this.appPromLengthErrMsg == undefined)
      //     && (this.categoryDataFlag == false || this.categoryDataFlag == undefined)
      //     && (this.mobileNumberErrLen == false || this.mobileNumberErrLen == undefined)
      //     && (this.emailErrCheck == true || this.emailErrCheck == undefined)
      //     && (this.urlErrCheck == true || this.urlErrCheck == undefined)
      //     && (this.marketingUrlErrCheck == true || this.marketingUrlErrCheck == undefined)
      //     && this.valueCategoryData == true
      //  )
      // {
      //   this.disableGenralFlag = true;
      // }else{
      //    this.disableGenralFlag = false;
      // }

      if (this.valueCategoryData == undefined) {
        this.valueCategoryData = false;
      }
      if (this.appPromLengthErrMsg == undefined) {
        this.appPromLengthErrMsg = true;
      }


    } else {
      this.disableGenralFlag = false;
    }
  }
  // count tageditor string array character count

  private countkeywordLen(arr: string[]) {
    this.appKeywordCnt = 100;
    arr.forEach(element => {
      this.appKeywordCnt -= element.length;
    });
    // set ref of tags char count
    this.tempappKeywordCnt = this.appKeywordCnt;
  }

  private addKeywordCount(data: string) {

    if (this.tempappKeywordCnt >= 0) {
      this.tempappKeywordCnt = this.tempappKeywordCnt - data.length;
      // if suddenly tempappkeywordcnt become negative
      if (this.tempappKeywordCnt < 0) {
        this.removalTag(data);
      }
    }

  }
  private removalTag(val: string) {
    $('#app_keywords_tag').tagEditor('removeTag', val);
  }

  private getSortIDByArray(data, value) {
    var array_num = -1;
    for (let i =0 ; i < 15; i++) {
      if (data != null && typeof(data) != 'undefined' && typeof(data[i]) != 'undefined' && typeof(data[i].sort_id) != 'undefined' && String(data[i].sort_id)  == String(value)) {
        array_num = i;
      }
    }
    return array_num;
  }

  private downloadIPAimg() {

  }

  private downloadASSimg() {
    
  }
  //kkk
  private save_real()
  {
    let padScreenShot = 0;
    let screenShot = 0;
    let selIDPad =  "";
    let selID = "";
    
    for(let i = 0; i < 5; i++){
      if(this.add_screenshot_data['add_screenshot_data'][i].add_screenshot_original_url.indexOf("/default.png") == -1){
        screenShot++;
      }
      if(this.add_ipad_screenshot_data['add_screenshot_data'][i].add_screenshot_original_url.indexOf("/default.png") == -1){
        padScreenShot++;
      }
    }
    
    if(this.appiconform.controls['imageInput'].value == null || 
      this.spscreenform.controls['bcimageInput'].value == null){
        $(function () {
          $.notify({
            title: '',
            message: "You must insert App Icon or Splash Images."
          }, {
              type: 'danger'
            });
        });
        return;

    }
    else if(screenShot < 2){
        $(function () {
          $.notify({
            title: '',
            message: "You must insert at least 2 images of Iphone or Android screenshots."
          }, {
              type: 'danger'
            });
        });
        return;
    }
    else if(padScreenShot < 2){
        $(function () {
          $.notify({
            title: '',
            message: "You must insert at least 2 images of Ipad or Tablet screenshots."
          }, {
              type: 'danger'
            });
        });
        return;
    }

    if(this.sponsorsplashform.controls['no_sec_display'].value.length == 0 ) {
      $(function () {
        $.notify({
          title: '',
          message: "You must insert Sponsor splash time."
        }, {
            type: 'danger'
          });
      });
      return;
    }
    debugger;
    $(function () {
      $.notify({
        title: '',
        message: "Settings Saving, Please Wait..."
      }, {
          type: 'success'
        });
    });
    
    this.msgService.setSpinnerActive({
      active: true,
      text: 'This process will take some time to finish. Please DO NOT leave the page and wait until it finishes.'
    })

    
    NProgress.start();
    var time_step = 0; 
    this.someting_posted = true;
   
    let save_observable_array = [Observable.of('')];

    if (this.boolAppIconForm == true)
        save_observable_array.push(this.onSubmitAppIconObservable());
    if (this.boolSplashScreenForm == true)
        save_observable_array.push(this.splashScreenSubmitObservable(this.splashScreen_form));
    if (this.boolSponserSplashScreenForm == true || this.boolSponsorSplashTime == true)
        save_observable_array.push(this.sponsorSplashSubmitObservable(this.sponsorSplash_form));

    [1,2,3,4,5].forEach(i => {
        let id = +$('#my_screen .draggable-element')[i - 1].getAttribute('attr.data-id');
        save_observable_array.push(this.onSubmitAddScreenShotObservable(id,i)); 

        id = +$('#my_screen_ipad .draggable-element')[i - 1].getAttribute('attr.data-id');
        save_observable_array.push(this.onSubmitAddIpadScreenShotObservable(id, i));
    });

    debugger;
    Observable.forkJoin(...save_observable_array).subscribe(
        data => {
          debugger;
            let change_observable_array = [
                Observable.of(''),
                this.onChangeAddScreenObservable(),
                this.onChangeAddScreenShotIpadObservable()
            ];
            Observable.forkJoin(...change_observable_array).subscribe(
              data => {
                debugger;
                this.basicInformatoinSubmitObservable(this.basicInfo_form).subscribe(
                    data => {
                        debugger;
                        console.log("btn_app_info start");
                        NProgress.done();
                        this.msgService.setSpinnerActive(false);
                        $(function () {
                          $.notify({
                            title: '',
                            message: "Settings Saved Successfully."
                          }, {
                              type: 'success'
                            });
                        });

                        if (this.contact_us_able == true) {
                          this.contact_us_able == false; 
                          swal({
                            title: 'Please Contact Us',
                            text: 'These changes require approval from Apple and Google. Please contact us to get this updated for you.',
                            type: 'warning',
                            confirmButtonClass: 'btn-success',
                            confirmButtonText: 'Ok',
                            closeOnConfirm: true
                          },
                          (isConfirm) => {
                            if (isConfirm) {
                              this.route.navigate(['contact-us']);
                            }
                          });
                        }
                    }, err => {
                        this.msgService.setSpinnerActive(false);
                        $(function () {
                          $.notify({
                            title: '',
                            message: err
                          }, {
                              type: 'danger'
                            });
                        });
                        console.error(err);
                    }, () => {
                      console.log('completed');
                    }
                );
              },
              error => {
                this.msgService.setSpinnerActive(false);
                $(function () {
                  $.notify({
                    title: '',
                    message: "Couldn't change screenshots' order."
                  }, {
                      type: 'danger'
                    });
                });
                console.error(error);
              }  
            );
        }, error => {
            this.msgService.setSpinnerActive(false);
            $(function () {
              $.notify({
                title: '',
                message: "Error happend on images save."
              }, {
                  type: 'danger'
                });
            });
            console.error(error);
        }
    );
  }
  private save_all() {
    if ($(".dropify-preview .dropify-render .loading").length > 0) {
      // document.getElementById("btnSaveAll").setAttribute('disabled', 'disabled');
      return new Promise<boolean>((resolve, reject) => {
        swal({
          title: 'Warning',
          text: 'Image is uploading. Just a second',
          type: 'warning',
          confirmButtonClass: 'btn-success',
          confirmButtonText: 'Yes',
          closeOnConfirm: true
        },
          (isConfirm) => {
            // if accept yes
            if (isConfirm) {
              resolve(true);
            } else {
              resolve(true);
            }
          });
      });
    }
    else {
      // document.getElementById("btnSaveAll").setAttribute('disabled', '');
      this.save_real();
    }

    // btn_app_icon   this.boolAppIconForm == true
    // btn_app_splash  this.boolSplashScreenForm
    // btn_sponsor_splash  this.boolSponserSplashScreenForm
    // btn_app_info
    // setTimeout(() => {
    //   if ($(".dropify-preview .dropify-render .loading").length > 0) {
    //     document.getElementById("btnSaveAll").setAttribute('disabled', 'disabled');
    //     // show prompt 
        
      // } else {
    //     this.save_real();
    //   }
      
    // }, 1000);
    
  }
}
