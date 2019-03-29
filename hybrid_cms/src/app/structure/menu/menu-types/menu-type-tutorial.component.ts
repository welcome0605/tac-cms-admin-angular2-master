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

import { environment } from '../../../../environments/environment';
import { Constants } from '../constants';

declare var $: any;
declare var jQuery: any;

declare var NProgress: any;
declare var swal: any;
// declare var file_count: any;

@Component({
    selector: 'app-menu-type-tutorial',
    templateUrl: './menu-type-tutorial.component.html',
    styleUrls: ['./menu-type-tutorial.component.css']
})
export class MenuTypeTutorialComponent implements OnInit, OnDestroy
{
    public menuTypeTutorialform: FormGroup;

    @Input('menuTypeSubTutorialCssJsonData') menuSubCssJsonData: any;

    @Output('childTutorialFormData') tutorialFormOutgoingData = new EventEmitter<any>();

    @Input('menuTypeTutorialSlugId') menuTypeMenuSlugId: any;

    get IMAGE() {
        return Constants.IMAGE;
    }

    get VIDEO() {
        return Constants.VIDEO;
    }

    public typeMenuform = {
        show_tutorial: '',
        css_string_json:'',
        media_data:[{
            type: this.IMAGE,
            url: ''
        }]
    };
    private dirtyFormBool: boolean;

    fileList: FileList;

    simpleArr = [];
    is_file = false;
    rdata : any;
    rstatus : any;
    fontcl : any;
    closecl:any;    

    removed_images_array = [];

    subMenuCssJsonData : any;

    subMenuAlignmentArray = [
        {
            "name": "Top",
            "key": 1
        },
        {
            "name": "Right",
            "key": 2
        },
        {
            "name": "Bottom",
            "key": 3
        },
        {
            "name": "Left",
            "key": 4
        },
        {
            "name": "Center",
            "key": 5
        }
    ];

    subMenuBorderStyleArray = [
        {
            "name": "Solid",
            "key": 1
        },
        {
            "name": "Double",
            "key": 2
        },
        {
            "name": "Dotted",
            "key": 3
        },
        {
            "name": "Dashed",
            "key": 4
        },
        {
            "name": "Groove",
            "key": 5
        },
        {
            "name": "Ridge",
            "key": 6
        }
    ];

    subMenuPositionTypeArray = [
        {
            "name": "absolute",
            "key": 1
        },
        {
            "name": "relative",
            "key": 2
        },
        {
            "name": "static",
            "key": 3
        },
        {
            "name": "fixed",
            "key": 4
        },
        {
            "name": "sticky",
            "key": 5
        }
    ]

    getMenuTypeSubCssData:any;

    subMenuTypeCollapsed:any;

    // declare subscription
    msgMenuJsonSubscrption: Subscription;
    cssJsonSubRes: any;
    subMenuFontTypeData:any;
    //gjc
    public isStartViewData: any;
    currentTutoMedia: any;
    previousTutoMedia: any;

    constructor(private cpService: ColorPickerService, private commonService: CommonService, private fb: FormBuilder, private http: Http,private sharedService: SharedService, private msgMenuCssJson:MessageService)
    {
        this.subMenuTypeCollapsed = '';
        localStorage.setItem("pre_tuto_data", "true");
    }

    ngOnInit()
    {
        let title = '';
        let is_file : boolean = false;
        let file_upload = null;
        var self = this;
        let setDefaultImage = `${environment.baseUrl}/upload/appicon/original/default.png`;
        this.removed_images_array = [];

        this.commonService.getData('getFontData').subscribe(res => {
          this.subMenuFontTypeData = JSON.parse(res);
        })

        this.msgMenuJsonSubscrption = this.msgMenuCssJson.getCssJsonData().subscribe(res =>
        {
            this.cssJsonSubRes = res.data;
            if (this.cssJsonSubRes)
            {
                this.typeMenuform = this.cssJsonSubRes;
                if(localStorage.getItem("pre_tuto_data") == "true"){
                    this.previousTutoMedia = this.typeMenuform.media_data;
                    localStorage.setItem("pre_tuto_data", "false");
                }
            }
            else
            {
                // console.log('nothing');
            }

            let bottom_html = "<input type='file' id='fileInput' name='files[]'/ accept='image/*'><canvas id='myCanvas' style='display:none;'></canvas><div id='modal'></div><div id='preview'><div class='buttons'><div class='cancel' style='background-size: 100% 100%;'></div><div class='ok' style='background-size: 100% 100%;'></div></div></div>";
            if (typeof($('#preview').html()) == 'undefined') {
                $('body').append(bottom_html);
            }
        });
        console.log(this.msgMenuJsonSubscrption);
    }

    ngOnDestroy(): void
    {
        this.msgMenuJsonSubscrption.unsubscribe();
    }

    
    get getMenuTypeMenuSlugId():any
    {
       return this.menuTypeMenuSlugId;
    }

    addFormHtml()
    {
        this.typeMenuform.media_data.push({
            type: this.IMAGE,
            url: ''
        });

        // var self = this;
        // let setDefaultImage = `${environment.baseUrl}/upload/appicon/original/default.png`;

        // $('#file_upload_'+self.min).dropify();
        // let drEventML = $('#file_upload_'+self.min).dropify({
        //     defaultFile:setDefaultImage
        // });
        // drEventML.on('dropify.beforeClear', function (event, element) {
        //     // console.log('appy');
        //     self.removeFileChange(event);
        // });
    }

    removeHtmlForm(i: any)
    {
        if (this.typeMenuform.media_data[i].type == this.IMAGE && this.typeMenuform.media_data[i].url.length > 0) {
            this.removed_images_array.push(this.typeMenuform.media_data[i].url);    
        }
        this.typeMenuform.media_data.splice(i, 1);
    }

    addCorruptImage(i: any)
    {
        if (this.typeMenuform.media_data[i].type == this.IMAGE && this.typeMenuform.media_data[i].url.length > 0) {
            this.removed_images_array.push(this.typeMenuform.media_data[i].url);
        }
    }

    subMenuCollapseOpen(menuTypeMenuSlugId)
    {
        if(this.subMenuTypeCollapsed !== menuTypeMenuSlugId)
        {
            var self = this;
            swal({
                title: "Are You Sure?",
                text: "Changing Advanced Options without technical knowledge could lead to an undesired appearance",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Accept",
                cancelButtonText: "Cancel",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            (isConfirm) =>
            {
                if (isConfirm)
                {
                    this.subMenuTypeCollapsed = menuTypeMenuSlugId;
                    swal({
                        title: "Successfully",
                        text: "Advanced Options open",
                        type: "success",
                        confirmButtonClass: "btn-success"
                    });
                } else {
                    this.subMenuTypeCollapsed = '';
                    swal({
                        title: "Cancelled",
                        text: "Not Open Advanced Options",
                        type: "error",
                        confirmButtonClass: "btn-danger"
                    });
                }
            });
        }
    }

    onChangeclosebtncolor(color: string): any
    {
        this.closecl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
        this.msgMenuCssJson.setdirtyChildActive(true);
    }

    onChangeBottomFontcolor(color: string): any
    {
        this.fontcl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
        this.msgMenuCssJson.setdirtyChildActive(true);
    }

    public sendMenuTypeTutorialFormData(data:any, i:any, colorPikerKey:any, childForm: NgForm)
    {
        if (childForm.dirty) {
            this.dirtyFormBool = childForm.dirty;
            this.msgMenuCssJson.setdirtyChildActive(this.dirtyFormBool);
            //  console.log(childForm, this.dirtyFormBool);
        }
        else if(colorPikerKey == 'fontSize'){
            this.msgMenuCssJson.setdirtyChildActive(true);
        }

        if(colorPikerKey !== null && colorPikerKey == 'backgroundColor')
        {
            this.typeMenuform.css_string_json[i]['value'] = this.closecl;
        }

        if(colorPikerKey !== null && colorPikerKey == 'bottomFontColor')
        {
            this.typeMenuform.css_string_json[i]['value'] = this.fontcl;
        }

        let subFormData:FormData = new FormData();
        if(this.fileList != null && this.simpleArr.length > 0)
        {
            let file: File = this.fileList[0];
            // let file: File = JSON.stringify(this.simpleArr);
            // subFormData.append('tutorialImage', JSON.stringify(this.simpleArr));
            for (let k = 0; k < this.simpleArr.length; k++)
            {
                let tag = ".tutorial_upload_" + k;
                var img = $(tag).parent().find('.dropify-preview .dropify-render img');
                console.log(img);
                if (img.length > 0) {
                    console.log("img load" + k);
                    console.log(k);
                    let blob = $('.tutorial_upload_' + k).converter2File();
                    var b: any = blob;
                    b.lastModifiedDate = new Date();
                    b.name = "app.png";
                    let blob_file = <File>blob;
                    if (blob_file != null) {
                        subFormData.append('tutorialImage[]', blob_file);
                    }
                } else {
                    console.log(subFormData);
                    for(let n = 0; n < k; n++) {
                        subFormData.delete('tutorialImage[]');
                        console.log(subFormData);
                    }
                    k = 0;
                }
                // subFormData.append('tutorialImage[]', this.simpleArr[k]);
            }
        }

        subFormData.append('show_tutorial', this.typeMenuform.show_tutorial);
        subFormData.append('start_view', this.isStartViewData);
        subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));
        subFormData.append('media_data', JSON.stringify(this.typeMenuform.media_data));

        this.tutorialFormOutgoingData.emit(subFormData);
    }

    fileUploadFileChange(event,i)
    {
        let tag = ".tutorial_upload_" + i;
        $(tag).simpleCropper(560,250);
        this.fileList = event.target.files;
        let file = event.target.files[0];
        // this.simpleArr.push(event.target.files);
        this.simpleArr[i] = event.target.files[0];
    }
    removeFileChange(event)
    {
        this.fileList = event.target.files;
        this.is_file = true;
    }

    changeRadioBtn(index: number, childForm: NgForm){

        this.isStartViewData = this.typeMenuform.css_string_json[index]['value'];
        if(this.isStartViewData == true){
            localStorage.setItem("tutorialStartView","true");
            this.msgMenuCssJson.setdirtyChildActive(true);
        }
        else{
            localStorage.setItem("tutorialStartView","false");
            this.msgMenuCssJson.setdirtyChildActive(true);
        }

        let subFormData:FormData = new FormData();
        subFormData.append('show_tutorial', this.typeMenuform.show_tutorial);
        subFormData.append('start_view', this.isStartViewData);
        subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));
        subFormData.append('media_data', JSON.stringify(this.typeMenuform.media_data));

        this.tutorialFormOutgoingData.emit(subFormData);
    }

    preSave(){
        this.currentTutoMedia = this.typeMenuform.media_data;

        if(this.currentTutoMedia.length != this.previousTutoMedia.length){
            this.msgMenuCssJson.setdirtyChildActive(true);
            this.previousTutoMedia = this.currentTutoMedia;
        }
        else{
            for(let i = 0; i < this.currentTutoMedia.length; i++){
                if(this.currentTutoMedia[i].url != this.previousTutoMedia[i].url){
                    this.previousTutoMedia = this.currentTutoMedia;
                    this.msgMenuCssJson.setdirtyChildActive(true);
                    return;
                }
            }
        }
    }
}
