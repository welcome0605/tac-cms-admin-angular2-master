import {
    Component, OnInit, Pipe, EventEmitter, Input, Output, ViewChild, ElementRef,
    AfterViewInit, OnDestroy, ChangeDetectorRef
} from '@angular/core';

import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { MenuTypeContentEditorComponent } from './menu-types/menu-type-content-editor.component';
import { MenuTypeContactComponent } from './menu-types/menu-type-contact.component';
import { MenuTypeTutorialComponent } from './menu-types/menu-type-tutorial.component';
import { MenuTypeRewardsComponent } from './menu-types/menu-type-rewards.component';
import { MenuTypeWebsiteComponent } from './menu-types/menu-type-website.component';
import { MenuTypePdfComponent } from './menu-types/menu-type-pdf.component';

import { MenuRecuTreeViewComponent } from './menu-recu-tree-view/menu-recu-tree-view.component';

import { CommonService } from './../../common.service';
import { SharedService } from './../../shared.service';
import { MessageService } from './../../message.service';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/forkJoin';

import { CanComponentDeactivate } from './../../can-deactivate-guard.service';
import { S3Service } from './../../s3.service';
import { environment } from './../../../environments/environment';

import { Constants } from './constants';

declare var $: any;
declare var jQuery: any;

declare var NProgress: any;
declare var swal: any;
declare var Ladda: any;

function matchCorrectSpace() {
    // const hasExclamation = input.value !== this.o_password.value;
    return (input: FormControl) => {
        return /^[^-\s][a-zA-Z0-9_\s-]+$/.test(input.value) ? null : {
            matchCorrectSpace: {
                valid: false
            }
        };
    }
}

@Component({
    selector: 'menu-configuration-page',
    templateUrl: './menu-configuration.component.html',
    styles:['#tabmenu-image-upload .image-upload-dropify { width: 200px; }']
})

export class MenuConfigurationComponent implements OnInit, CanComponentDeactivate, AfterViewInit, OnDestroy {
    @ViewChild('editMenuForm') editMenuFormRef: NgForm;
    @ViewChild('addMenuSaveBtn') addMenuSaveBtnRef: ElementRef;
    @ViewChild('saveMenuDisbleBtn') saveMenuDisbleBtnRef: ElementRef;
    @ViewChild('saveMenuOrderDisableBtn') saveMenuOrderDisableBtnRef: ElementRef;
    @ViewChild('contentEditor') contentEditorRef: MenuTypeContentEditorComponent | MenuTypeContactComponent;
    @ViewChild('tutorial') tutorialRef: MenuTypeTutorialComponent;
    @ViewChild('website') websiteRef: MenuTypeWebsiteComponent;
    @ViewChild('pdf') pdfRef: MenuTypePdfComponent;

    public form: FormGroup;
    public menuForm: FormGroup;
    //2018.02.24 gjc
    public check_selected_albumUrl: any;

    private snapShotCssJson: any;
    private boolChildFormDirty: boolean;
    private boolMenuNullUrl: boolean;
    private boolImageChangeValidDirty: boolean;
    private boolTabImageChangeValidDirty: boolean;
    private boolSaveDisable: boolean;
    private boolChildFormSub: Subscription;
    private MenuNullUrl: Subscription;
    private saveDisable: Subscription;

    rdata: any;
    storeData = [];
    rstatus: any;
    currentAppData = [];
    app_id = '';
    menuData = [];
    is_parent = 0;
    fileList: FileList;
    tabFileList:FileList;
    is_file = false;
    is_tabFile = false;
    is_menu_change = false;

    tab_show = 0;
    tab_menu_icon_image = '';
    menuTypeData = [];
    noMenuTypeFound = true;
    menuTypeFound = false;
    noMenuFound = false;
    menuFound = false;
    menuCreateMsg = false;

    menuTypeSel = 0;
    menuTypeHtml = false;
    menuTypeHtmlForm: SafeHtml;
    menuTypeHtmlHidden = [true, true, true, true, true, true, true, true, true, true, true];
    menuTypeSelValue = '';

    menuTypeMenuSlugData = '';
    finalMenuArray: any;
    finalSubArray: any;
    sampleChildData: any;
    menuTypeSubCssJsonData: any;
    parentMenuData: any;
    parentMenuType: any;
    menuNotSelected: any;
    menuTypeMenuSlugId: any;
    parent_menuType: any;
    menu_type: any;
    menuLocationArray = [
        {
            'name': 'Side Menu',
            'key': 1
        },
        {
            'name': 'Tab Menu',
            'key': 2
        }
    ];

    imageMenuTitle = false;

    menuTypeIsChild: any;
    menu_icon_name: '';
    menu_font_icon: '';
    menu_name = '';
    menu_level = 1;
    menu_id = 0;
    subMenuTypeCollapsed: '';
    iterableDiffers: any;
    dropifyId: any;
    drImgEvent: any;
    menuOriginalDataOnclick: any;
    image_input_img_name: any;
    //menu location type for TAB or SIDE
    menu_location_type:any;

    created_menu_id:-1;
    // jcr 416
    is_access_app_operation = true;
    //gjc 
    public canDeactiveFlag: any = false;
    public check_canDeactive_data= [];
    public preItemData: any;
    public curItemData: any;

    constructor(private sanitizer: DomSanitizer,
        private commonService: CommonService,
        private http: Http,
        private cssJsonService: MessageService,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef,
        private s3Service: S3Service,
        private router: Router) {
        
        this.currentAppData = this.commonService.get_current_app_data();
        
        this.app_id = this.currentAppData['id'];
        this.subMenuTypeCollapsed = '';

        this.boolChildFormSub = this.cssJsonService.getdirtyChildActive().subscribe(d => {
            this.boolChildFormDirty = d;
            // console.log(this.boolChildFormDirty, 'Child Menu changes detect in menu configuration');
        });
        this.MenuNullUrl = this.cssJsonService.getUrlNull().subscribe(res => {
            this.boolMenuNullUrl = res;
        });
        this.saveDisable = this.cssJsonService.getSaveDisable().subscribe(d => {
            this.boolSaveDisable = d;
            // console.log(this.boolChildFormDirty, 'Child Menu changes detect in menu configuration');
        });

        //jcr 416
		this.commonService.check_user_token_valid().subscribe(res => {
			if(res == false) {
			  this.router.navigate(['sign-in']);
			} else {
			  const currentuserdata = this.commonService.get_user_data();
			  const userRole = currentuserdata.role_id;
			  if (userRole !== 1) {
				this.is_access_app_operation = false;
			  }
			}
		  });

    }

    ngOnInit() {
        $("#mySidenav").css('display','');
        console.log("start post");
        $('.loadingbar').css('display','');
        let iFrameUrl = `${environment.baseUrl}/projects/${this.currentAppData['app_code']}/index.html`;
        //let iFrameUrl = 'http://192.168.100.112:1204/projects/'+this.currentAppData['app_code']+'/index.html';
        $('#native_preview').attr('src',iFrameUrl);
        $(function () {
            $('#nestable1').nestable();
            // $('.dropify').dropify();
            $('[data-toggle=tooltip]').tooltip();
        });

        $('#native_preview').on('load',function(){
            $('.loadingbar').css('display','none');  
            console.log('load the iframe')
        });

        $('#nestable1').nestable({
            maxDepth: 5,
        }).on('change', e => {
            if (this.is_menu_change === false) {
                this.is_menu_change = true;
                // console.log(this.is_menu_change);
            }
        });

        this.form = this.fb.group({
            menu_name: ['', Validators.compose([Validators.required, matchCorrectSpace()])],
            menu_type: ['', Validators.compose([Validators.required])]
        });

        const imageInput = null;

        if(parseInt(this.currentAppData['menu_location_type']) == 1) {
            this.menu_name = '';     
            this.menuForm = this.fb.group({
                menuId: '',
                parentId: '',
                menu_text: [null, Validators.compose([Validators.required])],
                imageInput: [null, Validators.compose([Validators.required])],
                existingFile: '',
                image_url: '',               
                tabImage_url: '',
                selct_menu_type: []
            });
        }else if(parseInt(this.currentAppData['menu_location_type']) == 2) {
            this.menu_name = '';     
            this.menuForm = this.fb.group({
                menuId: '',
                parentId: '',
                menu_text: [null, Validators.compose([Validators.required])],
                imageInput: [null, Validators.compose([Validators.required])],
                existingFile: '',
                image_url: '',
                tabImageInput: [null, Validators.compose([Validators.required])],
                tabExistingFile: '',
                tabImage_url: '',
                selct_menu_type: []
            });
        }
        

        if (this.form.dirty) {
            // console.log('sdffds');
        }

        this.getAppMenu();
        this.getAppMenuType();
        //gjc
        this.testCanDeactive();
        
    }

    ngAfterViewInit() {
        // console.log('nativeElement', this.cn1.nativeElement.class);
    }
    ngOnDestroy(): void {
        this.boolChildFormSub.unsubscribe();
        this.saveDisable.unsubscribe();
    }

    get IMAGE() {
        return Constants.IMAGE;
    }

    get VIDEO() {
        return Constants.VIDEO;
    }

    private onClickscrollUp(): void {
        $('[data-toggle=tooltip]').tooltip();
        $('html, body').animate({ scrollTop: 0 }, 400);
    }

    /**
     * canDeactivate Implementation
     */
    canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
        if (NProgress.isStarted()) {
            NProgress.done();
        }
        if(localStorage.getItem("doDelItemMenu") ==  "true"){
            this.is_menu_change = false;
            this.boolChildFormDirty =false;
            this.boolImageChangeValidDirty = false;
            localStorage.setItem("doDelItemMenu", "false");
            return false;
        }

        // console.log(this.boolImageChangeValidDirty, '<<<Bool Image dirty');
        // no menu change
        if(this.boolMenuNullUrl){
            return new Promise<boolean>((resolve, reject) => {
                swal({
                    title: 'You didn`t input URL!',
                    text: 'Would you like to delete this item?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonClass: 'btn-success',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    closeOnConfirm: false,
                    closeOnCancel: true
                },
                    (isConfirm) => {
                        // if accept yes
                        if (isConfirm) {
                            // console.log(this.editMenuFormRef.value);
                            // save form data 
                            // this.onMenuFormSubmit(this.editMenuFormRef);
                            this.deleteAppMenu(this.preItemData);
                            swal({
                                title: 'Successfully',
                                text: 'Data Deleted Successfully',
                                type: 'success',
                                confirmButtonClass: 'btn-success'
                            });
                            setTimeout(() => {
                                resolve(true);
                                this.boolMenuNullUrl = false;
                            }, 1400);
                        } else {
                            resolve(true);
                            this.boolMenuNullUrl = false;
                        }
                    });
            });
        } else if (!this.is_menu_change && !this.boolChildFormDirty && !this.menuForm.dirty && !this.boolImageChangeValidDirty) {
            return true;
        } else if (this.is_menu_change) {
            return new Promise<boolean>((resolve, reject) => {
                swal({
                    title: 'You didn`t save!',
                    text: 'You have unsaved changes, would you like to save?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonClass: 'btn-success',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    closeOnConfirm: false,
                    closeOnCancel: true
                }, (isConfirm) => {
                    // if accept yes
                    if (isConfirm) {
                        this.getOrderData();
                        swal({
                            title: 'Successfully',
                            text: 'Menu Changes Saved',
                            type: 'success',
                            confirmButtonClass: 'btn-success'
                        });
                        this.is_menu_change = false;
                        setTimeout(() => {
                            resolve(true);
                        }, 1000);
                    } else {
                        resolve(false);
                    }
                });
            });
        } else if (this.boolChildFormDirty || this.menuForm.dirty || this.boolImageChangeValidDirty) {
            // if any changes made in child componenet form show alert
            return new Promise<boolean>((resolve, reject) => {
                swal({
                    title: 'You didn`t save!',
                    text: 'You have unsaved changes, would you like to save?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonClass: 'btn-success',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    closeOnConfirm: false,
                    closeOnCancel: true
                },
                    (isConfirm) => {
                        // if accept yes
                        if (isConfirm) {
                            // console.log(this.editMenuFormRef.value);
                            // save form data 
                            this.onMenuFormSubmit(this.editMenuFormRef);
                            swal({
                                title: 'Successfully',
                                text: 'Data Saved Successfully',
                                type: 'success',
                                confirmButtonClass: 'btn-success'
                            });
                            setTimeout(() => {
                                resolve(true);
                                this.boolChildFormDirty = false;
                                this.boolImageChangeValidDirty = false;
                                this.check_canDeactive_data = [this.is_menu_change, this.boolChildFormDirty, this.boolImageChangeValidDirty];
                                localStorage.setItem("check_deactive_data", JSON.stringify(this.check_canDeactive_data));
                                this.cssJsonService.setItemChangeDeactive( true );
                            }, 1400);
                        } else {
                            resolve(true);
                            this.boolChildFormDirty = false;
                            this.boolImageChangeValidDirty = false;
                            this.check_canDeactive_data = [this.is_menu_change, this.boolChildFormDirty, this.boolImageChangeValidDirty];
                            localStorage.setItem("check_deactive_data", JSON.stringify(this.check_canDeactive_data));
                            // this.cssJsonService.setItemChangeDeactive( true );
                        }
                    });
            });
        } else {
            return true;
        }
    }

    callToolTip() {
        return $(function () {
            $('[data-toggle=tooltip]').tooltip();
        });
    }

    getAppMenu(): void {
        // NProgress.start();
        const handlerTimestart = Observable.timer(1000);
        const handlerTimeend = Observable.timer(2000);
        handlerTimestart.subscribe(() => {
            NProgress.start();
        });
        const postData = {
            'app_basic_id': this.app_id
        }
        this.commonService.postData(postData, 'appmenudata').subscribe(res => {
            this.rdata = JSON.parse(res);
            this.rstatus = this.rdata['status'];
            if (+(this.rstatus) == 1 && this.rdata['data'].length !== 0) {
                this.callToolTip();
                this.noMenuFound = true;
                this.menuCreateMsg = false;
                this.menuFound = false;
                this.menuData = this.rdata['data'];
                this.cssJsonService.setMenuListData(this.menuData);

                if(this.created_menu_id != -1){                  
                  setTimeout( this.editCreatedMenuDetails(this.created_menu_id, this.menuData), 1000);
                }
                handlerTimeend.subscribe(() => {
                    NProgress.done();
                });
                // NProgress.done();
            } else {
                this.noMenuFound = false;
                this.menuCreateMsg = true;
                this.callToolTip();
                this.menuFound = false;
                const error_message = this.rdata['message'];

                handlerTimeend.subscribe(() => {
                    NProgress.done();
                });

            }
        });
    }

    afterSaveGetAppMenu() {
        NProgress.start();
        const postData = {
            'app_basic_id': this.app_id
        }
        this.commonService.postData(postData, 'appmenudata').subscribe(res => {
            NProgress.done();
            this.rdata = JSON.parse(res);
            this.rstatus = this.rdata['status'];
            if (+(this.rstatus) == 1) {
                this.menuData = this.rdata['data'];
                this.cssJsonService.setMenuListData(this.menuData);
            }
            else {
                this.noMenuFound = false;
                this.menuCreateMsg = true;
                this.callToolTip();
                this.menuFound = false;
                const error_message = this.rdata['message'];
            }
        });
    }

    getAppMenuType() {
        NProgress.start();
        const postData = {
            'app_basic_id': this.app_id
        }
        this.commonService.postData(postData, 'allmenutypedata').subscribe(res => {
            this.rdata = JSON.parse(res);
            this.rstatus = this.rdata['status'];
            if (+(this.rstatus) == 1) {
                NProgress.done();
                this.noMenuTypeFound = false;
                this.menuTypeFound = true;
                this.menuTypeData = this.rdata['data'];
                // console.log(this.menuTypeData);
            }
            else {
                NProgress.done();
                let error_message = this.rdata['message'];
                // $(function() {
                //     $.notify({
                //         title: '',
                //         message: error_message
                //     },{
                //         type: 'danger'
                //     });
                // });
            }
        });
    }

    setIsParent(id: any) {
        this.is_parent = id;
    }

    clickCreateMenu() {
      
      $('#selMenuType').html();
      
      let optionList = '<option value="" selected>Select Menu Type</option>';

      this.menuTypeData.forEach(menu_type => {
        optionList += '<option value="'+menu_type.menuTypeId+'">'+menu_type.menuTypeName+'</option>';
      });
      $('#selMenuType').html(optionList);
    }

    clickAddListItem(data) {
      
      this.setIsParent(data.id);
      $('#selMenuType').html();
      
      let optionList = '<option value="" selected>Select Menu Type</option>';
      let enableListMenu = this.checkEnableListMenu(data);
      this.menuTypeData.forEach(menu_type => {
        if( menu_type.menuTypeId == 4 && !enableListMenu)
          return true;
        if( menu_type.menuTypeId == 1 && !enableListMenu)
          return true;
        optionList += '<option value="'+menu_type.menuTypeId+'">'+menu_type.menuTypeName+'</option>';
      });
      $('#selMenuType').html(optionList);
    }

    clickAddAnimatedPanel(data) {
      
      this.setIsParent(data.id);
      $('#selMenuType').html();
      
      let optionList = '<option value="" selected>Select Menu Type</option>';
      let enableListMenu = this.checkEnableListMenu(data);

      this.menuTypeData.forEach(menu_type => {        
        if( menu_type.menuTypeId == 4 && !enableListMenu)
          return true;
        if( menu_type.menuTypeId == 1 && !enableListMenu)
          return true;
        optionList += '<option value="'+menu_type.menuTypeId+'">'+menu_type.menuTypeName+'</option>';
      });
      $('#selMenuType').html(optionList);
    }

    selectedParentMenuData:any;
    checkEnableListMenu(data) {
      if( data.is_parent == 0 )
        return true;        
      else
        return false;
    }
    
    editCreatedMenuDetails(id, menuData) {
      menuData.forEach(element => {
        if(id == element.id){
          this.editMenuDetails(element);
          return;
        }
        if(element.hasOwnProperty('children') && element.children.length > 0) {
          this.editCreatedMenuDetails(id, element.children);          
        }
      });
    }

    getOrderData() {
        NProgress.start();
        this.saveMenuOrderDisableBtnRef.nativeElement.disabled = true;
        var finalArray = [];
        var self = this;
        var orderMenuArray = [];
        var orderSubMenuArray = [];
        $(function () {
            $('#my_screen .dd3-content').each(function () {
                var menuData = $(this).data('id').split('parent');
                var menu_ide = $(this).data('ide');
                // var subData = $(this).data('id').split('child');

                // console.log(menuData);
                // console.log('MenuData');
                // console.log(subData);
                // console.log('subData');

                if (menuData.indexOf('parent')) {
                    const mainMenuData = $(this).data('id').split('parent');
                    if (mainMenuData[1] !== undefined) {
                        const menu = {
                            'menu': mainMenuData[1],
                            'ide': menu_ide
                        };
                        finalArray.push(menu);
                    }
                }
                // if (subData.indexOf('child')) {
                //     var subMenuData = $(this).data('id').split('child');
                //     if (subMenuData[1] != undefined) {
                //         var submenu = 'submenu:' + subMenuData[1];
                //         finalArray.push(submenu);
                //     }
                // }
            });
            // console.log(finalArray);
            // console.log('sdffds');
            self.changeAddScreenShotOrder(finalArray);
        });
    }

    changeAddScreenShotOrder(finalArray) {
        this.commonService.custompostData({ 'finalArray': finalArray }, 'storeOrderedMenuData').subscribe(res => {
            this.rdata = JSON.parse(res);
            this.rstatus = this.rdata['status'];
            if (this.rstatus === 1) {
                this.saveMenuOrderDisableBtnRef.nativeElement.disabled = false;
                NProgress.done();
                // $('#createmenu').modal('toggle');
                const success_message = this.rdata['message'];
                this.getAppMenu();
                $(function () {
                    $.notify({
                        title: '',
                        message: success_message
                    }, {
                            type: 'success'
                        });
                });
                this.FastGenerateJson();
            } else {
                this.saveMenuOrderDisableBtnRef.nativeElement.disabled = false;
                NProgress.done();
                const error_message = this.rdata['message'];
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

    onSubmit(form: NgForm) {
        console.log("start post");
        $('.loadingbar').css('display',''); 
        console.log($('.loadingbar'));
        for(let i = 0; i < this.menuData.length; i++){
            if((form.value.menu_type == 10 && this.menuData[i].name == "App Tutorial") 
            || (form.value.menu_type == 6 && this.menuData[i].name == "Notifications")){
                $(function () {
                    $.notify({
                        title: '',
                        message: " You can only have one this item. "
                    }, {
                            type: 'danger'
                        });
                });
                $('#createmenu').modal('toggle');
                return;
            }
        }
        this.addMenuSaveBtnRef.nativeElement.disabled = true;
        NProgress.start();
        form.value.app_basic_id = this.app_id;
        form.value.is_parent = this.is_parent;
        form.value.current_user = JSON.stringify([{ email: JSON.parse(localStorage.getItem('currentUser')).email }]);
        
        this.commonService.postData(form.value, 'saveappmenu').subscribe(res => {
            this.is_parent = 0;
            this.rdata = JSON.parse(res);
            this.rstatus = this.rdata['status'];
            if (+(this.rstatus) == 1) {
                this.addMenuSaveBtnRef.nativeElement.disabled = false;
                NProgress.done();
                form.resetForm();
                $('#createmenu').modal('toggle');
                const success_message = this.rdata['message'];
                this.created_menu_id = this.rdata.details.id;
                this.getAppMenu();
                $(function () {
                    $.notify({
                        title: '',
                        message: success_message
                    }, {
                            type: 'success'
                        });
                });
            } else {
                this.addMenuSaveBtnRef.nativeElement.disabled = false;
                NProgress.done();
                const error_message = this.rdata['message'];
                $(function () {
                    $.notify({
                        title: '',
                        message: error_message
                    }, {
                            type: 'danger'
                        });
                });
            }
        }, err => {
            $('#createmenu').modal('toggle');
        }, () => {
            console.log("launch emulator");
            this.FastGenerateJson();
        });
    }

    appIconFileChange(event)
    {
        this.fileList = event.target.files;
        const file = event.target.files[0];
        this.menuForm.controls['existingFile'].setValue(this.image_input_img_name);
        this.menuForm.controls['imageInput'].setValue(event.target.files[0].name);
        this.is_file = false;
        this.boolImageChangeValidDirty = true;
    }

    tabmenuIconFileChange(event)
    {
        this.tabFileList = event.target.files;
        const file = event.target.files[0];
        this.menuForm.controls['tabExistingFile'].setValue(this.tab_menu_icon_image);
        this.menuForm.controls['tabImageInput'].setValue(event.target.files[0].name);
        this.is_tabFile = false;
        this.boolImageChangeValidDirty = true;
    }

    subMenuCollapseOpen(menuTypeMenuSlugId) {
        if (this.subMenuTypeCollapsed !== menuTypeMenuSlugId) {
            const self = this;
            swal({
                title: 'Are you sure?',
                text: 'Changing Advanced Options without technical knowledge could lead to an undesired appearance',
                type: 'warning',
                showCancelButton: true,
                confirmButtonClass: 'btn-success',
                confirmButtonText: 'Accept',
                cancelButtonText: 'Cancel',
                closeOnConfirm: true,
                closeOnCancel: true
            },
                (isConfirm) => {
                    if (isConfirm) {
                        this.subMenuTypeCollapsed = menuTypeMenuSlugId;
                        swal({
                            title: 'Successfully',
                            text: 'Advanced Options open',
                            type: 'success',
                            confirmButtonClass: 'btn-success'
                        });
                    } else {
                        this.subMenuTypeCollapsed = '';
                        swal({
                            title: 'Cancelled',
                            text: 'Not Open Advanced Options',
                            type: 'error',
                            confirmButtonClass: 'btn-danger'
                        });
                    }
                });
        }
    }

    // revert back
    revertBack(): void {
        if (this.snapShotCssJson) {
            swal({
                title: 'Are you sure?',
                text: 'You want to revert back with previous data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonClass: 'btn-warning',
                confirmButtonText: 'Yes, Revert Back',
                cancelButtonText: 'Cancel',
                closeOnConfirm: false,
                closeOnCancel: true
            }, (isConfirm) => {
                if (isConfirm) {
                    this.editMenuDetails(this.snapShotCssJson);
                    swal({
                        title: 'Success!',
                        text: 'Your record revert back.',
                        type: 'success',
                        confirmButtonClass: 'btn-success'
                    });
                    if (this.boolChildFormDirty === true) {
                        // reset all dirty state after revert back
                        // this.resetAlldirty();
                        this.boolChildFormDirty = false;
                        this.boolImageChangeValidDirty = false;
                    }
                } else {
                    // swal({
                    //     title: 'Cancelled',
                    //     text: 'Your record is safe :)',
                    //     type: 'error',
                    //     confirmButtonClass: 'btn-danger'
                    // });
                }
            });

        } else {
            console.log('snapshot empty..!!');
        }
    }


    editMenuDetails(data) {
        this.preItemData = this.curItemData;
        this.curItemData = data;

        // boolSaveDisable false for save button
        this.fileList = null;
        this.tabFileList = null;

        this.boolSaveDisable = false;

        // for dropify reset
        
        $('.dropify-render img').attr('src', null);
        // for revert logic
        this.menuOriginalDataOnclick = data;        
        this.onClickscrollUp();

        //format just created menu data
        this.created_menu_id = -1;

        // for revert logic
        this.snapShotCssJson = data;
        this.dropifyId = data.id;

        this.menu_icon_name = data.menu_type_icon_name;
        this.menu_font_icon = data.menu_type_icon;
        this.menu_level = data.menu_level;        

        if(parseInt(this.currentAppData['menu_location_type']) == 2) {  
          if(data.hasOwnProperty('tab_show')) {
            this.tab_show = data.tab_show;
          }else {
            this.tab_show = 0;
          }
        }else {
          this.tab_show = 0;
        }                

        let parentId = data.is_parent;

        if (parentId === 0) {
            // this ref
            var self = this;
            this.image_input_img_name = '';
            this.noMenuFound = false;
            this.menuFound = true;
            this.menuCreateMsg = false;
            
            this.menu_id = data.id;
            let menuId = data.id;
            let menu_text = data.menu_name;
            
            this.imageMenuTitle = false;            
            
            if (data.menu_type === 0 || data.menu_type == null) {
                this.menuTypeSelValue = null;
                this.menuNotSelected = null;
                this.menuTypeHtml = false;
            } else {
                this.menuTypeMenuSlugData = this.menuTypeData[0 + (data.menu_type - 1)]['menuTypeSlug'];
                this.menuTypeMenuSlugId = this.menuTypeMenuSlugData + '_' + data.id;

                this.menuTypeSelValue = data.menu_type;
                this.menuNotSelected = data.menu_type;

                this.menuTypeHtml = true;
                for (let x in this.menuTypeHtmlHidden) {
                    if (this.menuTypeHtmlHidden.hasOwnProperty(x)) {
                        this.menuTypeHtmlHidden[x] = false;
                    }
                }
                this.menuTypeHtmlHidden[data.menu_type - 1] = true;
            }

            this.menuTypeIsChild =
                {
                    'menuId': menuId,
                    'parentId': parentId,
                    'menu_text': menu_text
                };

            this.cssJsonService.setListMenuShowChildData(this.menuTypeIsChild);

            if (data.menu_type_json_data !== null && data.menu_type_json_data.length > 0) {
                this.menuTypeSubCssJsonData = JSON.parse(data.menu_type_json_data);
                this.cssJsonService.setCssJsonData(this.menuTypeSubCssJsonData);
            }
            else {
                this.menuTypeSubCssJsonData = '';
                this.cssJsonService.setCssJsonData(this.menuTypeSubCssJsonData);
            }

            this.image_input_img_name = environment.defaultIcon;
            if( !data.menu_icon ) {
                this.image_input_img_name = data.menu_icon;
            }

            if(parseInt(this.currentAppData['menu_location_type']) == 1) {  
                this.menu_name = menu_text;   
                this.menuForm = this.fb.group({
                    menuId: menuId,
                    parentId: parentId,
                    menu_text: [menu_text, Validators.compose([Validators.required])],                   
                    selct_menu_type: [this.menuTypeSelValue, []],
                });
            }else if(parseInt(this.currentAppData['menu_location_type']) == 2) {

                let dropifyMenuImageUploadId: any;
                dropifyMenuImageUploadId = '#tabmenu_image_upload_' + this.dropifyId;

                if(data.menu_icon == undefined || data.menu_icon.length <= 0){
                    this.tab_menu_icon_image = environment.defaultIcon;
                }else{
                    this.tab_menu_icon_image = data.menu_icon;
                }
                this.menu_name = menu_text;
                this.menuForm = this.fb.group({
                    menuId: menuId,
                    parentId: parentId,
                    menu_text: [menu_text, Validators.compose([Validators.required])],
                    tabImageInput: [this.tab_menu_icon_image, Validators.compose([Validators.required])],
                    tabExistingFile: [this.tab_menu_icon_image, Validators.compose([Validators.required])],
                    selct_menu_type: [this.menuTypeSelValue, []],
                });

                setTimeout( () => {
                    const subdrEventTab = $(dropifyMenuImageUploadId).dropify({
                        defaultFile: self.tab_menu_icon_image,
                        messages: {
                            'default': 'Drag and drop a file here or click',
                            'replace': 'Drag and drop or click to replace',
                            'remove': 'Remove',
                            'error': ''
                        },
                        tpl: {
                            wrap: '<div class="dropify-wrapper"></div>',
                            loader: '<div class="dropify-loader"></div>',
                            message: '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
                            preview: '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
                            filename: '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
                            clearButton: '<button type="button" class="dropify-clear">{{ remove }}</button>',
                            errorLine: '<p class="dropify-error">{{ error }}</p>',
                            errorsContainer: '<div class="dropify-errors-container">The image uploaded is not (128x128), please upload your image in these dimensions</div>'
                        }
                    });
    
                    let bottom_html = "<input type='file' id='fileInput' name='files[]'/ accept='image/*'><canvas id='myCanvas' style='display:none;'></canvas><div id='modal'></div><div id='preview'><div class='buttons'><div class='cancel' style='background-size: 100% 100%;'></div><div class='ok' style='background-size: 100% 100%;'></div></div></div>";
    
                    if (typeof($('#preview').html()) == 'undefined') {
                        $('body').append(bottom_html);
                    }
    
                    $(dropifyMenuImageUploadId).on('change',function(){
                        $('#tabmenu-image-upload .image-upload-dropify').simpleCropper(128,128);
                    });
                                    
    
                    let checkDropifyClass = $("#tabmenu-image-upload .dropify-wrapper").hasClass("has-preview");
                    if (!checkDropifyClass) {
                        $("#tabmenu-image-upload .dropify-wrapper").removeClass("has-error").addClass("has-preview");
                        $('#tabmenu-image-upload .dropify-wrapper .dropify-preview').css('display', 'block')
                        $('#tabmenu-image-upload .dropify-wrapper .dropify-preview .dropify-render').prepend('<img src="" />')
                    }
    
                    subdrEventTab.on('#tabmenu-image-upload dropify.beforeClear', function (event, element) {
                        self.onClickOnDropify(event, element)
                            .then(res => {
                                if (res === true) {
                                    self.removeTabFileOnDropify(event, subdrEventTab);
                                } else {
                                    $('#tabmenu-image-upload .dropify-render img').attr('src', self.tab_menu_icon_image);
                                }
                            });
                        return false;
                    });
    
                    subdrEventTab.on('#tabmenu-image-upload dropify.afterClear', function (event, element) {
                        // self.removeFileChange(event);
                        self.removeTabFileChange(event, subdrEventTab);
                    });
    
                    subdrEventTab.on('#tabmenu-image-upload dropify.error.minWidth', function (event, element) {
                        self.removeTabFileChange(event, subdrEventTab);
                        // decline imge dirty status coz of error
                        self.boolImageChangeValidDirty = false;
                    });
    
                    subdrEventTab.on('#tabmenu-image-upload dropify.error.maxWidth', function (event, element) {
                        self.removeTabFileChange(event, subdrEventTab);
                        // decline imge dirty status coz of error
                        self.boolImageChangeValidDirty = false;
                    });
    
                    subdrEventTab.on('#tabmenu-image-upload dropify.error.minHeight', function (event, element) {
                        self.removeTabFileChange(event, subdrEventTab);
                        // decline imge dirty status coz of error
                        self.boolImageChangeValidDirty = false;
                    });
    
                    subdrEventTab.on('#tabmenu-image-upload dropify.error.maxHeight', function (event, element) {
                        self.removeTabFileChange(event, subdrEventTab);
                        // decline imge dirty status coz of error
                        self.boolImageChangeValidDirty = false;
                    });

                    $('#tabmenu-image-upload .dropify-render img').attr('src', this.tab_menu_icon_image);
                    
                    $('#tabmenu-image-upload .dropify-infos .dropify-filename .dropify-filename-inner').html(this.tab_menu_icon_image);
                }, 300)                
                
            }
        }        
        else {
            this.editSubMenuDetails(data);
        }
    }

    editSubMenuDetails(subData) {
        // for dropify reset
        // console.log('subData===>',subData);
        this.menu_type = subData.menu_type;
        $('.dropify-render img').attr('src', null);

        // console.log('Submenu Exsting Data', subData.app_existing_img_name);
        this.image_input_img_name = '';
        
        this.tab_menu_icon_image = '';

        this.noMenuFound = false;
        this.menuFound = true;
        this.menuCreateMsg = false;
        let self = this;
        let menuId = subData.id
        let parentId = subData.is_parent
        let menu_text = subData.menu_name;

        let existing_img: any;
        let tab_existing_img: any;


        let menu_type_sub_json_data;

        if (subData.menu_type_json_data !== null && subData.menu_type_json_data.length > 0) {
            menu_type_sub_json_data = JSON.parse(subData.menu_type_json_data);
            this.menuTypeSubCssJsonData = menu_type_sub_json_data;
            this.cssJsonService.setCssJsonData(this.menuTypeSubCssJsonData);
        }
        else {
            this.menuTypeSubCssJsonData = '';
            this.cssJsonService.setCssJsonData(this.menuTypeSubCssJsonData);
        }

        if(subData.menu_icon != null){
            tab_existing_img = subData.menu_icon;
        }else {
            tab_existing_img =  environment.defaultIcon;
        }

        
        let image_input_img;        
        if ( this.menuTypeSubCssJsonData.hasOwnProperty('image') 
            && this.menuTypeSubCssJsonData.image.length > 0 ) {            
            image_input_img = this.menuTypeSubCssJsonData.image
            this.image_input_img_name = this.menuTypeSubCssJsonData.image;   
            existing_img = this.image_input_img_name;
        }else{
            image_input_img = environment.defaultIcon;        
            this.image_input_img_name = environment.defaultIcon;
            existing_img = environment.defaultIcon;
        }
        
        let imageTitleData;
        let imageUrlData;

        this.menuTypeIsChild = {
            'menuId': menuId,
            'parentId': parentId,
            'menu_text': menu_text
        };

        this.cssJsonService.setListMenuShowChildData(this.menuTypeIsChild);

        if (subData.menu_type == 0 || subData.menu_type == null) {
            this.menuTypeSelValue = null;
            this.menuNotSelected = null;
            this.menuTypeHtml = false;
        }
        else {
            // this.menuTypeSelValue = this.radioArray[0+(subData.menu_type - 1)]['data_'+subData.menu_type];
            this.menuTypeMenuSlugData = this.menuTypeData[0 + (subData.menu_type - 1)]['menuTypeSlug'];
            this.menuTypeMenuSlugId = this.menuTypeMenuSlugData + '_' + subData.id;

            this.menuTypeSelValue = subData.menu_type;
            this.menuNotSelected = subData.menu_type;
            this.menuTypeHtml = true;

            for (let x in this.menuTypeHtmlHidden) {
                if (this.menuTypeHtmlHidden.hasOwnProperty(x)) {
                    this.menuTypeHtmlHidden[x] = false;
                }
            }
            this.menuTypeHtmlHidden[subData.menu_type - 1] = true;
        }

        if(parseInt(this.currentAppData['menu_location_type']) == 1 ){
            this.menu_name = menu_text;
            this.menuForm = this.fb.group({
                menuId: menuId,
                parentId: parentId,
                menu_text: [menu_text, Validators.compose([Validators.required])],
                selct_menu_type: [this.menuTypeSelValue, []]               
            });
        }else if(parseInt(this.currentAppData['menu_location_type']) == 2 ){
            this.menu_name = menu_text;
            this.menuForm = this.fb.group({
                menuId: menuId,
                parentId: parentId,
                menu_text: [menu_text, Validators.compose([Validators.required])],
                selct_menu_type: [this.menuTypeSelValue, []],
                imageInput: [image_input_img, Validators.compose([Validators.required])],
                existingFile: [image_input_img, Validators.compose([Validators.required])],
                tabImageInput: [tab_existing_img, Validators.compose([Validators.required])],
                tabExistingFile: [tab_existing_img, Validators.compose([Validators.required])],
            });
        }
        
        
        
        let dropifyImageUploadId: any;
        dropifyImageUploadId = '#image_upload_' + this.dropifyId;

        let dropifyMenuImageUploadId: any;
        dropifyMenuImageUploadId = '#tabmenu_image_upload_' + this.dropifyId;

        setTimeout(() => {
            // $('#image_upload_' + this.dropifyId).dropify();
            this.callToolTip();
            let beforeClearType: any;
            const subdrEvent = $(dropifyImageUploadId).dropify({
                defaultFile: self.image_input_img_name,
                messages: {
                    'default': 'Drag and drop a file here or click',
                    'replace': 'Drag and drop or click to replace',
                    'remove': 'Remove',
                    'error': ''
                },
                tpl: {
                    wrap: '<div class="dropify-wrapper"></div>',
                    loader: '<div class="dropify-loader"></div>',
                    message: '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
                    preview: '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
                    filename: '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
                    clearButton: '<button type="button" class="dropify-clear">{{ remove }}</button>',
                    errorLine: '<p class="dropify-error">{{ error }}</p>',
                    errorsContainer: '<div class="dropify-errors-container">The image uploaded is not (1240x646), please upload your image in these dimensions</div>'
                }
            });

            let bottom_html = "<input type='file' id='fileInput' name='files[]'/ accept='image/*'><canvas id='myCanvas' style='display:none;'></canvas><div id='modal'></div><div id='preview'><div class='buttons'><div class='cancel' style='background-size: 100% 100%;'></div><div class='ok' style='background-size: 100% 100%;'></div></div></div>";

            if (typeof($('#preview').html()) == 'undefined') {
                $('body').append(bottom_html);
            }

            $(dropifyImageUploadId).on('change',function(){
                $('#panel-image-upload .image-upload-dropify').simpleCropper(1240,646);
            });
                            

            let checkDropifyClass = $("#panel-image-upload .dropify-wrapper").hasClass("has-preview");
            if (!checkDropifyClass) {
                $("#panel-image-upload .dropify-wrapper").removeClass("has-error").addClass("has-preview");
                $('#panel-image-upload .dropify-wrapper .dropify-preview').css('display', 'block')
                $('#panel-image-upload .dropify-wrapper .dropify-preview .dropify-render').prepend('<img src="" />')
            }

            subdrEvent.on('#panel-image-upload dropify.beforeClear', function (event, element) {
                self.onClickOnDropify(event, element)
                    .then(res => {
                        if (res === true) {
                            self.removeFileOnDropify(event, subdrEvent);
                        } else {
                            $('#panel-image-upload .dropify-render img').attr('src', self.image_input_img_name);
                        }
                    });
                return false;
            });

            subdrEvent.on('#panel-image-upload dropify.afterClear', function (event, element) {
                self.removeFileChange(event, subdrEvent);
            });

            subdrEvent.on('#panel-image-upload dropify.error.minWidth', function (event, element) {
                self.removeFileChange(event, subdrEvent);
                self.boolImageChangeValidDirty = false;
            });

            subdrEvent.on('#panel-image-upload dropify.error.maxWidth', function (event, element) {
                self.removeFileChange(event, subdrEvent);
                // decline imge dirty status coz of error
                self.boolImageChangeValidDirty = false;
            });

            subdrEvent.on('#panel-image-upload dropify.error.minHeight', function (event, element) {
                self.removeFileChange(event, subdrEvent);
                // decline imge dirty status coz of error
                self.boolImageChangeValidDirty = false;
            });

            subdrEvent.on('#panel-image-upload dropify.error.maxHeight', function (event, element) {
                self.removeFileChange(event, subdrEvent);
                // decline imge dirty status coz of error
                self.boolImageChangeValidDirty = false;
            });

            $('#panel-image-upload .dropify-render img').attr('src', this.image_input_img_name);

            $('#panel-image-upload .dropify-infos .dropify-filename .dropify-filename-inner').html(this.image_input_img_name);

            if(parseInt(this.currentAppData['menu_location_type']) == 2) {     
                           
                let image_input_img = subData.app_existing_img_name;        
                

                let menu_type_sub_json_data;
                let imageTitleData;
                let imageUrlData;
                let beforeClearTypeTab: any;
                
                if(subData.menu_icon == undefined || subData.menu_icon.length <= 0){
                    this.tab_menu_icon_image = environment.defaultIcon;
                }else{
                    this.tab_menu_icon_image = subData.menu_icon;
                }

                const subdrEventTab = $(dropifyMenuImageUploadId).dropify({
                    defaultFile: self.tab_menu_icon_image,
                    messages: {
                        'default': 'Drag and drop a file here or click',
                        'replace': 'Drag and drop or click to replace',
                        'remove': 'Remove',
                        'error': ''
                    },
                    tpl: {
                        wrap: '<div class="dropify-wrapper"></div>',
                        loader: '<div class="dropify-loader"></div>',
                        message: '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
                        preview: '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
                        filename: '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
                        clearButton: '<button type="button" class="dropify-clear">{{ remove }}</button>',
                        errorLine: '<p class="dropify-error">{{ error }}</p>',
                        errorsContainer: '<div class="dropify-errors-container">The image uploaded is not (128x128), please upload your image in these dimensions</div>'
                    }
                });

                let bottom_html = "<input type='file' id='fileInput' name='files[]'/ accept='image/*'><canvas id='myCanvas' style='display:none;'></canvas><div id='modal'></div><div id='preview'><div class='buttons'><div class='cancel' style='background-size: 100% 100%;'></div><div class='ok' style='background-size: 100% 100%;'></div></div></div>";

                if (typeof($('#preview').html()) == 'undefined') {
                    $('body').append(bottom_html);
                }

                $(dropifyMenuImageUploadId).on('change',function(){
                    $('#tabmenu-image-upload .image-upload-dropify').simpleCropper(128,128);
                });
                                

                let checkDropifyClass = $("#tabmenu-image-upload .dropify-wrapper").hasClass("has-preview");
                if (!checkDropifyClass) {
                    $("#tabmenu-image-upload .dropify-wrapper").removeClass("has-error").addClass("has-preview");
                    $('#tabmenu-image-upload .dropify-wrapper .dropify-preview').css('display', 'block')
                    $('#tabmenu-image-upload .dropify-wrapper .dropify-preview .dropify-render').prepend('<img src="" />')
                }

                subdrEventTab.on('#tabmenu-image-upload dropify.beforeClear', function (event, element) {
                    self.onClickOnDropify(event, element)
                        .then(res => {
                            if (res === true) {
                                self.removeTabFileOnDropify(event, subdrEventTab);
                            } else {
                                $('#tabmenu-image-upload .dropify-render img').attr('src', self.tab_menu_icon_image);                                
                            }
                        });
                    return false;
                });

                subdrEventTab.on('#tabmenu-image-upload dropify.afterClear', function (event, element) {
                    // self.removeFileChange(event);
                    self.removeTabFileChange(event, subdrEventTab);
                });

                subdrEventTab.on('#tabmenu-image-upload dropify.error.minWidth', function (event, element) {
                    self.removeTabFileChange(event, subdrEventTab);
                    // decline imge dirty status coz of error
                    self.boolImageChangeValidDirty = false;
                });

                subdrEventTab.on('#tabmenu-image-upload dropify.error.maxWidth', function (event, element) {
                    self.removeTabFileChange(event, subdrEventTab);
                    // decline imge dirty status coz of error
                    self.boolImageChangeValidDirty = false;
                });

                subdrEventTab.on('#tabmenu-image-upload dropify.error.minHeight', function (event, element) {
                    self.removeTabFileChange(event, subdrEventTab);
                    // decline imge dirty status coz of error
                    self.boolImageChangeValidDirty = false;
                });

                subdrEventTab.on('#tabmenu-image-upload dropify.error.maxHeight', function (event, element) {
                    self.removeTabFileChange(event, subdrEventTab);
                    // decline imge dirty status coz of error
                    self.boolImageChangeValidDirty = false;
                });

                $('#tabmenu-image-upload .dropify-render img').attr('src', this.tab_menu_icon_image);

                $('#tabmenu-image-upload .dropify-infos .dropify-filename .dropify-filename-inner').html(this.tab_menu_icon_image);
            }

            if (parentId !== 0 && parentId !== null) {
                this.getParentMenuType(parentId)
                    .then(res => {
                        if (res !== 'undefined' && res !== null && res['menu_type'] == 1) {
                            this.imageMenuTitle = true;
                            this.is_file = false;
    
                            if(parseInt(this.currentAppData['menu_location_type']) == 1) {
                                this.menu_name = menu_text;     
                                this.menuForm = this.fb.group({
                                    menuId: menuId,
                                    parentId: parentId,
                                    menu_text: [menu_text, Validators.compose([Validators.required])],
                                    imageInput: [existing_img, Validators.compose([Validators.required])],
                                    existingFile: [existing_img, Validators.compose([Validators.required])],                               
                                    selct_menu_type: [this.menuTypeSelValue, []]
                                });
                            }else if(parseInt(this.currentAppData['menu_location_type']) == 2) {
                                this.menu_name = menu_text;     
                                this.menuForm = this.fb.group({
                                    menuId: menuId,
                                    parentId: parentId,
                                    menu_text: [menu_text, Validators.compose([Validators.required])],
                                    imageInput: [existing_img, Validators.compose([Validators.required])],
                                    existingFile: [existing_img, Validators.compose([Validators.required])],
                                    tabImageInput: [tab_existing_img, Validators.compose([Validators.required])],
                                    tabExistingFile: [tab_existing_img, Validators.compose([Validators.required])],
                                    selct_menu_type: [this.menuTypeSelValue, []]
                                });
                            }
                            
                            //  this.menuForm.controls['imageInput'].setValue(existing_img);
                            //  this.menuForm.controls['existingFile'].setValue(existing_img);
                        } else {
                            this.imageMenuTitle = false;
                            if(parseInt(this.currentAppData['menu_location_type']) == 1) {
                                this.menu_name = menu_text;     
                                this.menuForm = this.fb.group({
                                    menuId: menuId,
                                    parentId: parentId,
                                    menu_text: [menu_text, Validators.compose([Validators.required])],                               
                                    selct_menu_type: [this.menuTypeSelValue, []],                            
                                });
                            }else if(parseInt(this.currentAppData['menu_location_type']) == 2) {
                                this.menu_name = menu_text;     
                                this.menuForm = this.fb.group({
                                    menuId: menuId,
                                    parentId: parentId,
                                    menu_text: [menu_text, Validators.compose([Validators.required])],
                                    tabImageInput: [tab_existing_img, Validators.compose([Validators.required])],
                                    tabExistingFile: [tab_existing_img, Validators.compose([Validators.required])],
                                    selct_menu_type: [this.menuTypeSelValue, []],                            
                                });
                            }
                            
                        }
                    });
            }       
            else {
                this.imageMenuTitle = false;
                if(parseInt(this.currentAppData['menu_location_type']) == 1) {
                    this.menu_name = menu_text;     
                    this.menuForm = this.fb.group({
                        menuId: menuId,
                        parentId: parentId,
                        menu_text: [menu_text, Validators.compose([Validators.required])],                   
                        selct_menu_type: [this.menuTypeSelValue, []]
                    });
                }else if(parseInt(this.currentAppData['menu_location_type']) == 2) {
                    this.menu_name = menu_text;     
                    this.menuForm = this.fb.group({
                        menuId: menuId,
                        parentId: parentId,
                        menu_text: [menu_text, Validators.compose([Validators.required])],
                        tabImageInput: [tab_existing_img, Validators.compose([Validators.required])],
                        tabExistingFile: [tab_existing_img, Validators.compose([Validators.required])],
                        selct_menu_type: [this.menuTypeSelValue, []]
                    });
                }            
            }
    

        }, 300);

    }

    public getParentMenuType(parentId: any) {
        return new Promise(resolve => {
            const postData = {
                'parentId': parentId
            }
            this.commonService.postData(postData, 'getparentmenutypedata').subscribe(res => {
                let parentMenuJsonData;
                let parentStatus;

                parentMenuJsonData = JSON.parse(res);
                parentStatus = parentMenuJsonData['status'];
                if (parentStatus == 1) {
                    this.parentMenuData = parentMenuJsonData['data'];
                    resolve(parentMenuJsonData['data']);
                    this.parent_menuType = parentMenuJsonData['data']['menu_type'];
                    console.log(this.parent_menuType);
                } else {
                    this.parentMenuData = null;
                    resolve('undefined');
                }
            });
        });
    }

    getCorruptImageList() {
        return this.contentEditorRef.corruptImageList;
    }

    getRemovedImageList() {
        return this.tutorialRef.removed_images_array;
    }

    getRecipients() {
        return this.contentEditorRef.hasOwnProperty('recipients') ? this.contentEditorRef['recipients'] : [];
    }

    getContentRefBackground() {
        return this.contentEditorRef['typeMenuform']['background'] ? this.contentEditorRef['typeMenuform']['background'] : '#ffffff';
    }

    isThemePicked() {
        return this.contentEditorRef.hasOwnProperty('pickedTheme') && this.contentEditorRef['pickedTheme'] > 0 ? true : false;
    }
// 2018-2-11

    onMenuFormSubmit(mform: NgForm) {
        //    MenuTypePhotoComponent.prototype.ngOnInit();

        return new Promise<boolean>(resolve => {
            debugger;
            let tutorialStartView = localStorage.getItem("tutorialStartView");
            let tutoState = null;
            if(tutorialStartView == "true")
                tutoState = true;
            if(tutorialStartView == "false")
                tutoState = false;

            this.saveMenuDisbleBtnRef.nativeElement.disabled = true;
            NProgress.start();
            //gjc 0515
            $(function () {
                $.notify({
                    title: '',
                    message: "Settings Saving, Please Wait..."
                }, {
                    type: 'success'
                    });
            });
            
            this.cssJsonService.setSpinnerActive({
                active: true,
                text: 'This process will take some time to finish. Please DO NOT leave the page and wait until it finishes.'
            })
            //gjc line end

            mform.value.selct_menu_type = this.menuTypeSelValue;
            if (this.contentEditorRef){
                this.contentEditorRef.preSave();
            }

            mform.value.contact_form = $('input#hidden-info').val();

            if( parseInt(this.currentAppData['menu_location_type']) == 2
              && this.menu_level == 1 && this.tab_show == 1 ) {

              let countTabMenu = 0;
              for(let i = 0; i<this.menuData.length; i++) {
                if(this.menuData[i].tab_show == 1){
                  if(this.menu_id != this.menuData[i].id)
                    countTabMenu++;
                }
              }

              // if(countTabMenu > 5 || countTabMenu < 2 ) {                
              if(countTabMenu > 5) {
                $(function () {
                  $.notify({
                      title: '',
                      message: 'You must insert only less than 6 menus to TabMenu.'
                  }, {
                        type: 'danger'
                      }
                    );
                });
                NProgress.done();
                this.saveMenuDisbleBtnRef.nativeElement.disabled = false;
                this.afterSaveGetAppMenu();
                mform.form.markAsPristine();
                this.resetAlldirty();
                resolve(true);
                return;
              } 
            }

            if ( ( this.parent_menuType == 1 
                    && this.menu_type == 9 
                    && mform.value.existingFile == null
                    && mform.value.parentId != 0 ) 
                || ( this.parent_menuType == 1 
                    && this.menu_type == 2 
                    && mform.value.existingFile == null
                    && mform.value.parentId != 0 ) ) {
                console.log('no image');
                NProgress.done();
                this.saveMenuDisbleBtnRef.nativeElement.disabled = false;
                const error_message = this.rdata['message'];
                $(function () {
                    $.notify({
                        title: '',
                        message: 'You must insert panel image.'
                    }, {
                            type: 'danger'
                        });
                });
                this.afterSaveGetAppMenu();
                mform.form.markAsPristine();
                this.resetAlldirty();
                resolve(true);
            }
            else if((parseInt(this.currentAppData['menu_location_type']) == 2 
                && mform.value.tabExistingFile == null )) {

                    console.log('no image');
                    NProgress.done();
                    this.saveMenuDisbleBtnRef.nativeElement.disabled = false;
                    const error_message = this.rdata['message'];
                    $(function () {
                        $.notify({
                            title: '',
                            message: 'You must insert tab menu icon image.'
                        }, {
                                type: 'danger'
                            });
                    });
                    this.afterSaveGetAppMenu();
                    mform.form.markAsPristine();
                    this.resetAlldirty();
                    resolve(true);
    
            }
            else if(mform.value.selct_menu_type == 7 && this.check_selected_albumUrl == null){
                NProgress.done();
                this.saveMenuDisbleBtnRef.nativeElement.disabled = false;
                const error_message = this.rdata['message'];
                    $(function () {
                        $.notify({
                            title: '',
                            message: 'You must select album url.'
                        }, {
                                type: 'danger'
                            });
                    });
                    this.afterSaveGetAppMenu();
                    mform.form.markAsPristine();
                    this.resetAlldirty();
                    resolve(true);
            }
            else {

                if (typeof (this.sampleChildData) === 'undefined') {
                    this.sampleChildData = new FormData();
                }
                //gjc tutorial test
                this.sampleChildData.append('tutorialStartView', tutoState);
                
                const promiseForloop = new Promise((resolve) => {
                    
                    if(parseInt(this.currentAppData['menu_location_type']) == 2) {
                        // if (mform.value.hasOwnProperty('tabExistingFile')
                        //     && typeof (mform.value.tabExistingFile) !== 'undefined'
                        //     && mform.value.tabExistingFile !== '') {
                        //     this.sampleChildData.append('tabExistingImage', mform.value.tabExistingFile);
                        // }
    
                        if (this.tabFileList != null){
                            let base64File = $('#tabmenu-image-upload .image-upload-dropify').converter2Base64();
                            //save menuimage fuction start
                            const filename = this.currentAppData['app_code']+"/setting/tab_menuImage_"+ Math.random() + "_" + mform.value.menuId;
                            const fileData = {
                                'image':base64File,
                                'name':filename
                            };
    
                            this.s3Service.uploadAppData(fileData)
                                .subscribe(
                                    res => {
                                        this.sampleChildData.append('menu_icon', res['data'].Location);
                                        resolve(true);
                                    },
                                    err => {                                
                                        console.log(err);
                                        resolve(false);
                                    }
                                )
                        }else {
                            resolve(true);
                        }
                    }else{
                        resolve(true);
                    }
                    
                })

                promiseForloop.then(() => {
                    
                    // if (mform.value.hasOwnProperty('existingFile')
                    //     && typeof (mform.value.existingFile) !== 'undefined'
                    //     && mform.value.existingFile !== '') {
                    //     this.sampleChildData.append('existingImage', mform.value.existingFile);
                    // }                
                    this.menu_name = mform.value.menu_text;
                                        
                    if (this.fileList != null) {
                        let base64File = $('#panel-image-upload .image-upload-dropify').converter2Base64();
                        //save menuimage fuction start
                        const filename = this.currentAppData['app_code']+"/setting/menuImage_" + Math.random() + "_" + mform.value.menuId;
                        const fileData = {
                            'image':base64File,
                            'name':filename
                        };

                    
                        this.s3Service.uploadAppData(fileData)
                            .subscribe(
                                res => {
                                    this.sampleChildData.append('image_upload', res['data'].Location);
                                    const obj = {
                                        'app_basic_id': this.app_id,
                                        'menu_id': mform.value.menuId,
                                        'is_parent': mform.value.parentId,
                                        'menu_text': mform.value.menu_text,
                                        'selct_menu_type': mform.value.selct_menu_type,
                                        'select_menu_slug': this.menuTypeMenuSlugData,                                        
                                    };

                                    if(parseInt(this.currentAppData['menu_location_type']) == 2) {
                                      if(this.menu_level == 1)
                                        this.sampleChildData.append('tab_show', this.tab_show);
                                    }                                    

                                    this.sampleChildData.append('mainMenuData', JSON.stringify(obj));
                                    
                                    if (mform.value.selct_menu_type == 12 || mform.value.selct_menu_type == 11) {
                                        // firstly, get corruptImageList
                                        let corruptImages = this.getCorruptImageList();
                                        var contact_form_json_array = JSON.parse(mform.value.contact_form);
                                        let observable_array = [Observable.of(0)];

                                        contact_form_json_array.forEach((form_json, index) => {
                                            if (form_json.subtype == 'image') {
                                                let wrapper = $('.image-dropify', $(`.field-${form_json.name}-preview`));

                                                if (!$('.dropify-render img', wrapper)[0])
                                                {
                                                    delete form_json['src'];
                                                    contact_form_json_array[index] = form_json;
                                                    return Observable.of(0);
                                                }

                                                
                                                if (!corruptImages.includes(wrapper[0].id))
                                                    return;
                                                let uploadFile = () => {
                                                    let base64File = wrapper.converter2Base64();
                                                    return this.s3Service.uploadBase64(base64File).map(
                                                        res => {
                                                            form_json['src'] = res['data'].Location;
                                                            contact_form_json_array[index] = form_json;
                                                            return 0;
                                                        }
                                                    );    
                                                }

                                                // let uploader$: Observable<any> = uploadFile();
                                                observable_array.push(uploadFile());
                                            } else if (form_json.type == 'slideshow') {
                                                contact_form_json_array[index].values = [];
                                                let wrappers = $('.image-dropify', $(`.field-${form_json.name}-preview`));
                                                let image_index = 0;
                                                wrappers.toArray().forEach((wrapper) => {
                                                    if (!$('.dropify-render img', wrapper)[0])
                                                    {
                                                        // delete form_json['src'];
                                                        return Observable.of(0);
                                                    }
                                                    
                                                    if (!corruptImages.includes(wrapper.id))
                                                    {
                                                        contact_form_json_array[index].values[image_index++] = {source: $('.dropify-render img', wrapper).attr('src')};
                                                        return Observable.of(0);
                                                    }

                                                    let uploadFile = (i_index) => {
                                                        let base64File = $(wrapper).converter2Base64(true);
                                                        return this.s3Service.uploadBase64(base64File).map(
                                                            res => {
                                                                contact_form_json_array[index].values[i_index] = {source: res['data'].Location};
                                                                return 0;
                                                            }
                                                        );    
                                                    }

                                                    // let uploader$: Observable<any> = uploadFile();
                                                    observable_array.push(uploadFile(image_index++));
                                                });
                                            } 
                                        });

                                        Observable.forkJoin(...observable_array).subscribe(
                                            data => {
                                            },
                                            err => console.error(err),
                                            () => {
                                                console.log(JSON.stringify(contact_form_json_array));
                                                this.sampleChildData.append('css_string_json', JSON.stringify(contact_form_json_array));
                                                this.sampleChildData.append('recipients_string_json', JSON.stringify(this.getRecipients()));
                                                this.sampleChildData.append('background', this.getContentRefBackground());
                                                if (mform.value.selct_menu_type == 12 && this.isThemePicked()) { // Content and theme picked
                                                    this.sampleChildData.append('is_theme_picked', 1);    
                                                }
                                                
                                                // this.sampleChildData.append('recipients', JSON.stringify(recipients_json_array));
                                                this.commonService.filePostData(this.sampleChildData, 'updatemenutypedata').subscribe(res => {
                                                    this.saveMenuDisbleBtnRef.nativeElement.disabled = false;
                                                    NProgress.done();
                                                    this.rdata = JSON.parse(res);
                                                    console.log("1111111111111111111111=>",this.rdata);
                                                
                                                
                                                    this.rstatus = this.rdata['status'];
                                                    if (this.rstatus == '1') {
                                                        this.afterSaveGetAppMenu();
                                                        this.image_input_img_name = this.rdata['data'].image_upload;

                                                        // $('.dropify-infos .dropify-filename .dropify-filename-inner').html(this.image_input_img_name);
                                                        $('#panel-image-upload .dropify-infos .dropify-filename .dropify-filename-inner').html(this.image_input_img_name);
                                                        if(this.rdata['data'].hasOwnProperty('menu_icon')) {
                                                            this.tab_menu_icon_image = this.rdata['data'].menu_icon;
                                                            $('#tabmenu-image-upload .dropify-infos .dropify-filename .dropify-filename-inner').html(this.tab_menu_icon_image);
                                                        }

                                                        const success_message = this.rdata['message'];
                                                        //  reset all dirty and menu changes false
                                                        debugger;
                                                        this.resetAlldirty();
                                                        // $(function () {
                                                        //     $.notify({
                                                        //         title: '',
                                                        //         message: success_message
                                                        //     },
                                                        //         {
                                                        //             type: 'success'
                                                        //         });
                                                        // });
                                                        mform.form.markAsPristine();
                                                        resolve(true);
                                                    } else {
                                                        const error_message = this.rdata['message'];
                                                        $(function () {
                                                            $.notify({
                                                                title: '',
                                                                message: error_message
                                                            }, {
                                                                    type: 'danger'
                                                                });
                                                        });
                                                        mform.form.markAsPristine();
                                                        resolve(false);
                                                    }
                                                    this.FastGenerateJson();
                                                });
                                            }
                                        );
                                    } else if (mform.value.selct_menu_type == 10) {
                                        let removed_images_array = this.getRemovedImageList();
                                        let delete_observable_array = [Observable.of(0)];
                                        removed_images_array.forEach(image => {
                                            let deleteFile = () => {
                                                this.s3Service.deleteFileByUrl(image);
                                                return Observable.of(0);
                                            }
                                            delete_observable_array.push(deleteFile());
                                        });
                                        Observable.forkJoin(...delete_observable_array).subscribe(
                                            data => {
                                                // save images
                                                let save_observable_array = [Observable.of(0)];
                                                this.tutorialRef.typeMenuform.media_data.forEach((medium_data, index) => {
                                                    if (medium_data.type != this.IMAGE)
                                                        return;
                                                    let wrapper = $(`[name="file_upload_${index}"]`).closest('.dropify-wrapper');
                                                    let uploadFile = () => {
                                                        let base64File = wrapper.converter2Base64();
                                                        if (!base64File)
                                                            return Observable.of(0);
                                                        else 
                                                            return this.s3Service.uploadBase64(base64File).map(
                                                                    res => {
                                                                        this.tutorialRef.typeMenuform.media_data[index].url = res['data'].Location;
                                                                        $('.dropify-render img', wrapper)[0].src = res['data'].Location;
                                                                        return 0;
                                                                    }
                                                                )
                                                    };
                                                    save_observable_array.push(uploadFile());
                                                });
                                                
                                                Observable.forkJoin(...save_observable_array).subscribe(
                                                    data => {

                                                    },
                                                    err => console.error(err),
                                                    () => {
                                                        
                                                        
                                                        this.sampleChildData.append('css_string_json', JSON.stringify(this.tutorialRef.typeMenuform.css_string_json));
                                                        this.sampleChildData.append('media_data', JSON.stringify(this.tutorialRef.typeMenuform.media_data));
                                                        this.sampleChildData.append('show_tutorial', JSON.stringify(this.tutorialRef.typeMenuform.show_tutorial));

                                                        this.commonService.filePostData(this.sampleChildData, 'updatemenutypedata').subscribe(
                                                            res => {
                                                                this.saveMenuDisbleBtnRef.nativeElement.disabled = false;
                                                                NProgress.done();
                                                                this.rdata = JSON.parse(res);
                                                                console.log("1111111111111111111111=>",this.rdata);
                                                            
                                                            
                                                                this.rstatus = this.rdata['status'];
                                                                if (this.rstatus == '1') {
                                                                    this.afterSaveGetAppMenu();
                                                                    this.image_input_img_name = this.rdata['data'].image_upload;

                                                                    // $('.dropify-infos .dropify-filename .dropify-filename-inner').html(this.image_input_img_name);
                                                                    $('#panel-image-upload .dropify-infos .dropify-filename .dropify-filename-inner').html(this.image_input_img_name);
                                                                    if(this.rdata['data'].hasOwnProperty('menu_icon')) {
                                                                        this.tab_menu_icon_image = this.rdata['data'].menu_icon;
                                                                        $('#tabmenu-image-upload .dropify-infos .dropify-filename .dropify-filename-inner').html(this.tab_menu_icon_image);
                                                                    }

                                                                    const success_message = this.rdata['message'];
                                                                    //  reset all dirty and menu changes false
                                                                    debugger;
                                                                    this.resetAlldirty();
                                                                    // $(function () {
                                                                    //     $.notify({
                                                                    //         title: '',
                                                                    //         message: success_message
                                                                    //     },
                                                                    //         {
                                                                    //             type: 'success'
                                                                    //         });
                                                                    // });
                                                                    mform.form.markAsPristine();
                                                                    resolve(true);
                                                                } else {
                                                                    const error_message = this.rdata['message'];
                                                                    $(function () {
                                                                        $.notify({
                                                                            title: '',
                                                                            message: error_message
                                                                        }, {
                                                                                type: 'danger'
                                                                            });
                                                                    });
                                                                    mform.form.markAsPristine();
                                                                    resolve(false);
                                                                }
                                                                this.FastGenerateJson();
                                                            }
                                                        );
                                                    }
                                                );
                                            },
                                            err => console.error(err)
                                        );

                                    }
                                    else {
                                        // this.sampleChildData.append('css_string_json', mform.value.contact_form);
                                        this.commonService.filePostData(this.sampleChildData, 'updatemenutypedata').subscribe(res => {
                                            this.saveMenuDisbleBtnRef.nativeElement.disabled = false;
                                            NProgress.done();
                                            this.rdata = JSON.parse(res);                           
                                        
                                            this.rstatus = this.rdata['status'];
                                            if (this.rstatus == '1') {
                                                this.afterSaveGetAppMenu();
                                                this.image_input_img_name = this.rdata['data'].image_upload;
                                                
                                                // $('.dropify-infos .dropify-filename .dropify-filename-inner').html(this.image_input_img_name);
                                                $('#panel-image-upload .dropify-infos .dropify-filename .dropify-filename-inner').html(this.image_input_img_name);
                                                if(this.rdata['data'].hasOwnProperty('menu_icon')) {
                                                    this.tab_menu_icon_image = this.rdata['data'].menu_icon;
                                                    $('#tabmenu-image-upload .dropify-infos .dropify-filename .dropify-filename-inner').html(this.tab_menu_icon_image);
                                                }

                                                const success_message = this.rdata['message'];
                                                //  reset all dirty and menu changes false
                                                debugger;
                                                this.resetAlldirty();
                                                // $(function () {
                                                //     $.notify({
                                                //         title: '',
                                                //         message: success_message
                                                //     },
                                                //         {
                                                //             type: 'success'
                                                //         });
                                                // });
                                                mform.form.markAsPristine();
                                                resolve(true);
                                            } else {
                                                const error_message = this.rdata['message'];
                                                $(function () {
                                                    $.notify({
                                                        title: '',
                                                        message: error_message
                                                    }, {
                                                            type: 'danger'
                                                        });
                                                });
                                                mform.form.markAsPristine();
                                                resolve(false);
                                            }
                                            this.FastGenerateJson();
                                        });
                                    }
                                },
                                err => {
                                    console.log(err);
                                    resolve(false);
                                }
                            )
                    }
                    else {
                        
                        const obj = {
                            'app_basic_id': this.app_id,
                            'menu_id': mform.value.menuId,
                            'is_parent': mform.value.parentId,
                            'menu_text': mform.value.menu_text,
                            'selct_menu_type': mform.value.selct_menu_type,
                            'select_menu_slug': this.menuTypeMenuSlugData
                        };

                        if(parseInt(this.currentAppData['menu_location_type']) == 2) {
                          if(this.menu_level == 1)
                            this.sampleChildData.append('tab_show', this.tab_show);
                        }                                    

                        this.sampleChildData.append('mainMenuData', JSON.stringify(obj));
                        this.sampleChildData.append('image_upload', this.image_input_img_name);

                        if (mform.value.selct_menu_type == 12 || mform.value.selct_menu_type == 11) {
                            // firstly, get corruptImageList
                            let corruptImages = this.getCorruptImageList();
                            var contact_form_json_array = JSON.parse(mform.value.contact_form);
                            let observable_array = [Observable.of(0)];

                            contact_form_json_array.forEach((form_json, index) => {
                                if (form_json.subtype == 'image') {
                                    let wrapper = $('.image-dropify', $(`.field-${form_json.name}-preview`));

                                    if (!$('.dropify-render img', wrapper)[0])
                                    {
                                        delete form_json['src'];
                                        contact_form_json_array[index] = form_json;
                                        return Observable.of(0);
                                    }

                                    
                                    if (!corruptImages.includes(wrapper[0].id))
                                        return;
                                    let uploadFile = () => {
                                        let base64File = wrapper.converter2Base64();
                                        return this.s3Service.uploadBase64(base64File).map(
                                            res => {
                                                form_json['src'] = res['data'].Location;
                                                contact_form_json_array[index] = form_json;
                                                return 0;
                                            }
                                        );    
                                    }

                                    // let uploader$: Observable<any> = uploadFile();
                                    observable_array.push(uploadFile());
                                } else if (form_json.type == 'slideshow') {
                                    contact_form_json_array[index].values = [];
                                    let wrappers = $('.image-dropify', $(`.field-${form_json.name}-preview`));
                                    let image_index = 0;
                                    wrappers.toArray().forEach((wrapper) => {
                                        if (!$('.dropify-render img', wrapper)[0])
                                        {
                                            // delete form_json['src'];
                                            return Observable.of(0);
                                        }
                                        
                                        if (!corruptImages.includes(wrapper.id))
                                        {
                                            contact_form_json_array[index].values[image_index++] = {source: $('.dropify-render img', wrapper).attr('src')};
                                            return Observable.of(0);
                                        }

                                        let uploadFile = (i_index) => {
                                            let base64File = $(wrapper).converter2Base64(true);
                                            return this.s3Service.uploadBase64(base64File).map(
                                                res => {
                                                    contact_form_json_array[index].values[i_index] = {source: res['data'].Location};
                                                    return 0;
                                                }
                                            );    
                                        }

                                        // let uploader$: Observable<any> = uploadFile();
                                        observable_array.push(uploadFile(image_index++));
                                    });
                                } 
                            });

                            Observable.forkJoin(...observable_array).subscribe(
                                data => {
                                },
                                err => console.error(err),
                                () => {
                                    console.log(JSON.stringify(contact_form_json_array));
                                    this.sampleChildData.append('css_string_json', JSON.stringify(contact_form_json_array));
                                    this.sampleChildData.append('recipients_string_json', JSON.stringify(this.getRecipients()));
                                    this.sampleChildData.append('background', this.getContentRefBackground());
                                    if (mform.value.selct_menu_type == 12 && this.isThemePicked()) { // Content and theme picked
                                        this.sampleChildData.append('is_theme_picked', 1);    
                                    }
                                    
                                    // this.sampleChildData.append('recipients', JSON.stringify(recipients_json_array));
                                    this.commonService.filePostData(this.sampleChildData, 'updatemenutypedata').subscribe(res => {
                                        this.saveMenuDisbleBtnRef.nativeElement.disabled = false;
                                        NProgress.done();
                                        this.rdata = JSON.parse(res);
                                        console.log("1111111111111111111111=>",this.rdata);
                                    
                                    
                                        this.rstatus = this.rdata['status'];
                                        if (this.rstatus == '1') {
                                            this.afterSaveGetAppMenu();
                                            this.image_input_img_name = this.rdata['data'].image_upload;

                                            // $('.dropify-infos .dropify-filename .dropify-filename-inner').html(this.image_input_img_name);
                                            $('#panel-image-upload .dropify-infos .dropify-filename .dropify-filename-inner').html(this.image_input_img_name);
                                            if(this.rdata['data'].hasOwnProperty('menu_icon')) {
                                                this.tab_menu_icon_image = this.rdata['data'].menu_icon;
                                                $('#tabmenu-image-upload .dropify-infos .dropify-filename .dropify-filename-inner').html(this.tab_menu_icon_image);
                                            }

                                            const success_message = this.rdata['message'];
                                            //  reset all dirty and menu changes false
                                            debugger;
                                            this.resetAlldirty();
                                            // $(function () {
                                            //     $.notify({
                                            //         title: '',
                                            //         message: success_message
                                            //     },
                                            //         {
                                            //             type: 'success'
                                            //         });
                                            // });
                                            mform.form.markAsPristine();
                                            resolve(true);
                                        } else {
                                            const error_message = this.rdata['message'];
                                            $(function () {
                                                $.notify({
                                                    title: '',
                                                    message: error_message
                                                }, {
                                                        type: 'danger'
                                                    });
                                            });
                                            mform.form.markAsPristine();
                                            resolve(false);
                                        }
                                        this.FastGenerateJson();
                                    });
                                }
                            );
                        } else if (mform.value.selct_menu_type == 10) {
                            
                            let removed_images_array = this.getRemovedImageList();
                            let delete_observable_array = [Observable.of(0)];
                            removed_images_array.forEach(image => {
                                let deleteFile = () => {
                                    this.s3Service.deleteFileByUrl(image);
                                    return Observable.of(0);
                                }
                                delete_observable_array.push(deleteFile());
                            });
                            Observable.forkJoin(...delete_observable_array).subscribe(
                                data => {
                                    // save images
                                    let save_observable_array = [Observable.of(0)];
                                    this.tutorialRef.typeMenuform.media_data.forEach((medium_data, index) => {
                                        if (medium_data.type != this.IMAGE)
                                            return;
                                        let wrapper = $(`[name="file_upload_${index}"]`).closest('.dropify-wrapper');
                                        let uploadFile = () => {
                                            let base64File = wrapper.converter2Base64();
                                            if (!base64File)
                                                return Observable.of(0);
                                            else 
                                                return this.s3Service.uploadBase64(base64File).map(
                                                        res => {
                                                            this.tutorialRef.typeMenuform.media_data[index].url = res['data'].Location;
                                                            $('.dropify-render img', wrapper)[0].src = res['data'].Location;
                                                            return 0;
                                                        }
                                                    )
                                        };
                                        save_observable_array.push(uploadFile());
                                    });
                                    
                                    Observable.forkJoin(...save_observable_array).subscribe(
                                        data => {

                                        },
                                        err => console.error(err),
                                        () => {
                                            
                                            
                                            this.sampleChildData.append('css_string_json', JSON.stringify(this.tutorialRef.typeMenuform.css_string_json));
                                            this.sampleChildData.append('media_data', JSON.stringify(this.tutorialRef.typeMenuform.media_data));
                                            this.sampleChildData.append('show_tutorial', JSON.stringify(this.tutorialRef.typeMenuform.show_tutorial));

                                            this.commonService.filePostData(this.sampleChildData, 'updatemenutypedata').subscribe(
                                                res => {
                                                    this.saveMenuDisbleBtnRef.nativeElement.disabled = false;
                                                    NProgress.done();
                                                    this.rdata = JSON.parse(res);
                                                    console.log("1111111111111111111111=>",this.rdata);
                                                
                                                
                                                    this.rstatus = this.rdata['status'];
                                                    if (this.rstatus == '1') {
                                                        this.afterSaveGetAppMenu();
                                                        this.image_input_img_name = this.rdata['data'].image_upload;

                                                        // $('.dropify-infos .dropify-filename .dropify-filename-inner').html(this.image_input_img_name);
                                                        $('#panel-image-upload .dropify-infos .dropify-filename .dropify-filename-inner').html(this.image_input_img_name);
                                                        if(this.rdata['data'].hasOwnProperty('menu_icon')) {
                                                            this.tab_menu_icon_image = this.rdata['data'].menu_icon;
                                                            $('#tabmenu-image-upload .dropify-infos .dropify-filename .dropify-filename-inner').html(this.tab_menu_icon_image);
                                                        }

                                                        const success_message = this.rdata['message'];
                                                        //  reset all dirty and menu changes false
                                                        debugger;
                                                        this.resetAlldirty();
                                                        // $(function () {
                                                        //     $.notify({
                                                        //         title: '',
                                                        //         message: success_message
                                                        //     },
                                                        //         {
                                                        //             type: 'success'
                                                        //         });
                                                        // });
                                                        mform.form.markAsPristine();
                                                        resolve(true);
                                                    } else {
                                                        const error_message = this.rdata['message'];
                                                        $(function () {
                                                            $.notify({
                                                                title: '',
                                                                message: error_message
                                                            }, {
                                                                    type: 'danger'
                                                                });
                                                        });
                                                        mform.form.markAsPristine();
                                                        resolve(false);
                                                    }
                                                    this.FastGenerateJson();
                                                }
                                            );
                                        }
                                    );
                                },
                                err => console.error(err)
                            );

                        }
                        else {
                            // this.sampleChildData.append('css_string_json', mform.value.contact_form);
                            this.commonService.filePostData(this.sampleChildData, 'updatemenutypedata').subscribe(res => {
                                this.saveMenuDisbleBtnRef.nativeElement.disabled = false;
                                NProgress.done();
                                this.rdata = JSON.parse(res);                           
                            
                                this.rstatus = this.rdata['status'];
                                if (this.rstatus == '1') {
                                    this.afterSaveGetAppMenu();
                                    this.image_input_img_name = this.rdata['data'].image_upload;
                                    
                                    // $('.dropify-infos .dropify-filename .dropify-filename-inner').html(this.image_input_img_name);
                                    $('#panel-image-upload .dropify-infos .dropify-filename .dropify-filename-inner').html(this.image_input_img_name);
                                    if(this.rdata['data'].hasOwnProperty('menu_icon')) {
                                        this.tab_menu_icon_image = this.rdata['data'].menu_icon;
                                        $('#tabmenu-image-upload .dropify-infos .dropify-filename .dropify-filename-inner').html(this.tab_menu_icon_image);
                                    }

                                    const success_message = this.rdata['message'];
                                    //  reset all dirty and menu changes false
                                    debugger;
                                    this.resetAlldirty();
                                    // $(function () {
                                    //     $.notify({
                                    //         title: '',
                                    //         message: success_message
                                    //     },
                                    //         {
                                    //             type: 'success'
                                    //         });
                                    // });
                                    mform.form.markAsPristine();
                                    resolve(true);
                                } else {
                                    const error_message = this.rdata['message'];
                                    $(function () {
                                        $.notify({
                                            title: '',
                                            message: error_message
                                        }, {
                                                type: 'danger'
                                            });
                                    });
                                    mform.form.markAsPristine();
                                    resolve(false);
                                }
                                this.FastGenerateJson();
                            });
                        }
                    }
                });
                
            }
            
        });
        
    }

    onClickOnDropify(event, element) {
        // const self = this;
        return new Promise(resolve => {
            swal({
                title: "Are You Sure?",
                text: "Are you sure you want to remove the panel image? This cannot be reversed.",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Continue",
                cancelButtonText: "Cancel",
                closeOnConfirm: true,
                closeOnCancel: true
            },
                (isConfirm) => {
                    if (isConfirm) {
                        swal({
                            title: "Successfully",
                            text: "Remove the Panel Image",
                            type: "success",
                            confirmButtonClass: "btn-success"
                        });
                        resolve(true);
                    } else {
                        swal({
                            title: "Cancelled",
                            text: "Not Remove the Panel Image",
                            type: "error",
                            confirmButtonClass: "btn-danger"
                        });
                        resolve(false);
                    }
                });
        });
    }

    showMenuTypesForm(menuTypeData, index, menuId, menuTypeSlug) {
        this.menuTypeSelValue = menuId;
        this.menuTypeHtml = true;
        this.menuTypeMenuSlugData = menuTypeSlug;

        if (typeof (menuTypeData) != 'undefined' && menuTypeData !== null) {
            for (var x in this.menuTypeHtmlHidden) {
                this.menuTypeHtmlHidden[x] = true;
            }
            this.menuTypeHtmlHidden[index] = false;

            menuTypeData.app_basic_id = this.app_id;
        }
    }

    public handleEvent(childData: any) {
        this.sampleChildData = childData;
    }

    removeFileChange(event, drEvent: any) {
        this.fileList = event.target.files;
        this.is_file = true;
        this.menuForm.controls['imageInput'].setValue(null);
    }

    removeTabFileChange(event, drEvent: any) {        
        this.tabFileList = event.target.files;
        this.is_tabFile = true;
        this.menuForm.controls['tabImageInput'].setValue(null);        
    }

    removeFileOnDropify(event, drEvent: any) {
        let dropifyImgId = drEvent.attr("id");
    
        this.fileList = event.target.files;
        this.is_file = true;
        this.menuForm.controls['imageInput'].setValue(null);
        this.menuForm.controls['existingFile'].setValue(null);
        $('#panel-image-upload .dropify-render img').attr('src', null);
        $('#panel-image-upload .dropify-infos .dropify-filename .dropify-filename-inner').html(null);     
    }

    removeTabFileOnDropify(event, drEvent: any) {
        let dropifyImgId = drEvent.attr("id");
        
        this.tabFileList = event.target.files;
        this.is_tabFile = true;
        this.menuForm.controls['tabImageInput'].setValue(null);
        this.menuForm.controls['tabExistingFile'].setValue(null);
        $('#tabmenu-image-upload .dropify-render img').attr('src', null);
        $('#tabmenu-image-upload .dropify-infos .dropify-filename .dropify-filename-inner').html(null);     
    }

    public removeMenu(data) {
        let self = this;
        swal({
            title: 'Are You Sure?',
            text: 'You will not be able to recover this menu item',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn-danger',
            confirmButtonText: 'Continue',
            cancelButtonText: 'Cancel',
            closeOnConfirm: false,
            closeOnCancel: true
        },
            function (isConfirm) {
                if (isConfirm) {
                    self.deleteAppMenu(data);
                    swal({
                        title: 'Menu Removed',
                        text: 'The menu item has been removed',
                        type: 'success',
                        confirmButtonClass: 'btn-success'
                    });
                } else {
                    swal({
                        title: 'Cancelled',
                        text: 'Your menu item is safe :)',
                        type: 'error',
                        confirmButtonClass: 'btn-danger'
                    });
                }
            });
    }

    public deleteAppMenu(data) {
        let postData =
            {
                'id': data.id,
                'app_basic_id': data.app_basic_id,
                'order': data.order,
                'is_parent': data.is_parent
            }
        $('.loadingbar').css('display','');
        this.commonService.postData(postData, 'deleteappmenu').subscribe(res => {
            this.rdata = JSON.parse(res);
            this.rstatus = this.rdata['status'];
            if (this.rstatus == '1') {
                this.getAppMenu();
            }
            else {
                const error_message = this.rdata['message'];
                $(function () {
                    $.notify({
                        title: '',
                        message: error_message
                    },
                        {
                            type: 'danger'
                        });
                });
            }
            this.FastGenerateJson();
        });
    }
    resetAlldirty(): void {
        this.boolChildFormDirty = false;
        this.boolImageChangeValidDirty = false;
        this.is_menu_change = false;
    }
    
    clickTabShow() {
      if(this.tab_show == 1 )
        this.tab_show = 0;
      else if(this.tab_show == 0)
        this.tab_show = 1;
    }

    FastGenerateJson() {
        $('.loadingbar').css('display','');
        const appData = this.commonService.get_current_app_data();
        NProgress.start();
        //nick request 0504
        // $(function () {
        //     $.notify({
        //         title: '',
        //         message: "Refresh Preview Data",
        //     }, {
        //         type: 'success'
        //     });
        // });
        this.commonService.postData({
    
          'id': JSON.stringify(appData.id),
          'appName': JSON.stringify(appData.app_name)
    
        }, 'fastGenerateJson').subscribe(res => {
            NProgress.done();
            this.rdata = JSON.parse(res);
            this.rstatus = this.rdata['status'];
            if (this.rstatus === 1 || this.rstatus === '1') {
                //gjc 0515
                this.cssJsonService.setSpinnerActive(false);
                $(function () {
                    $.notify({
                        title: '',
                        message: "Feature successfully updated to app menu.",
                    }, {
                        type: 'success'
                    });
                });
            } else {

            }    
        }, err => {
          
        }, () => {
            // console.log('obsever completed');
            console.log("launch emulator");
            
            let iFrameUrl = `${environment.baseUrl}/projects/${this.currentAppData['app_code']}/index.html`;
            //let iFrameUrl = 'http://192.168.100.112:1204/projects/'+this.currentAppData['app_code']+'/index.html';
            $('#native_preview').attr('src',iFrameUrl);
            
            //  let currentAppData = this.commonService.get_current_app_data();
        
        })
    }
    
    testCanDeactive(){
        // this.canDeactiveFlag = this.canDeactivate();
        // this.cssJsonService.setMenuDeactive( this.canDeactiveFlag );
        this.cssJsonService.getMenuDeactive().subscribe( res=> {
            if(res == true){
                if (this.contentEditorRef){
                    this.contentEditorRef.preSave();
                }
                else if(this.tutorialRef){
                    this.tutorialRef.preSave();
                }
                else if(this.websiteRef){
                    this.websiteRef.checkUrl();
                }
                else if(this.pdfRef){
                    this.pdfRef.checkUrl();
                }

                this.check_canDeactive_data = [this.is_menu_change, this.boolChildFormDirty, this.boolImageChangeValidDirty, this.boolMenuNullUrl];
                localStorage.setItem("check_deactive_data", JSON.stringify(this.check_canDeactive_data));
                return;
            }
            else if(res == false){
                this.canDeactivate();
                return;
            }
        });
    }
}