<?php

namespace App\Http\Controllers;

use Aws\S3\S3Client;
use League\Flysystem\AwsS3v3\AwsS3Adapter;
use League\Flysystem\Filesystem;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use JWTAuthException;
use Config;
use Helpers;
use Mail;
use App\AppBasic;
use App\AppMenu;
use App\Services\App\Contracts\AppRepository;
use App\Services\User\Contracts\UserRepository;
use App\Services\AppMenu\Contracts\AppMenuRepository;
use App\Services\AppAssignUser\Contracts\AppAssignUserRepository;
use App\Services\EmailTemplate\Contracts\EmailTemplateRepository;
use File;
use DB;
use App\AppMenuType;
use Zipper;
use \stdClass;
use App\AppAssignUser;

class JsonController extends Controller
{
    public function __construct(AppRepository $AppRepository,AppMenuRepository $AppMenuRepository,EmailTemplateRepository $EmailTemplateRepository, AppAssignUserRepository $AppAssignUserRepository, UserRepository $UserRepository)
    {
        $this->middleware('jwt.auth');
        $this->objAppBasic = new AppBasic();
        $this->objAppMenu = new AppMenu();
        $this->objAppMenuType = new AppMenuType();
        $this->AppRepository = $AppRepository;
        $this->UserRepository = $UserRepository;
        $this->AppMenuRepository = $AppMenuRepository;
        $this->EmailTemplateRepository =$EmailTemplateRepository;
        $this->AppAssignUserRepository = $AppAssignUserRepository;
        $this->bcOriginalImageUploadPath = Config::get('constant.bcOriginalImageUploadPath');
        $this->sponsorsplashOriginalImageUploadPath = Config::get('constant.sponsorsplashOriginalImageUploadPath');
        $this->appIconOriginalImageUploadPath = Config::get('constant.appIconOriginalImageUploadPath');
        $this->addscreenshotOriginalImageUploadPath = Config::get('constant.addscreenshotOriginalImageUploadPath');
        $this->menuIconOriginalImageUploadPath = Config::get('constant.menuIconOriginalImageUploadPath');
        $this->menuIconThumbImageUploadPath = Config::get('constant.menuIconThumbImageUploadPath');
        $this->menuIconThumbImageWidth = Config::get('constant.menuIconThumbImageWidth');
        $this->menuIconThumbImageHeight = Config::get('constant.menuIconThumbImageHeight');
        $this->objAppAssignUser = new AppAssignUser();
    }

    public function FastGenerateJsonData(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if ($user)
        {
            // Generate final json for app
            $mainJSON = [];
            $appBasicArr = [];
            $sidemenu = [];
            $tabmenu = [];
            $appData = $this->AppRepository->getSingleAppData($body['id']);

            $appBasicInfo = $appData->getAllBasicDetailData;

            $firebase_id = ""; 
            $analytics_id = "";
            $crashlytics_id = "";

            if(isset($body['firebase_id'])){
                $firebase_id = $body['firebase_id'];
            }

            if(isset($body['analytics_id'])){
                $analytics_id = $body['analytics_id'];
            }

            if(isset($body['crashlytics_id'])){
                $crashlytics_id = $body['crashlytics_id'];
            }


            //First add static details
            $appInfo = array(
                "appID" => $body['id'],
                "appName" => $appData->app_name,
                "appBundleId" => "",
                "appJSONVersion" => "",
                "appDescription" => "",
                "homePageIndex" => 0,
                "googleAnalyticId" => ""  ,
                "firebase_id" => $firebase_id,
                "analytics_id"  => $analytics_id,
                "crashlytics_id" => $crashlytics_id 
            );


            //Merge basic details of App
            if (isset($appBasicInfo) && !empty($appBasicInfo))
            {
                foreach ($appBasicInfo as $key => $data)
                {
                    $appBasicDetail[$data->app_section_slug] = json_decode($data->section_json_data);
                }
            }

            unset($appBasicDetail['home_screen']);
            unset($appBasicDetail['menu_configuration']);
            $mainJSON['menu_location_type'] = $appData['menu_location_type'];
            $mainJSON['s3_font_family_url'] = Config::get('constant.s3bucketFontFamilyURL');
            //Now merge app info and basic details
            $mainJSON['appInfo'] = array_merge($appInfo, $appBasicDetail);

            if(isset($mainJSON['appInfo']['google_analytic']) && isset($mainJSON['appInfo']['google_analytic']->google_key) && !empty($mainJSON['appInfo']['google_analytic']->google_key))
            {
                $mainJSON['appInfo']['googleAnalyticId'] = $mainJSON['appInfo']['google_analytic']->google_key;
            }

            // unset($mainJSON['appInfo']['splash_screen'], $mainJSON['appInfo']['sponsor_splash'], $mainJSON['appInfo']['app_icon'], $mainJSON['appInfo']['basic_information'], $mainJSON['appInfo']['google_analytic'], $mainJSON['appInfo']['add_screenshot'], $mainJSON['appInfo']['notification_popup'], $mainJSON['appInfo']['auto_upgrade_popup'], $mainJSON['appInfo']['rate_popup']);

            // if(isset($mainJSON['appInfo']['app_icon']) &&
            //     isset($mainJSON['appInfo']['app_icon']->app_icon))
            // {
            //     $mainJSON['appInfo']['app_icon'] = $mainJSON['appInfo']['app_icon']->app_icon;    
            // }

            //get app menu data
            $menuData = [];
            $uniqueArray = [];
            $appMenuData = $this->AppMenuRepository->getAllAppMenuData($body['id']);

            if (isset($appMenuData) && count($appMenuData) > 0)
            {
                $parent = 0;
                $nLevelMenu = $this->nLevelMenuFunction($parent, $appMenuData->toArray());

                foreach($appMenuData->toArray() as  $tutorialKey => $checkTutorialOnStart)
                {
                    $checkTutorialOnStart = (array)$checkTutorialOnStart;
                    if($checkTutorialOnStart && $checkTutorialOnStart['menu_type'] == 10 && !empty($checkTutorialOnStart['menu_type_json_data']))
                    {
                        $menuTypeDecodeJsonData = json_decode($checkTutorialOnStart['menu_type_json_data']);
                        $tutorial_first_view = $menuTypeDecodeJsonData->css_string_json;
                        //gjc 0509
                        if($tutorial_first_view[1]->key == "firstView"){
                            $mainJSON['appInfo']['tutorial']['flag'] = 0;
                            $mainJSON['appInfo']['tutorial']['index'] = 0;
                            $mainJSON['appInfo']['tutorial']['first_view'] = $tutorial_first_view[1]->value;
                        }

                        if($menuTypeDecodeJsonData && count($menuTypeDecodeJsonData) > 0 && isset($menuTypeDecodeJsonData->show_tutorial) && !empty($menuTypeDecodeJsonData->show_tutorial) && $menuTypeDecodeJsonData->show_tutorial == 'true')
                        {
                            $mainJSON['appInfo']['tutorial']['flag'] = 1;
                            $mainJSON['appInfo']['tutorial']['index'] = $tutorialKey;
                        }
                    }
                }

                if (!array_key_exists("tutorial", $mainJSON['appInfo']) )
                {
                    $mainJSON['appInfo']['tutorial']['flag'] = 0;
                    $mainJSON['appInfo']['tutorial']['index'] = 0;
                    $mainJSON['appInfo']['tutorial']['first_view'] = false;
                }

            }

            /* ********************************************************************************************* */

            //          All Menu Json here

            $mainJSON['menu'] = array();
            $mainJSON['menu']['sidemenu'] = array();
            if (isset($nLevelMenu) && count($nLevelMenu) > 0)
            {                

                $mainJSON['menu']['sidemenu'] = array_merge($nLevelMenu);
                $mainJSON['menu']['tabmenu'] = array_merge($nLevelMenu);

            }

            /* ********************************************************************************************* */

            $mainJSON['url'] = array(
                'imageUrl' => url('/json/'.$appData->app_code."/".$appData->version."/")
            );
            
            $mainJSON['frameworkConfig'] = array(
                'language-json-name' => "language.json"
            );

            $appData = $this->AppRepository->getSingleAppData($body['id']);
            $appBasicInfo = $appData->getAllBasicDetailData;
            $allAppBasicData = $appBasicInfo->toArray();

            $popUpData = [];
            $downloadImageData = [];

            for ($v = 0; $v < sizeof($allAppBasicData); $v++)
            {
                if ($allAppBasicData[$v]['app_section_slug'] == "notification_popup")
                {
                    $dataNotification = json_decode($allAppBasicData[$v]['section_json_data']);
                    if(isset($dataNotification)) {
                        $popUpData['notification'] = json_decode($allAppBasicData[$v]['section_json_data']);
                    } else {
                        // $popUpNotificationData = '{"title":"Title",
                        //     "message":"You have been automatically subscribed to receive push notifications. Remember, you can always update your push notification settings by going to Settings",
                        //     "button1":"Continue",
                        //     "button2":"Manage Notifications",
                        //     "isShow":"false"}';
                        // $popUpData['notification'] = json_decode($popUpNotificationData);
                    }

                }
                if ($allAppBasicData[$v]['app_section_slug'] == "auto_upgrade_popup")
                {
                    $data = json_decode($allAppBasicData[$v]['section_json_data']);
                    $settingsData = $this->AppRepository->getDataAdmin($body);

                    if(isset($settingsData))
                    {
                        // test commented start by Obrad
                        // $rate_android_app_id = (isset($settingsData[0]->rate_android_app_id) && !empty($settingsData[0]->rate_android_app_id)) ? $settingsData[0]->rate_android_app_id : '';
                        // $rate_ios_app_id = (isset($settingsData[0]->rate_ios_app_id) && !empty($settingsData[0]->rate_ios_app_id)) ? $settingsData[0]->rate_ios_app_id : '';
                        // $android_app_id = (isset($settingsData[0]->android_app_id) && !empty($settingsData[0]->android_app_id)) ? $settingsData[0]->rate_ios_app_id : '';
                        // $ios_app_id = (isset($settingsData[0]->ios_app_id) && !empty($settingsData[0]->ios_app_id)) ? $settingsData[0]->rate_ios_app_id : '';
                        $rate_android_app_id = '';
                        $rate_ios_app_id = '';
                        $android_app_id = '';
                        $ios_app_id = '';
                        // test commented end by Obard

                        // if(isset($data->application->ios->id)) {
                        //     $data->application->ios->id = (isset($settingsData[0]->ios_app_id) && !empty($settingsData[0]->ios_app_id)) ? $settingsData[0]->rate_ios_app_id : '';
                        // }
                        // if(isset($data->application->android->id)) {
                        //     $data->application->android->id = (isset($settingsData[0]->android_app_id) && !empty($settingsData[0]->android_app_id)) ? $settingsData[0]->rate_ios_app_id : '';
                        // }

                        $ios_version = '';//(isset($settingsData[0]->ios_version) && !empty($settingsData[0]->ios_version)) ? $settingsData[0]->ios_version : '';
                        $android_version = '';//(isset($settingsData[0]->android_version) && !empty($settingsData[0]->android_version)) ? $settingsData[0]->android_version : '';
                        $force_update_message = (isset($settingsData[0]->force_update_message) && !empty($settingsData[0]->force_update_message)) ? $settingsData[0]->force_update_message : '';
                    }

                    if(isset($data)) {
                        if(isset($data->message)) {
                            if($data->message == 'undefined') {
                                $data->message = "There is a newer version of this app available, click Update to update the app.";
                            }
                        }

                        if(isset($data->application->ios->version)) {
                            if($data->application->ios->version == 'undefined') {
                                $data->application->ios->version = "2.0";
                            } else {
                                $ios_version = $data->application->ios->version;
                            }
                        }

                        if(isset($data->application->ios->id)) {
                            if($data->application->ios->id == 'undefined') {
                                $data->application->ios->id = $rate_ios_app_id;
                            } else {
                                $data->application->ios->id = $rate_ios_app_id;
                            }
                        }

                        if(isset($data->application->android->version)) {
                            if($data->application->android->version == 'undefined') {
                               $data->application->android->version = "1.0";
                            } else {
                                $android_version = $data->application->android->version;
                            }
                        }

                        if (isset($data->application->android->id)) {
                            if($data->application->android->id == 'undefined') {
                                $data->application->android->id = $rate_android_app_id;
                            } else {
                                $data->application->android->id = $rate_android_app_id;
                            }
                        }
                        $popUpData['updateApp'] = $data;
                    } else {
                        $popUpUpdateData= '{"title":"Title",
                            "buttonName":"Update",
                            "message": ' . '"' . $force_update_message . '"' .',
                            "isShow":"false",
                            "application":{
                            "ios":{
                            "version":'. '""' . ',
                            "id":'. '"' . $rate_ios_app_id . '"' . '
                            },
                            "android":{
                            "version":'. '""' . ',
                            "id": '. '"' . $rate_android_app_id . '"' . '
                            }
                            }}';
                $popUpData['updateApp'] = json_decode($popUpUpdateData);

                    }
                }
                if ($allAppBasicData[$v]['app_section_slug'] == "rate_popup")
                {
                    $rateAppData = json_decode($allAppBasicData[$v]['section_json_data']);
                    $settingsData = $this->AppRepository->getDataAdmin($body);
                    if(isset($settingsData)){

                        // test commented by obrad start
                        // $rate_android_app_id = (isset($settingsData[0]->rate_android_app_id) && !empty($settingsData[0]->rate_android_app_id)) ? $settingsData[0]->rate_android_app_id : '';
                        // $rate_ios_app_id = (isset($settingsData[0]->rate_ios_app_id) && !empty($settingsData[0]->rate_ios_app_id)) ? $settingsData[0]->rate_ios_app_id : '';
                        // $android_app_id = (isset($settingsData[0]->android_app_id) && !empty($settingsData[0]->android_app_id)) ? $settingsData[0]->rate_ios_app_id : '';
                        // // $rateAppData->application->android->id = (isset($settingsData[0]->android_app_id) && !empty($settingsData[0]->android_app_id)) ? $settingsData[0]->rate_ios_app_id : '';
                        // // $rateAppData->application->ios->id = (isset($settingsData[0]->ios_app_id) && !empty($settingsData[0]->ios_app_id)) ? $settingsData[0]->rate_ios_app_id : '';
                        // $ios_app_id = (isset($settingsData[0]->ios_app_id) && !empty($settingsData[0]->ios_app_id)) ? $settingsData[0]->rate_ios_app_id : '';

                        // $ios_version = (isset($settingsData[0]->ios_version) && !empty($settingsData[0]->ios_version)) ? $settingsData[0]->ios_version : '';
                        // $android_version = (isset($settingsData[0]->android_version) && !empty($settingsData[0]->android_version)) ? $settingsData[0]->android_version : '';
                        $rate_android_app_id = '';
                        $rate_ios_app_id = '';
                        $android_app_id = '';
                        $ios_app_id = '';

                        $ios_version = '';
                        $android_version = '';
                        // test commented by obrad end
                    }

                    if(isset($rateAppData)) {
                        if (isset($rateAppData->andr_app_id)) {
                            if($rateAppData->andr_app_id == 'undefined' ) {
                                $rateAppData->andr_app_id = $rate_android_app_id;
                            } else {
                                $rateAppData->andr_app_id = $rate_android_app_id;
                            }
                        }

                        if (isset($rateAppData->ios_app_id)) {
                            if($rateAppData->ios_app_id == 'undefined' ) {
                                $rateAppData->ios_app_id = $rate_ios_app_id;
                            } else {
                                $rateAppData->ios_app_id = $rate_ios_app_id;
                            }
                        }

                        if (isset($rateAppData->application->ios->version)) {
                            if($rateAppData->application->ios->version == 'undefined' ) {
                                if(isset($data->application->ios->version)) {
                                    $rateAppData->application->ios->version = $data->application->ios->version;
                                }
                            } else {
                                if($data->application->ios->version){
                                    $rateAppData->application->ios->version = $data->application->ios->version;
                                } else {
                                    $rateAppData->application->ios->version = '';
                                }
                            }
                        }

                        if (isset($rateAppData->application->ios->id)) {
                            if($rateAppData->application->ios->id == 'undefined' ) {
                                $rateAppData->application->ios->id = $rate_ios_app_id;
                            } else {
                                $rateAppData->application->ios->id = $rate_ios_app_id ;
                            }
                        }

                        if (isset($rateAppData->application->android->version)) {
                            if($rateAppData->application->android->version == 'undefined' ) {
                                if(isset($data->application->android->version)) {
                                    $rateAppData->application->android->version = $data->application->android->version;
                                }
                            } else {
                                if($data->application->android->version){
                                    $rateAppData->application->android->version = $data->application->android->version;
                                } else {
                                    $rateAppData->application->android->version = '';
                                }
                            }
                        }

                        if (isset($rateAppData->application->android->id)) {
                            if($rateAppData->application->android->id == 'undefined' ) {
                                $rateAppData->application->android->id = $rate_android_app_id;
                            } else {
                                $rateAppData->application->android->id = $rate_android_app_id;
                            }
                        }
                        $popUpData['rateApp'] = $rateAppData;
                    } else {
                        $androidVer = '';
                        $iosVer = '';
                        if(isset($data)) {
                            if(isset($data->application->android->version)) {
                                $iosVer = $data->application->ios->version;
                                }
                            }

                            if(isset($data)) {
                                if(isset($data->application->android->version)) {
                                   $androidVer = $data->application->android->version;
                                }
                            }


                        $popUpRateAppData = '{"isShow":"false",
                            "andr_app_id": '. '"' .$rate_android_app_id. '"' . ',
                            "ios_app_id": '. '"' .$rate_ios_app_id.'"' . ',
                            "uses_until_prompt":"5",
                            "title":"Title",
                            "message":"If you enjoy this app, please take a moment to rate it.",
                            "rateThisButton":"Agree",
                            "cancelButton":"Decline",
                            "remindLaterButton":"Remind",
                            "rateTitle":null,
                            "application":{
                            "ios":{
                            "version": '. '"'.$iosVer.'"' . ',
                            "id": '. '"' .$rate_ios_app_id.'"' . '
                            },
                            "android":{
                            "version":'. '"'.$androidVer.'"' . ',
                            "id": '. '"' .$rate_android_app_id.'"' . '
                            }
                            }
                            }';
                  $popUpData['rateApp'] = json_decode($popUpRateAppData);
                    }



                }
                if ($allAppBasicData[$v]['app_section_slug'] == "splash_screen")
                {
                    $downloadImageData[$allAppBasicData[$v]['app_section_slug']] = json_decode($allAppBasicData[$v]['section_json_data']);
                }
                if ($allAppBasicData[$v]['app_section_slug'] == "sponsor_splash") {
                    $downloadImageData[$allAppBasicData[$v]['app_section_slug']] = json_decode($allAppBasicData[$v]['section_json_data']);
                }
                if ($allAppBasicData[$v]['app_section_slug'] == "app_icon") {
                    $downloadImageData[$allAppBasicData[$v]['app_section_slug']] = json_decode($allAppBasicData[$v]['section_json_data']);
                }
                if ($allAppBasicData[$v]['app_section_slug'] == "add_screenshot") {
                    $downloadImageData[$allAppBasicData[$v]['app_section_slug']] = json_decode($allAppBasicData[$v]['section_json_data']);
                }
            }

            $mainJSON['popups'] = array_merge($popUpData);
            $mainMenuArr = [];
            $mainSubMenuArr = [];
            $cssArray = [];
            $cssArray = DB::table('app_basic')
                    ->where(['id' => $body['id']])
                    ->get(['app_side_menu_css_json_data'])
                    ->toArray();

            if (isset($cssArray[0]->app_side_menu_css_json_data) && !empty($cssArray[0]->app_side_menu_css_json_data))
            {
                $sidemenuCssArray = json_decode($cssArray[0]->app_side_menu_css_json_data);
            }

            if (isset($sidemenuCssArray->sideMenuCss[0]->mainMenu) && !empty($sidemenuCssArray->sideMenuCss[0]->mainMenu))
            {
                $mainMenuCss = json_encode($sidemenuCssArray->sideMenuCss[0]->mainMenu);
                $finalMainMenuCss = json_decode($mainMenuCss);
                for ($i = 0; $i < sizeof($finalMainMenuCss); $i++)
                {

                    if($finalMainMenuCss[$i]->key == "lineDividerHeight")
                    {

                        if($finalMainMenuCss[$i]->value)
                        {
                            $mainMenuArr = array_merge($mainMenuArr, array(
                            $finalMainMenuCss[$i]->key => $finalMainMenuCss[$i]->value."px"
                            ));
                        }
                        else
                        {
                            $mainMenuArr = array_merge($mainMenuArr, array(
                            $finalMainMenuCss[$i]->key => "0px"
                            ));
                        }
                    }

                    else if($finalMainMenuCss[$i]->key == "fontSize")
                    {
                        if($finalMainMenuCss[$i]->value)
                        {
                            $mainMenuArr = array_merge($mainMenuArr, array(
                            $finalMainMenuCss[$i]->key => $finalMainMenuCss[$i]->value."px"
                            ));
                        }
                        else
                        {
                            $mainMenuArr = array_merge($mainMenuArr, array(
                            $finalMainMenuCss[$i]->key => "0px"
                            ));
                        }
                    }
                    else if($finalMainMenuCss[$i]->key == "backgroundColor")
                    {
                        if($finalMainMenuCss[$i]->value)
                        {
                            $mainMenuArr = array_merge($mainMenuArr, array(
                            $finalMainMenuCss[$i]->key => $finalMainMenuCss[$i]->value
                            ));
                        }
                        else
                        {
                            $mainMenuArr = array_merge($mainMenuArr, array(
                            $finalMainMenuCss[$i]->key => "#ffffff"
                            ));
                        }
                    }
                    else
                    {
                        $mainMenuArr = array_merge($mainMenuArr, array(
                            $finalMainMenuCss[$i]->key => $finalMainMenuCss[$i]->value
                        ));
                    }

                }
            }
            // tabmenu css create
            $mainMenuTabArr = [];
            if(isset($sidemenuCssArray->sideMenuCss[3]->tabMenu) && !empty($sidemenuCssArray->sideMenuCss[3]->tabMenu)) {
                $mainMenuCss = json_encode($sidemenuCssArray->sideMenuCss[3]->tabMenu);
                $finalMainMenuCss = json_decode($mainMenuCss);
                for ($i = 0; $i < sizeof($finalMainMenuCss); $i++)
                {
                    if(isset($finalMainMenuCss[$i]->key)) {
                        if($finalMainMenuCss[$i]->key == "fontsizetab")
                    {

                        if($finalMainMenuCss[$i]->value)
                        {
                            $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => $finalMainMenuCss[$i]->value."px"
                            ));
                        }
                        else
                        {
                            $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => "0px"
                            ));
                        }
                    }

                    else if($finalMainMenuCss[$i]->key == "backgroundColor")
                    {
                        if($finalMainMenuCss[$i]->value)
                        {
                            $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => $finalMainMenuCss[$i]->value
                            ));
                        }
                        else
                        {
                            $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => "#ffffff"
                            ));
                        }
                    }

                    else if($finalMainMenuCss[$i]->key == "fontName")
                    {
                        if($finalMainMenuCss[$i]->value)
                        {
                            $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => $finalMainMenuCss[$i]->value
                            ));
                        }
                        else
                        {
                            $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => "arial"
                            ));
                        }
                    }

                    else if($finalMainMenuCss[$i]->key == "borderColor")
                    {
                        if($finalMainMenuCss[$i]->value)
                        {
                            $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => $finalMainMenuCss[$i]->value
                            ));
                        }
                        else
                        {
                            $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => "#ffffff"
                            ));
                        }
                    }


                    else if($finalMainMenuCss[$i]->key == "bordertab")
                    {
                        if($finalMainMenuCss[$i]->value)
                        {
                            $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => $finalMainMenuCss[$i]->value."px"
                            ));
                        }
                        else
                        {
                            $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => "0px"
                            ));
                        }
                    }

                    else if($finalMainMenuCss[$i]->key == "tabheight")
                    {
                        if($finalMainMenuCss[$i]->value)
                        {
                            $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => $finalMainMenuCss[$i]->value."px"
                            ));
                        }
                        else
                        {
                            $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => "0px"
                            ));
                        }
                    }

                    else
                    {
                        $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => $finalMainMenuCss[$i]->value
                        ));
                    }
                    } else {

                        // if( isset($finalMainMenuCss[5]) && isset($finalMainMenuCss[5][0]) && isset($finalMainMenuCss[5][0]->menutype)) {
                        //     $mainJSON['appInfo']['appType'] = $finalMainMenuCss[5][0]->menutype;
                        // }
                        // print_r($mainJSON['menu']['tabmenu']);
                        if(isset($mainJSON['menu']) && isset($mainJSON['menu']['tabmenu'])) {
                            for ($k = 0; $k < sizeof($mainJSON['menu']['tabmenu']); $k++ ) {
                                if(isset($finalMainMenuCss[$i][$k]->icon)) {
                                    $mainJSON['menu']['tabmenu'][$k]['tabIcon'] = $finalMainMenuCss[$i][$k]->icon;
                                }
                            }
                        }                        
                    }
                }
            }


            $submenuBorderSize = '';
            $subMenuBorderColor = '';
            if (isset($sidemenuCssArray->sideMenuCss[1]->subMenu) && !empty($sidemenuCssArray->sideMenuCss[1]->subMenu))
            {
                $subMenuCss = json_encode($sidemenuCssArray->sideMenuCss[1]->subMenu);

                $finalSubMenuCss = json_decode($subMenuCss);
                for ($i = 0; $i < sizeof($finalSubMenuCss); $i++)
                {
                    if($finalSubMenuCss[$i]->key == "paddingLeft"){
                        $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                            $finalSubMenuCss[$i]->key => ""//$finalSubMenuCss[$i]->value."px"
                        ));
                    }
                    else if($finalSubMenuCss[$i]->key == "paddingTop"){
                        $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                            $finalSubMenuCss[$i]->key => ""//$finalSubMenuCss[$i]->value."px"
                        ));
                    }
                    else if($finalSubMenuCss[$i]->key == "borderBottom"){
                        if($finalSubMenuCss[$i]->value)
                        {
                            $submenuBorderSize = $finalSubMenuCss[$i]->value."px solid";
                            // $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                            //      $finalSubMenuCss[$i]->key => $finalSubMenuCss[$i]->value."px"
                            // ));
                        }
                        else
                        {
                            $submenuBorderSize = "1px solid";
                            // $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                            //      $finalSubMenuCss[$i]->key => "0px"
                            // ));
                        }

                    }
                    else if($finalSubMenuCss[$i]->key == "borderColor"){
                        if($finalSubMenuCss[$i]->value)
                        {

                            $subMenuBorderColor = $submenuBorderSize.' '.$finalSubMenuCss[$i]->value;
                            $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                                 'borderBottom' => $subMenuBorderColor
                            ));
                        }
                        else
                        {

                            $subMenuBorderColor = $submenuBorderSize.' black';
                            $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                                 'borderBottom' => $subMenuBorderColor
                            ));
                        }

                    }
                    else if($finalSubMenuCss[$i]->key == "fontSize"){
                        if($finalSubMenuCss[$i]->value)
                        {
                            $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                                $finalSubMenuCss[$i]->key => $finalSubMenuCss[$i]->value."px"
                            ));
                        }
                        else
                        {
                            $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                                $finalSubMenuCss[$i]->key => "0px"
                            ));
                        }
                    }
                    else if($finalSubMenuCss[$i]->key == "marginTop"){
                      if($finalSubMenuCss[$i]->value)
                      {
                        $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                            $finalSubMenuCss[$i]->key => $finalSubMenuCss[$i]->value."px"
                        ));
                      }else{
                        $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                            $finalSubMenuCss[$i]->key => "0px"
                        ));
                      }
                    }
                    else if($finalSubMenuCss[$i]->key == "headerIcon"){
                      if($finalSubMenuCss[$i]->value)
                      {
                        $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                            $finalSubMenuCss[$i]->key => $finalSubMenuCss[$i]->value
                        ));
                      }else{
                        $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                            $finalSubMenuCss[$i]->key => ""
                        ));
                      }
                    }
                    else
                    {
                        $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                            $finalSubMenuCss[$i]->key => $finalSubMenuCss[$i]->value
                        ));
                    }
                }
            }

            $generalCssData = DB::table('app_basic')
                                    ->where(['id' => $body['id']])
                                    ->get(['app_general_css_json_data'])
                                    ->toArray();

            if(isset($generalCssData[0]->app_general_css_json_data)){

            $header = json_decode($generalCssData[0]->app_general_css_json_data);
                $colorHeader = "";
                $menuIconCss = [];
                $menuIconCss['color'] = '#ffffff';
                if(isset($header)){
                    for ($i=0; $i < sizeof($header) ; $i++) {
                        if(isset($header[$i]->menuIconCss)){
                            if( $header[$i]->menuIconCss[$i]->value == "" ){
                                $colorHeader = "#ffffff";
                            } else {
                                $colorHeader = $header[$i]->menuIconCss[$i]->value;
                            }
                            $menuIconCss = array(
                              "color" => $colorHeader
                            );
                        }
                    }
                    $colorData = '';
                    $heightData = '';
                    $borderData = '';
                    $borderColorData = '';
                    $headerLogo = '';
                    for ($j=0; $j < sizeof($header[1]->headerCss); $j++)
                    {
                        if($header[1]->headerCss[$j]->key == 'background color')
                        {
                            $colorData = $header[1]->headerCss[$j]->value;
                            if(strlen($colorData) == 4)
                            {
                                $hex = str_split($colorData);
                                $colorData = '#' . $hex[1] . $hex[1] . $hex[2] . $hex[2] . $hex[3] . $hex[3];
                            }
                        }

                        if($header[1]->headerCss[$j]->key == 'height'){
                            if($header[1]->headerCss[$j]->value){
                                $heightData = $header[1]->headerCss[$j]->value."px";
                            }else{
                                $heightData = "0px";
                            }
                        }

                        if($header[1]->headerCss[$j]->key == 'borderbottom')
                        {
                            if($header[1]->headerCss[$j]->value)
                            {
                                $borderData = $header[1]->headerCss[$j]->value."px solid";
                            }
                            else
                            {
                                $borderData = $header[1]->headerCss[$j]->value."1px solid";
                            }
                        }

                        if($header[1]->headerCss[$j]->key == 'background color border')
                        {
                            $borderColorData = $header[1]->headerCss[$j]->value;
                            if(strlen($borderColorData) == 4)
                            {
                                $borderHex = str_split($borderColorData);
                                $borderColorData = '#' . $borderHex[1] . $borderHex[1] . $borderHex[2] . $borderHex[2] . $borderHex[3] . $borderHex[3];
                            }
                        }

                        if($header[1]->headerCss[$j]->key == 'headerIcon')
                        {
                            if($header[1]->headerCss[$j]->value)
                            {
                                $headerLogo = $header[1]->headerCss[$j]->value;
                            }
                        }

                    }

                    if($colorData == ""){
                        $colorData = "#ffffff";
                    }

                    if($borderData == ""){
                        $borderData = "2px solid #000000";
                    }

                    if($borderColorData == ""){
                        $borderData = "2px solid #000000";
                    }

                    if($heightData){
                        $headerCss = array(
                            "color" => $colorData,
                            "height" => $heightData,
                            "borderBottom" => $borderData ." ". $borderColorData,
                            "headerIcon" => $headerLogo
                        );
                    }else{
                        $headerCss = array(
                            "color" => "#ffffff",
                            "height" => '70px',
                            "borderBottom" => "2px solid #000000",
                            "headerIcon" => ""
                        );
                    }

                    $statusBarData = "";

                    for ($k=0; $k < sizeof($header[2]->statusBarCss); $k++)
                    {
                        if($header[2]->statusBarCss[$k]->key == 'background color')
                        {
                            $statusBarData = $header[2]->statusBarCss[$k]->value;
                            if(strlen($statusBarData) == 4)
                            {
                                $statusHex = str_split($statusBarData);
                                $statusBarData = '#' . $statusHex[1] . $statusHex[1] . $statusHex[2] . $statusHex[2] . $statusHex[3] . $statusHex[3];
                            }
                        }
                    }

                    if($statusBarData)
                    {
                        $statusBarCss = array(
                            "color" => $statusBarData
                        );
                    }else{
                        $statusBarCss = array(
                            "color" => '#000000'
                        );
                    }

                }
            }


            $generalCssData = DB::table('app_basic')
                                ->where(['id' => $body['id']])
                                ->get(['app_side_menu_css_json_data'])
                                ->toArray();

            if(isset($generalCssData[0]->app_side_menu_css_json_data))
            {
                $sidemenuData = json_decode($generalCssData[0]->app_side_menu_css_json_data);
                if (isset($sidemenuData))
                {

                    $rightData = "";
                    $positionData = "";
                    $fontSizeData = "";
                    $backArrowData = "";
                    $toggleOuterData = "";
                    $toggleInnerData = "";
                    $arrowColor = "";

                    for ($l=0; $l < sizeof($sidemenuData->sideMenuCss[2]->arrow); $l++) {

                        if($sidemenuData->sideMenuCss[2]->arrow[$l]->key == 'arrow padding left' ){
                            $rightData = $sidemenuData->sideMenuCss[2]->arrow[$l]->value."px" ;
                        }

                        if($sidemenuData->sideMenuCss[2]->arrow[$l]->key == 'position' ){
                            $positionData = $sidemenuData->sideMenuCss[2]->arrow[$l]->value;
                        }

                        if($sidemenuData->sideMenuCss[2]->arrow[$l]->key == 'size' ){
                            $fontSizeData = $sidemenuData->sideMenuCss[2]->arrow[$l]->value."px";
                        }

                        if($sidemenuData->sideMenuCss[2]->arrow[$l]->key == 'backarrowcolor' )
                        {
                            $backArrowData = $sidemenuData->sideMenuCss[2]->arrow[$l]->value;
                            if(strlen($backArrowData) == 4)
                            {
                                $backArrowHex = str_split($backArrowData);
                                $backArrowData = '#' . $backArrowHex[1] . $backArrowHex[1] . $backArrowHex[2] . $backArrowHex[2] . $backArrowHex[3] . $backArrowHex[3];
                            }
                        }

                        if($sidemenuData->sideMenuCss[2]->arrow[$l]->key == 'toggleouter' ){
                            $toggleOuterData = $sidemenuData->sideMenuCss[2]->arrow[$l]->value;
                        }

                        if($sidemenuData->sideMenuCss[2]->arrow[$l]->key == 'toggleinner' ){
                            $toggleInnerData = $sidemenuData->sideMenuCss[2]->arrow[$l]->value;
                        }

                        if($sidemenuData->sideMenuCss[2]->arrow[$l]->key == 'arrowColor' ){
                            $arrowColor = $sidemenuData->sideMenuCss[2]->arrow[$l]->value;
                        }

                    }

                    $arrowCss = array(
                        "right" => $rightData,
                        "position" => $positionData,
                        "fontSize" => $fontSizeData,
                        "arrowColor" => $arrowColor
                    );

                    if($backArrowData == ""){
                        $backArrowData = "#ffffff";
                    }
                    $backArrow = array(
                        "color" => $backArrowData
                    );

                    $toggleIcon = array(
                        "iconBackgroundColor"   =>   $toggleOuterData,
                        "innerBackgroundColor" => $toggleInnerData
                    );


                }
            }

            $sponserSplashAllData = DB::table('app_basic_detail')
                                    ->where(['app_basic_id' => $body['id']])
                                    ->where(['app_section_slug' => 'sponsor_splash'])
                                    ->get(['section_json_data'])
                                    ->toArray();
            $sponsorSplashTimeData = "";
            $sponsorSplashURLData = "";

            if(isset($sponserSplashAllData)){
                if(isset($sponserSplashAllData[0])){
                    if(isset($sponserSplashAllData[0]->section_json_data)){
                        $sponsorSplashData = json_decode($sponserSplashAllData[0]->section_json_data);                    
                        if(isset($sponsorSplashData->no_sec_display))
                            $sponsorSplashTimeData = $sponsorSplashData->no_sec_display;
                        if(isset($sponsorSplashData->sponsorsplash_image))
                            $sponsorSplashURLData = $sponsorSplashData->sponsorsplash_image;
                    }
                }                
            }

            $sponsorSplash = array(
                "url"   =>  $sponsorSplashURLData,
                "time"  =>  $sponsorSplashTimeData
            );

            $splashAllData = DB::table('app_basic_detail')
                                ->where(['app_basic_id' => $body['id']])
                                ->where(['app_section_slug' => 'splash_screen'])
                                ->get(['section_json_data'])
                                ->toArray();
            $splashURLData = "";
            if(isset($splashAllData)){
                if(isset($splashAllData[0])){
                    if(isset($splashAllData[0]->section_json_data)){
                        $splashScreenData = json_decode($splashAllData[0]->section_json_data);                    
                        if(isset($splashScreenData->bc_image))
                            $splashURLData = $splashScreenData->bc_image;
                    }
                }                
            }
            $splashScreen = array(
                "url" => $splashURLData,
            );


            $cssSubMenuArray = [];

            $cssSubMenuArray['sideMenuCss']['mainMenu'] = $mainMenuArr;
            $cssSubMenuArray['sideMenuCss']['subMenu'] = $mainSubMenuArr;
            $cssSubMenuArray['sideMenuCss']['arrow'] = $arrowCss;
            $cssSubMenuArray['sideMenuCss']['backArrow'] = $backArrow;
            $cssSubMenuArray['tabMenuCss']['tabMenu'] = $mainMenuTabArr;

            $cssSubMenuArray['menuIconCss'] = $menuIconCss;
            $cssSubMenuArray['headerCss'] = $headerCss;
            $cssSubMenuArray['statusBarCss'] = $statusBarCss;
            $cssSubMenuArray['sponsorSplash_screen'] = $sponsorSplash;
            $cssSubMenuArray['splash_Screen'] = $splashScreen;
            $cssSubMenuArray['toggleIcon'] = $toggleIcon;

            if (isset($sidemenuCssArray) && !empty($sidemenuCssArray) && !empty($cssSubMenuArray))
            {
                $mainJSON['appSpecific'] = $cssSubMenuArray;
            }

            $finalJSON = json_encode($mainJSON);

        //          Download the all images for json

            // $isDownloadImage = false;
            // $allScreenShots = [];

            // if (isset($downloadImageData['splash_screen']->bc_image) && $downloadImageData['splash_screen']->bc_image != '' && File::exists(public_path($this->bcOriginalImageUploadPath . $downloadImageData['splash_screen']->bc_image)))
            // {
            //     $splashImageOld = public_path($this->bcOriginalImageUploadPath . $downloadImageData['splash_screen']->bc_image);
            //     $imageInfo = pathinfo($splashImageOld);
            //     $splashImageNew = public_path($this->bcOriginalImageUploadPath . 'splash_screen_image.' . $imageInfo['extension']);
            //     File::copy($splashImageOld, $splashImageNew);
            //     $isDownloadImage = true;
            // }

            // if (isset($downloadImageData['sponsor_splash']->sponsorsplash_image) && $downloadImageData['sponsor_splash']->sponsorsplash_image != '' && File::exists(public_path($this->sponsorsplashOriginalImageUploadPath . $downloadImageData['sponsor_splash']->sponsorsplash_image)))
            // {
            //     $sponsorSplashImageOld = public_path($this->sponsorsplashOriginalImageUploadPath . $downloadImageData['sponsor_splash']->sponsorsplash_image);
            //     $imageInfo = pathinfo($sponsorSplashImageOld);
            //     $sponsorSplashImageNew = public_path($this->sponsorsplashOriginalImageUploadPath . 'sponsor_splash_image.' . $imageInfo['extension']);
            //     File::copy($sponsorSplashImageOld, $sponsorSplashImageNew);
            //     $isDownloadImage = true;
            // }

            // if (isset($downloadImageData['app_icon']->app_icon) && $downloadImageData['app_icon']->app_icon != '' && File::exists(public_path($this->appIconOriginalImageUploadPath . $downloadImageData['app_icon']->app_icon)))
            // {
            //     $appIconOld = public_path($this->appIconOriginalImageUploadPath . $downloadImageData['app_icon']->app_icon);
            //     $imageInfo = pathinfo($appIconOld);
            //     $appIconNew = public_path($this->appIconOriginalImageUploadPath . 'app_icon.' . $imageInfo['extension']);
            //     File::copy($appIconOld, $appIconNew);
            //     $isDownloadImage = true;
            // }

            // if (isset($downloadImageData['add_screenshot']) && !empty($downloadImageData['add_screenshot']))
            // {
            //     foreach ($downloadImageData['add_screenshot'] as $key => $image)
            //     {
            //         if ($image->add_screenshot != '' && File::exists(public_path($this->addscreenshotOriginalImageUploadPath . $image->add_screenshot)))
            //         {
            //             $screenShotOld = public_path($this->addscreenshotOriginalImageUploadPath . $image->add_screenshot);
            //             $imageInfo = pathinfo($screenShotOld);
            //             $screenShotNew = public_path($this->addscreenshotOriginalImageUploadPath . 'app_screenshot_' . $image->order . '.' . $imageInfo['extension']);
            //             File::copy($screenShotOld, $screenShotNew);
            //             $allScreenShots[] = $screenShotNew;
            //             $isDownloadImage = true;
            //         }
            //     }
            // }

            // Now download menu images

            // if(isset($appMenuData) && !empty($appMenuData) && count($appMenuData) > 0)
            // {
            //     foreach($appMenuData as $key => $menuImage)
            //     {
            //         if(isset($menuImage->menu_icon) && !empty($menuImage->menu_icon) && File::exists(public_path($this->menuIconOriginalImageUploadPath.$menuImage->menu_icon)) && $menuImage->menu_icon != 'default.png')
            //         {
            //             $menuImages = public_path($this->menuIconOriginalImageUploadPath.$menuImage->menu_icon);
            //             $allScreenShots[] = $menuImages;
            //             $isDownloadImage = true;
            //         }
            //     }
            // }

            // if ($isDownloadImage)
            // {
            //     //Merge all images

            //     if(isset($sponsorSplashImageNew) && $sponsorSplashImageNew != null && $sponsorSplashImageNew != '')
            //     {
            //         $allScreenShots[] = $sponsorSplashImageNew;
            //     }
            //     if(isset($splashImageNew) && $splashImageNew != null && $splashImageNew != '')
            //     {
            //         $allScreenShots[] = $splashImageNew;
            //     }
            //     if(isset($appIconNew) && $appIconNew != null && $appIconNew != '')
            //     {
            //         $allScreenShots[] = $appIconNew;
            //     }

            //     # create new zip object
            //     $zipFileName = 'images.zip';

            //     $zipImageFileFullPath = public_path() . "/json/".$appData->app_code."/".$appData->version;

            //     if (!file_exists($zipImageFileFullPath))
            //     {
            //         File::makeDirectory($zipImageFileFullPath, 0777, true, true);
            //     }

            //     //Del by Pandora

            //     $zipper = new \Chumper\Zipper\Zipper;
            //     $zipper->make(public_path() . "/json/".$appData->app_code."/".$appData->version."/".$zipFileName)->add($allScreenShots);
            //     $zipper->close();
            //     $zipper = new \Chumper\Zipper\Zipper;
            //     $extractFolderName = "images";
            //     $zipper->make(public_path()."/json/".$appData->app_code."/".$appData->version."/".$zipFileName)->extractTo(public_path() . "/json/".$appData->app_code."/".$appData->version."/".$extractFolderName);
            //     $zipper->close();

            //     (isset($splashImageNew)) ? unlink($splashImageNew) : '';
            //     (isset($sponsorSplashImageNew)) ? unlink($sponsorSplashImageNew) : '';
            //     (isset($appIconNew)) ? unlink($appIconNew) : '';

            // }

            $createdJson = $this->AppRepository->updateFinalJsonData($body, $finalJSON);

            $fileName = 'setting.json';
            $sourceLanguageFile = public_path() . "/json/language.json";
            $destinationPath = public_path() . "/projects/".$appData->app_code."/assets/";

            if (!is_dir($destinationPath))
            {
                mkdir($destinationPath, 0777, true);
            }
            //Del by pandora

            File::put($destinationPath.$fileName, $finalJSON);
            File::copy($sourceLanguageFile,$destinationPath."language.json");

            $outputArray['status'] = 1;
            $outputArray['message'] = trans('appmessages.app_json_generated_successfully');
            $outputArray['jsonFileDirectory'] = $destinationPath.$fileName;
            $outputArray['jsonFileName'] = $fileName;
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function generateJsonData(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if ($user)
        {
            // Generate final json for app
            $mainJSON = [];
            $appBasicArr = [];
            $sidemenu = [];
            $tabmenu = [];
            $appData = $this->AppRepository->getSingleAppData($body['id']);

            $appBasicInfo = $appData->getAllBasicDetailData;

            //First add static details
            $appInfo = array(
                "appName" => $appData->app_name,
                "appBundleId" => "",
                "appJSONVersion" => "",
                "appDescription" => "",
                "homePageIndex" => 0
            );

            //Merge basic details of App
            if (isset($appBasicInfo) && !empty($appBasicInfo))
            {
                foreach ($appBasicInfo as $key => $data)
                {
                    $appBasicDetail[$data->app_section_slug] = json_decode($data->section_json_data);
                }
            }

            unset($appBasicDetail['home_screen']);
            unset($appBasicDetail['menu_configuration']);

            $mainJSON['menu_location_type'] = $appData['menu_location_type'];

            //Now merge app info and basic details
            $mainJSON['appInfo'] = array_merge($appInfo, $appBasicDetail);

            if(isset($mainJSON['appInfo']['google_analytic']) && isset($mainJSON['appInfo']['google_analytic']->google_key) && !empty($mainJSON['appInfo']['google_analytic']->google_key))
            {
                $mainJSON['appInfo']['googleAnalyticId'] = $mainJSON['appInfo']['google_analytic']->google_key;
            }

            unset($mainJSON['appInfo']['splash_screen'], $mainJSON['appInfo']['sponsor_splash'], $mainJSON['appInfo']['app_icon'], $mainJSON['appInfo']['basic_information'], $mainJSON['appInfo']['google_analytic'], $mainJSON['appInfo']['add_screenshot'], $mainJSON['appInfo']['notification_popup'], $mainJSON['appInfo']['auto_upgrade_popup'], $mainJSON['appInfo']['rate_popup']);

            //get app menu data
            $menuData = [];
            $uniqueArray = [];
            $appMenuData = $this->AppMenuRepository->getAllAppMenuData($body['id']);

            if (isset($appMenuData) && count($appMenuData) > 0)
            {
                $parent = 0;
                $nLevelMenu = $this->nLevelMenuFunction($parent, $appMenuData->toArray());

                foreach($appMenuData->toArray() as  $tutorialKey => $checkTutorialOnStart)
                {
                    $checkTutorialOnStart = (array)$checkTutorialOnStart;
                    if($checkTutorialOnStart && $checkTutorialOnStart['menu_type'] == 10 && !empty($checkTutorialOnStart['menu_type_json_data']))
                    {
                        $menuTypeDecodeJsonData = json_decode($checkTutorialOnStart['menu_type_json_data']);

                        if($menuTypeDecodeJsonData && count($menuTypeDecodeJsonData) > 0 && isset($menuTypeDecodeJsonData->show_tutorial) && !empty($menuTypeDecodeJsonData->show_tutorial) && $menuTypeDecodeJsonData->show_tutorial == 'true')
                        {
                            $mainJSON['appInfo']['tutorial']['flag'] = 1;
                            $mainJSON['appInfo']['tutorial']['index'] = $tutorialKey;
                        }
                    }
                }

                if (!array_key_exists("tutorial", $mainJSON['appInfo']) )
                {
                    $mainJSON['appInfo']['tutorial']['flag'] = 0;
                    $mainJSON['appInfo']['tutorial']['index'] = 0;
                }
            }

            /* ************************************************************************************************************* */

            //          All Menu Json here

            if (isset($nLevelMenu) && count($nLevelMenu) > 0)
            {
                $mainJSON['menu'] = array();
                $mainJSON['menu']['sidemenu'] = array();

                $mainJSON['menu']['sidemenu'] = array_merge($nLevelMenu);
                $mainJSON['menu']['tabmenu'] = array_merge($nLevelMenu);

            }

            /* ************************************************************************************************************* */

            $mainJSON['url'] = array(
                'imageUrl' => url('/json/'.$appData->app_code."/".$appData->version."/")
            );

            $mainJSON['frameworkConfig'] = array(
                'language-json-name' => "language.json"
            );

            $appData = $this->AppRepository->getSingleAppData($body['id']);
            $appBasicInfo = $appData->getAllBasicDetailData;
            $allAppBasicData = $appBasicInfo->toArray();

            $popUpData = [];
            $downloadImageData = [];

            for ($v = 0; $v < sizeof($allAppBasicData); $v++)
            {
                if ($allAppBasicData[$v]['app_section_slug'] == "notification_popup")
                {
                    $dataNotification = json_decode($allAppBasicData[$v]['section_json_data']);
                    if(isset($dataNotification)) {
                        $popUpData['notification'] = json_decode($allAppBasicData[$v]['section_json_data']);
                    } else {
                        // $popUpNotificationData = '{"title":"Title",
                        //     "message":"You have been automatically subscribed to receive push notifications. Remember, you can always update your push notification settings by going to Settings",
                        //     "button1":"Continue",
                        //     "button2":"Manage Notifications",
                        //     "isShow":"false"}';
                        // $popUpData['notification'] = json_decode($popUpNotificationData);
                    }

                }
                if ($allAppBasicData[$v]['app_section_slug'] == "auto_upgrade_popup")
                {
                    $data = json_decode($allAppBasicData[$v]['section_json_data']);
                    $settingsData = $this->AppRepository->getDataAdmin($body);

                    if(isset($settingsData))
                    {
                        $rate_android_app_id = (isset($settingsData[0]->rate_android_app_id) && !empty($settingsData[0]->rate_android_app_id)) ? $settingsData[0]->rate_android_app_id : '';
                        $rate_ios_app_id = (isset($settingsData[0]->rate_ios_app_id) && !empty($settingsData[0]->rate_ios_app_id)) ? $settingsData[0]->rate_ios_app_id : '';
                        $android_app_id = (isset($settingsData[0]->android_app_id) && !empty($settingsData[0]->android_app_id)) ? $settingsData[0]->rate_ios_app_id : '';
                        $ios_app_id = (isset($settingsData[0]->ios_app_id) && !empty($settingsData[0]->ios_app_id)) ? $settingsData[0]->rate_ios_app_id : '';
                        // if(isset($data->application->ios->id)) {
                        //     $data->application->ios->id = (isset($settingsData[0]->ios_app_id) && !empty($settingsData[0]->ios_app_id)) ? $settingsData[0]->rate_ios_app_id : '';
                        // }
                        // if(isset($data->application->android->id)) {
                        //     $data->application->android->id = (isset($settingsData[0]->android_app_id) && !empty($settingsData[0]->android_app_id)) ? $settingsData[0]->rate_ios_app_id : '';
                        // }

                        $ios_version = '';//(isset($settingsData[0]->ios_version) && !empty($settingsData[0]->ios_version)) ? $settingsData[0]->ios_version : '';
                        $android_version = '';//(isset($settingsData[0]->android_version) && !empty($settingsData[0]->android_version)) ? $settingsData[0]->android_version : '';
                        $force_update_message = (isset($settingsData[0]->force_update_message) && !empty($settingsData[0]->force_update_message)) ? $settingsData[0]->force_update_message : '';
                    }

                    if(isset($data)) {
                        if(isset($data->message)) {
                            if($data->message == 'undefined') {
                                $data->message = "There is a newer version of this app available, click Update to update the app.";
                            }
                        }

                        if(isset($data->application->ios->version)) {
                            if($data->application->ios->version == 'undefined') {
                                $data->application->ios->version = "2.0";
                            } else {
                                $ios_version = $data->application->ios->version;
                            }
                        }

                        if(isset($data->application->ios->id)) {
                            if($data->application->ios->id == 'undefined') {
                                $data->application->ios->id = $rate_ios_app_id;
                            } else {
                                $data->application->ios->id = $rate_ios_app_id;
                            }
                        }

                        if(isset($data->application->android->version)) {
                            if($data->application->android->version == 'undefined') {
                               $data->application->android->version = "1.0";
                            } else {
                                $android_version = $data->application->android->version;
                            }
                        }

                        if (isset($data->application->android->id)) {
                            if($data->application->android->id == 'undefined') {
                                $data->application->android->id = $rate_android_app_id;
                            } else {
                                $data->application->android->id = $rate_android_app_id;
                            }
                        }
                        $popUpData['updateApp'] = $data;
                    } else {
                        $popUpUpdateData= '{"title":"Title",
                            "buttonName":"Update",
                            "message": ' . '"' . $force_update_message . '"' .',
                            "isShow":"false",
                            "application":{
                            "ios":{
                            "version":'. '""' . ',
                            "id":'. '"' . $rate_ios_app_id . '"' . '
                            },
                            "android":{
                            "version":'. '""' . ',
                            "id": '. '"' . $rate_android_app_id . '"' . '
                            }
                            }}';
                $popUpData['updateApp'] = json_decode($popUpUpdateData);

                    }
                }
                if ($allAppBasicData[$v]['app_section_slug'] == "rate_popup")
                {
                    $rateAppData = json_decode($allAppBasicData[$v]['section_json_data']);
                    $settingsData = $this->AppRepository->getDataAdmin($body);
                    if(isset($settingsData)){

                        $rate_android_app_id = (isset($settingsData[0]->rate_android_app_id) && !empty($settingsData[0]->rate_android_app_id)) ? $settingsData[0]->rate_android_app_id : '';
                        $rate_ios_app_id = (isset($settingsData[0]->rate_ios_app_id) && !empty($settingsData[0]->rate_ios_app_id)) ? $settingsData[0]->rate_ios_app_id : '';
                        $android_app_id = (isset($settingsData[0]->android_app_id) && !empty($settingsData[0]->android_app_id)) ? $settingsData[0]->rate_ios_app_id : '';
                        // $rateAppData->application->android->id = (isset($settingsData[0]->android_app_id) && !empty($settingsData[0]->android_app_id)) ? $settingsData[0]->rate_ios_app_id : '';
                        // $rateAppData->application->ios->id = (isset($settingsData[0]->ios_app_id) && !empty($settingsData[0]->ios_app_id)) ? $settingsData[0]->rate_ios_app_id : '';
                        $ios_app_id = (isset($settingsData[0]->ios_app_id) && !empty($settingsData[0]->ios_app_id)) ? $settingsData[0]->rate_ios_app_id : '';

                        $ios_version = (isset($settingsData[0]->ios_version) && !empty($settingsData[0]->ios_version)) ? $settingsData[0]->ios_version : '';
                        $android_version = (isset($settingsData[0]->android_version) && !empty($settingsData[0]->android_version)) ? $settingsData[0]->android_version : '';
                    }

                    if(isset($rateAppData)) {
                        if (isset($rateAppData->andr_app_id)) {
                            if($rateAppData->andr_app_id == 'undefined' ) {
                                $rateAppData->andr_app_id = $rate_android_app_id;
                            } else {
                                $rateAppData->andr_app_id = $rate_android_app_id;
                            }
                        }

                        if (isset($rateAppData->ios_app_id)) {
                            if($rateAppData->ios_app_id == 'undefined' ) {
                                $rateAppData->ios_app_id = $rate_ios_app_id;
                            } else {
                                $rateAppData->ios_app_id = $rate_ios_app_id;
                            }
                        }

                        if (isset($rateAppData->application->ios->version)) {
                            if($rateAppData->application->ios->version == 'undefined' ) {
                                if(isset($data->application->ios->version)) {
                                    $rateAppData->application->ios->version = $data->application->ios->version;
                                }
                            } else {
                                if($data->application->ios->version){
                                    $rateAppData->application->ios->version = $data->application->ios->version;
                                } else {
                                    $rateAppData->application->ios->version = '';
                                }
                            }
                        }

                        if (isset($rateAppData->application->ios->id)) {
                            if($rateAppData->application->ios->id == 'undefined' ) {
                                $rateAppData->application->ios->id = $rate_ios_app_id;
                            } else {
                                $rateAppData->application->ios->id = $rate_ios_app_id ;
                            }
                        }

                        if (isset($rateAppData->application->android->version)) {
                            if($rateAppData->application->android->version == 'undefined' ) {
                                if(isset($data->application->android->version)) {
                                    $rateAppData->application->android->version = $data->application->android->version;
                                }
                            } else {
                                if($data->application->android->version){
                                    $rateAppData->application->android->version = $data->application->android->version;
                                } else {
                                    $rateAppData->application->android->version = '';
                                }
                            }
                        }

                        if (isset($rateAppData->application->android->id)) {
                            if($rateAppData->application->android->id == 'undefined' ) {
                                $rateAppData->application->android->id = $rate_android_app_id;
                            } else {
                                $rateAppData->application->android->id = $rate_android_app_id;
                            }
                        }
                        $popUpData['rateApp'] = $rateAppData;
                    } else {
                        $androidVer = '';
                        $iosVer = '';
                        if(isset($data)) {
                            if(isset($data->application->android->version)) {
                                $iosVer = $data->application->ios->version;
                                }
                            }

                            if(isset($data)) {
                                if(isset($data->application->android->version)) {
                                   $androidVer = $data->application->android->version;
                                }
                            }


                        $popUpRateAppData = '{"isShow":"false",
                                                "andr_app_id": '. '"' .$rate_android_app_id. '"' . ',
                                                "ios_app_id": '. '"' .$rate_ios_app_id.'"' . ',
                                                "uses_until_prompt":"5",
                                                "title":"Title",
                                                "message":"If you enjoy this app, please take a moment to rate it.",
                                                "rateThisButton":"Agree",
                                                "cancelButton":"Decline",
                                                "remindLaterButton":"Remind",
                                                "rateTitle":null,
                                                "application":{
                                                "ios":{
                                                "version": '. '"'.$iosVer.'"' . ',
                                                "id": '. '"' .$rate_ios_app_id.'"' . '
                                                },
                                                "android":{
                                                "version":'. '"'.$androidVer.'"' . ',
                                                "id": '. '"' .$rate_android_app_id.'"' . '
                                                }
                                                }
                                                }';
                  $popUpData['rateApp'] = json_decode($popUpRateAppData);
                    }



                }
                if ($allAppBasicData[$v]['app_section_slug'] == "splash_screen")
                {
                    $downloadImageData[$allAppBasicData[$v]['app_section_slug']] = json_decode($allAppBasicData[$v]['section_json_data']);
                }
                if ($allAppBasicData[$v]['app_section_slug'] == "sponsor_splash") {
                    $downloadImageData[$allAppBasicData[$v]['app_section_slug']] = json_decode($allAppBasicData[$v]['section_json_data']);
                }
                if ($allAppBasicData[$v]['app_section_slug'] == "app_icon") {
                    $downloadImageData[$allAppBasicData[$v]['app_section_slug']] = json_decode($allAppBasicData[$v]['section_json_data']);
                }
                if ($allAppBasicData[$v]['app_section_slug'] == "add_screenshot") {
                    $downloadImageData[$allAppBasicData[$v]['app_section_slug']] = json_decode($allAppBasicData[$v]['section_json_data']);
                }
            }

            $mainJSON['popups'] = array_merge($popUpData);
            $mainMenuArr = [];
            $mainSubMenuArr = [];
            $cssArray = [];
            $cssArray = DB::table('app_basic')
                    ->where(['id' => $body['id']])
                    ->get(['app_side_menu_css_json_data'])
                    ->toArray();

            if (isset($cssArray[0]->app_side_menu_css_json_data) && !empty($cssArray[0]->app_side_menu_css_json_data))
            {
                $sidemenuCssArray = json_decode($cssArray[0]->app_side_menu_css_json_data);
            }

            if (isset($sidemenuCssArray->sideMenuCss[0]->mainMenu) && !empty($sidemenuCssArray->sideMenuCss[0]->mainMenu))
            {
                $mainMenuCss = json_encode($sidemenuCssArray->sideMenuCss[0]->mainMenu);
                $finalMainMenuCss = json_decode($mainMenuCss);
                for ($i = 0; $i < sizeof($finalMainMenuCss); $i++)
                {

                    if($finalMainMenuCss[$i]->key == "lineDividerHeight")
                    {

                        if($finalMainMenuCss[$i]->value)
                        {
                            $mainMenuArr = array_merge($mainMenuArr, array(
                            $finalMainMenuCss[$i]->key => $finalMainMenuCss[$i]->value."px"
                            ));
                        }
                        else
                        {
                            $mainMenuArr = array_merge($mainMenuArr, array(
                            $finalMainMenuCss[$i]->key => "0px"
                            ));
                        }
                    }

                    else if($finalMainMenuCss[$i]->key == "fontSize")
                    {
                        if($finalMainMenuCss[$i]->value)
                        {
                            $mainMenuArr = array_merge($mainMenuArr, array(
                            $finalMainMenuCss[$i]->key => $finalMainMenuCss[$i]->value."px"
                            ));
                        }
                        else
                        {
                            $mainMenuArr = array_merge($mainMenuArr, array(
                            $finalMainMenuCss[$i]->key => "0px"
                            ));
                        }
                    }
                    else if($finalMainMenuCss[$i]->key == "backgroundColor")
                    {
                        if($finalMainMenuCss[$i]->value)
                        {
                            $mainMenuArr = array_merge($mainMenuArr, array(
                            $finalMainMenuCss[$i]->key => $finalMainMenuCss[$i]->value
                            ));
                        }
                        else
                        {
                            $mainMenuArr = array_merge($mainMenuArr, array(
                            $finalMainMenuCss[$i]->key => "#ffffff"
                            ));
                        }
                    }
                    else
                    {
                        $mainMenuArr = array_merge($mainMenuArr, array(
                            $finalMainMenuCss[$i]->key => $finalMainMenuCss[$i]->value
                        ));
                    }

                }
            }
            // tabmenu css create
            $mainMenuTabArr = [];
            if(isset($sidemenuCssArray->sideMenuCss[3]->tabMenu) && !empty($sidemenuCssArray->sideMenuCss[3]->tabMenu)) {
                $mainMenuCss = json_encode($sidemenuCssArray->sideMenuCss[3]->tabMenu);
                $finalMainMenuCss = json_decode($mainMenuCss);
                for ($i = 0; $i < sizeof($finalMainMenuCss); $i++)
                {
                    if(isset($finalMainMenuCss[$i]->key)) {
                        if($finalMainMenuCss[$i]->key == "fontsizetab")
                    {

                        if($finalMainMenuCss[$i]->value)
                        {
                            $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => $finalMainMenuCss[$i]->value."px"
                            ));
                        }
                        else
                        {
                            $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => "0px"
                            ));
                        }
                    }

                    else if($finalMainMenuCss[$i]->key == "backgroundColor")
                    {
                        if($finalMainMenuCss[$i]->value)
                        {
                            $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => $finalMainMenuCss[$i]->value
                            ));
                        }
                        else
                        {
                            $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => "#ffffff"
                            ));
                        }
                    }

                    else if($finalMainMenuCss[$i]->key == "fontName")
                    {
                        if($finalMainMenuCss[$i]->value)
                        {
                            $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => $finalMainMenuCss[$i]->value
                            ));
                        }
                        else
                        {
                            $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => "arial"
                            ));
                        }
                    }

                    else if($finalMainMenuCss[$i]->key == "borderColor")
                    {
                        if($finalMainMenuCss[$i]->value)
                        {
                            $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => $finalMainMenuCss[$i]->value
                            ));
                        }
                        else
                        {
                            $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => "#ffffff"
                            ));
                        }
                    }


                    else if($finalMainMenuCss[$i]->key == "bordertab")
                    {
                        if($finalMainMenuCss[$i]->value)
                        {
                            $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => $finalMainMenuCss[$i]->value."px"
                            ));
                        }
                        else
                        {
                            $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => "0px"
                            ));
                        }
                    }

                    else if($finalMainMenuCss[$i]->key == "tabheight")
                    {
                        if($finalMainMenuCss[$i]->value)
                        {
                            $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => $finalMainMenuCss[$i]->value."px"
                            ));
                        }
                        else
                        {
                            $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => "0px"
                            ));
                        }
                    }

                    else
                    {
                        $mainMenuTabArr = array_merge($mainMenuTabArr, array(
                            $finalMainMenuCss[$i]->key => $finalMainMenuCss[$i]->value
                        ));
                    }
                    } else {

                        // if( isset($finalMainMenuCss[5]) && isset($finalMainMenuCss[5][0]) && isset($finalMainMenuCss[5][0]->menutype)) {
                        //     $mainJSON['appInfo']['appType'] = $finalMainMenuCss[5][0]->menutype;
                        // }
                        // print_r($mainJSON['menu']['tabmenu']);
                        for ($k = 0; $k < sizeof($mainJSON['menu']['tabmenu']); $k++ ) {
                            if(isset($finalMainMenuCss[$i][$k]->icon)) {
                                $mainJSON['menu']['tabmenu'][$k]['tabIcon'] = $finalMainMenuCss[$i][$k]->icon;
                            }
                        }
                    }
                }
            }


            $submenuBorderSize = '';
            $subMenuBorderColor = '';
            if (isset($sidemenuCssArray->sideMenuCss[1]->subMenu) && !empty($sidemenuCssArray->sideMenuCss[1]->subMenu))
            {
                $subMenuCss = json_encode($sidemenuCssArray->sideMenuCss[1]->subMenu);

                $finalSubMenuCss = json_decode($subMenuCss);
                for ($i = 0; $i < sizeof($finalSubMenuCss); $i++)
                {
                    if($finalSubMenuCss[$i]->key == "paddingLeft"){
                        $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                            $finalSubMenuCss[$i]->key => ""//$finalSubMenuCss[$i]->value."px"
                        ));
                    }
                    else if($finalSubMenuCss[$i]->key == "paddingTop"){
                        $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                            $finalSubMenuCss[$i]->key => ""//$finalSubMenuCss[$i]->value."px"
                        ));
                    }
                    else if($finalSubMenuCss[$i]->key == "borderBottom"){
                        if($finalSubMenuCss[$i]->value)
                        {
                            $submenuBorderSize = $finalSubMenuCss[$i]->value."px solid";
                            // $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                            //      $finalSubMenuCss[$i]->key => $finalSubMenuCss[$i]->value."px"
                            // ));
                        }
                        else
                        {
                            $submenuBorderSize = "1px solid";
                            // $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                            //      $finalSubMenuCss[$i]->key => "0px"
                            // ));
                        }

                    }
                    else if($finalSubMenuCss[$i]->key == "borderColor"){
                        if($finalSubMenuCss[$i]->value)
                        {

                            $subMenuBorderColor = $submenuBorderSize.' '.$finalSubMenuCss[$i]->value;
                            $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                                 'borderBottom' => $subMenuBorderColor
                            ));
                        }
                        else
                        {

                            $subMenuBorderColor = $submenuBorderSize.' black';
                            $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                                 'borderBottom' => $subMenuBorderColor
                            ));
                        }

                    }
                    else if($finalSubMenuCss[$i]->key == "fontSize"){
                        if($finalSubMenuCss[$i]->value)
                        {
                            $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                                $finalSubMenuCss[$i]->key => $finalSubMenuCss[$i]->value."px"
                            ));
                        }
                        else
                        {
                            $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                                $finalSubMenuCss[$i]->key => "0px"
                            ));
                        }
                    }
                    else if($finalSubMenuCss[$i]->key == "marginTop"){
                      if($finalSubMenuCss[$i]->value)
                      {
                        $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                            $finalSubMenuCss[$i]->key => $finalSubMenuCss[$i]->value."px"
                        ));
                      }else{
                        $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                            $finalSubMenuCss[$i]->key => "0px"
                        ));
                      }
                    }
                    else if($finalSubMenuCss[$i]->key == "headerIcon"){
                      if($finalSubMenuCss[$i]->value)
                      {
                        $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                            $finalSubMenuCss[$i]->key => $finalSubMenuCss[$i]->value
                        ));
                      }else{
                        $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                            $finalSubMenuCss[$i]->key => ""
                        ));
                      }
                    }
                    else
                    {
                        $mainSubMenuArr = array_merge($mainSubMenuArr, array(
                            $finalSubMenuCss[$i]->key => $finalSubMenuCss[$i]->value
                        ));
                    }
                }
            }

            $generalCssData = DB::table('app_basic')
                                    ->where(['id' => $body['id']])
                                    ->get(['app_general_css_json_data'])
                                    ->toArray();

            if(isset($generalCssData[0]->app_general_css_json_data)){

            $header = json_decode($generalCssData[0]->app_general_css_json_data);
                $colorHeader = "";
                $menuIconCss = [];
                $menuIconCss['color'] = '#ffffff';
                if(isset($header)){
                    for ($i=0; $i < sizeof($header) ; $i++) {
                        if(isset($header[$i]->menuIconCss)){
                            if( $header[$i]->menuIconCss[$i]->value == "" ){
                                $colorHeader = "#ffffff";
                            } else {
                                $colorHeader = $header[$i]->menuIconCss[$i]->value;
                            }
                            $menuIconCss = array(
                              "color" => $colorHeader
                            );
                        }
                    }
                    $colorData = '';
                    $heightData = '';
                    $borderData = '';
                    $borderColorData = '';
                    $headerLogo = '';
                    for ($j=0; $j < sizeof($header[1]->headerCss); $j++)
                    {
                        if($header[1]->headerCss[$j]->key == 'background color')
                        {
                            $colorData = $header[1]->headerCss[$j]->value;
                            if(strlen($colorData) == 4)
                            {
                                $hex = str_split($colorData);
                                $colorData = '#' . $hex[1] . $hex[1] . $hex[2] . $hex[2] . $hex[3] . $hex[3];
                            }
                        }

                        if($header[1]->headerCss[$j]->key == 'height'){
                            if($header[1]->headerCss[$j]->value){
                                $heightData = $header[1]->headerCss[$j]->value."px";
                            }else{
                                $heightData = "0px";
                            }
                        }

                        if($header[1]->headerCss[$j]->key == 'borderbottom')
                        {
                            if($header[1]->headerCss[$j]->value)
                            {
                                $borderData = $header[1]->headerCss[$j]->value."px solid";
                            }
                            else
                            {
                                $borderData = $header[1]->headerCss[$j]->value."1px solid";
                            }
                        }

                        if($header[1]->headerCss[$j]->key == 'background color border')
                        {
                            $borderColorData = $header[1]->headerCss[$j]->value;
                            if(strlen($borderColorData) == 4)
                            {
                                $borderHex = str_split($borderColorData);
                                $borderColorData = '#' . $borderHex[1] . $borderHex[1] . $borderHex[2] . $borderHex[2] . $borderHex[3] . $borderHex[3];
                            }
                        }

                        if($header[1]->headerCss[$j]->key == 'headerIcon')
                        {
                            if($header[1]->headerCss[$j]->value)
                            {
                                $headerLogo = $header[1]->headerCss[$j]->value;
                            }
                        }

                    }

                    if($colorData == ""){
                        $colorData = "#ffffff";
                    }

                    if($borderData == ""){
                        $borderData = "2px solid #000000";
                    }

                    if($borderColorData == ""){
                        $borderData = "2px solid #000000";
                    }

                    if($heightData){
                        $headerCss = array(
                            "color" => $colorData,
                            "height" => $heightData,
                            "borderBottom" => $borderData ." ". $borderColorData,
                            "headerIcon" => $headerLogo
                        );
                    }else{
                        $headerCss = array(
                            "color" => "#ffffff",
                            "height" => '70px',
                            "borderBottom" => "2px solid #000000",
                            "headerIcon" => ""
                        );
                    }

                    $statusBarData = "";

                    for ($k=0; $k < sizeof($header[2]->statusBarCss); $k++)
                    {
                        if($header[2]->statusBarCss[$k]->key == 'background color')
                        {
                            $statusBarData = $header[2]->statusBarCss[$k]->value;
                            if(strlen($statusBarData) == 4)
                            {
                                $statusHex = str_split($statusBarData);
                                $statusBarData = '#' . $statusHex[1] . $statusHex[1] . $statusHex[2] . $statusHex[2] . $statusHex[3] . $statusHex[3];
                            }
                        }
                    }

                    if($statusBarData)
                    {
                        $statusBarCss = array(
                            "color" => $statusBarData
                        );
                    }else{
                        $statusBarCss = array(
                            "color" => '#000000'
                        );
                    }

                }
            }


                $generalCssData = DB::table('app_basic')
                                    ->where(['id' => $body['id']])
                                    ->get(['app_side_menu_css_json_data'])
                                    ->toArray();

                if(isset($generalCssData[0]->app_side_menu_css_json_data))
                {
                    $sidemenuData = json_decode($generalCssData[0]->app_side_menu_css_json_data);
                    if (isset($sidemenuData))
                    {

                        $rightData = "";
                        $positionData = "";
                        $fontSizeData = "";
                        $backArrowData = "";
                        $toggleOuterData = "";
                        $toggleInnerData = "";
                        $arrowColor = "";

                        for ($l=0; $l < sizeof($sidemenuData->sideMenuCss[2]->arrow); $l++) {

                            if($sidemenuData->sideMenuCss[2]->arrow[$l]->key == 'arrow padding left' ){
                                $rightData = $sidemenuData->sideMenuCss[2]->arrow[$l]->value."px" ;
                            }

                            if($sidemenuData->sideMenuCss[2]->arrow[$l]->key == 'position' ){
                                $positionData = $sidemenuData->sideMenuCss[2]->arrow[$l]->value;
                            }

                            if($sidemenuData->sideMenuCss[2]->arrow[$l]->key == 'size' ){
                                $fontSizeData = $sidemenuData->sideMenuCss[2]->arrow[$l]->value."px";
                            }

                            if($sidemenuData->sideMenuCss[2]->arrow[$l]->key == 'backarrowcolor' )
                            {
                                $backArrowData = $sidemenuData->sideMenuCss[2]->arrow[$l]->value;
                                if(strlen($backArrowData) == 4)
                                {
                                    $backArrowHex = str_split($backArrowData);
                                    $backArrowData = '#' . $backArrowHex[1] . $backArrowHex[1] . $backArrowHex[2] . $backArrowHex[2] . $backArrowHex[3] . $backArrowHex[3];
                                }
                            }

                            if($sidemenuData->sideMenuCss[2]->arrow[$l]->key == 'toggleouter' ){
                                $toggleOuterData = $sidemenuData->sideMenuCss[2]->arrow[$l]->value;
                            }

                            if($sidemenuData->sideMenuCss[2]->arrow[$l]->key == 'toggleinner' ){
                                $toggleInnerData = $sidemenuData->sideMenuCss[2]->arrow[$l]->value;
                            }

                            if($sidemenuData->sideMenuCss[2]->arrow[$l]->key == 'arrowColor' ){
                                $arrowColor = $sidemenuData->sideMenuCss[2]->arrow[$l]->value;
                            }

                        }

                        $arrowCss = array(
                            "right" => $rightData,
                            "position" => $positionData,
                            "fontSize" => $fontSizeData,
                            "arrowColor" => $arrowColor
                        );

                        if($backArrowData == ""){
                            $backArrowData = "#ffffff";
                        }
                        $backArrow = array(
                            "color" => $backArrowData
                        );

                        $toggleIcon = array(
                            "iconBackgroundColor"   =>   $toggleOuterData,
                            "innerBackgroundColor" => $toggleInnerData
                        );


                    }
                }

            $sponserSplashAllData = DB::table('app_basic_detail')
                                    ->where(['app_basic_id' => $body['id']])
                                    ->where(['app_section_slug' => 'sponsor_splash'])
                                    ->get(['section_json_data'])
                                    ->toArray();
            $sponsorSplashTimeData = "";

            if(isset($sponserSplashAllData)){
                if(isset($sponserSplashAllData[0]->section_json_data)){
                    $sponsorSplashData = json_decode($sponserSplashAllData[0]->section_json_data);
                    $sponsorSplashTimeData = $sponsorSplashData->no_sec_display;
                }
            }

            $sponsorScreen = array(
                "url"   =>  "sponsor_splash_image.jpg",
                "time"  =>  $sponsorSplashTimeData
            );

            $cssSubMenuArray = [];

            $cssSubMenuArray['sideMenuCss']['mainMenu'] = $mainMenuArr;
            $cssSubMenuArray['sideMenuCss']['subMenu'] = $mainSubMenuArr;
            $cssSubMenuArray['sideMenuCss']['arrow'] = $arrowCss;
            $cssSubMenuArray['sideMenuCss']['backArrow'] = $backArrow;
            $cssSubMenuArray['tabMenuCss']['tabMenu'] = $mainMenuTabArr;

            $cssSubMenuArray['menuIconCss'] = $menuIconCss;
            $cssSubMenuArray['headerCss'] = $headerCss;
            $cssSubMenuArray['statusBarCss'] = $statusBarCss;
            $cssSubMenuArray['sponsorScreen'] = $sponsorScreen;
            $cssSubMenuArray['toggleIcon'] = $toggleIcon;

            if (isset($sidemenuCssArray) && !empty($sidemenuCssArray) && !empty($cssSubMenuArray))
            {
                $mainJSON['appSpecific'] = $cssSubMenuArray;
            }

            $finalJSON = json_encode($mainJSON);

         // Download the all images for json

            $isDownloadImage = false;
            $allScreenShots = [];

            if (isset($downloadImageData['splash_screen']->bc_image) && $downloadImageData['splash_screen']->bc_image != '' && File::exists(public_path($this->bcOriginalImageUploadPath . $downloadImageData['splash_screen']->bc_image)))
            {
                $splashImageOld = public_path($this->bcOriginalImageUploadPath . $downloadImageData['splash_screen']->bc_image);
                $imageInfo = pathinfo($splashImageOld);
                $splashImageNew = public_path($this->bcOriginalImageUploadPath . 'splash_screen_image.' . $imageInfo['extension']);
                File::copy($splashImageOld, $splashImageNew);
                $isDownloadImage = true;
            }

            if (isset($downloadImageData['sponsor_splash']->sponsorsplash_image) && $downloadImageData['sponsor_splash']->sponsorsplash_image != '' && File::exists(public_path($this->sponsorsplashOriginalImageUploadPath . $downloadImageData['sponsor_splash']->sponsorsplash_image)))
            {
                $sponsorSplashImageOld = public_path($this->sponsorsplashOriginalImageUploadPath . $downloadImageData['sponsor_splash']->sponsorsplash_image);
                $imageInfo = pathinfo($sponsorSplashImageOld);
                $sponsorSplashImageNew = public_path($this->sponsorsplashOriginalImageUploadPath . 'sponsor_splash_image.' . $imageInfo['extension']);
                File::copy($sponsorSplashImageOld, $sponsorSplashImageNew);
                $isDownloadImage = true;
            }

            if (isset($downloadImageData['app_icon']->app_icon) && $downloadImageData['app_icon']->app_icon != '' && File::exists(public_path($this->appIconOriginalImageUploadPath . $downloadImageData['app_icon']->app_icon)))
            {
                $appIconOld = public_path($this->appIconOriginalImageUploadPath . $downloadImageData['app_icon']->app_icon);
                $imageInfo = pathinfo($appIconOld);
                $appIconNew = public_path($this->appIconOriginalImageUploadPath . 'app_icon.' . $imageInfo['extension']);
                File::copy($appIconOld, $appIconNew);
                $isDownloadImage = true;
            }

            if (isset($downloadImageData['add_screenshot']) && !empty($downloadImageData['add_screenshot']))
            {
                foreach ($downloadImageData['add_screenshot'] as $key => $image)
                {
                    if ($image->add_screenshot != '' && File::exists(public_path($this->addscreenshotOriginalImageUploadPath . $image->add_screenshot)))
                    {
                        $screenShotOld = public_path($this->addscreenshotOriginalImageUploadPath . $image->add_screenshot);
                        $imageInfo = pathinfo($screenShotOld);
                        $screenShotNew = public_path($this->addscreenshotOriginalImageUploadPath . 'app_screenshot_' . $image->order . '.' . $imageInfo['extension']);
                        File::copy($screenShotOld, $screenShotNew);
                        $allScreenShots[] = $screenShotNew;
                        $isDownloadImage = true;
                    }
                }
            }

         // Now download menu images

            if(isset($appMenuData) && !empty($appMenuData) && count($appMenuData) > 0)
            {
                foreach($appMenuData as $key => $menuImage)
                {
                    if(isset($menuImage->menu_icon) && !empty($menuImage->menu_icon) && File::exists(public_path($this->menuIconOriginalImageUploadPath.$menuImage->menu_icon)) && $menuImage->menu_icon != 'default.png')
                    {
                        $menuImages = public_path($this->menuIconOriginalImageUploadPath.$menuImage->menu_icon);
                        $allScreenShots[] = $menuImages;
                        $isDownloadImage = true;
                    }
                }
            }

            if ($isDownloadImage)
            {
                //Merge all images

                if(isset($sponsorSplashImageNew) && $sponsorSplashImageNew != null && $sponsorSplashImageNew != '')
                {
                    $allScreenShots[] = $sponsorSplashImageNew;
                }
                if(isset($splashImageNew) && $splashImageNew != null && $splashImageNew != '')
                {
                    $allScreenShots[] = $splashImageNew;
                }
                if(isset($appIconNew) && $appIconNew != null && $appIconNew != '')
                {
                    $allScreenShots[] = $appIconNew;
                }

                # create new zip object
                $zipFileName = 'images.zip';

                $zipImageFileFullPath = public_path() . "/json/".$appData->app_code."/".$appData->version;

                if (!file_exists($zipImageFileFullPath))
                {
                    File::makeDirectory($zipImageFileFullPath, 0777, true, true);
                }

                $zipper = new \Chumper\Zipper\Zipper;

                $zipper->make(public_path() . "/json/".$appData->app_code."/".$appData->version."/".$zipFileName)->add($allScreenShots);
                $zipper->close();
                (isset($splashImageNew)) ? unlink($splashImageNew) : '';
                (isset($sponsorSplashImageNew)) ? unlink($sponsorSplashImageNew) : '';
                (isset($appIconNew)) ? unlink($appIconNew) : '';

            }

            $createdJson = $this->AppRepository->updateFinalJsonData($body, $finalJSON);

            $fileName = 'setting.json';
            $sourceLanguageFile = public_path() . "/json/language.json";
            $destinationPath = public_path() . "/json/".$appData->app_code."/".$appData->version."/";

            if (!is_dir($destinationPath))
            {
                mkdir($destinationPath, 0777, true);
            }

            if($appData->app_publish_counter > 0)
            {
                //Before copy setting.json file we will create backup folder and copy existing setting.json file on FTP
                $ftp_server = Config::get('constant.FTP_SERVER');
                $ftp_user_name = Config::get('constant.FTP_USERNAME');
                $ftp_user_pass = Config::get('constant.FTP_PASSWORD');
                $ftp_folder = Config::get('constant.FTP_UPLOAD_FOLDER');

                // set up basic connection
                $conn_id = ftp_connect($ftp_server);

                // login with username and password
                $login_result = ftp_login($conn_id, $ftp_user_name, $ftp_user_pass);
                ftp_pasv($conn_id, true);

                $versionDirectory = $appData->version;
                $backupFolder = date('Y-m-d-H:i:s');
                $path2 = "/".$ftp_folder.$appData->app_code;
                $versionDirectoryName = $path2."/".$versionDirectory;
                $appCodeDirectoryPath = 'ftp://'.$ftp_user_name.':'.$ftp_user_pass.'@'.$ftp_server.'/'.$ftp_folder;

                if (!is_dir($appCodeDirectoryPath)) {
                    ftp_mkdir($conn_id, "/".$ftp_folder);
                }
                if (!is_dir($appCodeDirectoryPath.$appData->app_code)) {
                    ftp_mkdir($conn_id, $path2);
                }
                if (!is_dir($appCodeDirectoryPath.$appData->app_code."/".$versionDirectory)) {
                    ftp_mkdir($conn_id,$versionDirectoryName );
                }

                if (!is_dir($appCodeDirectoryPath.$appData->app_code."/".$versionDirectory."/".$backupFolder)) {
                    ftp_mkdir($conn_id,$versionDirectoryName."/".$backupFolder );
                    ftp_put($conn_id, $versionDirectoryName."/setting.json", public_path() . "/json/".$appData->app_code."/".$appData->version."/setting.json", FTP_ASCII);
                    $outputArray['status'] = 1;
                    $outputArray['message'] = "Successfully created backup folder";
                }
                else
                {
                    $outputArray['status'] = 0;
                    $outputArray['message'] = "Error while creating backup folder";
                }

            }

            File::put($destinationPath.$fileName, $finalJSON);
            File::copy($sourceLanguageFile,$destinationPath."language.json");

            $previewPath = public_path() . "/projects/".$appData->app_code."/assets/";
            //$previewPath = public_path() . "/json/".$appData->app_code."/preview/";

            if (!is_dir($previewPath))
            {
                mkdir($previewPath, 0777, true);
            }

            File::put($previewPath.$fileName, $finalJSON);
            File::copy($sourceLanguageFile,$previewPath."language.json");

            //Prepare zip file for export
            $exportZipFileName = $appData->app_code."_".$appData->version.".zip";
            $zipper = new \Chumper\Zipper\Zipper;
            $zipper->make(public_path() . "/json/".$appData->app_code."/".$exportZipFileName)->add(array($sourceLanguageFile,$destinationPath.$fileName,$destinationPath."images.zip"));


            $outputArray['status'] = 1;
            $outputArray['message'] = trans('appmessages.app_json_generated_successfully');
         // $outputArray['data'] = url('/json/'.$appData->app_code."/".$appData->version."/".$fileName);
            $outputArray['data'] = url('/json/'.$appData->app_code."/".$exportZipFileName);
            $outputArray['jsonFileName'] = $fileName;
         // $outputArray['imageZip'] = url('/json/'.$appData->app_code."/".$appData->version."/".$zipFileName);

            $outputArray['imageZipFileName'] = $zipFileName;
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function nLevelMenuFunction($parentId = 0, $elements)
    {
        $branch = array();
        foreach ($elements as $element)
        {
            $element = (array)$element;
            $element['menu_icon'] = $element['menu_icon'];
            
            if ($element['is_parent'] == $parentId)
            {
                $menuTypeJsonDataDecode = json_decode($element['menu_type_json_data']);
                $element['title'] = $element['menu_name'];

                if(!empty($element['menu_type']))
                {
                    $getMenuType = Helpers::getMenuTypeData($element['menu_type'], $menuTypeJsonDataDecode);
                    $element['type'] = $getMenuType;
                }

                if(!empty($menuTypeJsonDataDecode) && isset($menuTypeJsonDataDecode->css_string_json) && $menuTypeJsonDataDecode->css_string_json != null && !empty($menuTypeJsonDataDecode->css_string_json))
                {
                    $element['css'] = array();

                 // For Animated Panels Done

                    if($element['menu_type'] == 1)
                    {
                        $getImageMenuJsonData = Helpers::getImageMenuJsonData($menuTypeJsonDataDecode, $menuTypeJsonDataDecode->css_string_json);
                        $element['css'] = $getImageMenuJsonData;
                    }

                 // For YouTube Playlist Done

                    elseif($element['menu_type'] == 3)
                    {
                        $getYouTubeMenuJsonData = Helpers::getYouTubeMenuJsonData($menuTypeJsonDataDecode->css_string_json);
                        $element['css'] = $getYouTubeMenuJsonData;
                    }

                 // For List Menu Done

                    elseif($element['menu_type'] == 4)
                    {
                        $getListMenuJsonData = Helpers::getListMenuJsonData($menuTypeJsonDataDecode->css_string_json);
                        $element['css'] = $getListMenuJsonData;
                    }

                 // For RSS Feed

                    elseif($element['menu_type'] == 5)
                    {
                        $getRSSMenuJsonData = Helpers::getRSSMenuJsonData($menuTypeJsonDataDecode->css_string_json);
                        $element['css'] = $getRSSMenuJsonData;
                    }

                 // For Notifications

                    elseif($element['menu_type'] == 6)
                    {
                        $getNotificationJsonData = Helpers::getNotificationJsonData($menuTypeJsonDataDecode->css_string_json);
                        $element['css'] = $getNotificationJsonData;
                        if(isset($menuTypeJsonDataDecode->notification_text_fields) && 
                          $menuTypeJsonDataDecode->notification_text_fields != null && 
                          !empty($menuTypeJsonDataDecode->notification_text_fields))
                        {
                            $element['value'] = $menuTypeJsonDataDecode->notification_text_fields;
                        }
                        else
                        {
                            $element['value'] = '';
                        }

                    }

                 // For Google/Picasa Album

                    elseif($element['menu_type'] == 7)
                    {
                        $getAlbumMenuJsonData = Helpers::getAlbumMenuJsonData($menuTypeJsonDataDecode->css_string_json);
                        $element['css'] = $getAlbumMenuJsonData;
                        if(isset($menuTypeJsonDataDecode->google_key))
                        {
                            $element['value']['google_key'] = $menuTypeJsonDataDecode->google_key;
                        }
                        if(isset($menuTypeJsonDataDecode->album_id))
                        {
                            $element['value']['album_id'] = $menuTypeJsonDataDecode->album_id;
                        }
                        if(isset($menuTypeJsonDataDecode->user_id))
                        {
                            $element['value']['userId'] = $menuTypeJsonDataDecode->user_id;
                        }
                        if(isset($menuTypeJsonDataDecode->album_url))
                        {
                            $element['value']['album_url'] = $menuTypeJsonDataDecode->album_url;
                        }
                         if(isset($menuTypeJsonDataDecode->complete_album_url))
                        {
                            $element['value']['complete_album_url'] = $menuTypeJsonDataDecode->complete_album_url;
                        }
                        if(isset($menuTypeJsonDataDecode->selected_complete_album_url))
                        {
                            $element['value']['selected_complete_album_url'] = $menuTypeJsonDataDecode->selected_complete_album_url;
                        }
                        if(isset($menuTypeJsonDataDecode->caption_check))
                        {
                            $element['value']['caption_check'] = $menuTypeJsonDataDecode->caption_check;
                        }
                    }
                    // For Contact
                    elseif($element['menu_type'] == 11)
                    {
                        if(isset($menuTypeJsonDataDecode->css_string_json))
                        {
                            $element['value']['css_string_json'] = json_decode($menuTypeJsonDataDecode->css_string_json);
                        }
                        if(isset($menuTypeJsonDataDecode->recipients_string_json))
                        {
                            $element['value']['recipients_string_json'] = json_decode($menuTypeJsonDataDecode->recipients_string_json);
                        }
                    }
                    // For Content 
                    elseif($element['menu_type'] == 12)
                    {
                        if(isset($menuTypeJsonDataDecode->css_string_json))
                        {
                            $element['value']['css_string_json'] = json_decode($menuTypeJsonDataDecode->css_string_json);
                        }
                        if(isset($menuTypeJsonDataDecode->background))
                        {
                            $element['value']['background'] = $menuTypeJsonDataDecode->background;
                        }
                    }

                 // For Tutorial

                    elseif($element['menu_type'] == 10)
                    {
                        $getTutorialMenuJsonData = Helpers::getTutorialMenuJsonData($menuTypeJsonDataDecode->css_string_json);
                        $element['css'] = $getTutorialMenuJsonData;

                        // if(isset($menuTypeJsonDataDecode->css_string_json))
                        // {
                        //     $element['value']['css_string_json'] = $menuTypeJsonDataDecode->css_string_json;
                        // }
                        if(isset($menuTypeJsonDataDecode->media_data))
                        {
                            $element['value']['media_data'] = $menuTypeJsonDataDecode->media_data;
                        }
                        if(isset($menuTypeJsonDataDecode->show_tutorial))
                        {
                            $element['value']['show_tutorial'] = $menuTypeJsonDataDecode->show_tutorial;
                        }
                    }
                }

                if(isset($menuTypeJsonDataDecode->image) && $menuTypeJsonDataDecode->image != null)
                {
                    //$element['image'] = Config::get('constant.IMAGES_JSON_PATH').$menuTypeJsonDataDecode->image;
                    $element['image'] = $menuTypeJsonDataDecode->image;
                }
                if(isset($menuTypeJsonDataDecode->web_url))
                {
                    $menuTypeJsonDataDecode->web_url = preg_replace('#^https?://|://|https?:#', '', $menuTypeJsonDataDecode->web_url);
                    $element['value'] = 'http://'.$menuTypeJsonDataDecode->web_url;
                }
                if(isset($menuTypeJsonDataDecode->video_url))
                {
                    $element['value'] = $menuTypeJsonDataDecode->video_url;
                }
                if(isset($menuTypeJsonDataDecode->feed_url))
                {
                    $menuTypeJsonDataDecode->feed_url = preg_replace('#^https?://#', '', $menuTypeJsonDataDecode->feed_url);
                    $element['value'] = 'http://'.$menuTypeJsonDataDecode->feed_url;
                }
                if(isset($menuTypeJsonDataDecode->pdfUrl))
                {
                    $element['value'] = $menuTypeJsonDataDecode->pdfUrl;
                }
                if(isset($menuTypeJsonDataDecode->url))
                {
                    $element['value'] = $menuTypeJsonDataDecode->url;
                }
                if(isset($menuTypeJsonDataDecode->menuTypeTutorialImages))
                {
                    $element['value'] = (!empty($menuTypeJsonDataDecode->menuTypeTutorialImages)) ? $menuTypeJsonDataDecode->menuTypeTutorialImages : '';
                }

                unset($elements['updated_at'], $elements['status']);
                unset($element['menu_name'], 
                  $element['is_parent'], 
                  $element['app_basic_id'], 
                  $element['order'], 
                  $element['menu_level'], 
                  $element['menu_type'], 
                  $element['menu_type_json_data'], 
                  $element['is_display_on_app'], 
                  $element['created_at'], 
                  $element['updated_at'], 
                  $element['status']);

                $children = $this->nLevelMenuFunction($element['id'], $elements);
                if ($children)
                {
                    $element['value'] = $children;
                }
                $branch[] = $element;
            }
        }

        return $branch;
    }

    public function getAppVersionData(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if($user)
        {
            $appVersionData = $this->AppRepository->getAppVersionData($body['appId']);
            $outputArray['status'] = 1;
            $outputArray['message'] = trans('appmessages.fetch_app_version');
            $outputArray['data'] = $appVersionData;
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function generateNewJSON(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if($user)
        {
            $this->AppRepository->getAppBasicDataUsingVersion($body);

            $appVersionData = $this->AppRepository->getAppBasicDataUsingVersion($body);

            if(!empty($appVersionData))
            {
                $appData = $appVersionData;

                //Prepare array to insert new version into app basic table
                $newData = array();
                $newData['app_unique_id'] = $appData->app_unique_id;
                $newData['app_name'] = $appData->app_name;
                $newData['app_code'] = $appData->app_code;
                $newData['app_json_data'] = $appData->app_json_data;
                $newData['menu_location_type'] = $appData->menu_location_type;
                $newData['version'] = $body['new_version'];
                $newData['app_publish_status'] = 1;
                $newData['app_general_css_json_data'] = $appData->app_general_css_json_data;
                $newData['app_side_menu_css_json_data'] = $appData->app_side_menu_css_json_data;
                $newData['app_created_by'] = $appData->app_created_by;
                $newData['app_updated_by'] = $appData->app_updated_by;
                $newData['status'] = 4;

                //Create new copy of app basic data
                $newCreatedId = $this->AppRepository->generateNewJsonVersion($newData,$basicData=array(),$menuData=array());
                $basicId = $newCreatedId;

                //Now copy data of basic info
                $singleAppData = $this->AppRepository->getSingleAppData($appData->id);
                $appBasicInfo = $singleAppData->getAllBasicDetailData;
                if(isset($appBasicInfo) && !empty($appBasicInfo))
                {
                   foreach($appBasicInfo as $key=>$value)
                   {
                       $basicInfo = [];
                       $basicInfo['app_basic_id'] = $basicId;
                       $basicInfo['app_section_id'] = $value->app_section_id;
                       $basicInfo['app_section_slug'] = $value->app_section_slug;
                       $basicInfo['section_json_data'] = $value->section_json_data;
                       $newCreatedId = $this->AppRepository->generateNewJsonVersion($newData=array(),$basicInfo,$menuData=array());
                   }
                }

                //Now copy data in app_assign table
                $oldAppId = $body['appId'];
                $appUsers = $this->objAppAssignUser->getUserByAppId($oldAppId);
                if(isset($appUsers) && count($appUsers) > 0)
                {
                    foreach($appUsers as $k1=>$userdata){
                        $createAssignUser = [];
                        $createAssignUser['app_basic_id'] = $basicId;
                        $createAssignUser['user_id'] = $userdata->user_id;
                        $createAssignUser['status'] = 1;
                        AppAssignUser::create($createAssignUser);
                    }
                }



                //Now copy data of menu items
                $appMenuData = $this->AppMenuRepository->getAllAppMenuData($appData->id);
                if(isset($appMenuData) && !empty($appMenuData))
                {
                   foreach($appMenuData as $key1=>$menu)
                   {
                       if($menu->is_parent == 0)
                       {
                            $menuData = [];
                            $menuData['is_parent'] = $menu->is_parent;
                            $menuData['app_basic_id'] = $basicId;
                            $menuData['menu_name'] = $menu->menu_name;
                            $menuData['menu_icon'] = $menu->menu_icon;
                            $menuData['order'] = $menu->order;
                            $menuData['menu_type'] = $menu->menu_type;
                            $menuData['menu_type_json_data'] = $menu->menu_type_json_data;
                            $menuData['is_display_on_app'] = $menu->is_display_on_app;
                            $menuData['status'] = $menu->status;
                            $newCreatedId = $this->AppRepository->generateNewJsonVersion($newData=array(),$basicInfo=array(),$menuData);

                            //check if sub menu exist for menu
                            $submenuData = $this->AppMenuRepository->getSubMenuForParent($menu->id,$newCreatedId,$basicId);
                        }

                   }
                }


                //get all version data
                $appVersionData = $this->AppRepository->getAppVersionData($body['appUniqId']);

                $outputArray['status'] = 1;
                $outputArray['message'] = trans('appmessages.new_version_generated_successfully');
                $outputArray['data'] = $appVersionData;
            }else{
                $outputArray['status'] = 0;
                $outputArray['message'] = 'Version Name already exist, Please enter different name';
            }
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function publishVersion(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if($user)
        {
            $appVersionData = $this->AppRepository->publishVersion($body);
            if(!empty($appVersionData))
            {
               $outputArray['status'] = 1;
               foreach ($appVersionData as $key => $value) {
                   # code...
                   if($value->status == 1 ){
                       $outputArray['message'] = trans('appmessages.new_version_published_successfully').' '.$value->version;
                    }
               }
              // $outputArray['message'] = trans('appmessages.new_version_published_successfully');
               $outputArray['data'] = $appVersionData;
            }else{
               $outputArray['status'] = 0;
               $outputArray['message'] = trans('appmessages.default_error_msg');
            }
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function uploadOnFTP($appCode,$versionName,$jsonFileName,$imageZipFileName = 'null')
    {

      $outputArray['status'] = 1;
      $outputArray['message'] = "Successfully created";
      return $outputArray;

       $ftp_server = Config::get('constant.FTP_SERVER');
       $ftp_user_name = Config::get('constant.FTP_USERNAME');
       $ftp_user_pass = Config::get('constant.FTP_PASSWORD');
       $ftp_folder = Config::get('constant.FTP_UPLOAD_FOLDER');

       // set up basic connection
       $conn_id = ftp_connect($ftp_server);
      
       if($conn_id === false){
        $outputArray['status'] = 0;
        $outputArray['message'] = "Ftp Connection Error.";
        return $outputArray;
       }

       // login with username and password
       $login_result = ftp_login($conn_id, $ftp_user_name, $ftp_user_pass);
       ftp_pasv($conn_id, true);

       //$file = public_path() . "/json/".$jsonFileName;

       $directory = $appCode;
       $path = "/".$ftp_folder;
       $appdirectoryname = $path.$directory;
      //  $appImagesdirectoryname = $path.$directory."/images";

       //now to create app_code directory $dir
       $appCodeDirectoryPath = 'ftp://'.$ftp_user_name.':'.$ftp_user_pass.'@'.$ftp_server.'/'.$ftp_folder;

       $appCodeDirectory_exists = is_dir($appCodeDirectoryPath.$directory);

       if(!$appCodeDirectory_exists)
       {
            if(ftp_mkdir($conn_id, $appdirectoryname))
            {
                // ftp_mkdir($conn_id, $appImagesdirectoryname);
                $outputArray['status'] = 1;
                $outputArray['message'] = "Successfully created $appdirectoryname";
            }
            else
            {
                $outputArray['status'] = 0;
                $outputArray['message'] = "Error while creating $appdirectoryname";
                return $outputArray;
            }
       }


      //  $appCodeDirectoryImage_exists = is_dir($appCodeDirectoryPath.$directory."/images");
      //  if(!$appCodeDirectoryImage_exists)
      //  {
      //       ftp_mkdir($conn_id, $appImagesdirectoryname);
      //  }

       //Now create version folder within APP folder
       $versionDirectory = $versionName;
       $path2 = "/".$ftp_folder.$appCode;
       $versionDirectoryName = $path2."/".$versionDirectory;

      //  $versionImagesdirectoryname = $versionDirectoryName."/images";

       $versionDirectoryPath = 'ftp://'.$ftp_user_name.':'.$ftp_user_pass.'@'.$ftp_server.'/'.$ftp_folder.$appCode;

       $versionDirectory_exists = is_dir($versionDirectoryPath.'/'.$versionDirectory);

       if(!$versionDirectory_exists)
       {
            if(ftp_mkdir($conn_id, $versionDirectoryName))
            {
                // ftp_mkdir($conn_id, $versionImagesdirectoryname);
                $outputArray['status'] = 1;
                $outputArray['message'] = "Successfully created $versionDirectoryName";
            }
            else
            {
                $outputArray['status'] = 0;
                $outputArray['message'] = "Error while creating $versionDirectoryName";
                return $outputArray;
            }
       }

      //  $versionDirectoryImage_exists = is_dir($versionDirectoryPath.'/'.$versionDirectory."/images");
      //  if(!$versionDirectoryImage_exists)
      //  {
      //       ftp_mkdir($conn_id, $versionImagesdirectoryname);
      //  }

        $sourceJsonFile = public_path()."/json/".$appCode."/".$versionName."/".$jsonFileName;
        // $sourceImageFolder = public_path()."/json/".$appCode."/".$versionName."/".$imageZipFileName;

       //Extract images folder
      //  $zipper = new \Chumper\Zipper\Zipper;
      //  $extractFolderName = "images";
      //  $zipper->make(public_path()."/json/".$appCode."/".$versionName."/".$imageZipFileName)->extractTo(public_path() . "/json/".$appCode."/".$versionName."/".$extractFolderName);

      //  $zipper->close();
      // $extractImagesFolder = public_path()."/json/".$appCode."/".$versionName."/".$extractFolderName;


        $remoteAppJsonFile = $appdirectoryname."/".$jsonFileName;
        $remoteVersionJsonFile = $versionDirectoryName."/".$jsonFileName;

        $sourceLanguageFile = public_path()."/json/language.json";

        // copy a json a file
        if(ftp_put($conn_id, $remoteAppJsonFile, $sourceJsonFile, FTP_ASCII))
        {
            ftp_put($conn_id, $remoteVersionJsonFile, $sourceJsonFile, FTP_ASCII);

            //Copy language json file
            ftp_put($conn_id, $appdirectoryname."/language.json", $sourceLanguageFile, FTP_ASCII);
            ftp_put($conn_id, $versionDirectoryName."/language.json", $sourceLanguageFile, FTP_ASCII);

            $outputArray['status'] = 1;
            $outputArray['message'] = "successfully uploaded $jsonFileName";
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = "There was a problem while uploading $jsonFileName\n";
            return $outputArray;
        }


        //Now copy a images on FTP
        // $d = dir($extractImagesFolder);
        // error_log($extractImagesFolder);
        // while($file = $d->read())
        // {
        //     error_log($file);
        //     // do this for each file in the directory
        //     if ($file != "." && $file != "..") { // to prevent an infinite loop
        //         $upload = ftp_put($conn_id, $appdirectoryname."/images/".$file, $extractImagesFolder."/".$file, FTP_BINARY); // put the images files in app directory
        //         $upload = ftp_put($conn_id, $versionDirectoryName."/images/".$file, $extractImagesFolder."/".$file, FTP_BINARY); // put the images files in app directory
        //     }
        // }
        //$d->close();

        // close the connection
        ftp_close($conn_id);
        if($outputArray['status'] == 1)
        {
            $outputArray['status'] = 1;
            $outputArray['message'] = "uploadOnFTP successfully";
        }

     // return response()->json($outputArray);
        return $outputArray;
        exit;
    }


    /////////////
    //      Publish App init
    /////////////
    public function publishAppInit(Request $req)
    {
        # code...
        $user = JWTAuth::parseToken()->authenticate();
        $body = $req->all();

        $checkMiddleware = $this->middlewareRequiredInfo($body);

        if(empty($checkMiddleware))
        {
            $jsonData = $this->FastGenerateJsonData($req);

            $jsonFileName = $jsonData->original['jsonFileName'];
            // $imageZipFileName = $jsonData->original['imageZipFileName'];

            $outputArray = array();

            $appId = (integer)$body['id'];
            $fName = $body['first_name'];
            $lName = $body['last_name'];
            $Email = $body['email'];

            $admin_data = DB::table('super_admin_setting')->where('status', 1)->first();
            

            if( $admin_data ){
                $admin_mail = json_decode($admin_data->app_super_admin_json_data)->email;                                
            }            

            $expand_mail = "";
            if(isset($admin_mail)){
                $expand_mail = explode(',',$admin_mail);
            }            

            $app_data = $this->AppRepository->getSingleAppData($appId);            
            
            if( $app_data ){
                $app_name = $app_data->app_name;
                $app_version = $app_data->version;
            }

            $passArr = [
                'first_name'=>$fName,
                'last_name'=>$lName,
                'email'=>$Email,
                'admin_mail'=>$expand_mail,
                'app_name'=>$app_name,
                'app_version'=>$app_version,
                'pseudo_name'=>Config::get('constant.APP_PUBLISH'),
                'content' => $app_name . " has been published.",
                'subject' => "App Publish"
            ];
            
            //Upload data on FTP server
            // $getUploadFtpData = $this->uploadOnFTP($app_data->app_code,$app_data->version,$jsonFileName,$imageZipFileName);
            $getUploadFtpData = $this->uploadOnFTP($app_data->app_code,$app_data->version,$jsonFileName);
            
            if($getUploadFtpData && $getUploadFtpData['status'] == 1)
            {
                // if app publish for first time
                // if(isset($app_data) && $app_data->app_publish_counter == 0){

                    // $addEmailData['et_name']        = $user['email'];
                    // $addEmailData['et_subject']     = $app_name." has been published.";
                    // $addEmailData['et_body']        = "New App has been first published.";
                    // $addEmailData['status']         = 1;
                    // $addEmailData['readable']       = 0;
                    // $addEmailData['et_pseudo_name'] = "";

                    // $assignUser = $this->AppAssignUserRepository->getUserByAppId($appId);
                    // foreach ($assignUser as $key => $value) {
                    //     # code...
                    //     $userEmail = $this->UserRepository->getUserNameById($value['user_id']);//mistake getUserNameById=>get user email, first_name and last_name

                    //     $delimiter = '_';
                    //     $et_pseudo_name_slug = strtolower(trim(preg_replace('/[\s-]+/', $delimiter, preg_replace('/[^A-Za-z0-9-]+/', $delimiter, preg_replace('/[&]/', 'and', preg_replace('/[\']/', '', iconv('UTF-8', 'ASCII//TRANSLIT', $userEmail['email']))))), $delimiter));

                    //     $addEmailData['et_pseudo_name'] = $addEmailData['et_pseudo_name'] . $et_pseudo_name_slug . ", ";
                    // }

                    // $this->EmailTemplateRepository->addEmailTamplate($addEmailData);

                    // send mail to admin
                    $handleSendMail = $this->sendMail($passArr);
                    $outputArray['handleSendMail'] = $handleSendMail;
                // }
                // else
                // {
                //     // do somthing if not publish for first time
                // }


                // sending app update counter
                $handlePublishCount = $this->incrementPublishCounter($appId);
                $handleUpdateAppData = $this->AppRepository->getSingleAppData($appId);

                $handleUpdateArr = (object)['publish_counter' => $handleUpdateAppData->app_publish_counter,
                 'publish_status' => $handleUpdateAppData->app_publish_status];

                 // for setting app publish status if counter is 1
                 if($handleUpdateAppData->app_publish_counter == 1) {
                    // update status
                    $handlePublish =  $this->setAppPublishStatus($appId,2);
                    $outputArray['handlePublish'] = $handlePublish;
                }

        //      if(isset($handlePublish['update_status'])) {
        //
        //          // Upload data on FTP server
        //            $this->uploadOnFTP($app_data->app_code,$app_data->version,$jsonFileName,$imageZipFileName);
        //            $handleSendMail = $this->sendMail($passArr);
        //         }
        //         else{
        //            $handleSendMail = 'something Wrong happen';
        //         }


                // prepare res upload ftp result
                $outputArray['uploadFtpData'] = $getUploadFtpData;
                // prepare res app publish counter
                $outputArray['handlePublishCount'] = $handlePublishCount;
                // prepare res app update result contain counter and publish status of app
                $outputArray['handleUpdateAppData'] = $handleUpdateArr;

                return response()->json(['body' => $outputArray]);
            }
            else
            {
                $outputArray['status'] = 0;
                $outputArray['message'] = trans('appmessages.default_error_msg');
                return response()->json($outputArray, 500);
            }
        }
        else
        {
            return response()->json(['body'=>$checkMiddleware]);
        }
        // set publish status
    }


    public function changeAppPublishStatus(Request $var)
    {
        $user = JWTAuth::parseToken()->authenticate();
        # code...
        $body = $var->all();
        $app_id = $body['id'];
        $status = $body ['status'];
        $app_name = $body['app_name'];
        $app_version = $body['app_version'];
        $strStatus = ['Work in Progress', 'Processing', 'Published', 'Inactive'];
        $admin_mail = "";
        $expand_mail = "";

        $admin_data = DB::table('super_admin_setting')->where('status', 1)->first();

        if( $admin_data ){
            $admin_mail = json_decode($admin_data->app_super_admin_json_data)->email;
        }

        if(isset($admin_mail)){
            $expand_mail = explode(',',$admin_mail);
        }
        

        $changeStatus = $this->setAppPublishStatus($app_id,$status);

        $currentPublishStatus = $this->AppRepository->getSingleAppData($app_id);

        $handleUpdateArr = (object)['publish_counter' => $currentPublishStatus->app_publish_counter, 'publish_status' => $currentPublishStatus->app_publish_status];

        if($changeStatus['update_status'] === 1){
            //gjc 0407
            // $addEmailData['et_name']        = "status_mail";
            // $addEmailData['et_subject']     = $app_name." has been changed";
            // $addEmailData['et_body']        = "Status has been changed to ".$strStatus[$status - 1];
            // $addEmailData['status']         = 1;
            // $addEmailData['readable']       = 0;
            // $addEmailData['et_pseudo_name'] = "";

            // $assignUser = $this->AppAssignUserRepository->getUserByAppId($app_id);
            // foreach ($assignUser as $key => $value) {
            //     # code...
            //     $userEmail = $this->UserRepository->getUserNameById($value['user_id']);//mistake getUserNameById=>get user email, first_name and last_name

            //     $delimiter = '_';
            //     $et_pseudo_name_slug = strtolower(trim(preg_replace('/[\s-]+/', $delimiter, preg_replace('/[^A-Za-z0-9-]+/', $delimiter, preg_replace('/[&]/', 'and', preg_replace('/[\']/', '', iconv('UTF-8', 'ASCII//TRANSLIT', $userEmail['email']))))), $delimiter));
                
            //     $addEmailData['et_pseudo_name'] = $addEmailData['et_pseudo_name'] . $et_pseudo_name_slug . ", ";

                // $passArr = [
                //     'first_name'=>$userEmail['first_name'],
                //     'last_name'=>$userEmail['last_name'],
                //     'email'=>$userEmail['eamil'],
                //     'admin_mail'=>$expand_mail,
                //     'app_name'=>$app_name,
                //     'app_version'=>$app_version,
                //     'pseudo_name'=>$et_pseudo_name_slug,
                //     'content' => $addEmailData['et_body'],
                //     'subject' => $addEmailData['et_subject']
                // ];

                // $handleSendMail = $this->sendMail($passArr);
            // }

            // $this->EmailTemplateRepository->addEmailTamplate($addEmailData);

            $passArr = [
                'first_name'=>$user['first_name'],
                'last_name'=>$user['last_name'],
                'email'=>$user['eamil'],
                'admin_mail'=>$expand_mail,
                'app_name'=>$app_name,
                'app_version'=>$app_version,
                'pseudo_name'=>Config::get('constant.APP_PUBLISH'),
                'content' => $app_name . "status has been changed to " . $strStatus[$status - 1],
                'subject' => $app_name . " has been status changed."
            ];

            $handleSendMail = $this->sendMail($passArr);
            
            return response()->json(['data'=>$changeStatus, 'app_json' => $handleUpdateArr]);
        } else{
            return response()->json(['data'=>['update_status' => 0], 'app_json' => $handleUpdateArr]);
        }
    }
     /**
     * todo retrive super admin status and email id and set app publsish status
     * @var $var mix type,$appPStatus number type to set status
     * @return $outputArray array that contain all db query result and reponse
     */
    private function incrementPublishCounter($appID)
    {
        # code...
        $outputArray = array();

        // fetch current app_publish_counter value
        $getCurrentPublishCount = AppBasic::where('id', $appID)->select('app_publish_counter')->first();

        try{
            $counter = $getCurrentPublishCount->app_publish_counter + 1;
            $incrementCount = AppBasic::where('id', $appID)
                            ->update(['app_publish_counter' => $counter]);
        }
        catch(Exception  $e){
            throw $e;
        }

        if($incrementCount){
            $outputArray['update_status'] = $incrementCount;
            return $outputArray;
        }

    }
    /**
     * todo retrive super admin status and email id and set app publish status
     * @var $var mix type,$appPStatus number type to set status
     * @return $outputArray array that contain all db query result and reponse
     */
    private function setAppPublishStatus($appID,$appPStatus)
    {
        # code...
        $outputArray = array();

        try{
        $updatePublishStatus = DB::table('app_basic')
                ->where('id', $appID)
                ->update(['app_publish_status' => $appPStatus]);
        }
        catch(Exception  $e){
            throw $e;
        }

        if($updatePublishStatus){

            $outputArray['update_status'] = $updatePublishStatus;

            return $outputArray;
        }

    }
      /**
     * todo send mail to super admin
     * @var $data mix  object type
     * @return $outputArray array that contain mail reponse
     */
    private function sendMail($data)
    {
        // $emailTemplateContent = $this->EmailTemplateRepository->getEmailTemplateDataByName(Config::get('constant.APP_PUBLISH'));
        // $emailTemplateContent = $this->EmailTemplateRepository->getEmailTemplateDataByName($data['pseudo_name']);

        // if($emailTemplateContent)
        // {
            $user_name = $data['first_name'].' '.$data['last_name'];
            $user_app_name = $data['app_name'];
            $user_app_version = $data['app_version'];
            $user_email = $data['email'];
            $toEmail = $data['admin_mail'];
            // declare local array
            $dataT = array();
            $replaceArray = array();

            $replaceArray['toUser'] = $user_name;
            $replaceArray['toEmail'] = $user_email;
            $replaceArray['toApp'] = $user_app_name;
            $replaceArray['toVersion'] = $user_app_version;

            // $content = $this->EmailTemplateRepository->getEmailContent($emailTemplateContent->et_body, $replaceArray);
            $content = $data['content'];

            // $dataT['subject'] = $emailTemplateContent->et_subject;
            $dataT['subject'] = $data['subject'];
            $dataT['toEmail'] = $toEmail;
            $dataT['toName'] = $toEmail;
            $dataT['content'] = $content;

            if($dataT)
            {
                try
                {
                    Mail::send(['html' => 'emails.Template'], $dataT, function($message) use ($dataT) {
                      $message->subject($dataT['subject']);
                      $message->to($dataT['toEmail'], $dataT['toName']);
                    });

                } catch(\Exception $e){
                    $outputArray['status'] = '0';
                    $outputArray['message'] = trans($e->getMessage());
                }

                $outputArray['status'] = '1';
                $outputArray['message'] = trans('Mail Sent Successfully');
            }
        // }
        // else
        // {
        //     $outputArray['status'] = '0';
        //     $outputArray['message'] = trans('Mail Template Wont found');
        // }
        return $outputArray;
    }
    /**
    * todo send mail to super admin
    * @var $req Request type
    * @return $fillArr array that contain validation response message
    */
    private function middlewareRequiredInfo($req)
    {
        # code...
        if(is_array($req))
        {
            $appId = (integer)$req['id'];
            $fillArr = [];

            $appData = $this->AppRepository->getSingleAppData($appId);
            $appMenuData = count($this->objAppMenu->getMenuDetailsByAppid($appId));

            $appBasicInfo = $appData->getAllBasicDetailData;

            // return response()->json(['appdata' => $appData, 'app_basic_info' => $appBasicInfo, 'appmenudata' => $appMenuData]);
            if(isset($appBasicInfo) && !empty($appBasicInfo))
            {
                foreach ($appBasicInfo as $key => $value)
                {
                    # code...
                    switch ($value->app_section_slug)
                    {
                        case 'splash_screen':
                            # code...
                            if($value->section_json_data == null)
                            {
                                $fillArr['basic_info_required'][$value->app_section_slug] = 'Splash Screen (Settings)';
                            }
                            break;
                        case 'app_icon':
                            #code
                            if($value->section_json_data == null) {
                                $fillArr['basic_info_required'][$value->app_section_slug] = 'App Icon (Settings)';
                            }
                            break;
                        case 'basic_information':
                            #code
                            if($value->section_json_data == null) {
                                $fillArr['basic_info_required'][$value->app_section_slug] = 'Basic Information (Settings)';
                            }
                            break;
                        case 'add_screenshot':
                            #code
                            if($value->section_json_data == null) {
                                $fillArr['basic_info_required'][$value->app_section_slug] = 'Screenshots (Settings)';
                            }
                            break;
                        default:
                            # code

                            break;
                   }
               }
            }
            if(empty($appBasicInfo)){

                $fillArr['basic_info_required'] = 'Basic Information (Settings)';

            }
            if($appMenuData == 0) {

                $fillArr['menu_required'] = 'At Least One Menu Item (Menu)';
            }
            return $fillArr;
        }
        return false;
    }

}
