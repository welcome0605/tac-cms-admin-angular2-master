<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Auth;
use Helpers;
use Config;
use Image;
use File;
use Illuminate\Support\Facades\Input;
use JWTAuth;
use JWTAuthException;
use App\AppMenuType;
use App\AppCss;
use Log;

use App\Services\AppMenu\Contracts\AppMenuRepository;
use App\Services\App\Contracts\AppRepository;

const IMAGE_MENU = 1;
const SINGLE_VIDEO_MENU = 2;
const YOUTUBE_VIDEO_MENU = 3;
const LIST_MENU = 4;
const RSS_FEED_MENU = 5;
const NOTIFICATION_MENU = 6;
const PICASA_ALBUM_MENU_CSS = 7;
const PDF_MENU = 8;
const WEB_VIEW_MENU = 9;
const TUTORIAL_MENU_CSS = 10;
const CONTACT_FORM_BUILDER = 11;
const CONTENT_EDITOR = 12;
const REWARDS_MENU = 13;

class AppMenuController extends Controller {

    public function __construct(AppMenuRepository $AppMenuRepository,AppRepository $AppRepository)
    {
        $this->middleware('jwt.auth', ['except' => ['getMenuTypeJsonData', 'getMenuTypeSmartJsonData']]);
        $this->AppMenuRepository = $AppMenuRepository;
        $this->AppRepository = $AppRepository;
        $this->objAppCss = new AppCss();
        $this->objAppMenuType = new AppMenuType();

        $this->appIconOriginalImageUploadPath = Config::get('constant.appIconOriginalImageUploadPath');
        $this->appIconThumbImageUploadPath = Config::get('constant.appIconThumbImageUploadPath');
        $this->appIconThumbImageWidth = Config::get('constant.appIconThumbImageWidth');
        $this->appIconThumbImageHeight = Config::get('constant.appIconThumbImageHeight');

        $this->menuIconOriginalImageUploadPath = Config::get('constant.menuIconOriginalImageUploadPath');
        $this->menuIconThumbImageUploadPath = Config::get('constant.menuIconThumbImageUploadPath');
        $this->menuIconThumbImageWidth = Config::get('constant.menuIconThumbImageWidth');
        $this->menuIconThumbImageHeight = Config::get('constant.menuIconThumbImageHeight');

        $this->menuTypeMenuOriginalImageUploadPath = Config::get('constant.menuTypeMenuOriginalImageUploadPath');
        $this->menuTypeMenuThumbImageUploadPath = Config::get('constant.menuTypeMenuThumbImageUploadPath');
        $this->menuTypeMenuThumbImageWidth = Config::get('constant.menuTypeMenuThumbImageWidth');
        $this->menuTypeMenuThumbImageHeight = Config::get('constant.menuTypeMenuThumbImageHeight');

        $this->menuTypeTutorialOriginalImageUploadPath = Config::get('constant.menuTypeTutorialOriginalImageUploadPath');
        $this->menuTypeTutorialThumbImageUploadPath = Config::get('constant.menuTypeTutorialThumbImageUploadPath');
        $this->menuTypeTutorialThumbImageWidth = Config::get('constant.menuTypeTutorialThumbImageWidth');
        $this->menuTypeTutorialImageHeight = Config::get('constant.menuTypeTutorialImageHeight');

        $this->menuPdfUploadPath = Config::get('constant.menuPdfUploadPath');

    }

    public function index(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();

        if($user)
        {
            $appId = $body['app_basic_id'];
            $appMenuData = $this->AppMenuRepository->getAllAppMenuData($appId);

            if($appMenuData && count($appMenuData) > 0)
            {
                $parent = 0;
                $testNLevel = $this->nLevelMenuFunction($parent, $appMenuData->toArray());
                $outputArray['data'] = $testNLevel;
                $outputArray['status'] = 1;
                $outputArray['message'] = trans('appmessages.getallmenudata');
            }
            else
            {
                $outputArray['status'] = 1;
                $outputArray['data'] = [];
                $outputArray['message'] = trans('appmessages.norecordfound');
            }
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
        foreach ($elements as $key => $element)
        {
            $element = (array)$element;
            // if( $element['menu_icon'] != null)
            // {
            //     $menu_icon_thumb_url = $element['menu_icon'];
            //     $menu_icon_original_url = $element['menu_icon'];
            //     $app_existing_img_name = $element['menu_icon'];
            // }
            // else
            // {
            //     $menu_icon_thumb_url = url($this->menuIconThumbImageUploadPath.'default.png');
            //     $menu_icon_original_url = url($this->menuIconOriginalImageUploadPath.'default.png');
            //     $app_existing_img_name = 'default.png';
            // }

            $element['menu_type_icon'] = $element['menu_type_icon'];
            $element['menu_type_icon_name'] = $element['name'];

            // $element['app_existing_img_name'] = $app_existing_img_name;
            $element['app_default_icon_thumb_url'] = url($this->menuIconThumbImageUploadPath.'default.png');
            // $element['app_default_icon_original_url'] = $menu_icon_original_url;

            if ($element['is_parent'] == $parentId)
            {
                $children = $this->nLevelMenuFunction($element['id'], $elements);
                if ($children)
                {
                    $element['children'] = $children;
                }
                $branch[] = $element;
            }
        }
        return $branch;
    }

    public function saveAppMenu(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();

        if($user)
        {
            $menu_name = $body['menu_name'];
            $menu_type = $body['menu_type'];
            $app_basic_id = $body['app_basic_id'];
            $is_parent = $body['is_parent'];
            $getAppCssData = null;
            $getAppCssJsonData = null;
            $appCssSlug = '';
            $menuTypeJsonArray = [];

            if(!empty($menu_type))
            {
                $data = $this->objAppMenuType->getMenuTypeSlugById($menu_type);
                $getMenuTypeSlug = $data['data'];
                $getMenuTypeSlugLen = $data['length'];

                $menuTypeSlugName = ($getMenuTypeSlugLen > 0 && !empty($getMenuTypeSlug->slug) ) ? $getMenuTypeSlug->slug : '';
                $appCssSlug = $this->getAppCssSlugByMenuType($menu_type);
                $i = 0;

                if($menu_type == 1)
                {
                    $menuTypeJsonArray['duration'] = '6';
                    $menuTypeJsonArray['from'] = '1.3';
                    $menuTypeJsonArray['to'] = '1';
                }
                if($menu_type == 3 || $menu_type == 2)
                {
                    $menuTypeJsonArray['video_url'] = '';
                }
                if($menu_type == 4)
                {
                    $menuTypeJsonArray['show_child_on'] = '1';
                }
                if($menu_type == 6)
                {
                  $menuTypeJsonArray['notification_text_fields'] = [];
                  
                  $menuTypeJsonArray['notification_text_fields'][0] = json_decode('{"title":"Message", "is_allow":1}');
                  $menuTypeJsonArray['notification_text_fields'][1] = json_decode('{"title":"Sound", "is_allow":1}');
                }

                if($menu_type == 5)
                {
                    $menuTypeJsonArray['notification_text_fields'] = [];
                    $menuTypeJsonArray['notification_text_fields'][$i]['add_text_field'] = '';
                }

                if($menu_type == 7)
                {
                    $menuTypeJsonArray['notification_text_fields'] = [];
                    $menuTypeJsonArray['notification_text_fields'][$i]['add_text_field'] = '';
                }

                if($menu_type == 10)
                {
                    $menuTypeJsonArray['show_tutorial'] = '';
                    $menuTypeJsonArray['media_data'] = [];
                    $menuTypeJsonArray['media_data'][$i]['url'] = '';
                    $menuTypeJsonArray['media_data'][$i]['type'] = 1; // image
                }

                if ($menu_type == 11) // add recipients for contact
                {
                    $menuTypeJsonArray['recipients_string_json'] = $body['current_user'];
                }
            }

            if(!empty($appCssSlug))
            {
                $data = $this->objAppCss->getAppCssBySlug($appCssSlug);
                $getAppCssData = $data['data'];
                $getAppCssDataLen = $data['length'];
                
                if($getAppCssDataLen > 0 && !empty($getAppCssData) && isset($getAppCssData->css_properties) && !empty($getAppCssData->css_properties))
                {
                    if($menu_type == 11) // Contact
                    {
                        $getAppCssJsonData = $getAppCssData->css_properties;
                    } else {
                        $getAppCssJsonData = json_decode($getAppCssData->css_properties);
                    }
                }
            }

            //          menu_type_json_data Json Set here

            $menuTypeJsonArray['type'] = (isset($menuTypeSlugName) && !empty($menuTypeSlugName)) ? $menuTypeSlugName : '';

            if(!empty($getAppCssJsonData))
            {
                $menuTypeJsonArray['css_string_json'] = $getAppCssJsonData;
            }
            else
            {
                $menuTypeJsonArray['css_string_json'] = '';
            }

            if($is_parent == 0)
            {
                $menu_level = 1;
            }
            else
            {
                $menu_level = 2;
            }

            $order = 1;
            $maxorder = $this->AppMenuRepository->getOrder($app_basic_id, $is_parent);
            if($maxorder)
            {
                $order = $maxorder->order + 1;
            }

            $menuTypeJsonData = json_encode($menuTypeJsonArray);

            $insertData['menu_name'] = $menu_name;
            $insertData['menu_type'] = $menu_type;
            $insertData['app_basic_id'] = $app_basic_id;
            $insertData['is_parent'] = $is_parent;
            $insertData['menu_level'] = $menu_level;
            $insertData['menu_type_json_data'] = $menuTypeJsonData;
            $insertData['order'] = $order;
            $outputArray['details'] = $this->AppMenuRepository->saveAppMenuData($insertData);

            $outputArray['status'] = '1';
            $outputArray['message'] = trans('appmessages.app_menu_created_msg');
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function getAppCssSlugByMenuType($menu_type)
    {
        if($menu_type == 1)
        {
            $appCssSlug = 'image_menu_css';
        }
        elseif($menu_type == 2)
        {
            $appCssSlug = 'single_video_menu_css';
        }
        elseif($menu_type == 3)
        {
            $appCssSlug = 'youtube_video_menu_css';
        }
        elseif($menu_type == 4)
        {
            $appCssSlug = 'list_menu_css';
        }
        elseif($menu_type == 5)
        {
            $appCssSlug = 'rss_feed_menu_css';
        }
        elseif($menu_type == 6)
        {
            $appCssSlug = 'notification_menu_css';
        }
        elseif($menu_type == 7)
        {
            $appCssSlug = 'picasa_album_menu_css';
        }
        elseif($menu_type == 10)
        {
            $appCssSlug = 'tutorial_menu_css';
        }
        elseif($menu_type == 11) // Contact Form
        {
            $appCssSlug = 'contact_menu_css';
        }
        else
        {
            $appCssSlug = null;
        }
        return $appCssSlug;
    }

    public function deleteAppMenu(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $body = $request->all();
        if($user)
        {
            $id = $body['id'];
            $app_basic_id = $body['app_basic_id'];
            $order = $body['order'];
            $is_parent = $body['is_parent'];
            $insertData['id'] = $id;
            $insertData['status'] = 2;
            $Detail = $this->AppMenuRepository->saveAppMenuData($insertData);

            $Detail = $this->AppMenuRepository->updateOrder($app_basic_id, $is_parent, $order);

            $outputArray['status'] = '1';
            $outputArray['message'] = trans('appmessages.delete_app_menu_msg');
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function getMenuTypeJsonData($id)
    {
        $appMenuData = $this->AppMenuRepository->getIndividualMenuTypeData($id);
        $response['status'] = 1;
        $response['menu_type_json_data'] = $appMenuData->menu_type_json_data;

        return response()->json($response);
    }

    public function getMenuTypeSmartJsonData($id)
    {
        $appMenuData = $this->AppMenuRepository->getIndividualMenuTypeData($id);
        $response['status'] = 1;
        $menu_type_json_data_array = json_decode($appMenuData->menu_type_json_data, true);
        $menu_type_json_data_array['css_string_json'] = json_decode($menu_type_json_data_array['css_string_json']);
        if(isset($menu_type_json_data_array['recipients_string_json']))
        {
           $menu_type_json_data_array['recipients_string_json'] = json_decode($menu_type_json_data_array['recipients_string_json']);
        }
        $response['menu_type_json_data'] = $menu_type_json_data_array;

        return response()->json($response);
    }

    public function getAllAppMenuTypeData(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();

        if($user)
        {
            $appId = $body['app_basic_id'];
            $appMenuData = $this->AppMenuRepository->getAllAppMenuTypeData();

            $response['status'] = 1;
            $response['message'] = trans('appmessages.getallmenutypedata');
            $response['data'] = [];
            $i = 0;

            foreach ($appMenuData as $key => $value)
            {
                $response['data'][$i]['appId'] = $appId;
                $response['data'][$i]['menuTypeId'] = $value->id;
                $response['data'][$i]['menuTypeName'] = $value->name;
                $response['data'][$i]['menuTypeSlug'] = $value->slug;
                $response['data'][$i]['menuTypeIcon'] = $value->menu_type_icon;
                $i++;
            }
        }
        else
        {
            $response['status'] = 0;
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }

    public function updateMenuTypeData(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $mainMenuData = '';
        
        if(isset($body['mainMenuData']))
        {
           $mainMenuData = json_decode($body['mainMenuData']);
        }

        if($user && !empty($mainMenuData))
        {
            $menu_id = $mainMenuData->menu_id;
            $app_basic_id = $mainMenuData->app_basic_id;
            $is_parent = $mainMenuData->is_parent;
            $menu_name = $mainMenuData->menu_text;
            $selct_menu_type = $mainMenuData->selct_menu_type;
            $select_menu_slug = $mainMenuData->select_menu_slug;
            $jsonArray = [];
            $jsonEncodeData = '';
            $cssStringArray = '';
            $tutorial_add_more_array = '';

            if(isset($body['image_upload']))
            {
                $fileName = ($body['image_upload'] != null) ? $body['image_upload'] : null;
            }

            if(isset($fileName) && !empty($fileName) && $fileName != null)
            {
                $jsonArray['image'] = $fileName;
            }

            if($selct_menu_type == IMAGE_MENU) // image_menu
            {
                if(isset($body['css_string_json']) && $body['css_string_json'] != 'undefined' && $body['css_string_json'] != '')
                {
                    $cssStringArray = json_decode($body['css_string_json']);
                }
                $jsonArray['type'] = $select_menu_slug;
                
                $jsonArray['duration'] = isset($body['duration']) ? $body['duration'] : '';
                $jsonArray['from'] = isset($body['from']) ? $body['from'] : '';
                $jsonArray['to'] = isset($body['to']) ? $body['to'] : '';
                $jsonArray['css_string_json'] = $cssStringArray;
                $jsonEncodeData = json_encode($jsonArray);
            }
            elseif($selct_menu_type == SINGLE_VIDEO_MENU) //single_video_menu
            {
                if(isset($body['css_string_json']) && $body['css_string_json'] != 'undefined' && $body['css_string_json'] != '')
                {
                    $cssStringArray = json_decode($body['css_string_json']);
                }

                $jsonArray['type'] = $select_menu_slug;
                
                $jsonArray['video_url'] = isset($body['video_url'])?$body['video_url']:'';
                $jsonArray['css_string_json'] = $cssStringArray;
                $jsonEncodeData = json_encode($jsonArray);

            }
            elseif($selct_menu_type == YOUTUBE_VIDEO_MENU) // youtube_video_menu
            {
                if(isset($body['css_string_json']) && $body['css_string_json'] != 'undefined' && $body['css_string_json'] != '')
                {
                    $cssStringArray = json_decode($body['css_string_json']);
                }
                $jsonArray['type'] = $select_menu_slug;
                
                $jsonArray['video_url'] = isset($body['video_url'])?$body['video_url']:'';
                $jsonArray['css_string_json'] = $cssStringArray;

                $jsonEncodeData = json_encode($jsonArray);

            }
            elseif($selct_menu_type == LIST_MENU) // list_menu
            {
                if(isset($body['css_string_json']) && $body['css_string_json'] != 'undefined' && $body['css_string_json'] != '')
                {
                    $cssStringArray = json_decode($body['css_string_json']);
                }
                $jsonArray['type'] = $select_menu_slug;
                
                $jsonArray['show_child_on'] = isset($body['show_child_on']) ? $body['show_child_on'] : 0;
                $jsonArray['css_string_json'] = $cssStringArray;

                $jsonEncodeData = json_encode($jsonArray);
            }
            elseif($selct_menu_type == RSS_FEED_MENU) // rss_feed_menu
            {
                if(isset($body['css_string_json']) && $body['css_string_json'] != 'undefined' && $body['css_string_json'] != '')
                {
                    $cssStringArray = json_decode($body['css_string_json']);
                }
                $jsonArray['type'] = $select_menu_slug;
                
                $jsonArray['feed_url'] = isset($body['feed_url'])?$body['feed_url']:'';
                $jsonArray['css_string_json'] = $cssStringArray;

                $jsonEncodeData = json_encode($jsonArray);
            }
            elseif($selct_menu_type == NOTIFICATION_MENU) // notification_menu
            {
                if(isset($body['css_string_json']) && $body['css_string_json'] != 'undefined' && $body['css_string_json'] != '')
                {
                    $cssStringArray = json_decode($body['css_string_json']);
                }

                $jsonArray['type'] = $select_menu_slug;
                
                $jsonArray['css_string_json'] = $cssStringArray;

                if(isset($body['notification_text_fields']) && $body['notification_text_fields'] != 'undefined' && $body['notification_text_fields'] != '')
                {
                    $notification_add_more_array = json_decode($body['notification_text_fields']);
                }

                $jsonArray['notification_text_fields'] = (isset($notification_add_more_array) && !empty($notification_add_more_array)) ? $notification_add_more_array : '';

                $jsonEncodeData = json_encode($jsonArray);

            }
            elseif($selct_menu_type == PICASA_ALBUM_MENU_CSS) // picasa_album_menu_css
            {
                if(isset($body['css_string_json']) && $body['css_string_json'] != 'undefined' && $body['css_string_json'] != '')
                {
                    $cssStringArray = json_decode($body['css_string_json']);
                }

                $jsonArray['type'] = $select_menu_slug;
                
                // $jsonArray['google_key'] = $body['google_key'];
                // $jsonArray['album_id'] = $body['album_id'];
                // $jsonArray['user_id'] = $body['user_id'];
                $jsonArray['album_url'] = $body['album_url'];
                $jsonArray['complete_album_url'] = $body['complete_album_url'];
                $jsonArray['selected_complete_album_url'] = $body['selected_complete_album_url'];
                $jsonArray['caption_check'] = $body['caption_check'];
                $jsonArray['css_string_json'] = $cssStringArray;

                $jsonEncodeData = json_encode($jsonArray);
            }
            elseif($selct_menu_type == PDF_MENU) // pdf_menu
            {
                if (Input::file('pdfUrlData'))
                {
                    $file = Input::file('pdfUrlData');
                    if (!empty($file))
                    {
                        // $ext = $file->getClientOriginalExtension();
                        $ext = 'pdf';
                        if ($ext == 'pdf')
                        {
                            // $pdfName = 'pdf_' . str_random(12) . '.' . $file->getClientOriginalExtension();
                            $pdfName = 'pdf_' . str_random(12) . '.pdf';
                            $pathOriginal = public_path($this->menuPdfUploadPath.$pdfName);
                            $pdfUrl = url($this->menuPdfUploadPath.$pdfName);
                            // uploading file
                            $fileMove = $file->move($this->menuPdfUploadPath, $pdfName);
                        }
                    }
                    else
                    {
                        $pdfName = '';
                    }
                }

                if(isset($body['css_string_json']) && $body['css_string_json'] != 'undefined' && $body['css_string_json'] != '')
                {
                    $cssStringArray = json_decode($body['css_string_json']);
                }
                $jsonArray['type'] = $select_menu_slug;
                
                if(isset($pdfUrl) && !empty($pdfUrl))
                {
                    $updatePdfUrl = preg_replace('#^https?://|://|https?:#', '', $pdfUrl);
                }
                $jsonArray['pdfUrl'] = (isset($updatePdfUrl) && !empty($updatePdfUrl)) ? $updatePdfUrl : '';
                $jsonArray['pdfName'] = (isset($pdfName) && !empty($pdfName)) ? $pdfName : '';
                $jsonArray['css_string_json'] = $cssStringArray;

                $jsonEncodeData = json_encode($jsonArray);
            }
            elseif($selct_menu_type == WEB_VIEW_MENU) // web_view_menu
            {
                if(isset($body['css_string_json']) && $body['css_string_json'] != 'undefined' && $body['css_string_json'] != '')
                {
                    $cssStringArray = json_decode($body['css_string_json']);
                }
                $jsonArray['type'] = $select_menu_slug;
                
                if(isset($body['web_url']) && !empty($body['web_url']))
                {
                    $updateWebUrl = preg_replace('#^https?://|://|https?:#', '', $body['web_url']);
                }
                $jsonArray['web_url'] = (isset($updateWebUrl) ? $updateWebUrl : '');
                $jsonArray['css_string_json'] = $cssStringArray;
                $jsonEncodeData = json_encode($jsonArray);
            }

            elseif($selct_menu_type == CONTACT_FORM_BUILDER) // contact_form_builder
            {
                // if(isset($body['css_string_json']) && $body['css_string_json'] != 'undefined' && $body['css_string_json'] != '')
                // {
                //     $cssStringArray = json_decode($body['css_string_json']);
                // }

                // if(isset($body['recipients_string_json']) && $body['recipients_string_json'] != 'undefined' && $body['recipients_string_json'] != '')
                // {
                //     $recipientsStringArray = json_decode($body['recipients_string_json']);
                // }
                
                $jsonArray['type'] = $select_menu_slug;

                $jsonArray['css_string_json'] = $body['css_string_json'];

                $jsonArray['recipients_string_json'] = $body['recipients_string_json'];
                
                $jsonEncodeData = json_encode($jsonArray);
            }

            elseif($selct_menu_type == CONTENT_EDITOR) // contact_form_builder
            {
                // if(isset($body['css_string_json']) && $body['css_string_json'] != 'undefined' && $body['css_string_json'] != '')
                // {
                //     $cssStringArray = json_decode($body['css_string_json']);
                // }
                
                $jsonArray['type'] = $select_menu_slug;

                $jsonArray['css_string_json'] = $body['css_string_json'];

                $jsonArray['is_theme_picked'] = $body['is_theme_picked'];

                $jsonArray['background'] = $body['background'];
                
                $jsonEncodeData = json_encode($jsonArray);
            }

            elseif($selct_menu_type == REWARDS_MENU) // contact_form_builder
            {
                $jsonArray['type'] = $select_menu_slug;

                $jsonEncodeData = json_encode($jsonArray);
            }
            
            elseif($selct_menu_type == TUTORIAL_MENU_CSS) // tutorial_menu_css
            {
                $jsonArray['type'] = $select_menu_slug;

                $jsonArray['show_tutorial'] = (isset($body['show_tutorial']) && !empty($body['show_tutorial']) && $body['show_tutorial'] == 'true') ? $body['show_tutorial'] : '';
                // if(isset($body['tutorialStartView'])){
                //     $jsonArray['show_tutorial'] = json_decode($body['tutorialStartView']);
                // }
                // else
                //     $jsonArray['show_tutorial'] = false;
                // if(isset($fileName) && !empty($fileName) && $fileName != null)
                // {
                //     $jsonArray['image'] = $fileName;
                // }
                
                $jsonArray['css_string_json'] = json_decode($body['css_string_json']);
                $jsonArray['media_data'] = json_decode($body['media_data']);

                $jsonEncodeData = json_encode($jsonArray);
            }

            $updateData['app_basic_id'] = $app_basic_id;
            $updateData['id'] = $menu_id;
            $updateData['is_parent'] = $is_parent;
            $updateData['menu_name'] = $menu_name;

            if(isset($body['tab_show'])) {
              $updateData['tab_show'] = $body['tab_show'];
            }
            
            // $updateData['menu_icon'] = (isset($fileName) && !empty($fileName)) ? $fileName : '';

            if(isset($body['menu_icon']))
            {                
                $updateData['menu_icon'] = $body['menu_icon'];
            }

            
            $updateData['menu_type'] = $selct_menu_type;
            $updateData['menu_type_json_data'] = $jsonEncodeData;

            $updateMenuTypeData = $this->AppMenuRepository->saveAppMenuData($updateData);
            
            if($updateMenuTypeData)
            {
                $updateData['image_upload'] = (isset($fileName) && !empty($fileName)) ? $fileName : '';
                $outputArray['status'] = 1;
                $outputArray['message'] = trans('appmessages.app_menu_updated_msg');
                $outputArray['data'] = $updateData;
            }
            else
            {
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

    public function getParentMenuTypeData(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();

        if($user && isset($body['parentId']) && $body['parentId'] != null && $body['parentId'] != 'undefined')
        {
            $appParentMenuData = $this->AppMenuRepository->getParentMenuTypeData($body['parentId']);
            if($appParentMenuData)
            {
                $response['status'] = 1;
                $response['message'] = trans('appmessages.app_parent_menu_get_successfully');
                $response['data'] = [];
                $response['data']['id'] = $appParentMenuData->id;
                $response['data']['is_parent'] = $appParentMenuData->is_parent;
                $response['data']['menu_name'] = $appParentMenuData->menu_name;
                $response['data']['menu_level'] = $appParentMenuData->menu_level;
                $response['data']['menu_type'] = $appParentMenuData->menu_type;
                $response['data']['is_display_on_app'] = $appParentMenuData->is_display_on_app;
            }
            else
            {
                $response['status'] = 0;
                $response['message'] = trans('appmessages.default_error_msg');
            }
            return response()->json($response);
        }
    }

    public function orderedMenuData(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();

        if($user)
        {
            $i = "";
            $submenuArray = [];
            $menuArray = $body['finalArray'];
            $outputArray = [];

            // old part
            // for($i = 0; $i < count($body)-1; $i++)
            // {


            //      $menu = explode(':', $body[$i]);
            //      if($menu[0] =="submenu")
            //      {
            //          array_push($submenuArray, $menu[1]);
            //      }
            //      if($menu[0] =="menu")
            //      {
            //          array_push($menuArray, $menu[1]);
            //      }
            // }

            $appMenuData = $this->AppMenuRepository->saveOrderedData($menuArray, $submenuArray);
                $outputArray['status'] = 1;
                $outputArray['message'] = trans('appmessages.app_menu_update_msg');
                $outputArray['test_data'] = $appMenuData;
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($outputArray);
    }

}
