import { Component, OnInit, EventEmitter, Input, Output, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl, NgForm, NgModel } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ColorPickerModule } from 'ngx-color-picker';
import { ColorPickerService, Rgba } from 'ngx-color-picker';

// import for subscription
import { Subscription } from 'rxjs/Subscription';
import { MessageService } from './../../../message.service';

import { CommonService } from './../../../common.service';
import { SharedService } from './../../../shared.service';

declare var $: any;
declare var jQuery: any;

declare var NProgress: any;
declare var swal: any;

@Component({
    selector: 'app-menu-type-website',
    templateUrl: './menu-type-website.component.html',
    styleUrls: []
})

export class MenuTypeWebsiteComponent implements OnInit, OnDestroy {

    type = "Back Close".split(' ');
    model = { closing_type: '' };

    @ViewChild('menuTypeWebsite') menuTypeWebFormRef: NgForm;

    public menuTypeWebsiteform: FormGroup;

    @Input('menuTypeSubWebsiteCssJsonData') menuSubCssJsonData: any;

    @Output('childWebsiteFormData') websiteFormOutgoingData = new EventEmitter<any>();

    public typeMenuform = {
        web_url: '',
        css_string_json: '',
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

    constructor(private commonService: CommonService,
        private fb: FormBuilder,
        private http: Http,
        private sharedService: SharedService,
        private msgMenuCssJson: MessageService) {
    }

    ngOnInit() {
        const cssObj = {
            'cssComponent': 'web_view_menu_css'
        };
        this.msgMenuJsonSubscrption = this.msgMenuCssJson.getCssJsonData().subscribe(res => {
            this.cssJsonSubRes = res.data;
            this.todoAfterCssJson();
        });

        let subFormData: FormData = new FormData();
        subFormData.append('web_url', this.typeMenuform.web_url);
        subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));

        this.websiteFormOutgoingData.emit(subFormData);
    }

    ngOnDestroy(): void {
        this.msgMenuJsonSubscrption.unsubscribe();
    }

    todoAfterCssJson(): void {
        if (this.cssJsonSubRes) {
            this.typeMenuform = this.cssJsonSubRes;
        }
        else {
            // console.log('nothing');
        }
    }

    checkUrl(){
        debugger;
        if($("#web_url").val() == null || $("#web_url").val() == undefined || $("#web_url").val() == ""){
            this.msgMenuCssJson.setUrlNull(true);
        }
    }

    public sendMenuTypeWebsiteFormData(data: any, childForm: NgForm) {
        if (childForm.dirty) {
            debugger;
            this.dirtyFormBool = childForm.dirty;
            this.msgMenuCssJson.setdirtyChildActive(this.dirtyFormBool);
        }
        // if (this.menuTypeWebFormRef.control.controls.web_url.errors) {
        //     this.errorFormBool = true;
        //     this.msgMenuCssJson.setSaveDisable(this.errorFormBool);
        // } else {
        //     this.errorFormBool = false;
        //     this.msgMenuCssJson.setSaveDisable(this.errorFormBool);
        // }
        // console.log(this.subMenuCssJsonData);
        this.typeMenuform.css_string_json = this.subMenuCssJsonData;
        // console.log(this.typeMenuform);

        let subFormData: FormData = new FormData();

        // subFormData.append('title', this.typeMenuform.title);
        subFormData.append('web_url', this.typeMenuform.web_url);
        subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));

        // console.log(subFormData);
        this.websiteFormOutgoingData.emit(subFormData);
    }


}
