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
    selector: 'app-menu-type-list-menu',
    templateUrl: './menu-type-list-menu.component.html'
})

export class MenuTypeListMenuComponent implements OnInit, OnDestroy
{
    @Input('menuTypeSubListingCssJsonData') menuSubCssJsonData: any;
    @Input('menuIsChild') menuIsChildId: any;
    @Output('listMenuFormData') listMenuOutgoingData = new EventEmitter<any>();

    @Input('menuTypeListingMenuSlugId') menuTypeMenuSlugId: any;

    public typeMenuform =
    {
        show_child_on: '',
        css_string_json: ''
    };

    private dirtyFormBool: boolean;

// Yes means showChildForm on side and No means showChildForm on content

    showChildArray = [
        {
            "name": "No",
            "key": '1'
        },
        {
            "name": "Yes",
            "key": '2'
        }
    ];

    fileList: FileList;
    is_file = false;
    rdata: any;
    rstatus: any;
    subMenuCssJsonData: any;
    showParentForm = false;
    showChildForm = false;
    getMenuTypeSubCssData: any;
    bgcl: any;
    fontcl: any;
    bocl: any;

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

    // declare subscription
    msgMenuJsonSubscrption: Subscription;
    msgMenuIsChildData: Subscription;
    cssJsonSubRes: any;
    subMenuFontTypeData:any;

    constructor(private cpService: ColorPickerService, private commonService: CommonService, private fb: FormBuilder, private http: Http, private sharedService: SharedService, private msgMenuCssJson: MessageService)
    {
        this.subMenuTypeCollapsed = '';
    }

    ngOnInit()
    {
        this.commonService.getData('getFontData').subscribe(res => {
          this.subMenuFontTypeData = JSON.parse(res);
        })


        this.msgMenuIsChildData = this.msgMenuCssJson.getlistMenuShowChildData().subscribe( res =>
        {
            this.menuIsChildId = res.data;
            if (this.menuIsChildId.parentId == 0)
            {
                this.showParentForm = true;
                this.showChildForm = false;
            }
            else {
                this.showChildForm = true;
                this.showParentForm = false;
            }
        });
        this.msgMenuJsonSubscrption = this.msgMenuCssJson.getCssJsonData().subscribe(res => {
            this.cssJsonSubRes = res.data;
            this.todoAfterCssJson();
        });

        let subFormData: FormData = new FormData();
        /* gjc 0510 non reflect selected method
        if (this.menuIsChildId.parentId !== 0) {
            this.typeMenuform.show_child_on = '2';
        } */
        subFormData.append('show_child_on', this.typeMenuform.show_child_on);
        subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));

        this.listMenuOutgoingData.emit(subFormData);
    }

    ngOnDestroy(): void {
        this.msgMenuJsonSubscrption.unsubscribe();
    }

    todoAfterCssJson(): void
    {
        if (this.cssJsonSubRes) {
            this.typeMenuform = this.cssJsonSubRes;
        }
        else {
            console.log('nothing');
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

    onChangebgcolor(color: string): any {
        this.bgcl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
        this.msgMenuCssJson.setdirtyChildActive(true);
    }

    onChangefontcolor(color: string): any {
        this.fontcl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
        this.msgMenuCssJson.setdirtyChildActive(true);
    }

    onChangeBordercolor(color: string): any {
        this.bocl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
        this.msgMenuCssJson.setdirtyChildActive(true);
    }


    public sendMenuTypeListMenuData(data: any, i: any, colorPikerKey: any, childForm: NgForm)
    {
        // if any child form dirty
        if (childForm.dirty) {
            this.dirtyFormBool = childForm.dirty;
            this.msgMenuCssJson.setdirtyChildActive(this.dirtyFormBool);
            //  console.log(childForm, this.dirtyFormBool);
        }
        if (colorPikerKey !== null && colorPikerKey == 'fontColor') {
            this.typeMenuform.css_string_json[i]['value'] = this.fontcl;
        }

        if (colorPikerKey !== null && colorPikerKey == 'borderColor') {
            this.typeMenuform.css_string_json[i]['value'] = this.bocl;
        }

        let subFormData: FormData = new FormData();

        subFormData.append('show_child_on', this.typeMenuform.show_child_on);
        subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));

        // console.log(subFormData);
        this.listMenuOutgoingData.emit(subFormData);
    }

}
