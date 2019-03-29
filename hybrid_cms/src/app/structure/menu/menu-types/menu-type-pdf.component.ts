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

declare var $: any;
declare var jQuery: any;

declare var NProgress: any;
declare var swal: any;

@Component({
    selector: 'app-menu-type-pdf',
    templateUrl: './menu-type-pdf.component.html',
    styleUrls: []
})
export class MenuTypePdfComponent implements OnInit, OnDestroy
{

    public menuTypePdfform: FormGroup;

    @Input('menuTypeSubPdfCssJsonData') menuSubCssJsonData: any;

    @Output('childPDFFormData') pdfFormOutgoingData = new EventEmitter<any>();

    public typeMenuform = {
        css_string_json:'',
    };
    fileList: FileList;
    is_file = false;
    rdata : any;
    rstatus : any;
    subMenuCssJsonData : any;
    getMenuTypeSubCssData:any;
    setdefaultPDfUrl :any;

     // declare subscription
    msgMenuJsonSubscrption: Subscription;
    cssJsonSubRes: any;
    preUrl: any;

    constructor(private commonService: CommonService, private fb: FormBuilder,private http: Http,private sharedService: SharedService, private msgMenuCssJson:MessageService)
    {
    }

    ngOnInit()
    {
        $(function ()
        {
            $('.dropify').dropify();
        });

        let cssObj = {
            'cssComponent': ''
        };

        this.msgMenuJsonSubscrption = this.msgMenuCssJson.getCssJsonData().subscribe(res =>
        {
            this.cssJsonSubRes = res.data;
            this.todoAfterCssJson();
        });

        let subFormData:FormData = new FormData();
        if(this.cssJsonSubRes.hasOwnProperty('pdfUrl') && typeof(this.cssJsonSubRes.pdfUrl) !== undefined)
        {
            this.preUrl = this.cssJsonSubRes.pdfUrl;
            subFormData.append('pdfUrl', this.cssJsonSubRes.pdfUrl);
        }
        subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));
        this.pdfFormOutgoingData.emit(subFormData);
    }

    ngOnDestroy(): void
    {
        this.msgMenuJsonSubscrption.unsubscribe();
    }

    todoAfterCssJson(): void
    {
        let self = this;
        if (this.cssJsonSubRes)
        {
            this.typeMenuform = this.cssJsonSubRes;
            this.setdefaultPDfUrl = this.cssJsonSubRes.pdfUrl;
        }
        else
        {
            // console.log('nothing');
        }
    }

    public sendMenuTypePdfFormData(data:any)
    {
        debugger;
        let subFormData:FormData = new FormData();
        if(this.fileList != null)
        {
            let file: File = this.fileList[0];
            subFormData.append('pdfUrlData', file);
        }
        // subFormData.append('url', this.typeMenuform.url);
        subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));

        console.log(subFormData);
        this.pdfFormOutgoingData.emit(subFormData);
    }

    fileUploadFileChange(event)
    {
        this.fileList = event.target.files;
        let file = event.target.files[0];
        // this.menuForm.controls['imageInput'].setValue(event.target.files[0].name);
        // this.typeMenuform.url = file.name;
        this.is_file = false;
    }

    removeFileChange(event)
    {
        this.fileList = event.target.files;
        this.is_file = true;
    }

    checkUrl(){
        debugger;
        $("#pdf_upload").val();
        if(this.fileList == null || this.fileList == undefined){
            if(this.setdefaultPDfUrl == null || this.setdefaultPDfUrl == undefined || this.setdefaultPDfUrl == ""){
                this.msgMenuCssJson.setUrlNull(true);
                this.preUrl = "";
            }
        }
        else{
            if(this.preUrl != this.fileList[0].name){
                this.preUrl = this.fileList[0].name;
                this.msgMenuCssJson.setdirtyChildActive(true);
            }
        }
    }
}
