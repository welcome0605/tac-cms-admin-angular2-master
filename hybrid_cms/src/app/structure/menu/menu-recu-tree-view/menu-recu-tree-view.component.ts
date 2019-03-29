import { Component, OnInit, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { ColorPickerService, Rgba } from 'ngx-color-picker';

// import for subscription
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { MessageService } from './../../../message.service';

import { BrowserModule, DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

import { CommonService } from './../../../common.service';
import { SharedService } from './../../../shared.service';

declare var $: any;
declare var jQuery: any;

declare var NProgress: any;
declare var swal: any;


@Component({
    selector: 'app-menu-recu-tree-view',
    templateUrl: './menu-recu-tree-view.component.html',
    styleUrls:['./menu-recu-tree-view.component.css']
})

export class MenuRecuTreeViewComponent implements OnInit {

    @Input('recursiveTreeview') recursiveTreeViewData: any;
    @Input('menuType') menuType:any;

    @Output('editMenuDetails') sendEditMenuOutgoingData = new EventEmitter<any>();
    @Output('removeMenu') sendRemoveMenuOutgoingData = new EventEmitter<any>();
    @Output('addListItem') sendAddListItemOutgoingData = new EventEmitter<any>();

    // declare subscription
    menuListJsonSubscrption: Subscription;
    recursiveTreeMenuViewData :any;
    deactiveFlagData: any;

    constructor(private cpService: ColorPickerService,
        private commonService: CommonService,
        private fb: FormBuilder,
        private http: Http,
        private sharedService: SharedService,
        private sanitizer: DomSanitizer,
        private menuListJson: MessageService)
    {
    }

    ngOnInit() {
        this.getDeactiveFlag();
    }

    public getDeactiveFlag(){
        this.deactiveFlagData = this.menuListJson.getItemChangeDeactive().subscribe( res=> {
            let data = JSON.parse(localStorage.getItem("emitReadyData"));
            if(res == true){
                this.sendEditMenuOutgoingData.emit(data);
            }
            else{
                return;
            }
        });
    }

    public sendEditMenuDetails(data: any) {
        if(localStorage.getItem("doDelItemMenu") ==  "true"){
            this.menuListJson.setMenuDeactive(false);
            return;
        }

        localStorage.setItem("emitReadyData", JSON.stringify(data));
        this.menuListJson.setMenuDeactive(true);
        if(this.canDeactivate() == true)
            this.sendEditMenuOutgoingData.emit(data);
        else
            return;
    }

    public sendRemoveMenu(data: any) {
        localStorage.setItem("doDelItemMenu", "true");
        this.sendRemoveMenuOutgoingData.emit(data);
    }

    public sendAddListItem(data: any) {
        this.sendAddListItemOutgoingData.emit(data);
    }

    public changeTabShow(event) {
      console.log(event);
    }

    canDeactivate() {
        if (NProgress.isStarted()) {
            NProgress.done();
        }
        let check_data = JSON.parse(localStorage.getItem("check_deactive_data"));
        if (check_data == null || check_data == undefined)
            check_data = [false, false, false];
        let is_menu_change = check_data[0];
        let boolChildFormDirty = check_data[1];
        let boolImageChangeValidDirty = check_data[2];
        let boolNullUrl = check_data[3];

        if(boolNullUrl){
            this.menuListJson.setMenuDeactive(false);
        }else if (!is_menu_change && !boolChildFormDirty && !boolImageChangeValidDirty) {
            return true;
        } else if (is_menu_change) {
            this.menuListJson.setMenuDeactive(false);
        } else if (boolChildFormDirty || boolImageChangeValidDirty) {
            this.menuListJson.setMenuDeactive(false);
        } else {
            return true;
        }
    }
}



