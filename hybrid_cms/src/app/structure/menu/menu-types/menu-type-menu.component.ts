import { Component, OnInit, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ColorPickerModule } from 'ngx-color-picker';
import { ColorPickerService, Rgba } from 'ngx-color-picker';

// import for subscription
import { Subscription } from 'rxjs/Subscription';
import { MessageService } from './../../../message.service';

import { BrowserModule, DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

import { CommonService } from './../../../common.service';
import { SharedService } from './../../../shared.service';

declare var $: any;
declare var jQuery: any;

declare var NProgress: any;
declare var swal: any;

@Component({
    selector: 'app-menu-types',
    templateUrl: './menu-type-menu.component.html'
})

export class MenuTypeMenuComponent implements OnInit, OnDestroy {
    @Input('menuTypeSubImageCssJsonData') menuSubCssJsonData: any;
    @Output('childData') outgoingData = new EventEmitter<any>();

    @Input('menuTypeMenuSlugId') menuTypeMenuSlugId: any;

    public menuForm: FormGroup;
    //2018.02.20 gjc
    public bottomboder_rgbaText: string;
    public listbanner_rgbaText: string;
    public listbanner_border_rgbaText: string;
    public listtitle_font_rgbaText: string;
    public listtitle_background_rgbaText: string;


    public typeMenuform = {
        duration: '6',
        from: '1.3',
        to: '1',
        css_string_json: ''
    };

    menu_type_submenu = [];
    rdata: any;
    rstatus: any;
    private dirtyFormBool: boolean;
    app_id = '';
    currentAppData = [];
    listTitleBcl: any;
    listTitleFontcl: any;
    headercl: any;
    headerBorderCl: any
    bannercl: any;
    bannerBordercl: any;
    fileList: FileList;
    is_file = false;
    min: any;
    max: any;
    menucssData: any;
    
    showChildArray = [
        {
            "name": "Side",
            "key": 1
        },
        {
            "name": "Content",
            "key": 2
        }
    ];

    subMenuAlignmentArray = [
        {
            "name": "Right",
            "key": 1
        },
        {
            "name": "Left",
            "key": 2
        },
        {
            "name": "Center",
            "key": 3
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

    subMenuDisplayArray = [
        {
            "name": "Block",
            "key": 1
        },
        {
            "name": "Inline-block",
            "key": 2
        },
        {
            "name": "Inline",
            "key": 3
        },
        {
            "name": "Table",
            "key": 4
        },
        {
            "name": "Flex",
            "key": 5
        },
        {
            "name": "Inline-flex",
            "key": 6
        }
    ];

    subMenuFontTypeData: any;
    menuTypeSubMenuHtml = false;
    menuTypeSubMenuHtmlHidden = [true, true, true, true, true, true, true, true, true, true, true];
    subMenuTypeCollapsed: '';
    cssObj = {
        'cssComponent': 'image_menu_css'
    };

    // declare subscription
    msgMenuJsonSubscrption: Subscription;
    cssJsonSubRes: any;
    fontFamilyData: any;

    constructor(private cpService: ColorPickerService,
        private commonService: CommonService,
        private fb: FormBuilder,
        private http: Http,
        private sharedService: SharedService,
        private sanitizer: DomSanitizer,
        private msgMenuCssJson: MessageService)
    {
        this.currentAppData = this.commonService.get_current_app_data();
        this.app_id = this.currentAppData['id'];
        this.min = 0;
        this.max = 10;
        this.subMenuTypeCollapsed = '';
        // this.getAppMenuType();
    }

    // general menu css
    public onChangeColorHex8(color: string): string {
        console.log("updated!");
        const hsva = this.cpService.stringToHsva(color, true);
        return this.cpService.outputFormat(hsva, 'rgba', null);
    }

    ngOnInit()
    {
        const cssObj = {
            'cssComponent': 'image_menu_css'
        };
        this.commonService.getData('getFontData').subscribe(res => {
          this.subMenuFontTypeData = JSON.parse(res);
        })

        this.msgMenuJsonSubscrption = this.msgMenuCssJson.getCssJsonData().subscribe(res => {
            this.cssJsonSubRes = res.data;
            this.todoAfterCssJson();
        });

        const subFormData: FormData = new FormData();

        subFormData.append('duration', this.typeMenuform.duration);
        subFormData.append('from', this.typeMenuform.from);
        subFormData.append('to', this.typeMenuform.to);
        subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));

        this.outgoingData.emit(subFormData);
        //2018.02.21 gjc
        this.listbanner_rgbaText=this.cpService.outputFormat(this.cpService.stringToHsva(this.typeMenuform.css_string_json[6]['value'], true), 'rgba', null);
        this.bottomboder_rgbaText = this.cpService.outputFormat(this.cpService.stringToHsva(this.typeMenuform.css_string_json[4]['value'], true), 'rgba', null);
        this.listbanner_border_rgbaText = this.cpService.outputFormat(this.cpService.stringToHsva(this.typeMenuform.css_string_json[9]['value'], true), 'rgba', null);
        this.listtitle_font_rgbaText = this.cpService.outputFormat(this.cpService.stringToHsva(this.typeMenuform.css_string_json[21]['value'], true), 'rgba', null);
        this.listtitle_background_rgbaText = this.cpService.outputFormat(this.cpService.stringToHsva(this.typeMenuform.css_string_json[24]['value'], true), 'rgba', null);

        this.fontFamilyData = [];
        this.commonService.getData('getFontData').subscribe(res => {
          this.fontFamilyData = JSON.parse(res);
        })
        
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

    subMenuCollapseOpen(menuTypeMenuSlugId)
    {
        if (this.subMenuTypeCollapsed !== menuTypeMenuSlugId) {
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

    getAppMenuType()
    {
        let postData =
            {
                'app_basic_id': this.app_id
            }
        this.commonService.postData(postData, 'allmenutypedata').subscribe(res => {
            this.rdata = JSON.parse(res);
            this.rstatus = this.rdata['status'];
            if (this.rstatus == '1') {
                this.menu_type_submenu = this.rdata['data'];
            }
            else {
                let error_message = this.rdata['message'];
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

    onChangeHeadercolor(color: string): any {
        this.headercl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
        //  if any changes made into color selection set dirty true
        this.msgMenuCssJson.setdirtyChildActive(true);
    }

    //2018.02.20 gjc
    onChangeHeaderBordercolor(color: string): any {
        this.headerBorderCl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
        // if any changes made into color selection set dirty true
        this.msgMenuCssJson.setdirtyChildActive(true);
        return this.headerBorderCl;
    }
    //2018.02.20 gjc
    onChangeBannerBackcolor(color: string): any {
        this.bannercl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
        //  if any changes made into color selection set dirty true
        this.msgMenuCssJson.setdirtyChildActive(true);
        return this.bannercl;
    }
    //2018.02.20 gjc
    onChangeBannerBordercolor(color: string): any {
        this.bannerBordercl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
        //  if any changes made into color selection set dirty true
        this.msgMenuCssJson.setdirtyChildActive(true);
        return this.bannerBordercl;
    }
    //2018.02.20 gjc
    onChangeListTitleFontColor(color: string): any {
        this.listTitleFontcl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
        //  if any changes made into color selection set dirty true
        this.msgMenuCssJson.setdirtyChildActive(true);
        // return this.listTitleFontcl;
    }
    //2018.02.20 gjc
    onChangeListTitleBackcolor(color: string): any {
        this.listTitleBcl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
        //  if any changes made into color selection set dirty true
        this.msgMenuCssJson.setdirtyChildActive(true);
        return this.listTitleBcl;
    }

    imageFileChange(event) {
        this.fileList = event.target.files;
        let file = event.target.files[0];
    }

    public sendData(data: any, i: any, colorPikerKey: any, childForm: NgForm) {
        // if any child form dirty
        if (childForm.dirty) {
            this.dirtyFormBool = childForm.dirty;
            this.msgMenuCssJson.setdirtyChildActive(this.dirtyFormBool);
        }

        if (colorPikerKey !== null && colorPikerKey == 'kenburnHeaderColor') {
            this.typeMenuform.css_string_json[i]['value'] = this.headercl;
        }

        if (colorPikerKey !== null && colorPikerKey == 'bottomBorderColor') {
            this.headerBorderCl = this.typeMenuform.css_string_json[i]['value'];
            //2018.02.20 gjc
            this.bottomboder_rgbaText = this.onChangeColorHex8(this.headerBorderCl);
        }

        if (colorPikerKey !== null && colorPikerKey == 'listBannerBackground') {
            //2018.02.20 gjc
            this.bannercl = this.typeMenuform.css_string_json[i]['value'];
            this.listbanner_rgbaText = this.onChangeColorHex8(this.bannercl);
        }

        if (colorPikerKey !== null && colorPikerKey == 'listBannerBorderColor') {
            //2018.02.20 gjc
            this.bannerBordercl = this.typeMenuform.css_string_json[i]['value'];
            this.listbanner_border_rgbaText = this.onChangeColorHex8(this.bannerBordercl);
        }

        if (colorPikerKey !== null && colorPikerKey == 'listTitleFontColor') {
            //2018.02.20 gjc
            // this.listTitleFontcl = this.typeMenuform.css_string_json[i]['value'];
            // this.listtitle_font_rgbaText = this.onChangeColorHex8(this.listTitleFontcl);
            this.typeMenuform.css_string_json[i]['value'] = this.listTitleFontcl;
        }

        if (colorPikerKey !== null && colorPikerKey == 'listTitleBackgroundColor') {
            //2018.02.20 gjc
            this.listTitleBcl = this.typeMenuform.css_string_json[i]['value'];
            this.listtitle_background_rgbaText = this.onChangeColorHex8(this.listTitleBcl);
        }

        const subFormData: FormData = new FormData();

        subFormData.append('duration', this.typeMenuform.duration);
        subFormData.append('from', this.typeMenuform.from);
        subFormData.append('to', this.typeMenuform.to);
        subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));

        this.outgoingData.emit(subFormData);
    }







}
