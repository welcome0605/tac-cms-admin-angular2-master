import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MessageService } from './../../message.service';

import { CommonService } from './../../common.service';
import { SharedService } from './../../shared.service';

import { CanComponentDeactivate } from './../../can-deactivate-guard.service';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../environments/environment';

declare var $: any;
declare var jQuery: any;
declare var NProgress: any;
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

function matchCorrectVersion() {
  // const hasExclamation = input.value !== this.o_password.value;
  return (input: FormControl) => {
    return /^[0-9.]+$/.test(input.value) ? null : {
      matchCorrectVersion: {
        valid: false
      }
    };
  }
}

function matchCorrectPrompt() {
  // const hasExclamation = input.value !== this.o_password.value;
  return (input: FormControl) => {
    return /^[0-9.]+$/.test(input.value) ? null : {
      matchCorrectPrompt: {
        valid: false
      }
    };
  }
}
@Component({
  selector: 'app-app-startup-config',
  templateUrl: './app-startup-config.component.html',
  styles: []
})

export class AppStartupConfigComponent implements OnInit, CanComponentDeactivate, OnDestroy {


  @ViewChild('autoupgradepopupForm') autoupgradepopupFormRef: NgForm;
  @ViewChild('rateForm') rateFormRef: NgForm;
  @ViewChild('notificationForm') notificationFormRef: NgForm;
  @ViewChild('notificationBtnDisable') notificationBtnDisableRef: ElementRef;
  @ViewChild('forceUpdateBtnDisable') forceUpdateBtnDisableRef: ElementRef;
  @ViewChild('reviewBtnDisable') reviewBtnDisableRef: ElementRef;
  @ViewChild('saveTabBtnDisable') saveTabBtnDisableRef: ElementRef;
  public notificationform: FormGroup;
  public autoupgradeForm: FormGroup;
  public ratepopupform: FormGroup;
  public flag: Boolean;

  rdata = [];
  storeData = [];
  rstatus = '';
  currentAppData = [];
  msgSubscription: Subscription;
  headerIconUrl: string;

  appBasicDetail = '';
  basic_information_data = '';
  basic_information_section_data = '';
  app_notification_data = '';
  app_notification_section_json_data = '';
  app_auto_upgrade_data = '';
  app_auto_upgrade_section_json_data = '';
  app_rate_popup_data = '';
  app_rate_popup_section_json_data = '';

  error_message = '';
  is_success = false;
  success_message = '';
  is_error = false;
  // notificationMessage = '';
  autoUpgradeMessage = '';
  rateMessage = '';
  isShowData: any;
  isHideData: any;
  isUpgradeShowData: any;
  isUpgradeHideData: any;
  counter: any;
  isRateShowData: any;
  messageNotificationDisplay: any;
  modelTwoData: any;
  modelOneData: any;
  titlePre: any;
  agreePre: any;
  remindPre: any;
  declinePre: any;
  msgRatePre: any;
  titleUpdatePre: any;
  msgRateUpdatePre: any;
  updatePre: any;
  cssJsonData: any;
  menuiconArrayCss: any;
  headerArrayCss: any;
  statusbarArrayCss: any;
  commonCssJsonData: any;
  menuIconCssColor: any;
  heightData: any;
  borderSize: any;
  headerBorderColor: any;
  headerBackgroundColor: any;
  statusBarColorCss: any;
  appIconUrl: any;
  messageTitle: any;
  resData: any;
  playstoreUrl: any;
  version: any;
  bundleId: any;
  firebase_id: any;
  rateIosAppId: any;
  rateAndrAppId: any;
  iosVersion: any;
  iosAppId: any;
  andrAppId: any;
  andrVersion: any;
  checkBoxValChange: boolean;
  autoUpgradeCheckBox: boolean;
  ratePopupCheckBox: boolean;
  updatePopupMsg: any;
  is_access_menu: any;
  notificationFlag: any;
  is_access_app_operation: boolean  = true;

  constructor(private router: Router, private commonService: CommonService, private msgService: MessageService, private fb: FormBuilder, private http: Http, private sharedService: SharedService) {
    this.flag = true;
    this.notificationFlag = false;
    this.currentAppData = this.commonService.get_current_app_data();

    this.appBasicDetail = this.currentAppData['basicDetail'];

    this.app_notification_data = this.appBasicDetail['notification_popup'];

    this.app_notification_section_json_data = JSON.parse(this.app_notification_data['section_json_data']);

    if (this.app_notification_section_json_data !== null) {
      if (this.app_notification_section_json_data['isShow'] == 'true') {
        this.isShowData = true;
        this.isHideData = false;
      } else {
        this.isShowData = false;
        this.isHideData = true;
      }
    } else {
      this.isShowData = true;
    }


    this.app_auto_upgrade_data = this.appBasicDetail['auto_upgrade_popup'];
    this.app_auto_upgrade_section_json_data = JSON.parse(this.app_auto_upgrade_data['section_json_data']);

    if (this.app_auto_upgrade_section_json_data !== null) {
      if (this.app_auto_upgrade_section_json_data['isShow'] == 'true') {
        this.isUpgradeShowData = true;
        this.isUpgradeHideData = false;
      } else {
        this.isUpgradeShowData = false;
        this.isUpgradeHideData = true;
      }      
    } else {
      this.isUpgradeShowData = false;
    }


    this.app_rate_popup_data = this.appBasicDetail['rate_popup'];
    this.app_rate_popup_section_json_data = JSON.parse(this.app_rate_popup_data['section_json_data']);

    if (this.app_rate_popup_section_json_data !== null) {
      if (this.app_rate_popup_section_json_data['isShow'] == 'true') {
        this.isRateShowData = true;
      } else {
        this.isRateShowData = false;
      }
    } else {
      this.isRateShowData = false;
    }

    const appData = JSON.parse(localStorage.getItem('currentAppData'));

    this.commonService.postData(appData, 'getAdminSettingData').subscribe(res => {


      this.resData = JSON.parse(res);

      if (this.resData.length !== 0) {
        if (this.resData[0].hasOwnProperty('plystore_url')) {
          this.playstoreUrl = this.resData[0]['plystore_url'];
        }
        this.version = this.resData[0]['version'];
        this.bundleId = this.resData[0]['bundle_id'];
        this.firebase_id = this.resData[0]['firebase_channel_id'];

        this.rateIosAppId = this.resData[0]['rate_ios_app_id'];
        this.rateAndrAppId = this.resData[0]['rate_android_app_id'];
        this.iosVersion = this.resData[0]['ios_version'];
        this.iosAppId = this.resData[0]['rate_ios_app_id'];
        this.andrAppId = this.resData[0]['rate_android_app_id'];
        this.andrVersion = this.resData[0]['android_version'];
        this.updatePopupMsg = this.resData[0]['force_update_message'];
        // this.msgRateUpdatePre = this.updatePopupMsg;
      }

    })
    this.msgSubscription = this.msgService.getMessage().subscribe(r => {
      this.headerIconUrl = r.text;
    })

    let iFrameUrl = `${environment.baseUrl}/projects/${this.currentAppData['app_code']}/index.html`;

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
    const currentuserdata = this.commonService.get_user_data();
    const userRole = currentuserdata.role_id;
    if (userRole !== 1) {
      this.is_access_menu = false;
    } else {
      this.is_access_menu = true;
    }

    var self = this;

    let notification_title = '';
    let notification_message = '';
    let button1 = '';
    let button2 = '';
    let isShow = '';

    let autoupgrade_title = '';
    let autoupgrade_message = '';
    let ok_button_text = '';
    let andr_app_id = '';
    let ios_app_id = '';

    let ratepopup_title = '';
    let rate_andr_app_id = '';
    let rate_ios_app_id = '';
    let uses_until_prompt = '';
    let agree_label = '';
    let remind_label = '';
    let decline_text = '';
    let rate_text = '';
    let android_version = '';
    let ios_version = '';
    let messageAutoupgrade = '';
    let messageNotification = '';
    let messageRatepopUp = '';
    let title = '';
    let rateTitle = '';

    const appData = JSON.parse(localStorage.getItem('currentAppData'));
    const appUniqId = JSON.stringify(appData.app_unique_id);
    const cssComponent = 'general_css';
    const sidemenuCssComponent = 'side_menu_css';
    const generalCssDBColumn = 'app_general_css_json_data';
    const sideMenuCssDBColumn = 'app_side_menu_css_json_data';
    const appId = JSON.stringify(appData.id);

    const iconData = this.currentAppData['basicDetail']['app_icon'];
    const app_icon = iconData.app_icon_thumb_url;

    if (localStorage.getItem('headerMainImg')) {
      this.appIconUrl = localStorage.getItem('headerMainImg');
    }
    // if (this.headerIconUrl) {
    //   this.appIconUrl = this.headerIconUrl;
    //   console.log(this.appIconUrl);
    // }

    // this.msgService.getMessage();
    this.commonService.postData({
      'appId': appUniqId,
      'id': appId,
      'cssComponent': cssComponent,
      'dbColumn': generalCssDBColumn
    }, 'isCssDataExsist').subscribe(res => {
      this.cssJsonData = JSON.parse(res);

      this.cssJsonData = JSON.parse(res);
      this.menuiconArrayCss = JSON.parse(this.cssJsonData['menuicon_css']);
      this.headerArrayCss = JSON.parse(this.cssJsonData['header_css']);
      this.statusbarArrayCss = JSON.parse(this.cssJsonData['statusbar_css']);
      this.commonCssJsonData = [];

      for (let i = 0; i < this.menuiconArrayCss.length; ++i) {
        if (this.menuiconArrayCss[i]['key'] == 'backgroundColorMenu') {
          this.menuIconCssColor = this.menuiconArrayCss[i]['value'];
        }
      }

      for (let i = 0; i < this.headerArrayCss.length; ++i) {

        if (this.headerArrayCss[i]['key'] == 'height') {
          this.heightData = this.headerArrayCss[i]['value'] + 'px';
        }

        if (this.headerArrayCss[i]['key'] == 'borderbottom') {
          this.borderSize = this.headerArrayCss[i]['value'] + 'px solid';
        }

        if (this.headerArrayCss[i]['key'] == 'background color border') {
          this.headerBorderColor = this.headerArrayCss[i]['value'];
        }

        if (this.headerArrayCss[i]['key'] == 'background color') {
          this.headerBackgroundColor = this.headerArrayCss[i]['value'];
        }

      }

      for (var i = 0; i < this.statusbarArrayCss.length; ++i) {
        if (this.statusbarArrayCss[i]['key'] == 'background color') {
          this.statusBarColorCss = this.statusbarArrayCss[i]['value'];
          if (this.statusBarColorCss == '') {
            this.statusBarColorCss = '#000';
          }
        }
      }


      // for (var i = 0; i < this.cssJsonData[0]['subMenu'].length; ++i) {
      //   this.commonCssJsonData.push(this.cssJsonData[0]['subMenu'][i]);
      // }

      // for (var j = 0; j < this.cssJsonData[1]['mainMenu'].length; ++j) {
      //   this.commonCssJsonData.push(this.cssJsonData[1]['mainMenu'][j]);
      // }

    });

    // if (this.app_notification_section_json_data != null) {
    //   this.notificationMessage = this.app_notification_section_json_data['message'];
    // }

    if (this.app_auto_upgrade_section_json_data != null) {
      this.autoUpgradeMessage = this.app_auto_upgrade_section_json_data['message'];
    }

    if (this.app_rate_popup_section_json_data != null) {
      this.rateMessage = this.app_rate_popup_section_json_data['rate_text'];
    }


    // if(this.app_notification_section_json_data.hasOwnProperty('title')){
    //   this.currentAppData['app_name']
    // }

    // gjc 0425 request nick
    
    // if (this.app_notification_section_json_data !== null) {
    //   if (this.app_notification_section_json_data.hasOwnProperty('title')) {
    //     notification_title = this.app_notification_section_json_data['title'];
    //   }
    //   if (this.app_notification_section_json_data.hasOwnProperty('message')) {
    //     messageNotification = this.app_notification_section_json_data['message'];
    //   }
    //   if (this.app_notification_section_json_data.hasOwnProperty('button1')) {
    //     button1 = this.app_notification_section_json_data['button1'];
    //   }
    //   if (this.app_notification_section_json_data.hasOwnProperty('button2')) {
    //     button2 = this.app_notification_section_json_data['button2'];
    //   }
    //   if (this.app_notification_section_json_data.hasOwnProperty('messageNotification')) {
    //     messageNotification = this.app_notification_section_json_data['messageNotification'];
    //   }

    //   this.messageTitle = notification_title;
    //   this.messageNotificationDisplay = messageNotification
    //   this.modelTwoData = button2;
    //   this.modelOneData = button1;
    //   setTimeout(() => {
    //     //gjc 04 19
    //     this.notificationFlag = false;
    //     //this.notificationFlag = true;
    //   }, 3000)
    // } else {
    //   notification_title = this.currentAppData['app_name'];
    //   button2 = 'Manage Notifications';
    //   button1 = 'Continue';
    //   messageNotification = 'You have been automatically subscribed to receive push notifications. Remember, you can always update your push notification settings by going to Settings';

    //   this.messageTitle = notification_title;
    //   this.messageNotificationDisplay = 'You have been automatically subscribed to receive push notifications. Remember, you can always update your push notification settings by going to Settings';

    //   this.modelTwoData = 'Manage Notifications';
    //   this.modelOneData = 'Continue';
    //   setTimeout(() => {
    //     //gjc 04 19
    //     this.notificationFlag = false;
    //     //this.notificationFlag = true;
    //   }, 3000)
    // }

    
    if (this.app_auto_upgrade_section_json_data !== null) {
      if (this.app_auto_upgrade_section_json_data.hasOwnProperty('title')) {
        autoupgrade_title = this.app_auto_upgrade_section_json_data['title'];
      }
      if (this.app_auto_upgrade_section_json_data.hasOwnProperty('message')) {
        messageAutoupgrade = this.app_auto_upgrade_section_json_data['message'];
      }

      if (this.app_auto_upgrade_section_json_data.hasOwnProperty('ok_button_text')) {
        ok_button_text = this.app_auto_upgrade_section_json_data['ok_button_text'];
      }
      if (this.app_auto_upgrade_section_json_data.hasOwnProperty('buttonName')) {
        ok_button_text = this.app_auto_upgrade_section_json_data['buttonName'];
      }

      if (this.app_auto_upgrade_section_json_data.hasOwnProperty('application')) {
        if (this.app_auto_upgrade_section_json_data['application'].android.id) {
          andr_app_id = this.app_auto_upgrade_section_json_data['application'].android.id;
        }
      }
      if (this.app_auto_upgrade_section_json_data.hasOwnProperty('application')) {
        if (this.app_auto_upgrade_section_json_data['application'].ios.id) {
          ios_app_id = this.app_auto_upgrade_section_json_data['application'].ios.id;
        }
      }
      if (this.app_auto_upgrade_section_json_data.hasOwnProperty('application')) {
        if (this.app_auto_upgrade_section_json_data['application'].android.version) {
          android_version = this.app_auto_upgrade_section_json_data['application'].android.version;
        }
      }
      if (this.app_auto_upgrade_section_json_data.hasOwnProperty('application')) {
        if (this.app_auto_upgrade_section_json_data['application'].ios.version) {
          ios_version = this.app_auto_upgrade_section_json_data['application'].ios.version;
        }
      }

      if (this.app_auto_upgrade_section_json_data.hasOwnProperty('andr_app_id')) {
        andr_app_id = this.app_auto_upgrade_section_json_data['andr_app_id'];
      }
      if (this.app_auto_upgrade_section_json_data.hasOwnProperty('ios_app_id')) {
        ios_app_id = this.app_auto_upgrade_section_json_data['ios_app_id'];
      }
      if (this.app_auto_upgrade_section_json_data.hasOwnProperty('ios_version')) {
        ios_version = this.app_auto_upgrade_section_json_data['ios_version'];
      }
      if (this.app_auto_upgrade_section_json_data.hasOwnProperty('android_version')) {
        android_version = this.app_auto_upgrade_section_json_data['android_version'];
      }
      if (this.app_auto_upgrade_section_json_data.hasOwnProperty('messageAutoupgrade')) {
        messageAutoupgrade = this.app_auto_upgrade_section_json_data['messageAutoupgrade'];
      }
      // 2222222
      // console.log(messageAutoupgrade);
      this.titleUpdatePre = autoupgrade_title;
      this.msgRateUpdatePre = messageAutoupgrade;
      this.updatePre = ok_button_text;

    } else {

      autoupgrade_title = this.currentAppData['app_name'];
      ok_button_text = 'Update';
      messageAutoupgrade = 'There is a newer version of this app available, click Update to update the app.';


      this.titleUpdatePre = this.currentAppData['app_name'];
      this.msgRateUpdatePre = 'There is a newer version of this app available, click Update to update the app.';
      this.updatePre = 'Update';
    }

    if (this.app_rate_popup_section_json_data !== null) {

      // console.log(JSON.stringify(this.app_rate_popup_section_json_data));
      if (this.app_rate_popup_section_json_data.hasOwnProperty('andr_app_id')) {
        rate_andr_app_id = this.app_rate_popup_section_json_data['andr_app_id'];
      }

      if (this.app_rate_popup_section_json_data.hasOwnProperty('rate_andr_app_id')) {
        rate_andr_app_id = this.app_rate_popup_section_json_data['rate_andr_app_id'];
      }

      if (this.app_rate_popup_section_json_data.hasOwnProperty('ios_app_id')) {
        rate_ios_app_id = this.app_rate_popup_section_json_data['ios_app_id'];
      }

      if (this.app_rate_popup_section_json_data.hasOwnProperty('rate_ios_app_id')) {
        rate_ios_app_id = this.app_rate_popup_section_json_data['rate_ios_app_id'];
      }

      if (this.app_rate_popup_section_json_data.hasOwnProperty('uses_until_prompt')) {
        uses_until_prompt = this.app_rate_popup_section_json_data['uses_until_prompt'];
      }

      if (this.app_rate_popup_section_json_data.hasOwnProperty('title')) {
        rateTitle = this.app_rate_popup_section_json_data['title'];
      }

      if (rateTitle == null || rateTitle == "") {
        if (this.app_rate_popup_section_json_data.hasOwnProperty('rateTitle')) {
          rateTitle = this.app_rate_popup_section_json_data['rateTitle'];
        }
      }



      // if(rateTitle == null){
      //   if (this.app_rate_popup_section_json_data.hasOwnProperty('ratepopup_title')) {
      //     rateTitle = this.app_rate_popup_section_json_data['ratepopup_title'];
      //   }
      // }

      if (this.app_rate_popup_section_json_data.hasOwnProperty('message')) {
        messageRatepopUp = this.app_rate_popup_section_json_data['message'];
      }

      if (this.app_rate_popup_section_json_data.hasOwnProperty('text')) {
        messageRatepopUp = this.app_rate_popup_section_json_data['text'];
      }

      if (this.app_rate_popup_section_json_data.hasOwnProperty('messageRatepopUp')) {
        messageRatepopUp = this.app_rate_popup_section_json_data['messageRatepopUp'];
      }


      if (this.app_rate_popup_section_json_data.hasOwnProperty('rateThisButton')) {
        agree_label = this.app_rate_popup_section_json_data['rateThisButton'];
      }

      if (this.app_rate_popup_section_json_data.hasOwnProperty('agree_label')) {
        agree_label = this.app_rate_popup_section_json_data['agree_label'];
      }


      if (this.app_rate_popup_section_json_data.hasOwnProperty('cancelButton')) {
        decline_text = this.app_rate_popup_section_json_data['cancelButton'];
      }

      if (this.app_rate_popup_section_json_data.hasOwnProperty('decline_text')) {
        decline_text = this.app_rate_popup_section_json_data['decline_text'];
      }

      if (this.app_rate_popup_section_json_data.hasOwnProperty('remindLaterButton')) {
        remind_label = this.app_rate_popup_section_json_data['remindLaterButton'];
      }

      if (this.app_rate_popup_section_json_data.hasOwnProperty('remind_label')) {
        remind_label = this.app_rate_popup_section_json_data['remind_label'];
      }


      if (this.app_rate_popup_section_json_data.hasOwnProperty('application')) {
        this.app_rate_popup_section_json_data['application']['ios'].version;
        rate_ios_app_id = this.app_rate_popup_section_json_data['application']['ios'].id;

        this.app_rate_popup_section_json_data['application']['android'].version;
        rate_andr_app_id = this.app_rate_popup_section_json_data['application']['android'].id;

      }


      this.titlePre = rateTitle;
      this.agreePre = agree_label;
      this.remindPre = remind_label;
      this.declinePre = decline_text;
      this.msgRatePre = messageRatepopUp;
    }
    else {
      rateTitle = this.currentAppData['app_name'];
      uses_until_prompt = '5';
      agree_label = 'Agree';
      remind_label = 'Remind';
      decline_text = 'Decline';
      messageRatepopUp = 'If you enjoy this app, please take a moment to rate it.';


      this.titlePre = this.currentAppData['app_name'];
      this.agreePre = 'Agree';
      this.remindPre = 'Remind';
      this.declinePre = 'Decline';
      this.msgRatePre = 'If you enjoy this app, please take a moment to rate it.';
    }

    $(function () {
      $('.message_body').summernote({
        height: 200
        // placeholder: 'write here...'
      });

      $('[data-toggle=tooltip]').tooltip();
    });

    this.notificationform = this.fb.group({
      title: [notification_title, Validators.compose([Validators.required, matchCorrectSpace()])],
      button1: [button1, Validators.compose([Validators.required, matchCorrectSpace()])],
      button2: [button2, Validators.compose([Validators.required, matchCorrectSpace()])],
      messageNotification: [messageNotification, Validators.compose([Validators.required, , matchCorrectSpace()])]
    });

    this.autoupgradeForm = this.fb.group({
      title: [autoupgrade_title, Validators.compose([Validators.required, matchCorrectSpace()])],
      ok_button_text: [ok_button_text, Validators.compose([Validators.required, matchCorrectSpace()])],
      andr_app_id: [andr_app_id, ''],
      ios_app_id: [ios_app_id, ''],
      ios_version: [ios_version, Validators.compose([matchCorrectVersion()])],
      android_version: [android_version, Validators.compose([matchCorrectVersion()])],
      messageAutoupgrade: [this.msgRateUpdatePre, Validators.compose([Validators.required, matchCorrectSpace()])]
    });

    this.ratepopupform = this.fb.group({
      rate_andr_app_id: [rate_andr_app_id, ''],
      rate_ios_app_id: [rate_ios_app_id, ''],
      uses_until_prompt: [uses_until_prompt, Validators.compose([Validators.required])],
      agree_label: [agree_label, Validators.compose([Validators.required, matchCorrectSpace()])],
      remind_label: [remind_label, Validators.compose([Validators.required, matchCorrectSpace()])],
      decline_text: [decline_text, Validators.compose([Validators.required, matchCorrectSpace()])],
      ratepopup_title: [ratepopup_title, ''],
      messageRatepopUp: [messageRatepopUp, Validators.compose([Validators.required, matchCorrectSpace()])],
      rateTitle: [rateTitle, Validators.compose([Validators.required, matchCorrectSpace()])]
    });
  }
  ngOnDestroy(): void {
    this.msgSubscription.unsubscribe();
  }

  radioSave(event, name) {
    if (name === 'notificationForm') {
      this.checkBoxValChange = true;
    }
    if (name === 'rateForm') {
      this.ratePopupCheckBox = true;
    }
    if (name === 'autoupgradeForm') {
      this.autoUpgradeCheckBox = true;
    }

    if (event.target.checked) {
      this.isShowData = true;
    } else if (!event.target.checked) {
      this.isShowData = false;
    }
  }

  notificationSubmit(form: NgForm) {

    return new Promise<boolean>((resolve, reject) => {
      NProgress.start();
      // this.notificationDisBtnCall('true');
      // "asd");
      // console.log('asdasd');
      this.notificationBtnDisableRef.nativeElement.disabled = true;
      console.log(this.notificationBtnDisableRef.nativeElement);
      const notification_message = $('#notification_message').summernote('code');
      form.value.message = notification_message;
      form.value.id = this.app_notification_data['id'];
      form.value.app_id = this.currentAppData['id'];
      form.value.isShow = this.isShowData;

      this.commonService.postData(form.value, 'notificationpopupform').subscribe(res => {
        NProgress.done();
        this.rdata = JSON.parse(res);
        this.rstatus = this.rdata['status'];

        if (this.rstatus == '1') {

          this.currentAppData['basicDetail']['notification_popup']['section_json_data'] = this.rdata['data']['section_json_data'];
          this.app_notification_data = this.currentAppData['basicDetail']['notification_popup'];
          this.app_notification_section_json_data = JSON.parse(this.app_notification_data['section_json_data']);

          localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
          this.sharedService.emit_appdata(this.currentAppData);

          const success_message = this.rdata['message'];

          this.fastGenerateJson();          

          $(function () {
            $.notify({
              title: '',
              message: success_message
            }, {
                type: 'success'
              });
          });
          this.notificationform.markAsPristine();
          resolve(true);
          // reset checkbox val false;
          this.checkBoxValChange = false;
          this.notificationBtnDisableRef.nativeElement.disabled = false;
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
          this.checkBoxValChange = false;
          this.notificationBtnDisableRef.nativeElement.disabled = false;
          reject(error_message);
        }

      });
    });
  }

  autoupgradeSubmit(form: NgForm) {

    return new Promise<boolean>((resolve, reject) => {
      NProgress.start();
      this.forceUpdateBtnDisableRef.nativeElement.disabled = true;
      this.saveTabBtnDisableRef.nativeElement.disabled = true;

      const autoupgrade_message = $('#autoupgrade_message').summernote('code');
      form.value.message = autoupgrade_message;
      form.value.id = this.app_auto_upgrade_data['id'];
      form.value.app_id = this.currentAppData['id'];
      form.value.isShow = this.isShowData;
      form.value.andr_app_id = this.andrAppId;
      form.value.ios_app_id = this.iosAppId;
      // form.value.ios_version = this.iosVersion;
      // form.value.android_version = this.andrVersion;

      
      this.commonService.postData(form.value, 'autoupgradepopupform').subscribe(res => {
        NProgress.done();
        this.rdata = JSON.parse(res);
        this.rstatus = this.rdata['status'];

        if (this.rstatus == '1') {
          this.currentAppData['basicDetail']['auto_upgrade_popup']['section_json_data'] = this.rdata['data']['section_json_data'];
          this.app_auto_upgrade_data = this.currentAppData['basicDetail']['auto_upgrade_popup'];
          this.app_auto_upgrade_section_json_data = JSON.parse(this.app_auto_upgrade_data['section_json_data']);

          localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
          this.sharedService.emit_appdata(this.currentAppData);

          const success_message = this.rdata['message'];
          this.fastGenerateJson();

          $(function () {
            $.notify({
              title: '',
              message: success_message
            }, {
                type: 'success'
              });
          });
          this.autoupgradeForm.markAsPristine();
          resolve(true);
          // reset dirty checkbox val
          this.autoUpgradeCheckBox = false;
          this.forceUpdateBtnDisableRef.nativeElement.disabled = false;
          this.reviewBtnDisableRef.nativeElement.disabled = false;
          this.saveTabBtnDisableRef.nativeElement.disabled = false;
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
          reject(error_message);
          // reset
          this.autoUpgradeCheckBox = false;
          this.forceUpdateBtnDisableRef.nativeElement.disabled = false;
          this.reviewBtnDisableRef.nativeElement.disabled = false;
          this.saveTabBtnDisableRef.nativeElement.disabled = false;

        }

      });

    });
  }

  setModelData($event, name) {
    if (name == 'buttonOne') {
      this.modelOneData = $event;
    }
    if (name == 'buttonTwo') {
      this.modelTwoData = $event;
    }
    if (name == 'messageNotification') {
      this.messageNotificationDisplay = $event;
    }
    if (name == 'messageTitle') {
      this.messageTitle = $event;
    }
    if (name == 'updateTitle') {
      this.titleUpdatePre = $event;
    }
    if (name == 'updateMessage') {
      this.msgRateUpdatePre = $event;
    }
    if (name == 'okButton') {
      this.updatePre = $event;
    }

    if (name == 'title') {
      this.titlePre = $event;
    }
    if (name == 'messageRate') {
      this.msgRatePre = $event;
    }
    if (name == 'agree') {
      this.agreePre = $event;
    }
    if (name == 'remind') {
      this.remindPre = $event;
    }
    if (name == 'decline') {
      this.declinePre = $event;
    }
  }

  ratepopupSubmit(form: NgForm) {
    return new Promise<boolean>((resolve, reject) => {
      NProgress.start();
      this.reviewBtnDisableRef.nativeElement.disabled = true;
      this.saveTabBtnDisableRef.nativeElement.disabled = true;
      const rate_message = $('#rate_message').summernote('code');
      form.value.text = rate_message;
      form.value.id = this.app_rate_popup_data['id'];
      form.value.app_id = this.currentAppData['id'];
      form.value.isShow = this.isShowData;


      form.value.rate_andr_app_id = this.rateAndrAppId;
      form.value.rate_ios_app_id = this.rateIosAppId;

      form.value.ios_version = this.iosVersion;
      form.value.android_version = this.andrVersion;

      this.commonService.postData(form.value, 'ratepopupform').subscribe(res => {
      this.reviewBtnDisableRef.nativeElement.disabled = true;
      this.saveTabBtnDisableRef.nativeElement.disabled = true;
        NProgress.done();
        this.rdata = JSON.parse(res);
        this.rstatus = this.rdata['status'];
        if (this.rstatus == '1') {
          this.currentAppData['basicDetail']['rate_popup']['section_json_data'] = this.rdata['data']['section_json_data'];
          this.app_rate_popup_data = this.currentAppData['basicDetail']['rate_popup'];
          this.app_rate_popup_section_json_data = JSON.parse(this.app_rate_popup_data['section_json_data']);

          localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
          this.sharedService.emit_appdata(this.currentAppData);

          const success_message = this.rdata['message'];

          this.fastGenerateJson();

          $(function () {
            $.notify({
              title: '',
              message: success_message
            }, {
                type: 'success'
              });
          });
          resolve(true);
          this.ratepopupform.markAsPristine();
          // reset rateform checkbox false
          this.ratePopupCheckBox = false;
          this.reviewBtnDisableRef.nativeElement.disabled = false;

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
          reject(error_message);
          // reset rateform checkbox false
          this.ratePopupCheckBox = false;
          this.reviewBtnDisableRef.nativeElement.disabled = false;
        }
      });
    });

  }

  fastGenerateJson() {
    const appData = this.commonService.get_current_app_data();
    this.commonService.postData({
      'id': JSON.stringify(appData.id),
      'appName': JSON.stringify(appData.app_name)
    }, 'fastGenerateJson').subscribe(res => {        
        this.rdata = JSON.parse(res);
        this.rstatus = this.rdata['status'];
      if ( this.rstatus === '1') {
        
      } else {

      }

    }, err => {
      
    }, () => {    
        let iFrameUrl = `${environment.baseUrl}/projects/${this.currentAppData['app_code']}/index.html`;
        $('#native_preview').attr('src',iFrameUrl);                
    })
  }

  /**
  * canDeactivate Implementation
  */
  canDeactivate(): boolean | Promise<boolean> {

    if (this.autoupgradeForm.dirty || this.notificationform.dirty || this.ratepopupform.dirty || this.checkBoxValChange
      || this.autoUpgradeCheckBox || this.ratePopupCheckBox
    ) {
      return new Promise<boolean>((resolve, reject) => {
        swal({
          title: 'You didn`t save!',
          text: 'You have unsaved changes, would you like to save?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonClass: 'btn-success',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          closeOnConfirm: false,
          closeOnCancel: true
        },
          (isConfirm) => {
            // if accept yes
            if (isConfirm) {
              // console.log(this.editMenuFormRef.value);
              // save form data if any of form is dirty
              if (this.autoupgradeForm.dirty || this.autoUpgradeCheckBox) {

                this.autoupgradeSubmit(this.autoupgradepopupFormRef).then(d => {

                }).catch(d => { });

              } if (this.notificationform.dirty || this.checkBoxValChange) {

                this.notificationSubmit(this.notificationFormRef).then(d => {

                }).catch(d => { });

              } if (this.ratepopupform.dirty || this.ratePopupCheckBox) {

                this.ratepopupSubmit(this.rateFormRef).then(d => {

                }).catch(d => { });

              }

              swal({
                title: 'Successfully',
                text: 'Data Saved Successfully',
                type: 'success',
                confirmButtonClass: 'btn-success',
                confirmButtonText: 'Ok'
              });
              setTimeout(() => {
                resolve(true);
              }, 1400);
            } else {
              resolve(true);
            }
          });
      });
    }
    return true;

  }

  f1(){
    this.flag = true;
  }
  f2(){
    this.flag = false;
  }
  saveTabs(){
    console.log("asdfasdfasdfasdfsadfsadf");
    debugger
        if (this.flag == true) {
            this.autoupgradeSubmit(this.autoupgradepopupFormRef);
        } else {
            this.ratepopupSubmit(this.rateFormRef);
        }
    }
}
