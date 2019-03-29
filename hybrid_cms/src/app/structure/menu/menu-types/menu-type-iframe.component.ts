import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { CommonService } from './../../../common.service';
import { SharedService } from './../../../shared.service';

declare var $: any;
declare var jQuery: any;

declare var NProgress: any;
declare var swal: any;

@Component({
	selector: 'app-menu-type-iframe',
	templateUrl: './menu-type-iframe.component.html',
	styleUrls: []
})
export class MenuTypeIframeComponent implements OnInit
{
	public menuTypeImageform: FormGroup;

    @Input('menuTypeSubIframeCssJsonData') menuSubCssJsonData: any;

    @Output('childIframeFormData') iframeFormOutgoingData = new EventEmitter<any>();

    public typeMenuform = {
        title: '',
        web_url: '',
        css_string_json:'',
    };

    fileList: FileList;
    rdata : any;
    rstatus : any;
    subMenuCssJsonData : any;
    getMenuTypeSubCssData:any;

	constructor(private commonService: CommonService, private fb: FormBuilder,private http: Http,private sharedService: SharedService)
	{
	}

	ngOnInit()
	{
		let cssObj =
        {
            'cssComponent': 'iframe_menu_css'
        };

        if(this.menuSubCssJsonData.web_url !== '' && typeof(this.menuSubCssJsonData.web_url) !== "undefined" && this.menuSubCssJsonData.web_url !== null)
        {
            this.typeMenuform = this.menuSubCssJsonData;
        }
        else
        {
            this.commonService.postData(cssObj, 'isSubMenuCssDataExist').subscribe(res =>
            {
                this.rdata = JSON.parse(res);
                this.rstatus = this.rdata['status'];
                if(this.rstatus == 1)
                {
                    this.typeMenuform.css_string_json = JSON.parse(this.rdata['data']);
                }
                else
                {
                    this.typeMenuform.css_string_json = '';
                }
            });
        }
	}

    get getMenuSubCssJsonData():any
    {
        if(this.menuSubCssJsonData.web_url !== '' && typeof(this.menuSubCssJsonData.web_url) !== "undefined" && this.menuSubCssJsonData.web_url !== null)
        {
            // this.typeMenuform = this.menuSubCssJsonData;
            // return this.menuSubCssJsonData;
            return this.typeMenuform = this.menuSubCssJsonData;
        }
        else
        {
            return 'Something went to wrong';
        }
    }

	public sendMenuTypeIframeFormData(data:any)
    {
        // console.log(this.subMenuCssJsonData);
        // console.log(this.typeMenuform);

        let subFormData:FormData = new FormData();

        subFormData.append('title', this.typeMenuform.title);
        subFormData.append('web_url', this.typeMenuform.web_url);
        subFormData.append('css_string_json',JSON.stringify(this.typeMenuform.css_string_json));

        // console.log(subFormData);
        this.iframeFormOutgoingData.emit(subFormData);
    }

}
