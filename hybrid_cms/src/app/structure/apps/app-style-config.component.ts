import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, ElementRef } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ColorPickerService, Rgba } from 'ngx-color-picker';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { CommonService } from './../../common.service';
import { SharedService } from './../../shared.service';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { CanComponentDeactivate } from './../../can-deactivate-guard.service';
import { MessageService } from './../../message.service';
import { S3Service } from './../../s3.service';

import { environment } from '../../../environments/environment';

declare var $: any;
declare var jQuery: any;
declare var NProgress: any;
declare var swal: any;
// declare var limit_child: 10;
@Component({
    selector: 'app-app-style-config',
    templateUrl: './app-style-config.component.html',
    styleUrls: ['./app-style-config.css'],
})

export class AppStyleConfigComponent implements OnInit, CanComponentDeactivate, AfterViewInit {

    @ViewChild('generalForm') gFormRef: NgForm;
    @ViewChild('menuForm') menuFormRef: NgForm;
    @ViewChild('submenuForm') submenuFormRef: NgForm;
    @ViewChild('arrowmenuForm') arrowmenuFormRef: NgForm;
    @ViewChild('tabmenuForm') tabmenuFormRef: NgForm;
    @ViewChild('generalBtnSave') generalBtnSaveRef: ElementRef;
    @ViewChild('menuBtnSave') menuBtnSaveRef: ElementRef;
    @ViewChild('tabBtnSave') tabBtnSaveRef: ElementRef;

    // boolean ref of gFormRef
    private menuLocationFormBoolRef: boolean;
    domloaded: boolean

    private menuFormBoolRef: boolean;
    private submenuFormBoolRef: boolean;
    private arrowmenuBoolRef: boolean;
    private tabmenuFormBoolRef: boolean;

    public homescreenform: FormGroup;
    public menuconfigurationform: FormGroup;
    public menuLocationType: FormGroup;
    //2018.02.20 gjc
    public headarr_border_rgbaText: string;
    public nonselected_font_rgbaText: string;
    public menuarr_selected_rgbaText: string;
    public tabarr_border_rgbaText: string;
    public smheaderarr_bg_rgbaText: string;
    //gjc 0420
    public sub_sel_font_rgbaText: string;
    public sub_nonsel_font_rgbaText: string;
    public sub_sel_rgbaText: string;
    public sub_nonsel_rgbaText: string;
    public biform: FormGroup;

    // group b changes
    private headerImgDataMain: FormData;

    id = 'qDuKsiwS5xw';
    private player;
    private ytEvent;
    private json_file_url;
    
    public typeMenuform =
        {
            sel_menu_type: '1',
        };

    cl = "";
    bgcl = "";
    bg_cl = "";
    fileList: FileList;
    rstatus: any;
    model = { alignment: '' };
    is_applogoImage_file = false;
    is_homescreen_file = false;
    is_bcimage_file = false;
    is_menulogo_file = false;
    is_app_bg_file = false;
    is_image_file = false;
    rdata = [];
    is_file = false;
    fontFlag = false;
    heightFlag = false;
    headerFlag = false;
    currentAppData = [];
    basic_information_data = '';
    home_screen_data: any;
    menu_configuration_data: any;
    home_screen_data_json: any;
    menu_configuration_data_json: any;
    alignment = 'Left Right Center'.split(' ');
    menu_alignment_json: any;
    inputcolor = '';
    cssJsonData: any;
    menuCssJsonData: any;
    menuJson: any;
    allMenuData: any;
    appIconUrl: any;
    submenuArrayCss: any;
    menuArrayCss: any;
    arrowArrayCss: any;
    subMenuCssData: any;
    tempArray: any;
    colorData: any;
    menuFontFamily: any;
    menuPaddingTop: any;
    menuPaddingLeft: any;
    backgroundColorData: any;
    parentFontSize: any;
    submenuBackgroundColorData: any;
    submenuColorData: any;
    submenuFontFamily: any;
    submenuMenuPaddingTop: any;
    submenuMenuPaddingLeft: any;
    submenuParentFontSize: any;
    menuBorder: any;
    borderColor: any;
    submenuBorderColor: any;
    submenuBorder: any;
    menuiconArrayCss: any;
    headerArrayCss: any;
    statusbarArrayCss: any;
    commonCssJsonData: any;
    fontFamilyData: any;
    fontDataMainMenu: any;
    fontDataSubmenu: any;
    menuIconCssColor: any;
    statusBarColorCss: any;
    headerBorderColor: any;
    headerBackgroundColor: any;
    heightData: any;
    borderSize: any;
    nonSelectedFontColor: any;
    nonSelectedColor: any;
    selectedFontColor: any;
    selectedMenuId: any;
    selectedColor: any;
    sideMenuHeaderBgColor: any;
    app_id = '';
    menuData = [];
    headerborderColorMain: any;
    logoHideFlag: any;
    logoHideFlagGeneral: any;
    showDownArrow: any;
    showUpArrow: any;
    nonSelectedFontColorSub: any;
    nonSelectedColorSub: any;
    selectedFontColorSub: any;
    selectedColorSub: any;
    marginLeftArrow: any;
    subMenuTypeCollapsed: any;
    confirmFlag: any;
    menuType: any;
    menuIconShow: any;
    menulength: any;
    cssTabHide: any;
    tabArrayCss: any;
    tabCss: any;
    iconOne: any;
    iconTwo: any;
    iconThree: any;
    iconFour: any;
    iconFive: any;
    mainCssArray: any;
    fontDataTab: any;
    tabPosition:any;
    tabMenuData: any;
    finallTabArray: any;
    menuIconData: any;
    // selectedArray: any;
    positionData: any;
    iFrameUrl: any;
    iFrameEnable: any;
    levelThreeData: any;
    listFlag: any;
    videoList: any;
    videoDataFinal: any;
    submenuMarginTop: any;
    subMenuHeaderBorderColor: any;
    sideMenuBorderBottom: any;
    sideMenuBorderColor: any;
    sideMenuHeaderImgData: any;
    sideMenuHeaderImgName: any;
    headerImgData: any;
    headerSideImg: any;
    headerMainImg: any;
    mainHeaderImgData: any;
    mainHeaderImgName: any;
    oldHeaderImg: any;
    oldMainImg: any;
    exctImage: any;
    menuImageChangeFlag: any;
    genralImageChangeFlag: any
    headerLogoWidth: any;
    headerLogoHeight: any;
    headerBorderSize: any;
    subMenuHeaderBorderColorMob: any;
    // generalFlag: any;
    generalImgUrl: any;
    dropifyAppIconHeaderSize: any;
    menuOneVal: any;
    menuTwoVal: any;
    menuThreeVal: any;
    menuFourVal: any;
    menuFiveVal: any;
    menuTypeData: any;
    menuSelectedVal: any;
    currentMenuJson = [];
    appstylestatusArray = [];
    appstyleshtmlArray = [];
    //gjc 0420
    subMenuSelectedColor: any;
    subMenuSelectedColorSub: any;
    subMenuNonSelectedColor: any;
    subMenuNonSelectedColorSub: any;
    subMenuSelectedFontColor: any;
    subMenuSelectedFontColorSub: any;
    subMenuNonSelectedFontColor: any;
    subMenuNonSelectedFontColorSub: any;
    fontSize : any;
    headerSize : any;
    heightSize : any;
    
    positionArray = [
        {
            'name': 'absolute',
            'key': '1'
        },
        {
            'name': 'relative',
            'key': '2'
        }
    ]
    menuLocationArray = [
        {
            'name': 'Slide Out Menu',
            'key': '1',
            'url': {
                normal: '/assets/images/layout_sidemenu_normal.png',
                selected: '/assets/images/layout_sidemenu_selected.png'
            }
        },
        {
            'name': 'Tab Bar Menu',
            'key': '2',
            'url': {
                normal: '/assets/images/layout_tabmenu_normal.png',
                selected: '/assets/images/layout_tabmenu_selected.png'
            }
        }
    ];
    menu_location_type: any;
    menuTypeDataSelection: any;
    app_icon_data: any;
    // obseravable time declaration
    handlerTimestart: Observable<any>;
    is_access_app_operation: boolean = true;

    constructor(
        private cpService: ColorPickerService,
        private commonService: CommonService,
        private fb: FormBuilder,
        private http: Http,
        private sharedService: SharedService,
        private _sanitizer: DomSanitizer,
        private cdr: ChangeDetectorRef,
        private msgService: MessageService,
        private s3Service: S3Service,
        private router: Router
    ) {
        this.domloaded = true;
        // set timer
        this.handlerTimestart = Observable.timer(1000);
        // this.generalFlag = false;
        this.levelThreeData = []
        this.iFrameEnable = false;
        $('.loadingbar').css('display','');        
        // this.selectedArray = [];
        this.menuIconData = [];
        this.finallTabArray = [];
        this.tabCss = [];
        this.confirmFlag = false
        this.showDownArrow = true;
        this.logoHideFlagGeneral = true;
        this.logoHideFlag = true;
        // this.menuFontFamily = 'arial';
        this.subMenuCssData = [];
        this.tempArray = [];
        this.borderSize = '1px solid';
        // this.menuBorder = '1px solid';
        this.currentAppData = this.commonService.get_current_app_data();

        

        this.sideMenuBorderBottom = '1px solid';
        this.app_id = this.currentAppData['id'];
        this.menu_location_type = this.currentAppData['menu_location_type'];

        this.menuTypeDataSelection = this.currentAppData['menu_location_type'];
        this.typeMenuform.sel_menu_type = this.currentAppData['menu_location_type'];

        if (this.typeMenuform.sel_menu_type == '1') {
            this.menuType = 1;
            this.toggleMenuHeaderDefault();
        } else {
            this.menuType = 2;
            this.toggleMenuHeaderDefault();
        }

        this.basic_information_data = this.currentAppData['basicDetail']['basic_information'];
        this.home_screen_data = this.currentAppData['basicDetail']['home_screen'];
        this.menu_configuration_data = this.currentAppData['basicDetail']['menu_configuration'];
        // console.log(this.home_screen_data['section_json_data']);
        const iconData = this.currentAppData['basicDetail']['app_icon'];
        const app_icon = iconData.app_icon_thumb_url;
        // if (app_icon) {
        //     this.appIconUrl = app_icon;
        // }
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

     // general menu css
     public onChangeColorHex8(color: string): string {
        const hsva = this.cpService.stringToHsva(color, true);

        return this.cpService.outputFormat(hsva, 'rgba', null);
    }

    ngAfterViewInit(): void {
    }

    ngOnInit() {
        $("#mySidenav").css('display','');
        this.iFrameUrl = `${environment.baseUrl}/projects/${this.currentAppData['app_code']}/index.html`;
    
        // this.iFrameUrl = this._sanitizer.bypassSecurityTrustResourceUrl(this.iFrameUrl);
        
        $('#native_preview').attr('src',this.iFrameUrl);

        if (NProgress.isStarted()) {
            NProgress.done();
        }

        this.handlerTimestart.subscribe(() => {
            NProgress.start();
        });
        // $(function () {
        //     $('.dropify').dropify();
        // });

        // let drEventTwo = $('#app_iconHeader').dropify({
        //         defaultFile: this.appIconUrl
        //     });
        // this.headerLogoWidth = '64px';
        this.headerLogoHeight = '45px';

        setTimeout(() => {
            // $('.select2-tags').select2({
            //     tags: true,
            //     tokenSeparators: [',', ' ']
            // });

            $('.selectpicker').selectpicker('refresh');
            //
            // $('#menuSelectId').selectpicker('refresh');

            // $('#menuSelectId').val('Bookman').trigger('change');

            
            $('.frame_prev').on('load',function(){
                self.iFrameEnable = true;
                $('.loadingbar').css('display','none');  
                console.log('load the iframe')
            });

            $('#menuconfigurationform').on('click',function(){
                if (self.appstyleshtmlArray[0] != '') {
                    if ($('#menuconfigurationform').html() != self.appstyleshtmlArray[0]) {
                        self.SetFormChangeState(0);
                    }
                }
                self.appstyleshtmlArray[0] = $('#menuconfigurationform').html();
            });
            $('#homescreenform').on('click',function(){
                if (self.appstyleshtmlArray[1] != '') {
                    if ($('#homescreenform').html() != self.appstyleshtmlArray[1]) {
                        self.SetFormChangeState(1);
                    }
                }
                self.appstyleshtmlArray[1] = $('#homescreenform').html();
            });
            $('#menuconfigurationtab').on('click',function(){
                if (self.appstylestatusArray[1] == 1) {
                    console.log("home tag changed");
                    return new Promise<boolean>((resolve, reject) => {

                        // self.homescreenSubmit();

                        // swal({
                        //     title: 'You didn`t save!',
                        //     text: 'You have unsaved changes, would you like to save?',
                        //     type: 'warning',
                        //     showCancelButton: true,
                        //     confirmButtonClass: 'btn-success',
                        //     confirmButtonText: 'Yes',
                        //     cancelButtonText: 'No',
                        //     closeOnConfirm: true,
                        //     closeOnCancel: true
                        // }, (isConfirm) => {
                        //     // if accept yes
                        //     if (isConfirm) {
                        //         self.homescreenSubmit();
                        //     } else {
                                
                        //         resolve(true);
                        //         self.mainHeaderImgData = null;
                        //         $('#homescreentab').click();
                        //     }
                        // });
                    });
                }
                self.appstylestatusArray[0] = 0;
                self.appstylestatusArray[1] = 0;
                console.log(self.appstylestatusArray);
            });

            $('#homescreentab').on('click',function(){
                if (self.appstylestatusArray[0] == 1) {
                    console.log("menu tag changed");
                    return new Promise<boolean>((resolve, reject) => {
                        // self.sideMenuCssSubmit();
                        // swal({
                        //     title: 'You didn`t save!',
                        //     text: 'You have unsaved changes, would you like to save?',
                        //     type: 'warning',
                        //     showCancelButton: true,
                        //     confirmButtonClass: 'btn-success',
                        //     confirmButtonText: 'Yes',
                        //     cancelButtonText: 'No',
                        //     closeOnConfirm: true,
                        //     closeOnCancel: true
                        // }, (isConfirm) => {
                        //     // if accept yes
        
                        //     if (isConfirm) {
                        //         self.sideMenuCssSubmit();
                        //     } else {
                                
                        //         resolve(true);
                        //         self.sideMenuHeaderImgData = null;
                        //         $('#menuconfigurationtab').click();
                        //     }
                        // });
                    });
                }
                self.appstylestatusArray[0] = 0;
                self.appstylestatusArray[1] = 0;
                console.log(self.appstylestatusArray);
            });
            
        }, 1000);

        $(window).scroll(function () {
            const scroll = $(window).scrollTop();
            if (scroll >= 150) {
                $('.sticky_class').addClass('change-position');
            } else {
                $('.sticky_class').removeClass('change-position');
            }
        });


        setTimeout(() => {

            function formatFA(icon) {
                if (!icon.id) {
                    return icon.text;
                }
                const $icon = $('<span></span>').append($('<i class="fa ' + icon.id + ' "></i>').css({
                    'color': icon.text
                })).append(icon.text);
                return $icon;
            };
            $('#gyr_ind0').select2({
                templateResult: formatFA
            });

            $('#gyr_ind0').change(function (e) {
                self.selectMenuChange('0', $(this).val());
                self.menuOneVal = $(this).val();
            })

        }, 2000)

        setTimeout(() => {
            function formatFA(icon) {
                if (!icon.id) {
                    return icon.text;
                }
                const $icon = $('<span></span>').append($('<i class="fa ' + icon.id + ' "></i>').css({
                    'color': icon.text
                })).append(icon.text);
                return $icon;
            };
            $('#gyr_ind1').select2({
                templateResult: formatFA
            });

            $('#gyr_ind1').change(function (e) {
                self.selectMenuChange('1', $(this).val());
                self.menuTwoVal = $(this).val();
            })

        }, 2000)

        setTimeout(() => {
            function formatFA(icon) {
                if (!icon.id) {
                    return icon.text;
                }
                const $icon = $('<span></span>').append($('<i class="fa ' + icon.id + ' "></i>').css({
                    'color': icon.text
                })).append(icon.text);
                return $icon;
            };
            $('#gyr_ind2').select2({
                templateResult: formatFA
            });

            $('#gyr_ind2').change(function (e) {
                self.selectMenuChange('2', $(this).val());
                self.menuThreeVal = $(this).val();
            })
        }, 2000)

        setTimeout(() => {
            function formatFA(icon) {
                if (!icon.id) {
                    return icon.text;
                }
                const $icon = $('<span></span>').append($('<i class="fa ' + icon.id + ' "></i>').css({
                    'color': icon.text
                })).append(icon.text);
                return $icon;
            };
            $('#gyr_ind3').select2({
                templateResult: formatFA
            });

            $('#gyr_ind3').change(function (e) {
                self.selectMenuChange('3', $(this).val());
                self.menuFourVal = $(this).val();
            })
        }, 2000)


        setTimeout(() => {
            function formatFA(icon) {
                if (!icon.id) {
                    return icon.text;
                }
                const $icon = $('<span></span>').append($('<i class="fa ' + icon.id + ' "></i>').css({
                    'color': icon.text
                })).append(icon.text);
                return $icon;
            };
            $('#gyr_ind4').select2({
                templateResult: formatFA
            });

            $('#gyr_ind4').change(function (e) {
                self.selectMenuChange('4', $(this).val());
                self.menuFiveVal = $(this).val();
            })

        }, 2000)
        const self = this;

        let tab = false;
        let sidebar = false;
        let appLogo = null;
        let home_screen_bg = null;
        let height = '';
        let bg_image = false;
        let bg_img = null;
        let color = false;

        const appData = this.commonService.get_current_app_data();
        const appUniqId = JSON.stringify(appData.app_unique_id);
        const cssComponent = 'general_css';
        const sidemenuCssComponent = 'side_menu_css';
        const generalCssDBColumn = 'app_general_css_json_data';
        const sideMenuCssDBColumn = 'app_side_menu_css_json_data';
        const appId = JSON.stringify(appData.id);

        this.fontFamilyData = [];
        this.commonService.getData('getFontData').subscribe(res => {
            this.fontFamilyData = JSON.parse(res);
        })

        // change promiseAPI to callableObservableAPI
        this.callablePromiseAPI().subscribe(res => {
            // console.log(res);
            if (res === 'imgLoaded') {
                this.domloaded = false;
                NProgress.done();
                // console.log(this.domloaded, '<<<<')
            } else {
                NProgress.done();
            }

        }, (err) => {

        });
        // isCSSDataExistAPI
        this.calllableisCssDataExist().then((res) => {

        });

        const postData = { 'app_basic_id': appId };
        this.commonService.postData(postData, 'appmenudata').subscribe(resP => {
            debugger;
            this.rdata = JSON.parse(resP);
            this.rstatus = this.rdata['status'];
            if (this.rstatus == '1') {
                this.menuJson = this.rdata['data'];
                console.log(this.menuJson);
                this.getCurrentActiveTapMenuGroup(null);
                for (let i = 0; i < this.menuJson.length; ++i) {
                    if (this.menuJson[i].menu_type_json_data) {
                        const childData = JSON.parse(this.menuJson[i].menu_type_json_data);
                        this.menuJson[i].menu_type_json_data = childData;
                    }                    
                }

                this.menulength = this.menuJson.length;

                this.commonService.getData('getMenuIcon').subscribe(res => {
                    this.menuIconData = [{ iconData: JSON.parse(res), menuData: this.menuJson }];
                    console.log(this.menuIconData);
                     this.AfterMenuIconSelectPickerInit();
                    // , selectedMenu : this.selectedArray
                })

            } else {
                const error_message = this.rdata['message'];
            }
        });



        this.menuLocationType = this.fb.group({
            menu_location_type: [this.menu_location_type, Validators.compose([Validators.required])]
        });

        this.biform = this.fb.group({
            // app_fontSize: [app_fontSize, Validators.compose([Validators.required])],
            
          });

        $(window).scroll(function () {
            if ($(this).scrollTop() > 105 && $(window).width() > 767) {
                $('#homescreenform .custom_tabpanel_phone').addClass("custom_tab_panel_phone_stick");
                $('#homescreenform .custom_tabpanel_phone .screen_outer').addClass("phone_stick_scroll");
            } else {
                $('#homescreenform .custom_tabpanel_phone').removeClass("custom_tab_panel_phone_stick");
                $('#homescreenform .custom_tabpanel_phone .screen_outer').removeClass("phone_stick_scroll");
            }
            if ($(this).scrollTop() > 105 && $(window).width() > 767) {
                $('#menuconfigurationform .custom_tabpanel_phone').addClass("custom_tab_panel_phone_stick");
                $('#menuconfigurationform .custom_tabpanel_phone .screen_outer').addClass("phone_stick_scroll");
            } else {
                $('#menuconfigurationform .custom_tabpanel_phone').removeClass("custom_tab_panel_phone_stick");
                $('#menuconfigurationform .custom_tabpanel_phone .screen_outer').removeClass("phone_stick_scroll");
            }

        });

        let bottom_html = "<input type='file' id='fileInput' name='files[]'/ accept='image/*'><canvas id='myCanvas' style='display:none;'></canvas><div id='modal'></div><div id='preview'><div class='buttons'><div class='cancel' style='background-size: 100% 100%;'></div><div class='ok' style='background-size: 100% 100%;'></div></div></div>";
        if (typeof($('#preview').html()) == 'undefined') {
            $('body').append(bottom_html);
        }

    }
    /**
     * Method to get all menu data related to app
     */
    getAppMenu(): void {
        const postData = { 'app_basic_id': this.app_id };
        this.commonService.postData(postData, 'appmenudata').subscribe(res => {
            this.rdata = JSON.parse(res);
            this.rstatus = this.rdata['status'];
            if (this.rstatus == '1') {
                this.menuData = this.rdata['data'];
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
            }
        });
    }
    /**
     * Method to update menulocation type
     * @param selMenuType
     */
    sendMenuTypeData(selMenuType: any) {
        //gjc 0515 save menu type
        $(function () {
            $.notify({
                title: '',
                message: "Settings Saving, Please Wait..."
            }, {
                type: 'success'
                });
        });
            
        this.msgService.setSpinnerActive({
            active: true,
            text: 'This process will take some time to finish. Please DO NOT leave the page and wait until it finishes.'
        })

        this.menuType = selMenuType;
        this.typeMenuform.sel_menu_type = this.menuType;
        if (this.menuType == 1) {
            this.calllableisCssDataExist();
            this.menuTypeData = 'sidemenu';
        } else {
            this.calllableisCssDataExist();
            this.menuTypeData = 'tabmenu';
            // this.fontDataTab = 'Arial';

            // setTimeout(() => {
            //     $('.select2-tags').select2({
            //         tags: true,
            //         tokenSeparators: [',', ' ']
            //     });
            //     $('.selectpicker').selectpicker('refresh');
            // }, 1000);

            $(window).scroll(function () {
                const scroll = $(window).scrollTop();
                if (scroll >= 150) {
                    $('.sticky_class').addClass('change-position');
                } else {
                    $('.sticky_class').removeClass('change-position');
                }
            });
        }
        const onChangeSelMenuType = {
            value: {
                app_basic_id: this.app_id,
                menu_location_type: selMenuType
            }

        };

        // NProgress.start();
        this.commonService.postData(onChangeSelMenuType.value, 'updatemenulocationtype').subscribe(res => {
            // NProgress.done();
            this.rdata = JSON.parse(res);
            this.rstatus = this.rdata['status'];
            console.log(this.rdata );
            if (this.rstatus == 1 || this.rstatus == '1') {
                this.menuTypeDataSelection = selMenuType;
                this.currentAppData['menu_location_type'] = selMenuType;

                localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
                this.sharedService.emit_appdata(this.currentAppData);

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
            } else {
                this.menuType = 1;
                this.typeMenuform.sel_menu_type = this.menuTypeDataSelection;
                const error_message = this.rdata['message'];
                $(function () {
                    $.notify({
                        title: '',
                        message: error_message
                    }, {
                            type: 'danger'
                        });
                });
                return;
            }
            console.log(selMenuType);
            if (selMenuType == '1') {
                this.menuType = 1;
                this.toggleMenuHeaderDefault();
            } else {
                this.menuType = 2;
                this.toggleMenuHeaderDefault();
            }

            this.FastGenerateJson();
        });

    }

    onMenuLocationTypeSubmit(menuLocationTypeform: NgForm) {
        // NProgress.start();
        menuLocationTypeform.value.app_basic_id = this.app_id;

        this.commonService.postData(menuLocationTypeform.value, 'updatemenulocationtype').subscribe(res => {
            // NProgress.done();
            this.rdata = JSON.parse(res);
            this.rstatus = this.rdata['status'];
            if (this.rstatus == '1') {
                // menuLocationTypeform.resetForm();
                this.menu_location_type = menuLocationTypeform.value.menu_location_type;
                this.currentAppData['menu_location_type'] = menuLocationTypeform.value.menu_location_type;

                localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
                this.sharedService.emit_appdata(this.currentAppData);

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
            }
        });
    }

    saveTabs(): void {
        // firstly, get active tab.
        $(function () {
        $.notify({
            title: '',
            message: "Settings Saving, Please Wait..."
        }, {
            type: 'success'
            });
        });
        
        this.msgService.setSpinnerActive({
        active: true,
        text: 'This process will take some time to finish. Please DO NOT leave the page and wait until it finishes.'
        })

        let active_tab_id = $(".tab-content .tab-pane.active")[0].id;
        console.log("active_tab_id",active_tab_id);
        // debugger
        if (active_tab_id == "homescreenform") {
            this.homescreenSubmit();
        } else if (active_tab_id == "menuconfigurationform") {
            // console.log("active_tab_id",this.menuType);
            if(this.menuType == 1)
                this.sideMenuCssSubmit();
            else this.tabMenuCssSubmit();
        }

    }

    homescreenSubmit(): void {
        $("#btnSave").removeAttr("disabled");
        if(this.mainHeaderImgData || (this.mainHeaderImgData == null && this.headerMainImg != "")){
            // get current selected app data
            this.homeScreenSubmitObservable().subscribe((d) => {
                // console.log(d);
                this.gFormRef.form.markAsPristine();
                this.resetAllDirtyStateMenuForm();
            }, (err) => {
                this.gFormRef.form.markAsPristine();
                this.resetAllDirtyStateMenuForm();
            }, () => {
                console.log("Start Generate");
                this.FastGenerateJson();
            })
        }else {
            $(function () {
                $.notify({
                    title: '',
                    message: 'You must insert panel image.'
                }, {
                    type: 'danger'
                });
            });
            
        }                
    }

    // group b Changes
    private homeScreenSubmitObservable(): Observable<any> {
        this.iFrameEnable = false;
        $('.loadingbar').css('display','');  
        return Observable.create((observe) => {
            
            NProgress.start();
            this.generalBtnSaveRef.nativeElement.disabled = true;
            this.tabBtnSaveRef.nativeElement.disabled = true;
            const appData = this.commonService.get_current_app_data();

            const appId = JSON.stringify(appData.id);
            const stringJsonData = JSON.stringify(this.cssJsonData);
            const generalCssDBColumn = 'app_general_css_json_data';

            this.mainCssArray = [{ 'menuIconCss': this.menuiconArrayCss },
            { 'headerCss': this.headerArrayCss },
            { 'statusBarCss': this.statusbarArrayCss }];


            this.headerImgDataMain = new FormData();

            for (let i = 0; i < this.headerArrayCss.length; ++i) {
                if (this.headerArrayCss[i]['key'] == 'headerIcon') {
                    this.exctImage = this.headerArrayCss[i]['value']
                }
            }

            const promiseUploadAppIcon = new  Promise((resolve) => {
                if(this.mainHeaderImgData){
                    let base64File = $('#app_iconHeader').closest('.header-icon-dropify').converter2Base64();
                    const fileName = this.currentAppData['app_code']+"/mainmenu/app_icon" + Math.random();

                    const fileData = { 
                        'image':base64File,
                        'name':fileName
                    };

                    // if (this.exctImage) {
                    //     this.headerMainImg = this.exctImage;
                    //     let drEventTwo = $('#app_iconHeader').dropify({
                    //         defaultFile: this.headerMainImg
                    //     });
                    // }  

                    this.s3Service.uploadAppData(fileData)
                        .subscribe(
                            res => {
                                for (let i = 0; i < this.mainCssArray[1].headerCss.length; ++i) {
                                    if (this.mainCssArray[1].headerCss[i]['key'] == 'headerIcon') {
                                        this.mainCssArray[1].headerCss[i]['value'] = res['data'].Location
                                    }
                                }                         
                                this.headerImgDataMain.append('headerMainImg', res['data'].Location);
                                resolve(true);
                            },
                            err => {
                                // this.errorMsg = 'Could not upload image.'; 
                                resolve(false);                                     
                            }
                        );
                }else {
                    resolve(true);
                }            
                
            })

            promiseUploadAppIcon.then((result) => {
                if (!result) {
                    let error_message = 'Upload Header Icon image failed by bad network connection';
                    //gjc 0515
                    this.msgService.setSpinnerActive(false);
                    $(function () {
                        $.notify({
                            title: '',
                            message: error_message
                        }, {
                                type: 'danger'
                            });
                    });

                    $('.header-icon-dropify .dropify-render img').attr('src', this.headerMainImg);
                    
                    NProgress.done();
                    observe.error(error_message);
                    this.generalBtnSaveRef.nativeElement.disabled = false;
                    this.tabBtnSaveRef.nativeElement.disabled = false;
                    return;
                }
                this.headerImgDataMain.append('data', JSON.stringify(this.mainCssArray));
                this.headerImgDataMain.append('appId', appId);
                this.headerImgDataMain.append('dbColumn', generalCssDBColumn);
                this.headerImgDataMain.append('selMenuType', this.menuTypeDataSelection);                

                this.commonService.filePostData(this.headerImgDataMain, 'saveCssData').subscribe(res => {
                    this.rdata = JSON.parse(res);
                    this.rstatus = this.rdata['status'];

                    if (this.rdata['mainMenuHeaderLogo']) {
                        this.headerMainImg = this.rdata['mainMenuHeaderLogo'];
                    }

                    localStorage.setItem('headerMainImg', this.headerMainImg);
                    // this.oldHeaderImg = this.headerMainImg.split('headerImg/');
                    // this.msgService.sendMessage(this.headerMainImg);

                    this.cdr.detectChanges();
                    
                    if (this.rstatus == '1') {
                        this.typeMenuform.sel_menu_type = this.menuTypeDataSelection;
                        this.currentAppData['menu_location_type'] = this.menuTypeDataSelection;

                        localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
                        this.sharedService.emit_appdata(this.currentAppData);
                        
                        const success_message = this.rdata['message'];
                        // this.save_success_msg = this.rdata['message'];

                        if (this.genralImageChangeFlag == true) {
                            this.genralImageChangeFlag = false;
                        } else {
                            // //gjc 0515
                            // this.msgService.setSpinnerActive(false);
                            // $(function () {
                            //     $.notify({
                            //         title: '',
                            //         message: success_message
                            //     }, {
                            //             type: 'success'
                            //         });
                            // });
                        }
                        observe.next(success_message);
                        NProgress.done();
                        observe.complete();
                        this.generalBtnSaveRef.nativeElement.disabled = false;
                        this.tabBtnSaveRef.nativeElement.disabled = false;

                    } else {
                        const error_message = this.rdata['message'];
                        //gjc 0515
                        this.msgService.setSpinnerActive(false);
                        $(function () {
                            $.notify({
                                title: '',
                                message: error_message
                            }, {
                                    type: 'danger'
                                });
                        });
                        NProgress.done();
                        observe.error(error_message);
                        this.generalBtnSaveRef.nativeElement.disabled = false;
                        this.tabBtnSaveRef.nativeElement.disabled = false;
                    }
                });

            })
            console.log("generate");
        })

        
    }

    sideMenuCssSubmit() {

        if(this.sideMenuHeaderImgData || (this.sideMenuHeaderImgData == null && this.headerSideImg != "")){
            this.sideMenuCssSubmitObservable().subscribe(d => {
                // reset all dirty boolFormRef
                this.resetAllDirtyStateMenuForm();
                // this.GenerateFastJson();
            }, err => {
            }, () => {
                this.FastGenerateJson();
            });
        }else {

        }
        
    }
    /**
     * Method to trigger while save tab menu design chnage Observable
     */
    sideMenuCssSubmitObservable(): Observable<any> {
        this.iFrameEnable = false;
        $('.loadingbar').css('display','');
        return Observable.create((observe) => {
            // get current app data
            NProgress.start();
            const data = [];

            

            this.menuBtnSaveRef.nativeElement.disabled = true;
            this.tabBtnSaveRef.nativeElement.disabled = true;

            const appData = this.commonService.get_current_app_data();
            const appId = JSON.stringify(appData.id);

            const sideMenuCssDBColumn = 'app_side_menu_css_json_data';

            for (let i = 0; i < this.arrowArrayCss.length; ++i) {
                if (this.arrowArrayCss[i].key == "backarrowcolor") {
                    this.arrowArrayCss[i].value = this.menuIconCssColor;
                }
            }
                                
            this.mainCssArray = {
                sideMenuCss: [{ 'mainMenu': this.menuArrayCss },
                { 'subMenu': this.submenuArrayCss },
                { 'arrow': this.arrowArrayCss },
                { 'tabMenu': this.tabArrayCss }]
            };
            
            this.headerImgData = new FormData();
                            
            const promiseUploadImage = new Promise((resolve) => {
                // sideMenuHeaderImgData
                if(this.sideMenuHeaderImgData) {
                    let base64File = $('.menu-header-icon-dropify').converter2Base64();
                    const fileName = this.currentAppData['app_code']+"/sidemenu/app_icon" + Math.random();

                    const fileData = {
                        'image':base64File,
                        'name':fileName
                    };

                    this.s3Service.uploadAppData(fileData)
                        .subscribe(
                            res => {                            
                                for (let i = 0; i < this.mainCssArray.sideMenuCss[0].mainMenu.length; i++) {
                                    if (this.mainCssArray.sideMenuCss[0].mainMenu[i]['key'] == 'sideMenuImg') {
                                        this.mainCssArray.sideMenuCss[0].mainMenu[i]['value'] = res['data'].Location;
                                    }
                                }
                                this.headerImgData.append('headerMainImg', res['data'].Location);
                                resolve(true);
                            },      
                            err => {
                                // this.errorMsg = 'Could not upload image.';              
                                // NProgress.done();
                                
                                resolve(false);                        
                            }
                        );
                    }else {
                        resolve(true);
                    }                
            })

            promiseUploadImage.then((result) => {
                if (!result) {
                    let error_message = "Uploading Menu Header Icon Failed.";
                    $(function () {
                        $.notify({
                            title: '',
                            message: error_message
                        }, {
                                type: 'danger'
                        });
                    });
                    $('.menu-header-icon-dropify .dropify-render img').attr('src', this.headerMainImg);
                    
                    NProgress.done();
                    observe.error(error_message);
                    this.menuBtnSaveRef.nativeElement.disabled = false;
                    this.tabBtnSaveRef.nativeElement.disabled = false;
                    return;
                }
                this.headerImgData.append('data', JSON.stringify(this.mainCssArray));
                this.headerImgData.append('appId', appId);
                this.headerImgData.append('dbColumn', sideMenuCssDBColumn);
                this.headerImgData.append('selMenuType', this.menuTypeDataSelection);
                                                        
                this.commonService.filePostData(this.headerImgData, 'saveCssData').subscribe(res => {
                    this.rdata = JSON.parse(res);
                    this.rstatus = this.rdata['status'];
                    if (this.rdata['sideMenuHeaderLogo']) {
                        this.headerSideImg = this.rdata['sideMenuHeaderLogo'];
                    }
                    // this.oldMainImg = this.headerSideImg.split('headerImg/');

                    const promise = new Promise((resolve) => {
                        for (let i = 0; i < this.menuArrayCss.length; ++i) {
                            if (this.menuArrayCss[i]['key'] == 'sideMenuImg') {
                                this.menuArrayCss[i]['value'] = this.headerSideImg;
                            }
                        }                                                     
                        resolve(true);
                    })
                    
                    if (this.rstatus == '1') {
                        const success_message = this.rdata['message'];
                        if (this.menuImageChangeFlag == true) {
                            this.menuImageChangeFlag = false;
                        } else {
                            $(function () {
                                $.notify({
                                    title: '',
                                    message: success_message
                                }, {
                                        type: 'success'
                                    });
                            });
                        }
                        observe.next(success_message);
                        NProgress.done();
                        observe.complete();
                        this.menuBtnSaveRef.nativeElement.disabled = false;
                        this.tabBtnSaveRef.nativeElement.disabled = false;
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
                        NProgress.done();
                        observe.error(error_message);
                        this.menuBtnSaveRef.nativeElement.disabled = false;
                        this.tabBtnSaveRef.nativeElement.disabled = false;
                    }
                });                            
            });

        })

    }

    tabMenuCssSubmit() {

        this.tabMenuCssSubmitObservable().subscribe(d => {
            // reset all dirty boolFormRef
            this.resetAllDirtyStateMenuForm();
            // this.GenerateFastJson();
        }, err => {
        }, () => {
            this.FastGenerateJson();
        });
        
    }

    tabMenuCssSubmitObservable(): Observable<any> {
        this.iFrameEnable = false;
        $('.loadingbar').css('display','');
        return Observable.create((observe) => {
            // get current app data
            NProgress.start();
            const data = [];

            

            this.menuBtnSaveRef.nativeElement.disabled = true;
            this.tabBtnSaveRef.nativeElement.disabled = true;
            const appData = this.commonService.get_current_app_data();
            console.log("arrowArrayCss = ",this.arrowArrayCss);
            const appId = JSON.stringify(appData.id);

            const sideMenuCssDBColumn = 'app_side_menu_css_json_data';

            for (let i = 0; i < this.arrowArrayCss.length; ++i) {
                if (this.arrowArrayCss[i].key == "backarrowcolor") {
                    this.arrowArrayCss[i].value = this.menuIconCssColor;
                }
            }
            // console.log("this.tabArrayCss = ",this.tabArrayCss);
            // console.log("$('#font_size').val() = ",$('#font_size').val());
            // console.log();
            this.tabArrayCss[0]['value'] = $('#font_size').val();
            this.mainCssArray = {
                sideMenuCss: [{ 'mainMenu': this.menuArrayCss },
                { 'subMenu': this.submenuArrayCss },
                { 'arrow': this.arrowArrayCss },
                { 'tabMenu': this.tabArrayCss }]
            };
            
            this.headerImgData = new FormData();

            for (let i = 0; i < this.mainCssArray.sideMenuCss[0].mainMenu.length; i++) {
                if (this.mainCssArray.sideMenuCss[0].mainMenu[i]['key'] == 'sideMenuImg') {
                    this.mainCssArray.sideMenuCss[0].mainMenu[i]['value'] = this.headerSideImg;
                }
            }

            this.headerImgData.append('data', JSON.stringify(this.mainCssArray));
            this.headerImgData.append('appId', appId);
            this.headerImgData.append('dbColumn', sideMenuCssDBColumn);
            this.headerImgData.append('selMenuType', this.menuTypeDataSelection);
            this.headerImgData.append('headerMainImg', this.headerSideImg);
                
            this.commonService.filePostData(this.headerImgData, 'saveCssData').subscribe(res => {
                this.rdata = JSON.parse(res);
                this.rstatus = this.rdata['status'];
                if (this.rdata['sideMenuHeaderLogo']) {
                    this.headerSideImg = this.rdata['sideMenuHeaderLogo'];
                }
                this.oldMainImg = this.headerSideImg.split('headerImg/');

                const promise = new Promise((resolve) => {
                    for (let i = 0; i < this.menuArrayCss.length; ++i) {
                        if (this.menuArrayCss[i]['key'] == 'sideMenuImg') {
                            this.menuArrayCss[i]['value'] = this.headerSideImg;
                        }
                    }                                                     
                    resolve(true);
                })
                
                if (this.rstatus == '1') {
                    const success_message = this.rdata['message'];
                    if (this.menuImageChangeFlag == true) {
                        this.menuImageChangeFlag = false;
                    } else {
                        $(function () {
                            $.notify({
                                title: '',
                                message: success_message
                            }, {
                                    type: 'success'
                                });
                        });
                    }
                    observe.next(success_message);
                    NProgress.done();
                    observe.complete();
                    this.menuBtnSaveRef.nativeElement.disabled = false;
                    this.tabBtnSaveRef.nativeElement.disabled = false;
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
                    NProgress.done();
                    observe.error(error_message);
                    this.menuBtnSaveRef.nativeElement.disabled = false;
                    this.tabBtnSaveRef.nativeElement.disabled = false;
                }
            });                                                
        })

    }


    // group b changes
    // sideMenuCssSubmit() {
    //     // get current app data
    //     const appData = this.commonService.get_current_app_data();
    //     const appId = JSON.stringify(appData.id);

    //     const sideMenuCssDBColumn = 'app_side_menu_css_json_data';

    //     if (this.finallTabArray) {
    //         for (let i = 0; i < this.tabArrayCss.length; ++i) {
    //             if (this.tabArrayCss[i]['key'] == 'menuname') {
    //                 this.tabArrayCss[i]['value'] = this.finallTabArray;
    //             }
    //         }
    //     }

    //     // setTimeout(() => {
    //     // savemenucssflag
    //     for (let i = 0; i < this.arrowArrayCss.length; ++i) {
    //         if (this.arrowArrayCss[i].key == "backarrowcolor") {
    //             this.arrowArrayCss[i].value = this.menuIconCssColor;
    //         }
    //     }
    //     // setTimeout(() => {

    //     this.mainCssArray = {
    //         sideMenuCss: [{ 'mainMenu': this.menuArrayCss },
    //         { 'subMenu': this.submenuArrayCss },
    //         { 'arrow': this.arrowArrayCss },
    //         { 'tabMenu': this.tabArrayCss }]
    //     };
    //     this.headerImgData = new FormData();

    //     if (this.sideMenuHeaderImgData) {
    //         const file: File = this.sideMenuHeaderImgData[0];
    //         this.headerImgData.append('headerImg', file);
    //     }

    //     if (this.oldHeaderImg) {
    //         this.headerImgDataMain.append('oldHeaderImg', this.oldHeaderImg[1]);
    //     }

    //     this.headerImgData.append('data', JSON.stringify(this.mainCssArray));
    //     this.headerImgData.append('appId', appId);
    //     this.headerImgData.append('dbColumn', sideMenuCssDBColumn);
    //     this.headerImgData.append('selMenuType', this.menuTypeDataSelection);

    //     if (this.oldMainImg) {
    //         this.headerImgData.append('oldMainImg', this.oldMainImg[1]);
    //     }

    //     this.commonService.filePostData(this.headerImgData, 'saveCssData').subscribe(res => {
    //         this.rdata = JSON.parse(res);
    //         this.rstatus = this.rdata['status'];

    //         this.headerSideImg = this.rdata['sideMenuHeaderLogo'];
    //         this.oldMainImg = this.headerSideImg.split('headerImg/');

    //         const promise = new Promise((resolve) => {
    //             for (let i = 0; i < this.menuArrayCss.length; ++i) {
    //                 if (this.menuArrayCss[i]['key'] == 'sideMenuImg') {
    //                     this.menuArrayCss[i]['value'] = this.headerSideImg;
    //                 }
    //             }
    //             resolve(true);
    //         })

    //         promise.then(() => {

    //             this.mainCssArray = {
    //                 sideMenuCss: [{ 'mainMenu': this.menuArrayCss },
    //                 { 'subMenu': this.submenuArrayCss },
    //                 { 'arrow': this.arrowArrayCss },
    //                 { 'tabMenu': this.tabArrayCss }]
    //             };
    //             this.headerImgData = new FormData();

    //             // if(this.oldHeaderImg){
    //             //     this.headerImgDataMain.append('oldHeaderImg', this.oldHeaderImg[1]);
    //             // }

    //             this.headerImgData.append('data', JSON.stringify(this.mainCssArray));
    //             this.headerImgData.append('appId', appId);
    //             this.headerImgData.append('dbColumn', sideMenuCssDBColumn);
    //             this.headerImgData.append('selMenuType', this.menuTypeDataSelection);

    //             // if(this.oldMainImg){
    //             //     this.headerImgData.append('oldMainImg', this.oldMainImg[1]);
    //             // }


    //             this.commonService.filePostData(this.headerImgData, 'saveCssData').subscribe(res => { });
    //         }
    //         )

    //         if (this.rstatus == '1') {
    //             const success_message = this.rdata['message'];
    //             $(function () {
    //                 $.notify({
    //                     title: '',
    //                     message: success_message
    //                 }, {
    //                         type: 'success'
    //                     });
    //             });
    //         } else {
    //             const error_message = this.rdata['message'];
    //             $(function () {
    //                 $.notify({
    //                     title: '',
    //                     message: error_message
    //                 }, {
    //                         type: 'danger'
    //                     });
    //             });
    //         }
    //     });

    //     //   }, 400);

    //     // }, 500)
    // }

    // menu css
    sendMenuTypeVideoData(id, value, cssPropName, f: NgForm) {

        if (cssPropName == 'fontSize') {
            this.parentFontSize = value + 'px';
        }
        if (cssPropName == 'paddingLeft') {
            this.menuPaddingLeft = value + 'px';
        }
        if (cssPropName == 'paddingTop') {
            this.menuPaddingTop = value + 'px';
        }
        if (cssPropName == 'background color') {
            this.menuPaddingTop = value + 'px';
        }
        if (cssPropName == 'lineDividerColor') {

            this.menuArrayCss[id]['value'] = value;
            this.borderColor = value;
        }
        if (cssPropName == 'lineDividerHeight') {
            this.menuBorder = value + 'px solid' + this.borderColor;
            this.menuArrayCss[id]['value'] = value;
        }

        if( cssPropName == 'sideMenuHeaderBgColor') {
          //2018.02.20 gjc
          const hsva = this.cpService.stringToHsva(value, true);
          const sideMenuHeaderBgColor = this.cpService.outputFormat(hsva, 'rgba', null);
          this.menuArrayCss[id]['value'] = value;
          this.sideMenuHeaderBgColor = sideMenuHeaderBgColor;

          this.menuLocationFormBoolRef = true;
          return sideMenuHeaderBgColor;
        }

        if (cssPropName == 'selectedColor') {
            //2018.02.20 gjc
            // const hsva = this.cpService.stringToHsva(value, true);
            // const selected_color = this.cpService.outputFormat(hsva, 'rgba', null);
            // this.menuArrayCss[id]['value'] = value;
            // this.selectedColor = selected_color;
            // this.selectedColorSub = selected_color;

            // this.menuLocationFormBoolRef = true;
            // return selected_color;
            this.menuArrayCss[id]['value'] = value;
            this.selectedColor = value;
            this.selectedColorSub = value;

        }
        if (cssPropName == 'selectedFontColor') {
            this.menuArrayCss[id]['value'] = value;
            this.selectedFontColor = value;
            this.selectedFontColorSub = value;
        }
        if (cssPropName == 'nonSelectedColor') {
            // alert(id);
            this.menuArrayCss[id]['value'] = value;
            this.nonSelectedColor = value;
            this.nonSelectedColorSub = value;
        }
        if (cssPropName == 'nonSelectedFontColor') {
            const hsva = this.cpService.stringToHsva(value, true);
            const nonselectFont = this.cpService.outputFormat(hsva, 'rgba', null);
            this.menuArrayCss[id]['value'] = value;
            this.nonSelectedFontColor = nonselectFont;
            this.nonSelectedFontColorSub = nonselectFont;

            this.menuLocationFormBoolRef = true;
            return nonselectFont;
        }

        // if (cssPropName == 'font_size') {
        //     this.tabArrayCss[id]['value'] = value;
        //     this.tabCss['font_size'] = value;
        // }
        if (cssPropName == 'borderColor') {
            this.tabArrayCss[id]['value'] = value;
            this.tabCss['borderColor'] = value;
        }
        if (cssPropName == 'tabBackgroundColor') {
            this.tabArrayCss[id]['value'] = value;
            this.tabCss['backgroundColor'] = value;
        }

        if (cssPropName == 'tabfontselectedColor') {
          this.tabArrayCss[id]['value'] = value;
          this.tabCss['fontcolor'] = value;
        }

        if (this.menuFormRef.dirty === f.dirty) {

            this.menuFormBoolRef = true;
            // console.log('menuform bool')

        } else if (this.submenuFormRef.dirty === f.dirty) {

            this.submenuFormBoolRef = true;
            // console.log('submenu form bool')

        } else if (this.arrowmenuFormRef.dirty === f.dirty) {

            this.arrowmenuBoolRef = true;
            // console.log('arrow bool ref');

        } else if (this.tabmenuFormRef.dirty === f.dirty) {

            this.tabmenuFormBoolRef = true;
            // console.log('tabmenu bool')
        }
    }

    selectMenuFun(id, $event, cssPropName) {

        if (cssPropName == 'fonttype') {

            this.menuArrayCss[id]['value'] = $event.target.value;
            // this.subMenuCssData['fonttype'] = { 'font-family': $event.target.value };
            this.menuFontFamily = $event.target.value;
            // console.log(this.menuFontFamily);
        }

        if (cssPropName == 'position') {
            this.arrowArrayCss[id]['value'] = $event.target.value;
        }

    }

    onChangefontcolor(i, $event, cssPropName): any {
        this.submenuArrayCss[i]['value'] = $event
        this.colorData = $event;

        // menu form set dirty
        this.menuFormBoolRef = true;
    }

    onChangebackgroundcolor(i, $event, cssPropName, f: NgForm): any {

        if (cssPropName == 'borderBottom') {
            if (this.headerBorderSize) {
                this.subMenuHeaderBorderColorMob = this.headerBorderSize + 'px solid ' + $event;
            } else {
                this.subMenuHeaderBorderColorMob = '1px solid ' + $event;
            }
            this.subMenuHeaderBorderColor = $event
            this.menuArrayCss[i]['value'] = this.subMenuHeaderBorderColorMob;
        }

        if( cssPropName == 'sideMenuHeaderBgColor') {
          // this.menuArrayCss[i]['value'] = 
        }

        if (cssPropName == 'borderBottomSize') {
            this.headerBorderSize = $event;
            let a = this.menuArrayCss[i]['value'].split('#');
            if (a[1]) {
                this.subMenuHeaderBorderColorMob = this.headerBorderSize + 'px solid #' + a[1];
            } else {
                this.subMenuHeaderBorderColorMob = this.headerBorderSize + 'px solid black';
            }
            this.menuArrayCss[i]['value'] = this.subMenuHeaderBorderColorMob;
        }
        // this.submenuArrayCss[i]['value'] = $event
        this.backgroundColorData = $event;
    }

    // submenu css
    submenuModelChange(id, value, cssPropName) {
        //begin gjc 0420
        if (cssPropName == 'selectedColor') {
            const hsva = this.cpService.stringToHsva(value, true);
            const selected_color = this.cpService.outputFormat(hsva, 'rgba', null);
            this.submenuArrayCss[id]['value'] = value;
            this.subMenuSelectedColor = selected_color;
            this.subMenuSelectedColorSub = selected_color;

            this.submenuFormBoolRef = true;
            return selected_color;

        }
        if (cssPropName == 'nonSelectedColor') {
            this.submenuArrayCss[id]['value'] = value;
            this.subMenuNonSelectedColor = value;
            this.subMenuNonSelectedColorSub = value;
        }
        if (cssPropName == 'selectedFontColor') {
            this.submenuArrayCss[id]['value'] = value;
            this.subMenuSelectedFontColor = value;
            this.subMenuSelectedFontColorSub = value;
        }
        if (cssPropName == 'nonSelectedFontColor') {
            const hsva = this.cpService.stringToHsva(value, true);
            const nonselectFont = this.cpService.outputFormat(hsva, 'rgba', null);
            this.submenuArrayCss[id]['value'] = value;
            this.subMenuNonSelectedFontColor = nonselectFont;
            this.subMenuNonSelectedFontColorSub = nonselectFont;

            this.submenuFormBoolRef = true;
            return nonselectFont;
        }
        
        //end gjc 0420

        if (cssPropName == 'fontSize') {
            this.submenuParentFontSize = value + 'px';
        }
        if (cssPropName == 'paddingLeft') {
            this.submenuMenuPaddingLeft = value + 'px';
        }
        if (cssPropName == 'paddingTop') {
            this.submenuMenuPaddingTop = value + 'px';
        }
        if (cssPropName == 'borderBottom') {
            this.submenuBorder = value + 'px solid ' + this.submenuBorderColor;
        }
        if (cssPropName == 'borderColor') {
            this.menuArrayCss[id]['value'] = value;
            this.submenuBorderColor = value;
        }

        if (cssPropName == 'marginTop') {
            this.submenuMarginTop = value + 'px';
        }

        if (cssPropName == 'arrow padding left') {
            this.arrowArrayCss[id]['value'] = value;
            this.marginLeftArrow = value + "px";
        }
        //for tab
        if (cssPropName == 'fontsizetab') {
            this.tabArrayCss[id]['value'] = value;
            this.tabCss['fontsizetab'] = value + "px";
        }

        if (cssPropName == 'tabheight') {
            this.tabArrayCss[id]['value'] = value;
            this.tabCss['tabheight'] = value + "px";
        }

        if (cssPropName == 'bordertab') {
            this.tabArrayCss[id]['value'] = value;
            this.tabCss['bordertab'] = value + "px solid";
        }

        if( cssPropName == 'tabcount') {
            this.tabArrayCss[id]['value'] = value;
            this.tabCss['tabcount'] = value;
        }

        // if(cssPropName == 'font_size') {
        //     this.tabArrayCss[id]['value'] = value;
        //     this.tabCss['font_size'] = value;
        // }
    }

    fontChange() {
        this.fontSize = $("#font_size").val();
        if(this.fontSize >15 || this.fontSize <5)
        {
            this.fontFlag = true;
            $('#btnSave').attr("disabled", "disabled");
            // $("input[type=submit]").attr("disabled", "disabled");
        }
        else 
        {
            this.fontFlag = false;
            $('#btnSave').removeAttr("disabled");
        }
        // console.log(this.fontSize);
        // this.fontSize = fontSize;
        // console.log("this.fontSize = ",this.fontSize);
        // debugger
    }

    headerChange() {
        this.headerSize = $("#header_size").val();
        if(this.headerSize < 0)
        {
            this.headerFlag = true;
            $('#btnSave').attr("disabled", "disabled");
        }
        else
        {
            this.headerFlag = false;
            $('#btnSave').removeAttr("disabled");
        }
    }

    heightChange() {
        this.heightSize = $("#height_size").val();
        // if(!$.isNumeric( $('#height_size').val())) return;
        if(this.heightSize > 60 || this.heightSize < 30)
        {
            this.heightFlag = true;
            $('#btnSave').attr("disabled", "disabled");
        }
        else
        {
            this.heightFlag = false;
            $('#btnSave').removeAttr("disabled");
        }
    }

    submenuBorderChange(id, value, cssPropName, f: NgForm) {
        if (cssPropName == 'borderColor') {
            //2018.02.20 gjc
            const hsva = this.cpService.stringToHsva(value, true);
            const border_color = this.cpService.outputFormat(hsva, 'rgba', null);
            this.submenuArrayCss[id]['value'] = value;
            this.submenuBorderColor = border_color;

            this.menuLocationFormBoolRef = true;
            return border_color;
        }

        if (cssPropName == 'tabfontselectedColor') {
            this.tabArrayCss[id]['value'] = value;
            this.tabCss['fontcolor'] = value;
        }

        if (cssPropName == 'tabBackgroundColor') {
          this.tabArrayCss[id]['value'] = value;
          this.tabCss['backgroundColor'] = value;
        }

        if (cssPropName == 'borderColor') {
            this.tabArrayCss[id]['value'] = value;
            this.tabCss['borderColor'] = value;
        }

        // if (cssPropName == 'font_size') {
        //     this.tabArrayCss[id]['value'] = value;
        //     this.tabCss['font_size'] = value;
        // }

        if (this.submenuFormRef && this.submenuFormRef.dirty === f.dirty) {
            this.submenuFormBoolRef = true;
        } else if (this.tabmenuFormRef && this.tabmenuFormRef.dirty === f.dirty) {
            this.tabmenuFormBoolRef = true;
        }
    }

    submenuSelectMenuFun(id, $event, cssPropName) {
        if (cssPropName == 'fonttype') {
            this.submenuArrayCss[id]['value'] = $event.target.value;
            this.submenuFontFamily = $event.target.value;
            // console.log(this.submenuFontFamily)
        }

        if (cssPropName == 'fonttypeTab') {
            this.tabArrayCss[id]['value'] = $event.target.value;
            this.tabCss['font-tab-data'] = $event.target.value;
        }
    }

    submenuSelectTabPosition(id, $event, cssPropName) {
        if(cssPropName == 'tabpositionTab'){
            this.tabArrayCss[id]['value'] = $event.target.value;      
            this.tabCss['tab-position'] = $event.target.value;
        }
    }

    submenuOnChangefontcolor(i, $event, cssPropName): any {
        this.menuArrayCss[i]['value'] = $event
        this.submenuColorData = $event;
        // set dirty if any changes made in submenuform detect via callback fun
        // console.log('submenu bool');
        this.submenuFormBoolRef = true;
    }

    submenuOnChangebackgroundcolor(i, $event, cssPropName): any {
        this.submenuArrayCss[i]['value'] = $event
        this.submenuBackgroundColorData = $event;

        // set dirty if any changes made in submenuform detect via callback fun
        // console.log('submenu bool');
        this.submenuFormBoolRef = true;
    }

    // general menu css
    genralMenuOnChangefontcolor(i, $event, cssPropName, formRef: NgForm): any {

        if (cssPropName == 'backgroundColorMenu') {
            this.menuiconArrayCss[i]['value'] = $event;
            this.menuIconCssColor = $event;
            this.arrowArrayCss[i]['value'] = $event;
            // set general menufrom ref dirty
            this.menuLocationFormBoolRef = true;
        }

        if (cssPropName == 'backgroundColorHeader') {
            this.headerArrayCss[i]['value'] = $event;
            this.headerBackgroundColor = $event;
            // set general menufrom ref dirty            
            this.menuLocationFormBoolRef = true;

            for(let j = 0; j<this.statusbarArrayCss.length; j++){
              if(this.statusbarArrayCss[j]['key'] == 'background color'){
                this.statusbarArrayCss[i]['value'] = $event;
                this.statusBarColorCss = $event;
              }
            }
            
        }

        if (cssPropName == 'headerbordercolor') {
            //2018.02.20 gjc
            //const hsva = this.cpService.stringToHsva($event, true);
            //const headerColor_value = this.cpService.outputFormat(hsva, 'rgb', null);
            this.headerArrayCss[i]['value'] = $event;//headerColor_value;
            this.headerBorderColor = $event;// headerColor_value;
            // set general menufrom ref dirty
            this.menuLocationFormBoolRef = true;
            //return headerColor_value;
        }

        if (cssPropName == 'statusbarcolor') {
            this.statusbarArrayCss[i]['value'] = $event;
            this.statusBarColorCss = $event;
            // set general menufrom ref dirty
            this.menuLocationFormBoolRef = true;
        }

        if (cssPropName == 'arrowColor') {

            $('.left_menu .arrow-down').css('border-top-color', $event);
            $('.left_menu .arrow-up').css('border-bottom-color', $event);
            this.arrowArrayCss[i]['value'] = $event;
            // set arrow menufrom ref dirty
            this.arrowmenuBoolRef = true;

        }

        if (cssPropName == 'toggleinner') {
            this.arrowArrayCss[i]['value'] = $event;
            // set arrow menufrom ref dirty
            this.arrowmenuBoolRef = true;
        }
        if (cssPropName == 'toggleouter') {
            this.arrowArrayCss[i]['value'] = $event;
            // set arrow menufrom ref dirty
            this.arrowmenuBoolRef = true;
        }
        if (cssPropName == 'backarrowcolor') {
            this.arrowArrayCss[i]['value'] = $event;
            // set arrow menufrom ref dirty
            this.arrowmenuBoolRef = true;
        }
    }

    generalCssChange(i, value, cssPropName) {

        if (cssPropName == 'borderbottom') {
            this.borderSize = value + 'px solid ' + this.headerBorderColor;
            let a = 40 - value;
            this.headerLogoWidth = a + 'px';
            this.headerLogoHeight = a + 'px';
        }

        if (cssPropName == 'height') {
            this.heightData = value + 'px';
        }
        // if general form dirty
        if (this.gFormRef.dirty) {
            this.menuLocationFormBoolRef = this.gFormRef.dirty;
        }
    }

    toggleMenuGeneral() {

        $('.sidemenuGeneral1').toggleClass('hide_menu');
        $('.sidemenuGeneral').toggleClass('left_view');
        if (this.logoHideFlagGeneral == true) {
            this.logoHideFlagGeneral = false;
        } else {
            this.logoHideFlagGeneral = true;
        }
    }

    toggleMenu() {
        $('.sidemenu1').toggleClass('hide_menu');
        $('.sidemenu').toggleClass('left_view');
        if (this.logoHideFlag == true) {
            this.logoHideFlag = false;
        } else {
            this.logoHideFlag = true;
        }
    }

    toggleMenuGeneralDefault() {
        // $('#btnSave').removeAttr("disabled");
        this.headerChange();
        // $('.mob_header')
        // mob_header:     margin-left: 160px-> 0
        //
        // $('.mob_header').;
        // $('.left_menu').removeClass('sidemenuGeneral1');

    }
    toggleMenuHeaderDefault() {
        if (this.menuType == 1 || this.menuType == undefined) {
            $('.sidemenu1').addClass('hide_menu');
            $('.sidemenu').addClass('left_view');
            this.logoHideFlag = false;
            this.menuIconShow = true;
        }
        if (this.menuType == 2) {
            // if()
            this.heightChange();
            this.fontChange();
            this.fontSize = $("#font_size").val();
            if(this.fontSize >15 || this.fontSize <5)
            {
                this.fontFlag = true;
                $('#btnSave').attr("disabled", "disabled");
                // $("input[type=submit]").attr("disabled", "disabled");
            }
            else 
            {
                this.fontFlag = false;
                $('#btnSave').removeAttr("disabled");
            }
            
            $('.sidemenu1').removeClass('hide_menu');
            $('.sidemenu').removeClass('left_view');
            this.logoHideFlag = true;
            this.menuIconShow = false;
            if (this.menuJson != null && typeof(this.menuJson) != 'undefined') {
                this.getCurrentActiveTapMenuGroup(null);
            }
        }

    }
    menuDownGeneral(i) {
        const className = 'arrowDownGeneral' + i;
        const subClassName = 'subMenuGeneral' + i;
        $('.' + subClassName).removeClass('childDisplayNone');
        if ($('#' + className).hasClass('arrow-down')) {

            $('#' + className).removeClass('arrow-down');
            $('#' + className).addClass('arrow-up');
            $('.' + subClassName).addClass('toggleChild');

            // $('#'+className).css({"border-left":"15px !important;"});

        } else {

            $('.' + subClassName).removeClass('toggleChild')
            $('#' + className).removeClass('arrow-up');
            $('#' + className).addClass('arrow-down');

        }
    }
    menuDown(i) {
        const className = 'arrowDown' + i;
        const subClassName = 'subMenu' + i;
        $('.' + subClassName).removeClass('childDisplayNone');
        if ($('#' + className).hasClass('arrow-down')) {

            $('#' + className).removeClass('arrow-down');
            $('#' + className).addClass('arrow-up');
            $('.' + subClassName).addClass('toggleChild');

            // $('#'+className).css({"border-left":"15px !important;"});

        } else {

            $('.' + subClassName).removeClass('toggleChild')
            $('#' + className).removeClass('arrow-up');
            $('#' + className).addClass('arrow-down');

        }
    }

    menuColorChange(fontColor, backgroundColor) {
        // if(fontColor == this.selectedFontColor || fontColor == this.nonSelectedFontColorSub){
        //     this.selectedFontColor = this.nonSelectedFontColorSub;
        // } else {
        //     this.nonSelectedFontColor = this.selectedFontColorSub;
        // }

        // if(backgroundColor == this.selectedColor || backgroundColor == this.nonSelectedColorSub){
        //     this.selectedColor = this.nonSelectedColorSub;
        // } else {
        //     this.nonSelectedColor = this.selectedColorSub;
        // }
    }

    subMenuCollapseOpen() {
        if (this.confirmFlag == false) {
            this.confirmFlag = true;
        } else {
            this.confirmFlag = false;
        }
    }

    selectMenuChange(i, value) {
        if (i == 0) {
            this.iconOne = value;
            this.tabMenuData = [{ menuName: this.menuJson[0]['menu_name'], icon: value }]
            this.assignTabMenuIcon(0, this.tabMenuData);
        }
        if (i == 1) {
            this.iconTwo = value;
            this.tabMenuData = [{ menuName: this.menuJson[1]['menu_name'], icon: value }]
            this.assignTabMenuIcon(1, this.tabMenuData);
        }
        if (i == 2) {
            this.iconThree = value;
            this.tabMenuData = [{ menuName: this.menuJson[2]['menu_name'], icon: value }]
            this.assignTabMenuIcon(2, this.tabMenuData);

        }
        if (i == 3) {
            this.iconFour = value;
            this.tabMenuData = [{ menuName: this.menuJson[3]['menu_name'], icon: value }]
            this.assignTabMenuIcon(3, this.tabMenuData);

        }
        if (i == 4) {
            this.iconFive = value;
            this.tabMenuData = [{ menuName: this.menuJson[4]['menu_name'], icon: value }]
            this.assignTabMenuIcon(4, this.tabMenuData);
        }
        console.log(value);
        this.currentMenuJson[i]['menu_icon'] = value;
        console.log(this.currentMenuJson[i]);
    }

    CheckSameMenuJson(CurrentMenu) {
        let index = -1;
        let menu_level = CurrentMenu.menu_level;
        
        return index;
    }


    assignTabMenuIcon(id, value) {
        this.finallTabArray[id] = value;
    }

    menuClick(menu_type, jsonData, isSidemenu) {
        this.listFlag = false;
        this.videoList = false;

        console.log(menu_type);
        console.log(jsonData);
        console.log(isSidemenu);

        this.selectedMenuId = jsonData.id;

        if (typeof(jsonData.children) != 'undefined' || jsonData.children != null) {
            for (let i = 0; i< jsonData.children.length; i++) {
                let child = jsonData.children[i];
                child.hidechild = 0;
                if (typeof(child.children) != 'undefined' || child.children != null) {
                    for (let j = 0; j< child.children.length; j++) {
                        let child1 = child.children[j];
                        child1.hidechild = 0;
                        if (typeof(child1.children) != 'undefined' || child1.children != null) {
                            for (let k = 0; k< child1.children.length; k++) {
                                let child2 = child1.children[k];
                                child2.hidechild = 0;
                            }
                        }
                    }
                }
            }
            if (jsonData.hidechild != 1) {
                jsonData.hidechild = 1;
            } else {
                jsonData.hidechild = 0;
            }
        }

        if (isSidemenu == 1) {
            if (jsonData.children) {
                for (let i = 0; i < jsonData.children.length; ++i) {

                    if (jsonData.children[i].menu_type == 9) {
                        const url = JSON.parse(jsonData.children[i].menu_type_json_data);
                        if (url) {
                            this.listFlag = true;
                            this.levelThreeData[i] = { name: jsonData.children[i].menu_name, url: url.web_url };
                        }
                    }
                }
            }

        }
        if (isSidemenu == undefined) {
            if (menu_type == 2) {
                if (jsonData.menu_type_json_data) {
                    if (jsonData.menu_type_json_data.type == "video") {
                        this.videoList = true;
                        const key = 'AIzaSyDQJOsabHfciuqqbPVapUbx1YIqNvnSdTE';
                        const playlistId = "PLwO-rsGhvb7FrKv8kvz8eZ0a5aRtgs6se";
                        this.commonService.getVideoInfo(key, playlistId);
                        setTimeout(() => {
                            // console.log(this.commonService.youtubeJsonData);
                            let allVideoData = JSON.parse(this.commonService.youtubeJsonData);
                            this.videoDataFinal = allVideoData['items'];

                        }, 1500);
                    }
                }
            }
        }

        // $('.sidemenu1').removeClass('hide_menu');
        // $('.sidemenu').removeClass('left_view');
        // this.logoHideFlag = true;
    }

    videoPlay(videoId) {

    }
    /**
    * canDeactivate Implemetation
    */
    canDeactivate(): boolean | Promise<boolean> {
        // console.log(this.submenuFormBoolRef
        //     , 'submenu Bool', this.arrowmenuBoolRef
        //     , 'arrowmenubool ref', this.menuFormBoolRef, 'menulocation bool ref'
        //     , 'tabmenuboolref', this.tabmenuFormBoolRef
        //     , 'menulocationboolref', this.menuLocationFormBoolRef
        //     , 'gformref', this.gFormRef.dirty
        //     , 'submenuformeref', this.submenuFormRef.dirty
        //     , 'menuform ref', this.menuFormRef.dirty
        //     , 'arrowmenu ref', this.arrowmenuFormRef.dirty);
        if (this.submenuFormBoolRef
            || this.arrowmenuBoolRef
            || this.menuFormBoolRef
            || this.tabmenuFormBoolRef
            || this.menuLocationFormBoolRef
            || (this.gFormRef && this.gFormRef.dirty)
            || (this.submenuFormRef && this.submenuFormRef.dirty)
            || (this.tabmenuFormRef && this.tabmenuFormRef.dirty)
            || (this.menuFormRef && this.menuFormRef.dirty)
            || (this.arrowmenuFormRef && this.arrowmenuFormRef.dirty)) {

            return new Promise<boolean>((resolve, reject) => {
                swal({
                    title: 'You didn`t save!',
                    text: 'You have unsaved changes, would you like to save?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonClass: 'btn-success',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    closeOnConfirm: true,
                    closeOnCancel: true
                }, (isConfirm) => {
                    // if accept yes

                    if (isConfirm) {
                        // console.log(this.submenuFormRef);

                        if ((this.gFormRef && this.gFormRef.dirty) || this.menuLocationFormBoolRef) {
                            this.isGFormDirty().subscribe(d => {
                                resolve(true);
                                // this.menuLocationFormBoolRef = false;
                                // this.gFormRef.form.markAsPristine();
                            }, err => {
                                resolve(false);
                            })
                        }

                        // detect menu submenu arrow forms dirty state
                        if (
                            ((this.menuFormRef && this.menuFormRef.dirty) || this.menuFormBoolRef)
                            || ((this.submenuFormRef && this.submenuFormRef.dirty) || this.submenuFormBoolRef)
                            || ((this.arrowmenuFormRef && this.arrowmenuFormRef.dirty) || this.arrowmenuBoolRef)
                        ) {

                            // console.log('menuform dirty');
                            this.sideMenuCssSubmitObservable().subscribe(d => {
                                //  console.log(d);
                                // reset all dirty boolFormRef
                                this.resetAllDirtyStateMenuForm();
                                resolve(true);
                            }, err => {
                                // console.log(err);
                                // reset all dirty boolFormRef
                                this.resetAllDirtyStateMenuForm();
                                resolve(false);
                            }, () => {

                            });
                        }
                        // detect submenuform dirty state
                        // if (this.submenuFormRef && (this.submenuFormRef.dirty || this.submenuFormBoolRef)) {
                        //     // console.log('submenuform dirty');
                        //     this.sideMenuCssSubmitObservable().subscribe(d => {
                        //         console.log(d);
                        //         this.submenuFormBoolRef = false;
                        //     }, err => {
                        //         console.log(err);
                        //         this.submenuFormBoolRef = false;
                        //     }, () => {

                        //     });
                        // }
                        // // detect arrowmenuform dirty state
                        // if (this.arrowmenuFormRef && (this.arrowmenuBoolRef || this.arrowmenuFormRef.dirty)) {
                        //     console.log('arrowmenu form');
                        //     this.sideMenuCssSubmitObservable().subscribe(d => {
                        //         console.log(d);
                        //         this.arrowmenuBoolRef = false;
                        //     }, err => {
                        //         console.log(err);
                        //         this.arrowmenuBoolRef = false;
                        //     }, () => {

                        //     });
                        // }
                        // detect tabmenuform dirty state
                        if (this.tabmenuFormRef && (this.tabmenuFormBoolRef || this.tabmenuFormRef.dirty)) {
                            // console.log('tabmenu form');
                            this.sideMenuCssSubmitObservable().subscribe(d => {

                                // reset all dirty boolFormRef
                                this.resetAllDirtyStateMenuForm();
                                resolve(true);
                            }, err => {

                                // reset all dirty boolFormRef
                                this.resetAllDirtyStateMenuForm();
                                resolve(false);
                            }, () => {
                                console.log("generate json")
                                this.FastGenerateJson();
                            });
                        }
                        // save form data if any of form is dirty

                    } else {
                        resolve(true);
                    }
                });
            });
        }
        return true;
    }
    appHeaderIconFileChange(event) {
        $('.menu-header-icon-dropify').simpleCropper();
        this.sideMenuHeaderImgData = event.target.files;
        this.sideMenuHeaderImgName = event.target.files[0].name;
        this.menuFormBoolRef = true;
        this.menuImageChangeFlag = true;
        // let tempData = this.sideMenuHeaderImgName.split('.');

        setTimeout(() => {
            if (this.dropifyAppIconHeaderSize != false) {
                // if ((tempData[1] == 'png' || tempData[1] == 'jpeg' || tempData[1] == 'jpg')) {
                //     this.sideMenuCssSubmit();
                // }
            } else {
                this.dropifyAppIconHeaderSize = true;
            }
        }, 1000)
    }
    appMainHeaderIconFileChange(event) {
        $('.header-icon-dropify').simpleCropper();
        this.mainHeaderImgData = event.target.files;
        this.mainHeaderImgName = event.target.files[0].name;
        this.menuLocationFormBoolRef = true;
        this.genralImageChangeFlag = true;
        // let tempData = this.mainHeaderImgName.split('.');
        // this.dropifyAppIconHeaderSize
        setTimeout(() => {
            if (this.dropifyAppIconHeaderSize != false) {
                // if ((tempData[1] == 'png' || tempData[1] == 'jpeg' || tempData[1] == 'jpg')) {
                //     // this.homescreenSubmit();
                // }
            } else {
                this.dropifyAppIconHeaderSize = true;
            }
        }, 1000)
    }
    /**
     * Private method to save while general css form data is dirty and use select to save
     * @param
     * @returns boolean
     */
    private isGFormDirty(): Observable<boolean> {
        return Observable.create((ob) => {
            // this.homeScreenSubmitObservable().subscribe((d) => {
            //     // console.log(d);
            //     this.menuLocationFormBoolRef = false;
            //     // console.log('cc');
            //     this.gFormRef.form.markAsPristine();
            //     // swal({
            //     //     title: 'Successfully',
            //     //     text: 'Data Saved Successfully',
            //     //     type: 'success',
            //     //     confirmButtonClass: 'btn-success'
            //     // });

            //     // give redirection
            //     ob.next(true)
            // }, (err) => {
            //     console.log(err);
            //     // stop redirection
            //     // resolve(false);
            //     this.menuLocationFormBoolRef = false;
            //     this.gFormRef.form.markAsPristine();
            //     ob.throw(err)
            // }, () => {
            //     // console.log('obsever completed');
            //     ob.complete()
            // })
        })
    }

    /**
     * Private method to save while submenyu css form data is dirty and use select to save
     * @param
     * @returns boolean
     */
    private resetAllDirtyStateMenuForm(): void {
        this.tabmenuFormBoolRef = false;
        this.menuFormBoolRef = false;
        this.arrowmenuBoolRef = false;
        this.submenuFormBoolRef = false;
        this.menuLocationFormBoolRef = false;

        //
        if (this.tabmenuFormRef) {
            this.tabmenuFormRef.form.markAsPristine();
        }

        if (this.menuFormRef || this.arrowmenuFormRef || this.submenuFormRef) {

            this.menuFormRef.form.markAsPristine();
            this.arrowmenuFormRef.form.markAsPristine();
            this.submenuFormRef.form.markAsPristine();
            this.gFormRef.form.markAsPristine();
        }
    }

    /**
     * Method to call isCssDataExist API
     */
    callablePromiseAPI(): Observable<any> {

        const appData = this.commonService.get_current_app_data();
        const appId = JSON.stringify(appData.id);
        const appUniqId = JSON.stringify(appData.app_unique_id);
        const cssComponent = 'general_css';
        const generalCssDBColumn = 'app_general_css_json_data';
        const self = this;
        return Observable.create((observer) => {
            this.commonService.postData({
                'appId': appUniqId,
                'id': appId,
                'cssComponent': cssComponent,
                'dbColumn': generalCssDBColumn
            }, 'isCssDataExsist').subscribe(res => {

                this.cssJsonData = JSON.parse(res);
                this.cssJsonData = JSON.parse(res);
                this.menuiconArrayCss = JSON.parse(this.cssJsonData['menuicon_css']);
                this.headerArrayCss = JSON.parse(this.cssJsonData['header_css']);
                this.statusbarArrayCss = JSON.parse(this.cssJsonData['statusbar_css']);
                this.commonCssJsonData = [];

                for (let i = 0; i < this.menuiconArrayCss.length; ++i) {
                    if (this.menuiconArrayCss[i]['key'] == 'backgroundColorMenu') {
                        this.menuIconCssColor = this.menuiconArrayCss[i]['value'];
                    }
                }

                for (let i = 0; i < this.headerArrayCss.length; ++i) {

                    if (this.headerArrayCss[i]['key'] == 'height') {
                        this.heightData = this.headerArrayCss[i]['value'] + 'px';
                    }

                    if (this.headerArrayCss[i]['key'] == 'borderbottom') {
                        this.borderSize = this.headerArrayCss[i]['value'] + 'px solid';
                    }

                    if (this.headerArrayCss[i]['key'] == 'background color border') {
                        this.headerBorderColor = this.headerArrayCss[i]['value'];
                        //2018.02.20 gjc
                        //this.headarr_border_rgbaText = this.onChangeColorHex8(this.headerBorderColor);
                    }

                    if (this.headerArrayCss[i]['key'] == 'background color') {
                        this.headerBackgroundColor = this.headerArrayCss[i]['value'];
                    }
                    // group b changes
                    if (this.headerArrayCss[i]['key'] == 'headerIcon') {
                        
                        this.headerMainImg = this.headerArrayCss[i]['value'];
                        // this.oldHeaderImg = this.headerMainImg.split('headerImg/');
                        this.generalImgUrl = this.headerMainImg;
                        this.appIconUrl = this.headerMainImg;
                        
                        localStorage.setItem('headerMainImg', this.headerMainImg);
                        // this.msgService.sendMessage(this.appIconUrl);
                        $(function () {
                            const drEventTwo = $('#app_iconHeader').dropify({
                                defaultFile: self.headerMainImg,
                                messages: {
                                    'default': 'Drag and drop a file here or click',
                                    'replace': 'Drag and drop or click to replace',
                                    'remove': 'Remove',
                                    'error': ''
                                },
                                error: {
                                    'fileSize': 'The file size is too big ({{ value }} max).',
                                    'minWidth': 'The image width is too small ({{ value }}px min).',
                                    'maxWidth': 'The image width is too big ({{ value }}px max).',
                                    'minHeight': 'The image height is too small ({{ value }}px min).',
                                    'maxHeight': 'The image height is too big ({{ value }}px max).',
                                    'imageFormat': 'The image format is not allowed ({{ value }} only).'
                                },
                                tpl: {
                                    wrap: '<div class="dropify-wrapper"></div>',
                                    loader: '<div class="dropify-loader"></div>',
                                    message: '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
                                    preview: '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
                                    filename: '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
                                    clearButton: '<button type="button" class="dropify-clear">{{ remove }}</button>',
                                    errorLine: '<p class="dropify-error">{{ error }}</p>',
                                    errorsContainer: '<div class="dropify-errors-container">Please upload image between 100 to 500 dimensions</div>'
                                }
                            });
                            // this.domloaded = false;
                            drEventTwo.on('dropify.error.fileSize', function (event, element) {
                                $('.header-icon-dropify .dropify-errors-container').html('The file size is too big (3M max).');
                            });

                            // For Dropify size Error handle

                            drEventTwo.on('dropify.error.maxWidth', function (event, element) {
                                self.dropifyAppIconHeaderSize = false;
                            });

                            drEventTwo.on('dropify.error.minWidth', function (event, element) {
                                self.dropifyAppIconHeaderSize = false;
                            });

                            drEventTwo.on('dropify.error.minHeight', function (event, element) {
                                self.dropifyAppIconHeaderSize = false;
                            });

                            drEventTwo.on('dropify.error.maxHeight', function (event, element) {
                                self.dropifyAppIconHeaderSize = false;
                            });

                            drEventTwo.on("#app_iconHeader dropify.beforeClear", function (event, element) {
                                self.onRemoveDropify(event, element, "App Icon")
                                    .then(res => {
                                        if (res === true) {
                                            self.removeAppIconDropify(event, drEventTwo);
                                        }
                                    });
                                return false;
                            });
                        })

                        this.handlerTimestart.subscribe(() => {
                            // NProgress.done();
                            observer.next('imgLoaded');
                            observer.complete();
                        });
                    }
                }

                for (let i = 0; i < this.statusbarArrayCss.length; ++i) {
                    if (this.statusbarArrayCss[i]['key'] == 'background color') {
                        this.statusBarColorCss = this.statusbarArrayCss[i]['value'];
                        if (this.statusBarColorCss == '') {
                            this.statusBarColorCss = '#000';
                        }
                    }
                }
            });
            //  this.generalFlag = false;
        })
    }

    onRemoveDropify(event, element, title) {
        // const self = this;
        return new Promise(resolve => {
            swal({
                title: "Are You Sure?",
                text: "Are you sure you want to remove the "+title+" image? This cannot be reversed.",
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
                            text: "Remove the "+title+" Image",
                            type: "success",
                            confirmButtonClass: "btn-success"
                        });
                        resolve(true);
                    } else {
                        swal({
                            title: "Cancelled",
                            text: "Not Remove the "+title+" Image",
                            type: "error",
                            confirmButtonClass: "btn-danger"
                        });
                        resolve(false);
                    }
                });
        });
    }

    removeAppIconDropify(event, drEvent: any) {
        this.mainHeaderImgData = null;
        this.headerMainImg = "";        
        $('.header-icon-dropify .dropify-render img').attr('src', null);
        $('.header-icon-dropify .dropify-infos .dropify-filename .dropify-filename-inner').html(null);
    }

    removeSideMenuIcon(event, drEvent: any) {
        this.headerSideImg = null;
        this.sideMenuHeaderImgData = null;
        $('.menu-header-icon-dropify .dropify-render img').attr('src', null);
        $('.menu-header-icon-dropify .dropify-infos .dropify-filename .dropify-filename-inner').html(null);
    }
    /**
     * method implementation to call isCssDataExist API
     */
    calllableisCssDataExist(): Promise<boolean> {
        const appData = this.commonService.get_current_app_data();
        const appUniqId = JSON.stringify(appData.app_unique_id);
        const sidemenuCssComponent = 'side_menu_css';
        const sideMenuCssDBColumn = 'app_side_menu_css_json_data';
        const appId = JSON.stringify(appData.id);
        const self = this;
        const isCssDataExsistJSON = {
            'appId': appUniqId,
            'id': appId,
            'cssComponent': sidemenuCssComponent,
            'dbColumn': sideMenuCssDBColumn
        };
        return new Promise((resolve, reject) => {
            this.commonService.postData(isCssDataExsistJSON, 'isCssDataExsist').subscribe(res => {

                this.allMenuData = JSON.parse(res);

                this.submenuArrayCss = JSON.parse(this.allMenuData['submenu css']);
                this.arrowArrayCss = JSON.parse(this.allMenuData['arrow css']);
                this.menuArrayCss = JSON.parse(this.allMenuData['menu css']);
                this.tabArrayCss = JSON.parse(this.allMenuData['tab css']);
                console.log('flag');
                console.log(this.allMenuData);
                
                this.menuCssJsonData = [];

                

                if (this.tabArrayCss[2].value == '') {
                    if(this.fontFamilyData.length > 0 )
                        this.fontDataTab = this.fontFamilyData[0].value;
                    else 
                        this.fontDataTab = "ABeeZee";                    
                }else {                                            
                    this.fontDataTab = this.tabArrayCss[2]['value'];
                }

                setTimeout(() => {
                    $('#tab-font-selector').val(this.fontDataTab).trigger('change');                    
                },100);

                this.tabCss['font-tab-data'] = this.fontDataTab;
                
                for (let i = 0; i < this.tabArrayCss.length; i++) {
                    // if(this.tabArrayCss[i]['key'] == 'font_size') {
                    //     this.tabCss['font_size'] = this.tabArrayCss[i]['value'] + 'px';
                    // }
                    
                    if (this.tabArrayCss[i]['key'] == 'fontsizetab') {
                        this.tabCss['fontsizetab'] = this.tabArrayCss[i]['value'] + 'px';
                    }
                    if (this.tabArrayCss[i]['key'] == 'backgroundColor') {
                        this.tabCss['backgroundColor'] = this.tabArrayCss[i]['value'];
                    }
                    if (this.tabArrayCss[i]['key'] == 'bordertab') {
                        this.tabCss['bordertab'] = this.tabArrayCss[i]['value'] + 'px solid';
                    }
                    if (this.tabArrayCss[i]['key'] == 'borderColor') {
                        this.tabCss['borderColor'] = this.tabArrayCss[i]['value'];
                        //2018.02.20 gjc
                        // this.tabarr_border_rgbaText = this.onChangeColorHex8(this.tabCss['borderColor']);
                    }
                    if (this.tabArrayCss[i]['key'] == 'tabheight') {
                        this.tabCss['tabheight'] = this.tabArrayCss[i]['value'] + 'px';
                    }
                    if (this.tabArrayCss[i]['key'] == 'tab-position') {
                        this.tabCss['tab-position'] = this.tabArrayCss[i]['value'];
                        this.tabPosition = this.tabArrayCss[i]['value'];
                    }
                    if(this.tabArrayCss[i]['key'] == 'tabcount') {
                        this.tabCss['tabcount'] = this.tabArrayCss[i]['value'];
                    }

                }

                setTimeout(() => {
                    const handlerTimestart = Observable.timer(2000);
                    for (let i = 0; i < this.arrowArrayCss.length; ++i) {

                        if (this.arrowArrayCss[i]['key'] == 'arrowColor') {
                            const clr = this.arrowArrayCss[i]['value'];
                            handlerTimestart.subscribe(() => {
                                $(function () {
                                    $('.left_menu .arrow-down').css("border-top", ' 8px solid ' + clr);
                                });
                            });
                        }
                        if (this.arrowArrayCss[i]['key'] == 'arrowColor') {

                            const clr = this.arrowArrayCss[i]['value'];
                            handlerTimestart.subscribe(() => {
                                $(function () {
                                    $('.left_menu .arrow-down').css("border-top", ' 8px solid ' + clr);
                                });
                            });
                        }
                        if (this.arrowArrayCss[i]['key'] == 'padding left') {
                            this.menuPaddingTop = this.arrowArrayCss[i]['value'] + "px";
                        }
                        if (this.arrowArrayCss[i]['key'] == 'size') {
                            this.menuPaddingTop = this.arrowArrayCss[i]['value'] + "px";
                        }
                        if (this.arrowArrayCss[i]['key'] == 'position') {
                            this.positionData = this.arrowArrayCss[i]['value'];
                        }
                    }
                }, 200);
                //submenu array
                for (let i = 0; i < this.submenuArrayCss.length; ++i) {

                    if (this.submenuArrayCss[i]['key'] == 'fontSize') {
                        this.submenuParentFontSize = this.submenuArrayCss[i]['value'] + "px";
                    }
                    if (this.submenuArrayCss[i]['key'] == 'paddingLeft') {
                        this.submenuMenuPaddingLeft = this.submenuArrayCss[i]['value'] + "px";
                    }
                    if (this.submenuArrayCss[i]['key'] == 'paddingTop') {
                        this.submenuMenuPaddingTop = this.submenuArrayCss[i]['value'] + "px";
                    }
                    if (this.submenuArrayCss[i]['key'] == 'marginTop') {
                        this.submenuMarginTop = this.submenuArrayCss[i]['value'] + "px";
                    }
                    if (this.submenuArrayCss[i]['key'] == 'borderBottom') {
                        this.submenuBorder = this.submenuArrayCss[i]['value'] + 'px solid';
                    }
                    if (this.submenuArrayCss[i]['key'] == 'borderColor') {
                        this.submenuBorderColor = this.submenuArrayCss[i]['value'];
                    }
                    if (this.submenuArrayCss[i]['key'] == 'color') {
                        this.submenuColorData = this.submenuArrayCss[i]['value'];
                    }
                    if (this.submenuArrayCss[i]['key'] == 'fontName') {

                        this.submenuFontFamily = this.submenuArrayCss[i]['value'];
                        setTimeout(() => {
                            $('#submenuFontSelect').val(this.submenuFontFamily).trigger('change');
                        }, 1000);

                    }
                    if (this.submenuArrayCss[i]['key'] == 'backgroundColor') {
                        this.submenuBackgroundColorData = this.submenuArrayCss[i]['value'];
                    }
                    if (this.submenuArrayCss[i]['key'] == 'selectedColor') {
                        this.selectedColor = this.submenuArrayCss[i]['value'];
                        //2018.02.20 gjc
                        // this.sub_sel_rgbaText = this.onChangeColorHex8(this.selectedColor);
                    }
                    if (this.submenuArrayCss[i]['key'] == 'nonSelectedFontColor') {
                        this.nonSelectedFontColor = this.submenuArrayCss[i]['value'];
                        //2018.02.20 gjc
                        // this.sub_nonsel_font_rgbaText = this.onChangeColorHex8(this.nonSelectedFontColor);
                    }
                }
                //menu array
                for (let i = 0; i < this.menuArrayCss.length; ++i) {

                    if (this.menuArrayCss[i]['key'] == 'fontSize') {
                        this.parentFontSize = this.menuArrayCss[i]['value'] + 'px';
                    }
                    if (this.menuArrayCss[i]['key'] == 'paddingLeft') {
                        this.menuPaddingLeft = '';
                        // this.menuArrayCss[i]['value'] + 'px';
                    }
                    if (this.menuArrayCss[i]['key'] == 'paddingTop') {
                        this.menuPaddingTop = this.menuArrayCss[i]['value'] + 'px';
                    }
                    if (this.menuArrayCss[i]['key'] == 'borderBottom') {
                        // this.menuBorder = this.menuArrayCss[i]['value'] + 'px solid';
                        this.subMenuHeaderBorderColor = this.menuArrayCss[i]['value'];
                        this.sideMenuBorderColor = this.menuArrayCss[i]['value'];
                        const a = this.sideMenuBorderColor.split('#');
                        this.subMenuHeaderBorderColor = '#' + a[1];

                        const b = a[0].split('px');
                        this.headerBorderSize = b[0];

                        if (this.subMenuHeaderBorderColor === '#undefined') {
                            this.subMenuHeaderBorderColor = '#ffffff';
                        }

                        this.subMenuHeaderBorderColorMob = this.headerBorderSize + 'px solid ' + this.subMenuHeaderBorderColor;

                    }
                    if (this.menuArrayCss[i]['key'] == 'lineDividerColor') {
                        this.borderColor = this.menuArrayCss[i]['value'];
                    }
                    if (this.menuArrayCss[i]['key'] == 'lineDividerHeight') {
                        this.menuBorder = this.menuArrayCss[i]['value'] + 'px solid ';
                    }
                    if (this.menuArrayCss[i]['key'] == 'backgroundColor') {
                        // this.submenuColorData = this.menuArrayCss[i]['value'];
                    }
                    if (this.menuArrayCss[i]['key'] == 'fontName') {
                        this.menuFontFamily = this.menuArrayCss[i]['value'];
                        if (this.menuFontFamily) {
                            if (this.menuFontFamily.length == 0) {
                                setTimeout(() => {
                                    $('#menuSelectId').val('ABeeZee').trigger('change');
                                }, 1000);
                            } else {
                                setTimeout(() => {
                                    $('#menuSelectId').val(this.menuFontFamily).trigger('change');
                                }, 1000);
                            }
                        } else {
                            setTimeout(() => {
                                $('#menuSelectId').val('ABeeZee').trigger('change');
                            }, 1000);
                        }

                    }
                    if (this.menuArrayCss[i]['key'] == 'sidemenubackcolor') {
                        this.submenuBackgroundColorData = this.menuArrayCss[i]['value'];
                    }
                    if (this.menuArrayCss[i]['key'] == 'selectedColor') {
                        this.selectedColor = this.menuArrayCss[i]['value'];
                        //2018.02.20 gjc
                        // this.menuarr_selected_rgbaText = this.onChangeColorHex8(this.selectedColor);
                    }
                    if(this.menuArrayCss[i]['key'] == 'sideMenuHeaderBgColor') {
                      this.sideMenuHeaderBgColor = this.menuArrayCss[i]['value'];
                    //   this.smheaderarr_bg_rgbaText = this.onChangeColorHex8(this.sideMenuHeaderBgColor);
                    }
                    
                    if (this.menuArrayCss[i]['key'] == 'selectedFontColor') {
                        this.selectedFontColor = this.menuArrayCss[i]['value'];
                    }
                    if (this.menuArrayCss[i]['key'] == 'nonSelectedColor') {
                        this.nonSelectedColor = this.menuArrayCss[i]['value'];
                    }
                    if (this.menuArrayCss[i]['key'] == 'nonSelectedFontColor') {
                        this.nonSelectedFontColor = this.menuArrayCss[i]['value'];
                        //2018.02.20 gjc
                        // this.nonselected_font_rgbaText = this.onChangeColorHex8(this.nonSelectedFontColor);
                    }
                    // group b Changes
                    if (this.menuArrayCss[i]['key'] == 'sideMenuImg') {

                        this.headerSideImg = this.menuArrayCss[i]['value'];
                        this.oldMainImg = this.headerSideImg.split('headerImg/');
                        this.menuBorder = this.menuBorder + "" + this.borderColor;
                        setTimeout(() => {

                            $(function () {
                                const drEventTwo = $('#app_iconSide').dropify({
                                    defaultFile: self.headerSideImg,
                                    messages: {
                                        'default': 'Drag and drop a file here or click',
                                        'replace': 'Drag and drop or click to replace',
                                        'remove': 'Remove',
                                        'error': ''
                                    },
                                    error: {
                                        'fileSize': 'The file size is too big ({{ value }} max).',
                                        'minWidth': 'The image width is too small ({{ value }}px min).',
                                        'maxWidth': 'The image width is too big ({{ value }}px max).',
                                        'minHeight': 'The image height is too small ({{ value }}px min).',
                                        'maxHeight': 'The image height is too big ({{ value }}px max).',
                                        'imageFormat': 'The image format is not allowed ({{ value }} only).'
                                    },
                                    tpl: {
                                        wrap: '<div class="dropify-wrapper"></div>',
                                        loader: '<div class="dropify-loader"></div>',
                                        message: '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
                                        preview: '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
                                        filename: '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
                                        clearButton: '<button type="button" class="dropify-clear">{{ remove }}</button>',
                                        errorLine: '<p class="dropify-error">{{ error }}</p>',
                                        errorsContainer: '<div class="dropify-errors-container">Please upload image between 100 to 500 dimensions</div>'
                                    }
                                });

                                drEventTwo.on('dropify.error.fileSize', function (event, element) {
                                    $('.menu-header-icon-dropify .dropify-errors-container').html('The file size is too big ( 3M max).');
                                });

                                drEventTwo.on('dropify.error.maxWidth', function (event, element) {
                                    self.dropifyAppIconHeaderSize = false;
                                });

                                drEventTwo.on('dropify.error.minWidth', function (event, element) {
                                    self.dropifyAppIconHeaderSize = false;
                                });

                                drEventTwo.on('dropify.error.minHeight', function (event, element) {
                                    self.dropifyAppIconHeaderSize = false;
                                });

                                drEventTwo.on('dropify.error.maxHeight', function (event, element) {
                                    self.dropifyAppIconHeaderSize = false;
                                });

                                drEventTwo.on("#app_iconSide dropify.beforeClear", function (event, element) {
                                    self.onRemoveDropify(event, element, "SideMenu Icon")
                                        .then(res => {
                                            if (res === true) {
                                                self.removeSideMenuIcon(event, drEventTwo);
                                            }
                                        });
                                    return false;
                                });

                            })

                        }, 1000)
                    }
                }

                // for (var i = 0; i < this.allMenuData[0]['subMenu'].length; ++i) {
                //     this.menuCssJsonData.push(this.allMenuData[0]['subMenu'][i]);
                // }
                // for (var j = 0; j < this.allMenuData[1]['mainMenu'].length; ++j) {
                //     this.menuCssJsonData.push(this.allMenuData[1]['mainMenu'][j]);
                // }
                resolve(true);
            })
        })

    }

    private getCurrentActiveTapMenuGroup (parentObject) {
        console.log(parentObject);
        if (parentObject == null) {
            this.currentMenuJson = [];
            for(let i = 0; i < this.menuJson.length; i++) {
                if (i < 10) {
                    this.currentMenuJson[i] = this.menuJson[i];
                }
            }
            //root menu
        } else {
            if (typeof(parentObject.children) == 'undefined' ||  parentObject.children == null) {
                // no child data
                return;
            }
            this.currentMenuJson = [];
            for(let i = 0; i < parentObject.children.length; i++) {
                if (i < 10) {
                    this.currentMenuJson[i] = parentObject.children[i];
                }
            }
        } 

    }

    CalculateDivWidth(dimensions) {
        let width = 100 / dimensions ;
        return width;
    }
    
    // GenerateFastJson() {

    //     const appData = this.commonService.get_current_app_data();
    //     this.commonService.postData({
    
    //       'id': JSON.stringify(appData.id),
    //       'appName': JSON.stringify(appData.app_name)
    
    //     }, 'FastGenerateJsonData').subscribe(res => {
    
    //       this.rdata = JSON.parse(res);
    //       this.rstatus = this.rdata['status'];
    //       if (this.rstatus === 1 || this.rstatus === '1') {
    //         this.json_file_url = this.rdata['data'];
    //         // this.imagezip_url = this.rdata['imageZip'];
    //         console.log(this.json_file_url);
    //         const success_message = this.rdata['message'];
   
    //         // this.currentSelectedbtnRef.nativeElement(currentSelectBtnRef).disabled = false;
    //         window.open(this.json_file_url, 'windowname');
    //         // window.open(this.imagezip_url, 'windowname');
    
    //         $(function () {
    //           $.notify({
    //             title: '',
    //             message: success_message
    //           }, {
    //               type: 'success'
    //             });
    //         });
    //       } else {
           
    //         // this.currentSelectedbtnRef.nativeElement(currentSelectBtnRef).disabled = false;
    //         const error_message = this.rdata['message'];
    //         $(function () {
    //           $.notify({
    //             title: '',
    //             message: error_message
    //           }, {
    //               type: 'danger'
    //             });
    //         });
    //       }
    
    //     }, err => {
          
    //     })
    //   }

    AfterMenuIconSelectPickerInit() {
        const self = this;
        setTimeout(() => {

            function formatFA1(icon) {
                if (!icon.id) {
                    return icon.text;
                }
                const $icon = $('<span></span>').append($('').css({
                    'color': icon.text
                })).append(icon.text);
                return $icon;
            };
            $('#gyr_ind0').select2({
                templateResult: formatFA1
            });

            $('#gyr_ind0').change(function (e) {
                self.selectMenuChange('0', $(this).val());
                self.menuOneVal = $(this).val();
            })

            function formatFA2(icon) {
                if (!icon.id) {
                    return icon.text;
                }
                const $icon = $('<span></span>').append($('').css({
                    'color': icon.text
                })).append(icon.text);
                return $icon;
            };
            $('#gyr_ind1').select2({
                templateResult: formatFA2
            });

            $('#gyr_ind1').change(function (e) {
                self.selectMenuChange('1', $(this).val());
                self.menuTwoVal = $(this).val();
            })

            function formatFA3(icon) {
                if (!icon.id) {
                    return icon.text;
                }
                const $icon = $('<span></span>').append($('').css({
                    'color': icon.text
                })).append(icon.text);
                return $icon;
            };
            $('#gyr_ind2').select2({
                templateResult: formatFA3
            });

            $('#gyr_ind2').change(function (e) {
                self.selectMenuChange('2', $(this).val());
                self.menuThreeVal = $(this).val();
            })

            function formatFA4(icon) {
                if (!icon.id) {
                    return icon.text;
                }
                const $icon = $('<span></span>').append($('').css({
                    'color': icon.text
                })).append(icon.text);
                return $icon;
            };
            $('#gyr_ind3').select2({
                templateResult: formatFA4
            });

            $('#gyr_ind3').change(function (e) {
                self.selectMenuChange('3', $(this).val());
                self.menuFourVal = $(this).val();
            })

            function formatFA5(icon) {
                if (!icon.id) {
                    return icon.text;
                }
                const $icon = $('<span></span>').append($('').css({
                    'color': icon.text
                })).append(icon.text);
                return $icon;
            };
            $('#gyr_ind4').select2({
                templateResult: formatFA5
            });

            $('#gyr_ind4').change(function (e) {
                self.selectMenuChange('4', $(this).val());
                self.menuFiveVal = $(this).val();
            })

        }, 2000)
    }


    FastGenerateJson() {
        const appData = this.commonService.get_current_app_data();
        NProgress.start();
        $(function () {
            $.notify({
                title: '',
                message: "Refresh Preview Data",
            }, {
                type: 'success'
            });
        });
        this.commonService.postData({
    
            'id': JSON.stringify(appData.id),
            'appName': JSON.stringify(appData.app_name)
    
        }, 'fastGenerateJson').subscribe(res => {
            NProgress.done();
            this.rdata = JSON.parse(res);
            this.rstatus = this.rdata['status'];

            if (this.rstatus === 1 || this.rstatus === '1') {
                //gjc 0515
                this.msgService.setSpinnerActive(false);
                $(function () {
                    $.notify({
                        title: '',
                        message: "Successfully general design saved"
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
            let currentAppData = this.commonService.get_current_app_data();
            let iFrameUrl = `${environment.baseUrl}/projects/${this.currentAppData['app_code']}/index.html`;
            //let iFrameUrl = 'http://192.168.100.112:1204/projects/'+this.currentAppData['app_code']+'/index.html';
            $('#native_preview').attr('src',this.iFrameUrl);
        })
        this.appstylestatusArray[0] = 0;
        this.appstylestatusArray[1] = 0;
        console.log(this.appstylestatusArray);
    }

    SetFormChangeState(event) {
          console.log(event);
          if (event == 404) {
            this.appstylestatusArray = [];
            return;
          }
          if (event == 200) {
            return this.appstylestatusArray;
          }
          this.appstylestatusArray[event] = 1;
    }
}
