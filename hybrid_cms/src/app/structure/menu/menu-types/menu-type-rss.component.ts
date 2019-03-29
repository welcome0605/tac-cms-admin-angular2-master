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
    selector: 'app-menu-type-rss',
    templateUrl: './menu-type-rss.component.html',
    styleUrls: []
})
export class MenuTypeRssComponent implements OnInit, OnDestroy
{
    public menuTypeRSSform: FormGroup;

    @Input('menuTypeSubRssCssJsonData') menuSubCssJsonData: any;

    @Output('childRSSFormData') RSSFormOutgoingData = new EventEmitter<any>();

    @Input('menuTypeRssSlugId') menuTypeMenuSlugId: any;

    public typeMenuform = {
        feed_url: '',
        css_string_json:''
    };

    private dirtyFormBool: boolean;
    rdata : any;
    rstatus : any;
    subMenuCssJsonData : any;
    bgCl: any;
    borderCl : any;
    fontcl : any;
    //gjc 0411
    bgColor_rgbaText: any;

    getMenuTypeSubCssData:any;

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

    subMenuTypeCollapsed:'';

    // declare subscription
    msgMenuJsonSubscrption: Subscription;
    cssJsonSubRes: any;
    subMenuFontTypeData:any;

    constructor(private cpService: ColorPickerService,
         private commonService: CommonService,
         private fb: FormBuilder,
         private http: Http,
         private sharedService: SharedService, 
         private msgMenuCssJson:MessageService)
    {
        this.subMenuTypeCollapsed = '';
    }

    ngOnInit()
    {
      this.commonService.getData('getFontData').subscribe(res => {
        this.subMenuFontTypeData = JSON.parse(res);
      })

        let cssObj = {
            'cssComponent': 'rss_feed_menu_css'
        };

        this.msgMenuJsonSubscrption = this.msgMenuCssJson.getCssJsonData().subscribe(res =>
        {
            this.cssJsonSubRes = res.data;
            this.todoAfterCssJson();
        });

        let subFormData:FormData = new FormData();

        subFormData.append('feed_url', this.typeMenuform.feed_url);
        subFormData.append('css_string_json',JSON.stringify(this.typeMenuform.css_string_json));

        this.RSSFormOutgoingData.emit(subFormData);
        //gjc 0411
         let value = this.cpService.outputFormat(this.cpService.stringToHsva(this.typeMenuform.css_string_json[0]['value'], true), 'rgba', null);
         this.bgColor_rgbaText = this.onChangeColorHex8(value);
    }

    ngOnDestroy(): void
    {
        this.msgMenuJsonSubscrption.unsubscribe();
    }

    todoAfterCssJson(): void
    {
        if (this.cssJsonSubRes)
        {
            this.typeMenuform = this.cssJsonSubRes;
        }
        else
        {
            // console.log('nothing');
        }
    }

    get getMenuTypeMenuSlugId():any
    {
        return this.menuTypeMenuSlugId;
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
    //gjc 0411
    onChangeBGColor(color: string): any
    {
        this.bgCl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
        this.msgMenuCssJson.setdirtyChildActive(true);
        return this.bgCl;
    }

    onChangeBorderColor(color: string): any
    {
        this.borderCl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
        this.msgMenuCssJson.setdirtyChildActive(true);
    }

    onChangefontcolor(color: string): any
    {
        this.fontcl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
        this.msgMenuCssJson.setdirtyChildActive(true);
    }

    public sendMenuTypeRSSFormData(data:any, i:any, colorPikerKey:any, childForm: NgForm)
    {
        if (childForm.dirty)
        {
            this.dirtyFormBool = childForm.dirty;
            this.msgMenuCssJson.setdirtyChildActive(this.dirtyFormBool);
            //  console.log(childForm, this.dirtyFormBool);
        }
        // console.log(this.subMenuCssJsonData);
        if(colorPikerKey !== null && colorPikerKey == 'bgColor')
        {
            //2018.04.11 gjc
            // this.typeMenuform.css_string_json[i]['value'] = this.bgCl;
            //this.bgCl = this.typeMenuform.css_string_json[i]['value'];
            this.bgColor_rgbaText = this.onChangeColorHex8(this.bgCl);
        }
        if(colorPikerKey !== null && colorPikerKey == 'borderColor')
        {
            this.typeMenuform.css_string_json[i]['value'] = this.borderCl;
        }
        if(colorPikerKey !== null && colorPikerKey == 'fontColor')
        {
            this.typeMenuform.css_string_json[i]['value'] = this.fontcl;
        }

        // console.log(this.typeMenuform);
        let subFormData:FormData = new FormData();

        subFormData.append('feed_url', this.typeMenuform.feed_url);
        subFormData.append('css_string_json',JSON.stringify(this.typeMenuform.css_string_json));

        // console.log(subFormData);
        this.RSSFormOutgoingData.emit(subFormData);
    }

    public onChangeColorHex8(color: string): string {
        console.log("updated!");
        const hsva = this.cpService.stringToHsva(color, true);
        return this.cpService.outputFormat(hsva, 'rgba', null);
    }

}
