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
    selector: 'app-menu-type-notification',
    templateUrl: './menu-type-notification.component.html',
    styleUrls: []
})
export class MenuTypeNotificationComponent implements OnInit, OnDestroy
{
    public menuTypeNotificationform: FormGroup;

    @Input('menuTypeSubNotificationCssJsonData') menuSubCssJsonData: any;

    @Output('childNotificationFormData') notificationOutgoingData = new EventEmitter<any>();

    @Input('menuTypeNotificationSlugId') menuTypeMenuSlugId: any;

    public typeMenuform = {
        notification_text_fields: [],
        css_string_json: ''
    };
    private dirtyFormBool: boolean;

    fileList: FileList;
    rdata: any;
    rstatus: any;
    subMenuCssJsonData: any;
    bordercl: any;
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

    subMenuTypeCollapsed: '';
    min: any;
    max: any;
    notificationFormHtmlAarry = [];

    // declare subscription
    msgMenuJsonSubscrption: Subscription;
    cssJsonSubRes: any;
    notificationAddedArray: any;
    subMenuFontTypeData:any;

    constructor(private cpService: ColorPickerService, private commonService: CommonService, private fb: FormBuilder, private http: Http, private sharedService: SharedService, private msgMenuCssJson: MessageService)
    {
        this.max = 10;
        this.subMenuTypeCollapsed = '';
        this.notificationAddedArray = 0;
    }

    ngOnInit()
    {
      this.commonService.getData('getFontData').subscribe(res => {
        this.subMenuFontTypeData = JSON.parse(res);
      })

        this.msgMenuJsonSubscrption = this.msgMenuCssJson.getCssJsonData().subscribe(res => {
            this.cssJsonSubRes = res.data;
            this.todoAfterCssJson();
        });

        
        this.min = this.typeMenuform.notification_text_fields.length;
        this.notificationAddedArray = this.cssJsonSubRes.notification_text_fields.length;

        if (this.notificationFormHtmlAarry.length == 0) {
            for (let i = 0; i < this.notificationAddedArray; i++) {
                this.notificationFormHtmlAarry.push(i);
            }
        }

        let subFormData: FormData = new FormData();
        subFormData.append('notification_text_fields', JSON.stringify(this.typeMenuform.notification_text_fields));
        subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));

        this.notificationOutgoingData.emit(subFormData);
    }

    ngOnDestroy(): void
    {
        this.msgMenuJsonSubscrption.unsubscribe();
    }

    todoAfterCssJson(): void
    {
        if (this.cssJsonSubRes) {
            this.typeMenuform = this.cssJsonSubRes;
        }
        else
        {
            // console.log('nothing');
        }
    }

    get getMenuTypeMenuSlugId(): any
    {
        return this.menuTypeMenuSlugId;
    }

    addFormHtml()
    {
        if (this.min <= this.max)
        {
            if (this.min > 0)
            {
                let testArray = {
                    add_text_field: ''
                };
                this.typeMenuform.notification_text_fields.push(testArray);
            }
            this.notificationFormHtmlAarry.push(this.min);
            this.min++;
        }
    }

    removeHtmlForm(i: any) {
        this.notificationFormHtmlAarry.splice(i, 1);
        this.typeMenuform.notification_text_fields.splice(i, 1);
        this.min--;
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

    onChangefontcolor(color: string): any {
        this.fontcl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
    }

    onChangeBorderColor(color: string): any {
        this.bordercl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
    }

    checkAllowStates(i: any) {
      if( this.typeMenuform.notification_text_fields[i]['is_allow'] == 1 )
        return true;
      else 
        return false;
    }

    public sendMenuTypeNotificationData(data: any, i: any, colorPikerKey: any, childForm: NgForm)
    {
        if (childForm.dirty)
        {
            this.dirtyFormBool = childForm.dirty;
            this.msgMenuCssJson.setdirtyChildActive(this.dirtyFormBool);
            //  console.log(childForm, this.dirtyFormBool);
        }
        if (colorPikerKey !== null && colorPikerKey == 'borderColor')
        {
            this.typeMenuform.css_string_json[i]['value'] = this.bordercl;
        }
        if (colorPikerKey !== null && colorPikerKey == 'fontColor') {
            this.typeMenuform.css_string_json[i]['value'] = this.fontcl;
        }
        
        if(colorPikerKey == 'change_allow') {
          if( this.typeMenuform.notification_text_fields[i]['is_allow'] == 1 ){
            this.typeMenuform.notification_text_fields[i]['is_allow'] = 0;
          }else if( this.typeMenuform.notification_text_fields[i]['is_allow'] == 0 ){
            this.typeMenuform.notification_text_fields[i]['is_allow'] = 1;
          }
        }        

        // console.log(this.typeMenuform);
        let subFormData: FormData = new FormData();

        subFormData.append('notification_text_fields', JSON.stringify(this.typeMenuform.notification_text_fields));
        subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));

        // console.log(subFormData);
        this.notificationOutgoingData.emit(subFormData);
    }

}
