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
//2018.02.24 gjc
import { MenuConfigurationComponent} from '../menu-configuration.component';
//

declare var $: any;
declare var jQuery: any;

declare var NProgress: any;
declare var swal: any;

@Component({
    selector: 'app-menu-type-photo',
    templateUrl: './menu-type-photo.component.html',
    styleUrls: []
})

export class MenuTypePhotoComponent implements OnInit, OnDestroy {
    public menuTypePhotoform: FormGroup;

    @Input('menuTypeSubPhotoCssJsonData') menuSubCssJsonData: any;

    @Output('childPhotoFormData') photoFormOutgoingData = new EventEmitter<any>();

    @Input('menuTypePhotoSlugId') menuTypeMenuSlugId: any;

    public typeMenuform = {
        // user_id:'',
        google_key: '',
        album_id: '',
        album_url: '',
        complete_album_url: '',
        selected_complete_album_url: '',
        css_string_json: '',
    };
    private dirtyFormBool: boolean;
    //2018.02.27 gjc
    public currentSavedAlbumUrl: any;
    //

    fileList: FileList;
    rdata: any;
    rstatus: any;
    subMenuCssJsonData: any;
    borderCl: any;
    fontcl: any;
    albfontcl: any;
    cpfontcl: any;
    getMenuTypeSubCssData: any;

    userId: any;
    data: any;
    picData: any;
    dataPhotolist = [];
    dataPhotoItem = [];
    timer: any;
    complete_album_url: any;//real album url (to the app)
    allself = this;
    mS: MessageService;
    is_loading: boolean;
    selectButtonStatus: boolean;
    caption_check: boolean;
    //gjc 0420
    photoId: any;

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

    // declare subscription
    msgMenuJsonSubscrption: Subscription;
    //gjc 0420
    photoIdSubscrption: Subscription;
    cssJsonSubRes: any;
    subMenuFontTypeData:any;

    constructor(private cpService: ColorPickerService, private commonService: CommonService, private fb: FormBuilder, private http: Http, private sharedService: SharedService, private msgMenuCssJson: MessageService) {
        this.subMenuTypeCollapsed = '';
    }

    ngOnInit()
    {
        this.commonService.getData('getFontData').subscribe(res => {
            this.subMenuFontTypeData = JSON.parse(res);
        })

        let cssObj = {
            'cssComponent': 'picasa_album_menu_css'
        };
        if(this.menuSubCssJsonData['caption_check'] == "true") {
            this.caption_check = true;
         } else {
             $('#caption_check').prop('checked', false);
             this.caption_check = false;
         }
        this.msgMenuJsonSubscrption = this.msgMenuCssJson.getCssJsonData().subscribe(res => {
            this.cssJsonSubRes = res.data;
            this.todoAfterCssJson();
        });

        let subFormData: FormData = new FormData();

        this.userId = this.typeMenuform.album_url;// init Email
        this.is_loading = true;
        let email_check_string = "";
        if(this.userId){
          email_check_string = this.userId.substring(this.userId.length-4,this.userId.length);
        }
        //gjc 0420
        this.photoIdSubscrption = this.msgMenuCssJson.getPhotoInfo().subscribe(res => {
            this.photoId = res.data;
            this.currentSavedAlbumUrl = res.data;
        });

        this.commonService.requestAlbum(this.userId)
        .then(res=>
        {
            this.data=res['feed']['entry']; //init album list data
            // this.commonService.loadingHide();
            this.is_loading = false;
            this.selectButtonStatus = true;

            if(this.currentSavedAlbumUrl == null || this.currentSavedAlbumUrl == undefined){
                let selected_album = this.data.filter(album => {
                    return album.id.$t == this.typeMenuform.selected_complete_album_url.replace('/data/feed/api', '/data/entry/api');
                });
                this.currentSavedAlbumUrl = this.data.filter(album => album.id.$t == this.typeMenuform.selected_complete_album_url.replace('/data/feed/api', '/data/entry/api'))[0].title.$t;
            }

            if(email_check_string == '.com') {
                this.showAlbumList();
            }
        });

        subFormData.append('album_url',this.typeMenuform.album_url);
        subFormData.append('complete_album_url', this.typeMenuform.complete_album_url || this.typeMenuform.google_key);
        subFormData.append('selected_complete_album_url', this.typeMenuform.selected_complete_album_url || this.typeMenuform.album_id);
        //2018.02.24 gjc
        MenuConfigurationComponent.prototype.check_selected_albumUrl = this.typeMenuform.album_id;
        //
        if(this.caption_check){
           subFormData.append('caption_check',"true");
           } else {
               subFormData.append('caption_check',"false");
         }
        subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));
        this.photoFormOutgoingData.emit(subFormData);
        // $('#photo-list').css('display','none');
        $('#photo-item').css('display','none');
        $('.photoList-header').css('display','none');
        $('.photoItem-header').css('display','none');

        $('#album-list').attr('style','display: none;');
    }

    ngOnDestroy(): void {
        this.msgMenuJsonSubscrption.unsubscribe();
        this.photoIdSubscrption.unsubscribe();
    }

    todoAfterCssJson(): void {
        if (this.cssJsonSubRes) {
            this.typeMenuform = this.cssJsonSubRes;
        }
        else {
            // console.log('nothing');
        }
    }
    // 1-27
    get getMenuSubCssJsonData(): any {
        return this.menuSubCssJsonData
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
                        if(this.menuSubCssJsonData['caption_check'] == "true") {
                            $('#caption_check').prop('checked', true);
                            this.caption_check = true;
                           } else {
                             $('#caption_check').prop('checked', false);
                             this.caption_check = false;
                        }
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

    onChangeBordercolor(color: string): any {
        this.borderCl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
    }

    onChangefontcolor(color: string): any {
        this.fontcl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
    }

    onChangeCaptionfontcolor(color: string): any {
        this.cpfontcl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
    }

    onChangeAlbumfontcolor(color: string): any {
        this.albfontcl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
    }


    public sendMenuTypePhotoFormData(data: any, i: any, colorPikerKey: any, childForm: NgForm)
    {
         //add***
          $('.select-title').css('z-index','9');
         $('#album-list').css('display','none');
         $('#photo-list').attr('style','display:none;');
         $('#photo-item').attr('style','display:none;');
         $('.photoList-header').css('display','none;');
         $('.photoItem-header').css('display','none;');

         //gjc 2018.03.01
         if(this.userId != this.typeMenuform.album_url || this.userId == null){
            this.userId = this.typeMenuform.album_url;// init Email
            this.currentSavedAlbumUrl = "Select Album";
        }
        this.is_loading = true;
        this.selectButtonStatus = false;
        // this.mS.setSpinnerActive(this.is_loading);
        const email_check_string = this.userId.substring(this.userId.length-4,this.userId.length);
        this.commonService.requestAlbum(this.userId)
        .then(res=>
        {

            this.data=res['feed']['entry']; //init album list data
            // this.commonService.loadingHide();
            this.is_loading = false;
            // this.mS.setSpinnerActive(this.is_loading);
            this.selectButtonStatus = true;

            if(email_check_string == '.com') {
                this.showAlbumList();
            }
            
        });
        this.viewAlbumList();
        // console.log(this.subMenuCssJsonData);
        if (childForm.dirty) {
            this.dirtyFormBool = childForm.dirty;
            this.msgMenuCssJson.setdirtyChildActive(this.dirtyFormBool);
            //  console.log(childForm, this.dirtyFormBool);
        }
        if (colorPikerKey !== null && colorPikerKey == 'borderColor') {
            this.typeMenuform.css_string_json[i]['value'] = this.borderCl;
        }
        if (colorPikerKey !== null && colorPikerKey == 'fontColor') {
            this.typeMenuform.css_string_json[i]['value'] = this.fontcl;
        }
        if (colorPikerKey !== null && colorPikerKey == 'captionfontColor') {
            this.typeMenuform.css_string_json[i]['value'] = this.cpfontcl;
        }
        if (colorPikerKey !== null && colorPikerKey == 'albumfontColor') {
            this.typeMenuform.css_string_json[i]['value'] = this.albfontcl;
        }
        // console.log(this.typeMenuform);

        let subFormData: FormData = new FormData();

        // subFormData.append('google_key', this.typeMenuform.google_key);
        // subFormData.append('album_id', this.typeMenuform.album_id);
        // subFormData.append('user_id', this.typeMenuform.user_id);
        subFormData.append('album_url', this.typeMenuform.album_url);
        subFormData.append('complete_album_url', this.typeMenuform.google_key);
        subFormData.append('selected_complete_album_url', this.typeMenuform.album_id);
        if(this.caption_check){
           subFormData.append('caption_check',"true");
           } else {
               subFormData.append('caption_check',"false");
         }
        subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));

        console.log('===========================================================subFormData in sendMenuType');

        console.log(subFormData);
        // console.log(subFormData);
        // this.photoFormOutgoingData.emit(subFormData);
        console.log('############################################################');
        console.log(this.photoFormOutgoingData);
    }

    itemSelected(item)
    {
        this.backToPhotoList();
        this.dataPhotolist = [];
        this.is_loading = true;
        //2018.02.28 gjc
        localStorage.setItem('currentAlbumURL', item.gphoto$name.$t);
        //
        this.msgMenuCssJson.setPhotoInfo(item.gphoto$name.$t);
        console.log('item=====>',item);
        $('.select-title').css('z-index','-1');
        // $('#album-list').css('display','none');
        $('#photo-list').css('display','none');
        // $('.albumList-header').css('display','none');
        $('.photoList-header').css('display','block');
        // this.commonService.loadingShow();
        console.log('222email=>',this.userId);
        console.log('album_id',item['link'][0]['href']);
        this.complete_album_url = '';

        this.complete_album_url = item['link'][0]['href'];
        // this.complete_album_url = 'http://s;ldkjfsladjf/dslkjflsdkjfs/sdfsldkjflsjdf';
        // $('#google_key').val(this.complete_album_url);
        this.typeMenuform.google_key = '';

        this.typeMenuform.google_key = this.complete_album_url;
        console.log('complete_album_url',this.complete_album_url);

        let subFormData: FormData = new FormData();
        subFormData.append('album_url', this.typeMenuform.album_url);
        subFormData.append('complete_album_url', this.typeMenuform.google_key);
        subFormData.append('selected_complete_album_url', this.typeMenuform.album_id);
        if(this.caption_check){
           subFormData.append('caption_check',"true");
           } else {
               subFormData.append('caption_check',"false");
         }
        subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));
        console.log('===========================================================subFormData in sendMenuType');

        console.log(subFormData);
        // console.log(subFormData);
        // this.photoFormOutgoingData.emit(subFormData);
        console.log('############################################################');
        console.log(this.photoFormOutgoingData);
        this.commonService.requestPhoto(item['gphoto$id']['$t'],this.userId).then(res=>
        //this.commonProvider.requestPhoto(item['gphoto$id']['$t'],this.album_url).then(res=>
        {
            // this.is_loading = false;
            this.picData=res['feed']['entry'];
            console.log(this.picData);
            console.log('this is kkk.');
            var i = 1;
            for (var x of this.picData)
            {
                var temp = [];
                // console.log(x['media$group']['media$content'][0]['url']);
                temp['image'] = x['media$group']['media$content'][0]['url'];
                console.log(x['media$group']['media$content'][0]['url']);
                temp['description'] = x['summary']['$t'];
                this.dataPhotolist.push(temp);
                // console.log(temp);
                // this.is_loading = false;
            }
            //1-27
            setTimeout(() => {
                this.is_loading = false;
                $('#photo-list').css('display','block');
              }, 3000)
        });
        this.selectAlbum();
        // $('#album-list').attr('style','display:none;');
    }

    picselect(index) {
        $('#photo-list').attr('style','display:none;');
        $('#photo-item').attr('style','display:block;');
        $('.photoList-header').css('display','none');
        $('.photoItem-header').css('display','block');
        this.dataPhotoItem = this.dataPhotolist[index];
    }

    backToAlbumList() {
        $('#photo-list').attr('style','display:none;');
        $('.photoList-header').css('display','none');
        this.dataPhotolist = [];
    }

    backToPhotoList() {
        $('#photo-item').attr('style','display:none;');
        $('.photoItem-header').css('display','none');
        $('#photo-list').attr('style','display:block;');
        $('.photoList-header').css('display','block');
    }

    viewAlbumList() {
        this.userId = '';
        this.userId = this.typeMenuform.album_url;
        this.typeMenuform.google_key = '';
        // init data
        this.data = [];
        if(this.userId !== null) {
            this.commonService.requestAlbum(this.userId)
            .then(res=>
            {
                this.data=res['feed']['entry'];
                // this.commonService.loadingHide();
            });
            console.log('email=>',this.userId);
            console.log(this.data);

        }
        else {
            this.data = [];
            console.log('please enter email');
            swal({
                title: 'You Should Enter Email!',
                text: 'Please Enter Your Email.',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                closeOnConfirm: true,
                closeOnCancel: true
              })
        }
        // this.commonService.requestAlbum(this.userId)
        // .then(res=>
        // {
        //     this.data=res['feed']['entry'];
        //     // this.commonService.loadingHide();
        // });
        // console.log('email=>',this.userId);
        // console.log(this.data);

        // $('#album-list').empty().append('<ul class="list-group">');
        // for(let item of this.data) {
        //     $('#album-list').append('<li class="list-group-item"><a> <span style="cursor:pointer;" onclick=\'itemSelected(item)\'>' + item.title["$t"] + '</span> </a></li>');
        // }
        // $('#album-list').append('</ul>');
    }

     // add***
     selectAlbum() {
        this.typeMenuform.album_id = this.typeMenuform.google_key;

        let subFormData: FormData = new FormData();

        // subFormData.append('google_key', this.typeMenuform.google_key);
        // subFormData.append('album_id', this.typeMenuform.album_id);
        // subFormData.append('user_id', this.typeMenuform.user_id);
        subFormData.append('album_url', this.typeMenuform.album_url);
        subFormData.append('complete_album_url', this.typeMenuform.google_key);
        subFormData.append('selected_complete_album_url', this.typeMenuform.album_id);
        //2018.02.24 gjc
        MenuConfigurationComponent.prototype.check_selected_albumUrl = this.typeMenuform.album_id;
        //
        if(this.caption_check){
           subFormData.append('caption_check',"true");
           } else {
               subFormData.append('caption_check',"false");
         }
        subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));

        console.log('===========================================================subFormData in sendMenuType');

        console.log(subFormData);
        // console.log(subFormData);
        this.photoFormOutgoingData.emit(subFormData);
    }

    showAlbumList(){
        // $('#album-list').attr('style','display: block; position: relative;');
        console.log(this.data);
        console.log(this.typeMenuform.complete_album_url);
        $('#album-list').attr('style','display: flex; margin-top: 20px;');
    }
    expandList(){
        $('.list-group').trigger('change');
    }
    //1-27
   setImageStyles() {
        let imageStyles = {
            'height':'auto',
            'margin':'auto',
            'padding-top': (this.typeMenuform.css_string_json[0]['value'])?this.typeMenuform.css_string_json[0]['value']+"px":'0',
            'padding-right':this.typeMenuform.css_string_json[1]['value']?this.typeMenuform.css_string_json[1]['value']+"px":'0',
            'padding-bottom':this.typeMenuform.css_string_json[2]['value']?this.typeMenuform.css_string_json[2]['value']+"px":'0',
            'padding-left':  this.typeMenuform.css_string_json[3]['value']?this.typeMenuform.css_string_json[3]['value']+"px":'0',
            'border-bottom-width':this.typeMenuform.css_string_json[4]['value']?this.typeMenuform.css_string_json[4]['value']+"px":'0',
            'border-bottom-color':this.typeMenuform.css_string_json[5]['value']?this.typeMenuform.css_string_json[5]['value']:'0',
            'border-bottom-style':this.typeMenuform.css_string_json[6]['value']?this.typeMenuform.css_string_json[6]['value']:'0'
        };
        return imageStyles;

    }
    setDescriptionStyles() {
        let descriptionStyles = {
            'font-family': this.typeMenuform.css_string_json[7]['value'] ?this.typeMenuform.css_string_json[7]['value'].toString():'serif',
            'font-size': this.typeMenuform.css_string_json[8]['value'] ? this.typeMenuform.css_string_json[8]['value']+"px":'12px',
            'color': this.typeMenuform.css_string_json[9]['value']? this.typeMenuform.css_string_json[9]['value'].toString() :'#000000'
        }
        return descriptionStyles;
    }
    public sendMenuTypePhotoFormDataStyle(data: any, i: any, colorPikerKey: any, childForm: NgForm)
    {
     console.log('INPUT============>', this.typeMenuform.css_string_json);

     for (var n=0; n<10; n++){
         console.log(this.typeMenuform.css_string_json[n]['key'],'=========>',this.typeMenuform.css_string_json[n]['value']);
     }
         if (childForm.dirty) {
            this.dirtyFormBool = childForm.dirty;
            this.msgMenuCssJson.setdirtyChildActive(this.dirtyFormBool);
        }
        if (colorPikerKey !== null && colorPikerKey == 'borderColor') {
            this.typeMenuform.css_string_json[i]['value'] = this.borderCl;
        }
        if (colorPikerKey !== null && colorPikerKey == 'fontColor') {
            this.typeMenuform.css_string_json[i]['value'] = this.fontcl;
        }
        if (colorPikerKey !== null && colorPikerKey == 'captionfontColor') {
            this.typeMenuform.css_string_json[i]['value'] = this.cpfontcl;
        }
        if (colorPikerKey !== null && colorPikerKey == 'albumfontColor') {
            this.typeMenuform.css_string_json[i]['value'] = this.albfontcl;
        }

        let subFormData: FormData = new FormData();

        subFormData.append('album_url', this.typeMenuform.album_url);
        subFormData.append('complete_album_url', this.typeMenuform.google_key);
        subFormData.append('selected_complete_album_url', this.typeMenuform.album_id);
        if(this.caption_check){
           subFormData.append('caption_check',"true");
           } else {
               subFormData.append('caption_check',"false");
         }
        subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));
        this.photoFormOutgoingData.emit(subFormData);
        this.setDescriptionStyles();
        this.setImageStyles();
    }
}
