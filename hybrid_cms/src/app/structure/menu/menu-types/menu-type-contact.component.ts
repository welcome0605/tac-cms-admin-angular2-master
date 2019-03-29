import { Component, OnInit, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ColorPickerModule } from 'ngx-color-picker';
import { ColorPickerService, Rgba } from 'ngx-color-picker';

// import for subscription
import { Subscription } from 'rxjs/Subscription';
import { MessageService } from './../../../message.service';

import { CommonService } from './../../../common.service';
import { SharedService } from './../../../shared.service';

import { config, defaultI18n, defaultOptions } from "./formbuilder/config";
import { FormBuilderCreateor } from "./formbuilder/form-builder";
import I18N from "./formbuilder/mi18n";
import * as $ from 'jquery';

declare var NProgress: any;
declare var swal: any;

function initJq() {
  (function ($) {
    (<any>$.fn).formBuilder = function (options) {
      if (!options) {
        options = {};
      }
      let elems = this;
      let {i18n, ...opts} = $.extend({}, defaultOptions, options, true);
      (<any>config).opts = opts;
      let i18nOpts = $.extend({}, defaultI18n, i18n, true);
      let instance = {
        actions: {
          getData: null,
          setData: null,
          setBackground: null,
          save: null,
          showData: null,
          setLang: null,  
          addField: null,
          removeField: null,
          clearFields: null
        },
        get formData() {
          return instance.actions.getData('json');
        },

        promise: new Promise(function (resolve, reject) {
          new I18N().init(i18nOpts).then(() => {
                elems.each(i => {
                  let formBuilder = new FormBuilderCreateor().getFormBuilder(opts, elems[i]);
                  
                  $(elems[i]).data('formBuilder', formBuilder);
                  instance.actions = formBuilder.actions;
                  console.log('formbuilder=>',formBuilder);
                });
         
            delete instance.promise;
            resolve(instance);
          }).catch(console.error);
        })

      };

      return instance;
    };
  })(jQuery);
}

@Component({
    selector: 'app-menu-type-contact',
    templateUrl: './menu-type-contact.component.html',
    styleUrls: [],
 
})

export class MenuTypeContactComponent implements OnInit, OnDestroy{
    formBuilder: any = null;

    @Input('menuTypeSubContactCssJsonData') menuSubCssJsonData: any;

    @Output('childContactFormData') contactFormOutgoingData = new EventEmitter<any>();



    public typeMenuform = {
      css_string_json: '',
      recipients_string_json: ''
    };

    private dirtyFormBool: boolean;
    private errorFormBool: boolean;
    fileList: FileList;
    rdata: any;
    rstatus: any;
    subMenuCssJsonData: any;
    getMenuTypeSubCssData: any;
    // declare subscription
    msgMenuJsonSubscrption: Subscription;
    cssJsonSubRes: any;
    formData_text: any;
    corruptImageList: any = [];
    recipients: Array<any> = [];
    currentFormDataContact: any;
    previousFormDataContact: any;

    constructor(
        private commonService: CommonService,
        private fb: FormBuilder,
        private http: Http,
        private sharedService: SharedService,
        private msgMenuCssJson: MessageService) {
    }   

    addToChangedList(event): void {
      
      this.corruptImageList.push(event.detail);
    }

    ngOnInit() {
      initJq();

      this.msgMenuJsonSubscrption = this.msgMenuCssJson.getCssJsonData().subscribe(res => {
        if (res.data.type != "contact")
            return;
        this.cssJsonSubRes = res.data;
        this.todoAfterCssJson();

        if (this.formBuilder && this.formBuilder.actions.setData) {
          this.formBuilder.actions.setData(this.formData_text);  
        }
      });

      let subFormData: FormData = new FormData();
      subFormData.append('css_string_json', this.typeMenuform.css_string_json);
      this.contactFormOutgoingData.emit(subFormData);
 
      var option = {
        formData: this.formData_text,
        dataType: 'json',
        disableFields: [
          'autocomplete',
          'slideshow',
          'checkbox',
          'checkbox-group',
          'date',
          'paragraph',
          'number',
          'radio-group',
          'select',
          'hidden',
          'button',
          'file',
          'textarea'
        ],
        controlConfig: {
          'textarea.tinymce': {
            css: '/assets/css/textarea-tinymce.css'
          }
        }
      }
      this.formBuilder = (<any>jQuery('.build-wrap-contact')).formBuilder(option); 
      this.recipients = JSON.parse(this.typeMenuform.recipients_string_json);
    }

    ngOnDestroy(): void {
      this.msgMenuJsonSubscrption.unsubscribe();
    }

    preSave()
    {
      // debugger;
      $('.build-wrap-contact .save-template').click();
      //0508 gjc
      this.currentFormDataContact = JSON.parse($('input#hidden-info').val());

      if ( this.previousFormDataContact.length != this.currentFormDataContact.length){
        this.msgMenuCssJson.setdirtyChildActive(true);
      }
      else{
        for(let i = 0; i < this.currentFormDataContact.length; i++){
          if(this.currentFormDataContact[i].value != this.previousFormDataContact[i].value){
            this.previousFormDataContact = this.currentFormDataContact;
            this.msgMenuCssJson.setdirtyChildActive(true);
            return;
          }
        }
      }
    }

    forward() {

    }

    backward() {

    }

    addRecipient() {
      this.recipients.push({
        email: ''
      });
    }

    removeRecipient(index) {
      this.recipients.splice(index, 1);
    }

    todoAfterCssJson(): void {
      if (this.cssJsonSubRes) {
          this.typeMenuform = this.cssJsonSubRes;
          console.log('dkdkdkdkdkdkdkdkdkd--->',this.typeMenuform);
          $('input#hidden-info').val(this.typeMenuform.css_string_json);
          this.formData_text = this.typeMenuform.css_string_json;
          //gjc 0509
          if(this.formData_text != "")
            this.previousFormDataContact = JSON.parse(this.typeMenuform.css_string_json);
      }
      else {
          
      }
    }

    viewSavedInfo(val: any) {
      
      let tmpJson =  $('input#hidden-info').val();
      $('input#hidden-info').val(val);
      
    }

    sendMenuTypeContactFormData( data: any, childForm: NgForm ) {
      
      let subFormData: FormData = new FormData();
      console.log('ddddddddddddddd=>',this.typeMenuform.css_string_json);
      subFormData.append('css_string_json', this.typeMenuform.css_string_json);
      // console.log(subFormData);
      this.contactFormOutgoingData.emit(subFormData);
  }
}