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
import { forEach } from '@angular/router/src/utils/collection';

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
                  // console.log('formbuilder=>',formBuilder);
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
    selector: 'app-menu-type-content-editor',
    templateUrl: './menu-type-content-editor.component.html',
    styleUrls: ['./menu-type-content-editor.component.css']
})

export class MenuTypeContentEditorComponent implements OnInit, OnDestroy {
    formBuilder: any = null;
    pickedTheme: number = -1;

    @Input('menuTypeSubContentCssJsonData') menuSubCssJsonData: any;

    @Output('childContentFormData') contentFormOutgoingData = new EventEmitter<any>();

    public typeMenuform = {
      css_string_json: '',
      is_theme_picked: '',
      background: '#ffffff'
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
    themes: any = [];
    corruptImageList: any = [];
    previousFormData: any;
    currentFormData: any;

    constructor(
        private commonService: CommonService, 
        private fb: FormBuilder, 
        private http: Http, 
        private sharedService: SharedService, 
        private msgMenuCssJson: MessageService) {
    }

    themeChange(event): void {
      
      this.pickedTheme = event; // pickedTheme means theme id.
      // once pickedTheme change, pad hidden-info value with pickedTheme's json data.
      let picked = this.themes.find(theme => {
        return theme.id == this.pickedTheme;
      });

      if (this.pickedTheme > -1) {
        this.msgMenuCssJson.setSaveDisable(false);
      } else {
        this.msgMenuCssJson.setSaveDisable(true);
      }

      this.typeMenuform.background = picked.background;
      this.formBuilder.actions.setBackground(this.typeMenuform.background);

      this.formBuilder.actions.setData(picked.json_data);
      $('input#hidden-info').val(picked.json_data);
    }

    changeTextareaBackground(color): void {
      // console.log(event);
      // this.preSave();
      // let old_css_string_json = $('input#hidden-info').val();

      // JSON.parse(old_css_string_json).map((control, index) => {
      //   if (control.type != "textarea")
      //     return control;
        
      //   let html = $.parseHTML(control.value);
      //   let newHtml = "";
      //   let boolBackgroundContains = false;
      //   $.each(html, (i, el) => {
      //     if ($(el).hasClass("background")) {
      //       $(el).css("background-color", color);
      //       boolBackgroundContains = true;
      //     } 
      //     newHtml += el['outerHTML'] ? el['outerHTML'] : '';
      //   });
      //   if (!boolBackgroundContains)
      //     newHtml = `<div class="background" style="background-color: ${color};">${newHtml}</div>`;
      //   // control.value = `<div class="background" style="background-color: ${color};">${control.value}</div>`;
      //   control.value = newHtml;
      //   let fieldId = $(`#${control.name}-preview`).closest('li[type="textarea"]')[0].id;
      //   this.formBuilder.actions.addField(control, index);
      //   this.formBuilder.actions.removeField(fieldId, 0);      
      // });
      this.msgMenuCssJson.setdirtyChildActive(true);
      let iframes = $(".mce-edit-area iframe");
      iframes.toArray().forEach(iframe => {
        $("html", $(iframe).contents())[0].style.background = color;
        $("body", $(iframe).contents())[0].style.background = color;
      });
    }

    addToChangedList(event): void {
      this.corruptImageList.push(event.detail);
    }

    preSave()
    {
      debugger;
      $('.build-wrap .save-template').click();
      //0508 gjc
      this.currentFormData = $('input#hidden-info').val();
      this.currentFormData = JSON.parse(this.currentFormData);

      if(this.previousFormData == null || this.previousFormData == undefined){
        this.previousFormData = [];
      }

      if ( this.previousFormData.length != this.currentFormData.length){
        this.msgMenuCssJson.setdirtyChildActive(true);
      }
      else{
        for(let i = 0; i < this.currentFormData.length; i++){
          if(this.currentFormData[i].value != this.previousFormData[i].value){
            this.previousFormData = this.currentFormData;
            this.msgMenuCssJson.setdirtyChildActive(true);
            return;
          }
        }
      }
    }

    getContentThemes() {
      this.commonService.getData('fetchAllContentThemes').subscribe(res => {
        this.themes = JSON.parse(res)['data'];
      }, err => {
        console.log(err);
      });
    }

    ngOnInit() {
        initJq();
        this.getContentThemes();

        this.msgMenuJsonSubscrption = this.msgMenuCssJson.getCssJsonData().subscribe(res => {
          
          if (res.data.type != "content_editor")
            return;
          
          this.cssJsonSubRes = res.data;
          this.todoAfterCssJson();
          
          if (this.formBuilder && this.formBuilder.actions.setData) {
            this.formBuilder.actions.setData(this.formData_text);
            this.formBuilder.actions.setBackground(res.data.background);  
          }
        });

        let subFormData: FormData = new FormData();
        subFormData.append('css_string_json', this.typeMenuform.css_string_json);
        this.contentFormOutgoingData.emit(subFormData);      

        var option = {
            // formData: this.formData_text,
            dataType: 'json',
            disableFields: [
              'autocomplete',
              'button',
              'checkbox',
              'checkbox-group',
              'date',
              'text',
              'header',
              'paragraph',
              'number',
              'radio-group',
              'select',
              'hidden',
              'textbox'
            ],
            controlConfig: {
              'textarea.tinymce': {
                css: '/assets/css/textarea-tinymce.css'
              }
            }
        }
        this.formBuilder = (<any>jQuery('.build-wrap')).formBuilder(option);
        this.formBuilder.promise.then(resolve => {
          resolve.actions.setBackground(this.typeMenuform.background);
          resolve.actions.setData(this.formData_text);
        });
    }

    ngOnDestroy(): void {
      this.msgMenuJsonSubscrption.unsubscribe();
    }

    todoAfterCssJson(): void {
      if (this.cssJsonSubRes) {
          
          this.typeMenuform = this.cssJsonSubRes;
          console.log('dkdkdkdkdkdkdkdkdkd--->',this.typeMenuform);
          $('input#hidden-info').val(this.typeMenuform.css_string_json);
          this.formData_text    = this.typeMenuform.css_string_json;
          //gjc 0509
          if(this.formData_text != "")
            this.previousFormData = JSON.parse(this.typeMenuform.css_string_json);

          this.pickedTheme = this.typeMenuform.is_theme_picked ? +this.typeMenuform.is_theme_picked : -1;
      }
      else {
          this.pickedTheme = -1;
      }

      if (this.pickedTheme > -1) {
        this.msgMenuCssJson.setSaveDisable(false);
      } else {
        this.msgMenuCssJson.setSaveDisable(true);
      }
    }

    viewSavedInfo(val: any) {
      
      let tmpJson =  $('input#hidden-info').val();
      $('input#hidden-info').val(val);
      
    }

    sendMenuTypeContentFormData( data: any, childForm: NgForm ) {
      if (childForm.dirty) {
          this.dirtyFormBool = childForm.dirty;
          this.msgMenuCssJson.setdirtyChildActive(this.dirtyFormBool);
      }

      let subFormData: FormData = new FormData();
      console.log('ddddddddddddddd=>',this.typeMenuform.css_string_json);
      subFormData.append('css_string_json', this.typeMenuform.css_string_json);
      // console.log(subFormData);
      this.contentFormOutgoingData.emit(subFormData);
  }
}
