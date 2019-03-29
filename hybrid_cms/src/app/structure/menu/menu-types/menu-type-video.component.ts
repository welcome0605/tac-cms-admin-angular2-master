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
    selector: 'app-menu-type-video',
    templateUrl: './menu-type-video.component.html',
    styleUrls: []
})

export class MenuTypeVideoComponent implements OnInit, OnDestroy {
    public menuTypeVideoform: FormGroup;

    @Input('menuTypeSubVideoCssJsonData') menuSubCssJsonData: any;

    @Output('childVideoData') videoOutgoingData = new EventEmitter<any>();

    @Input('menuTypeVideoSlugId') menuTypeMenuSlugId: any;

    public typeMenuform = {
        video_url: '',
        css_string_json: '',
    };
    private dirtyFormBool: boolean;
    fileList: FileList;
    rdata: any;
    rstatus: any;
    subMenuCssJsonData: any;
    bgcl: any;
    fontcl: any;
    getMenuTypeSubCssData: any;

    subMenuFontTypeArray = [
        {
            "name": "Arial",
            "key": 1
        },
        {
            "name": "Times new roman",
            "key": 2
        },
        {
            "name": "Helvetica",
            "key": 3
        },
        {
            "name": "Oswald",
            "key": 4
        },
        {
            "name": "Machine regular",
            "key": 5
        },
        {
            "name": "Ui displayblack",
            "key": 6
        }
    ];

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
    subMenuTypeCollapsed: '';

    // declare subscription
    msgMenuJsonSubscrption: Subscription;
    cssJsonSubRes: any;

    constructor(private cpService: ColorPickerService, private commonService: CommonService, private fb: FormBuilder, private http: Http, private sharedService: SharedService, private msgMenuCssJson: MessageService) {
        this.subMenuTypeCollapsed = '';
    }


    ngOnInit() {
        $("[data-toggle=tooltip]").tooltip();
        var cssObj =
            {
                "cssComponent": 'single_video_menu_css'
            };
        this.msgMenuJsonSubscrption = this.msgMenuCssJson.getCssJsonData().subscribe(res => {
            this.cssJsonSubRes = res.data;
            this.todoAfterCssJson();
        });

        let subFormData: FormData = new FormData();

        subFormData.append('video_url', this.typeMenuform.video_url);
        subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));

        this.videoOutgoingData.emit(subFormData);
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

    get getMenuTypeMenuSlugId(): any {
        return this.menuTypeMenuSlugId;
    }

    onChangebgcolor(color: string): any {
        this.bgcl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
    }

    onChangefontcolor(color: string): any {
        this.fontcl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
    }

    subMenuCollapseOpen(menuTypeMenuSlugId) {
        if (this.subMenuTypeCollapsed !== menuTypeMenuSlugId) {
            var self = this;
            swal({
                title: "Are you sure?",
                text: "Changing Advanced Options without technical knowledge could lead to an undesired appearance",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-primary",
                confirmButtonText: "Accept",
                cancelButtonText: "Cancel",
                closeOnConfirm: true,
                closeOnCancel: true
            },
                (isConfirm) => {
                    if (isConfirm) {
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

    public sendMenuTypeVideoData(data: any, i: any, colorPikerKey: any, childForm: NgForm) {

        if (childForm.dirty || data.type === 'paste') {

            this.dirtyFormBool = true;
            this.msgMenuCssJson.setdirtyChildActive(this.dirtyFormBool);
            //  console.log(childForm, this.dirtyFormBool);
        }
        if (colorPikerKey !== null && colorPikerKey == 'backgroundColor') {
            this.typeMenuform.css_string_json[i]['value'] = this.bgcl;
        }
        if (colorPikerKey !== null && colorPikerKey == 'fontColor') {
            this.typeMenuform.css_string_json[i]['value'] = this.fontcl;
        }

        // this.typeMenuform.css_string_json = this.subMenuCssJsonData;
        // console.log(this.subMenuCssJsonData);
        // console.log('Send Data');

        let subFormData: FormData = new FormData();

        subFormData.append('video_url', this.typeMenuform.video_url);
        subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));

        // console.log(subFormData);
        this.videoOutgoingData.emit(subFormData);
    }

}
