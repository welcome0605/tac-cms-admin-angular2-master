<?php

namespace App\Helpers;
use \stdClass;
use DB;
use Config;
use App\AppMenuType;

Class Helpers 
{
    public static function randomNumber($offset = 6)
    {
        return substr(number_format(time() * rand(),0,'',''),0,$offset);
    }
    
    
    public static function generateRandomString($length = 6) 
    {
        $upperalphabets = range('A', 'Z');
        $loweralphabets = range('a', 'z');
        $numbers = range('0', '9');
        $additional_characters = array('_', '.');
        $final_array = array_merge($upperalphabets, $loweralphabets, $numbers, $additional_characters);
        $string = '';

        while ($length--) {
            $key = array_rand($final_array);
            $string .= $final_array[$key];
        }
        return $string;
    }
    
    
    public static function getMenuTypeData($menuTypeId, $menuTypeJsonDataDecode)
    {
        $appMenuType = new AppMenuType();
        $getMenuTypeNameFromDatabase =  $appMenuType->getMenuTypeSlugById($menuTypeId);
        
        if($menuTypeId == '1')
        {
            $menu_type_name = 'kenburns';
        }
        elseif($menuTypeId == '2')
        {
           $menu_type_name = 'singlevideo'; 
        }
        elseif($menuTypeId == '3')
        {
            $menu_type_name = 'video';
        }
        elseif($menuTypeId == '4')
        {   
            //advanced option in list menu
            if(!empty($menuTypeJsonDataDecode) && isset($menuTypeJsonDataDecode->show_child_on) && $menuTypeJsonDataDecode->show_child_on == '1')
            {
                $menu_type_name = 'subMenu';
            }
            else
            {
                $menu_type_name = 'textList';
            }
            // $menu_type_name = 'subMenu';
            
        }
        elseif($menuTypeId == '5')
        {
            $menu_type_name = 'rss';
        }
        elseif($menuTypeId == '6')
        {
            $menu_type_name = 'notification';
        }
        elseif($menuTypeId == '7')
        {
            $menu_type_name = 'album';
        }
        elseif($menuTypeId == '8')
        {
            $menu_type_name = 'pdf';
        }
        elseif($menuTypeId == '9')
        {
//            $menu_type_name = 'web';
            $menu_type_name = 'customweb';
        }
        elseif($menuTypeId == '10')
        {
            $menu_type_name = 'tutorial';
        }
        elseif($menuTypeId == '11')
        {
            $menu_type_name = 'contact';   
        }
        elseif($menuTypeId == '12')
        {
            $menu_type_name = 'content';   
        }
        elseif($menuTypeId == '13')
        {
            $menu_type_name = 'rewards';   
        }
        else
        {
            $menu_type_name = 'noType';
        }
        
        return $menu_type_name;
    }

    
    public static function getImageMenuJsonData($menuTypeJsonData, $menuTypeJsonDataDecode)
    {
        $elementsCss = array(
                "kenburnHeader"=>new stdClass(),
                "kenburnListBanner"=>new stdClass(),
                "kenburnListTitle"=>new stdClass(),
                "kenburnAnimation"=>new stdClass(),                
                "kenburnIcon"=>new stdClass()
            );

        $togetherArray = array();
        
        foreach ($menuTypeJsonDataDecode as $cssKey => $cssStringJson)
        {            
//          kenburnHeader css json
            
            if(isset($cssStringJson->group) && !empty($cssStringJson->group) && $cssStringJson->group == 'kenburnHeader')
            {
                if($cssStringJson->key == 'textAlignment')
                {
                    $elementsCss['kenburnHeader']->textAlignment = $cssStringJson->value;
                }
                if($cssStringJson->key == 'kenburnHeaderColor')
                {
                    $elementsCss['kenburnHeader']->color = $cssStringJson->value;
                }
                if($cssStringJson->key == 'bottomBorderWidth' || $cssStringJson->key == 'bottomBorderStyle' || $cssStringJson->key == 'bottomBorderColor')
                {
                    $getBorderPro = self::togetherBorderData($cssStringJson, $togetherArray); 

                    if(!is_array($getBorderPro) && !empty($getBorderPro))
                    {
                       $elementsCss['kenburnHeader']->bottomBorder = $getBorderPro;
                        unset($togetherArray);
                        $togetherArray = array();                                        
                    }
                    else
                    {
                        $togetherArray = $getBorderPro;
                        $elementsCss['kenburnHeader']->bottomBorder = '';
                    }

                }
            }

//          kenburnListBanner css json
            
            if(isset($cssStringJson->group) && !empty($cssStringJson->group) && $cssStringJson->group == 'kenburnListBanner')
            {
                if($cssStringJson->key == 'radius')
                {
                    $elementsCss['kenburnListBanner']->radius = $cssStringJson->value.'px';
                }
                
                if($cssStringJson->key == 'listBannerBackground')
                {
                    $elementsCss['kenburnListBanner']->background = $cssStringJson->value;
                }
                
                if($cssStringJson->key == 'listBannerBorderWidth' || $cssStringJson->key == 'listBannerBorderStyle' || $cssStringJson->key == 'listBannerBorderColor')
                {
                    $getListBorderPro = self::togetherBorderData($cssStringJson, $togetherArray); 

                    if(!is_array($getListBorderPro) && !empty($getListBorderPro))
                    {
                        $elementsCss['kenburnListBanner']->border = $getListBorderPro;
                        unset($togetherArray);
                        $togetherArray = array();
                    }
                    else
                    {
                        $togetherArray = $getListBorderPro;
                        $elementsCss['kenburnListBanner']->border = '';
                    }
                }
                
                if($cssStringJson->key == 'marginTop' || $cssStringJson->key == 'marginRight' || $cssStringJson->key == 'marginBottom' || $cssStringJson->key == 'marginLeft')
                {
                    $getListMarginData = self::togetherMarginData($cssStringJson, $togetherArray); 

                    if(!is_array($getListMarginData) && !empty($getListMarginData))
                    {
                        $elementsCss['kenburnListBanner']->margin = $getListMarginData;
                        unset($togetherArray);
                        $togetherArray = array();
                    }
                    else
                    {
                        $togetherArray = $getListMarginData;
                        $elementsCss['kenburnListBanner']->margin = '';
                    }
                }
                
                if($cssStringJson->key == 'width')
                {
                    $elementsCss['kenburnListBanner']->width = 'calc('.$cssStringJson->value.'%)';
                }
                
                if($cssStringJson->key == 'paddingTop' || $cssStringJson->key == 'paddingRight' || $cssStringJson->key == 'paddingBottom' || $cssStringJson->key == 'paddingLeft')
                {
                    $getListPaddingData = self::togetherPaddingData($cssStringJson, $togetherArray); 

                    if(!is_array($getListPaddingData) && !empty($getListPaddingData))
                    {
                        $elementsCss['kenburnListBanner']->padding = $getListPaddingData;
                        unset($togetherArray);
                        $togetherArray = array();
                    }
                    else
                    {
                        $togetherArray = $getListPaddingData;
                        $elementsCss['kenburnListBanner']->padding = '';
                    }                    
                }                
            }

//          kenburnListTitle css json
            
            if(isset($cssStringJson->group) && !empty($cssStringJson->group) && $cssStringJson->group == 'kenburnListTitle')
            {
                if($cssStringJson->key == 'positionLeft')
                {
                    $elementsCss['kenburnListTitle']->left = $cssStringJson->value.'px';
                }
                if($cssStringJson->key == 'positionRight')
                {
                    $elementsCss['kenburnListTitle']->right = $cssStringJson->value.'px';
                }
                if($cssStringJson->key == 'positionBottom')
                {
                    $elementsCss['kenburnListTitle']->bottom = $cssStringJson->value.'px';
                }
                if($cssStringJson->key == 'kenburnListTitleHeight')
                {
                    $elementsCss['kenburnListTitle']->height = $cssStringJson->value.'px';
                }
                if($cssStringJson->key == 'listTitleFontColor')
                {
                    $elementsCss['kenburnListTitle']->color = $cssStringJson->value;
                }
                if($cssStringJson->key == 'listTitleFontSize')
                {
                    $elementsCss['kenburnListTitle']->size = $cssStringJson->value.'px';
                    $kenburnIconFontSize = $elementsCss['kenburnListTitle']->size;
                }
                if($cssStringJson->key == 'kenburnListTitleAlignment')
                {
                    $elementsCss['kenburnListTitle']->alignment = $cssStringJson->value;
                }
                if($cssStringJson->key == 'listTitleBackgroundColor')
                {
                    $elementsCss['kenburnListTitle']->backgroundColor = $cssStringJson->value;
                }
                if($cssStringJson->key == 'display')
                {
                    $elementsCss['kenburnListTitle']->display = $cssStringJson->value;
                }
                if($cssStringJson->key == 'fontName')
                {
                   $elementsCss['kenburnListTitle']->fontName = $cssStringJson->value;                    
                }
                if($cssStringJson->key == 'lineHeight')
                {
                    $elementsCss['kenburnListTitle']->lineHeight = $cssStringJson->value.'px';
                }
            }
        }
        
//        kenburnAnimation
        
        $elementsCss['kenburnAnimation']->name = 'zoom';
        $elementsCss['kenburnAnimation']->duration = (isset($menuTypeJsonData->duration) && !empty($menuTypeJsonData->duration)) ? $menuTypeJsonData->duration.'s' : '6'.'s';
        $elementsCss['kenburnAnimation']->from = (isset($menuTypeJsonData->from) && !empty($menuTypeJsonData->from)) ? $menuTypeJsonData->from : '1.3';
        $elementsCss['kenburnAnimation']->to = (isset($menuTypeJsonData->to) && !empty($menuTypeJsonData->to)) ? $menuTypeJsonData->to : '1';
        
//        kenburnIcon
        
        $elementsCss['kenburnIcon']->fontSize = (isset($kenburnIconFontSize) && !empty($kenburnIconFontSize)) ? $kenburnIconFontSize : '24px';
        $elementsCss['kenburnIcon']->verticalAlign = 'middle';
        $elementsCss['kenburnIcon']->margin = '0px 5px 0px 5px';
                
//      Close foreach loop 
        
        return $elementsCss;        
    }
    
    public static function getListMenuJsonData($menuTypeListMenuJsonData) 
    {
        $listMenuCss = array(
                "labelCss"=>new stdClass()
            );
        
        $togetherArray = array();
        
        foreach ($menuTypeListMenuJsonData as $cssKey => $cssStringJson)
        {            
//          labelCss css json
            
            if(isset($cssStringJson->group) && !empty($cssStringJson->group) && $cssStringJson->group == 'labelCss')
            {
                if($cssStringJson->key == 'paddingTop' || $cssStringJson->key == 'paddingRight' || $cssStringJson->key == 'paddingBottom' || $cssStringJson->key == 'paddingLeft')
                {
                    $getLabelPaddingData = self::togetherPaddingData($cssStringJson, $togetherArray); 

                    if(!is_array($getLabelPaddingData) && !empty($getLabelPaddingData))
                    {
                        $listMenuCss['labelCss']->paddingLeft = $getLabelPaddingData;
                        unset($togetherArray);
                        $togetherArray = array();
                    }
                    else
                    {
                        $togetherArray = $getLabelPaddingData;
                        $listMenuCss['labelCss']->paddingLeft = '';
                    }
                } 
                
                if($cssStringJson->key == 'borderSize' || $cssStringJson->key == 'borderColor' || $cssStringJson->key == 'bottomBorderStyle')
                {
                    $getLabelBorderPro = self::togetherBorderData($cssStringJson, $togetherArray); 
                    
                    if(!is_array($getLabelBorderPro) && !empty($getLabelBorderPro))
                    {
                        $listMenuCss['labelCss']->borderBottom = $getLabelBorderPro;
                        unset($togetherArray);
                        $togetherArray = array();
                    }
                    else
                    {
                        $togetherArray = $getLabelBorderPro;
                        $listMenuCss['labelCss']->borderBottom = '';
                    }
                }
                
                if($cssStringJson->key == 'fontColor')
                {
                    $listMenuCss['labelCss']->color = (isset($cssStringJson->value) && !empty($cssStringJson->value)) ? $cssStringJson->value : '#000000';
                }
                if($cssStringJson->key == 'fontName')
                {
                    $listMenuCss['labelCss']->fontName = $cssStringJson->value;
                }
                if($cssStringJson->key == 'fontSize')
                {
                    $listMenuCss['labelCss']->size = $cssStringJson->value.'px';
                }
            }
            
        }
        
//      Close foreach loop 
        
        return $listMenuCss;        
    }
    
    
    public static function getYouTubeMenuJsonData($menuTypeYouTubeMenuJsonData)
    {
        $youTubeMenuCss = array(
                'contentCss' => new stdClass(),
                'videoListCss' => new stdClass(),
                'textCss' => new stdClass(),
                'arrowCss' => new stdClass()
            );
        
        $togetherArray = array();
        
        foreach ($menuTypeYouTubeMenuJsonData as $cssKey => $cssStringJson)
        {            
//          contentCss css json
            
            if(isset($cssStringJson->group) && !empty($cssStringJson->group) && $cssStringJson->group == 'contentCss')
            {
                if($cssStringJson->key == 'fontColor')
                {
                    $youTubeMenuCss['contentCss']->color = $cssStringJson->value;
                }  
                
                if($cssStringJson->key == 'fontName')
                {
                    $youTubeMenuCss['contentCss']->fontName = $cssStringJson->value;
                }
                
                if($cssStringJson->key == 'fontSize')
                {
                    $youTubeMenuCss['contentCss']->fontSize = $cssStringJson->value;
                }
                
                if($cssStringJson->key == 'paddingTop' || $cssStringJson->key == 'paddingRight' || $cssStringJson->key == 'paddingBottom' || $cssStringJson->key == 'paddingLeft')
                {
                    $getContentPaddingData = self::togetherPaddingData($cssStringJson, $togetherArray); 

                    if(!is_array($getContentPaddingData) && !empty($getContentPaddingData))
                    {
                        $youTubeMenuCss['contentCss']->paddingLeft = $getContentPaddingData;
                        unset($togetherArray);
                        $togetherArray = array();
                    }
                    else
                    {
                        $togetherArray = $getContentPaddingData;
                        $youTubeMenuCss['contentCss']->paddingLeft = '';
                    }
                }   
            }

//          videoListCss css json
            
            if(isset($cssStringJson->group) && !empty($cssStringJson->group) && $cssStringJson->group == 'videoListCss')
            {   
                if($cssStringJson->key == 'marginTop' || $cssStringJson->key == 'marginRight' || $cssStringJson->key == 'marginBottom' || $cssStringJson->key == 'marginLeft')
                {
                    $getYouTubeMarginData = self::togetherMarginData($cssStringJson, $togetherArray); 

                    if(!is_array($getYouTubeMarginData) && !empty($getYouTubeMarginData))
                    {
                        $youTubeMenuCss['videoListCss']->margin = $getYouTubeMarginData;
                        unset($togetherArray);
                        $togetherArray = array();
                    }
                    else
                    {
                        $togetherArray = $getYouTubeMarginData;
                        $youTubeMenuCss['videoListCss']->margin = '';
                    }
                }
                
                 if($cssStringJson->key == 'paddingTop' || $cssStringJson->key == 'paddingRight' || $cssStringJson->key == 'paddingBottom' || $cssStringJson->key == 'paddingLeft')
                {
                    $getVideoListPaddingData = self::togetherPaddingData($cssStringJson, $togetherArray); 

                    if(!is_array($getVideoListPaddingData) && !empty($getVideoListPaddingData))
                    {
                        $youTubeMenuCss['videoListCss']->paddingLeft = $getVideoListPaddingData;
                        unset($togetherArray);
                        $togetherArray = array();
                    }
                    else
                    {
                        $togetherArray = $getVideoListPaddingData;
                        $youTubeMenuCss['videoListCss']->paddingLeft = '';
                    }
                }  
                
                if($cssStringJson->key == 'borderSize' || $cssStringJson->key == 'borderColor' || $cssStringJson->key == 'bottomBorderStyle')
                {
                    $getVideoListBorderPro = self::togetherBorderData($cssStringJson, $togetherArray); 

                    if(!is_array($getVideoListBorderPro) && !empty($getVideoListBorderPro))
                    {
                        $youTubeMenuCss['videoListCss']->borderBottom = $getVideoListBorderPro;
                        unset($togetherArray);
                        $togetherArray = array();
                    }
                    else
                    {
                        $togetherArray = $getVideoListBorderPro;
                        $youTubeMenuCss['videoListCss']->borderBottom = '';
                    }
                }                             
            }
            
//          textCss
            
            if(isset($cssStringJson->group) && !empty($cssStringJson->group) && $cssStringJson->group == 'textCss')
            {
                if($cssStringJson->key == 'marginTop' || $cssStringJson->key == 'marginRight' || $cssStringJson->key == 'marginBottom' || $cssStringJson->key == 'marginLeft')
                {
                    $getTextMarginData = self::togetherMarginData($cssStringJson, $togetherArray); 

                    if(!is_array($getTextMarginData) && !empty($getTextMarginData))
                    {
                        $youTubeMenuCss['textCss']->marginTop = $getTextMarginData;
                        unset($togetherArray);
                        $togetherArray = array();
                    }
                    else
                    {
                        $togetherArray = $getTextMarginData;
                        $youTubeMenuCss['textCss']->marginTop = '';
                    }
                }
            }
           
//          arrowCss
            
            if(isset($cssStringJson->group) && !empty($cssStringJson->group) && $cssStringJson->group == 'arrowCss')
            {
                if($cssStringJson->key == 'marginTop' || $cssStringJson->key == 'marginRight' || $cssStringJson->key == 'marginBottom' || $cssStringJson->key == 'marginLeft')
                {
                    $getArrowMarginData = self::togetherMarginData($cssStringJson, $togetherArray); 

                    if(!is_array($getArrowMarginData) && !empty($getArrowMarginData))
                    {
                        $youTubeMenuCss['arrowCss']->marginTop = $getArrowMarginData;
                        unset($togetherArray);
                        $togetherArray = array();
                    }
                    else
                    {
                        $togetherArray = $getArrowMarginData;
                        $youTubeMenuCss['arrowCss']->marginTop = '';
                    }
                }
                
                if($cssStringJson->key == 'fontSize')
                {
                    $youTubeMenuCss['arrowCss']->fontSize = $cssStringJson->value.'px';
                } 
                
                if($cssStringJson->key == 'positionLeft')
                {
                    $youTubeMenuCss['arrowCss']->left = $cssStringJson->value.'px';
                }                 
            }
        }
        
        return $youTubeMenuCss;
    }

    
    public static function getRSSMenuJsonData($menuTypeRSSMenuJsonData)
    {
        $RSSMenuCss = array(
                "buttonCss"=>new stdClass()
            );
        
        $togetherArray = array();
        
        foreach ($menuTypeRSSMenuJsonData as $cssKey => $cssStringJson)
        {            
//          labelCss css json
            
            if(isset($cssStringJson->group) && !empty($cssStringJson->group) && $cssStringJson->group == 'buttonCss')
            {
                if($cssStringJson->key == 'borderSize' || $cssStringJson->key == 'borderColor' || $cssStringJson->key == 'bottomBorderStyle')
                {
                    $getLabelBorderPro = self::togetherBorderData($cssStringJson, $togetherArray); 
                    
                    if(!is_array($getLabelBorderPro) && !empty($getLabelBorderPro))
                    {
                        $RSSMenuCss['buttonCss']->borderBottom = $getLabelBorderPro;
                        unset($togetherArray);
                        $togetherArray = array();
                    }
                    else
                    {
                        $togetherArray = $getLabelBorderPro;
                        $RSSMenuCss['buttonCss']->borderBottom = '';
                    }
                }
                
                if($cssStringJson->key == 'fontColor')
                {
                    $RSSMenuCss['buttonCss']->color = (isset($cssStringJson->value) && !empty($cssStringJson->value)) ? $cssStringJson->value : '#000000';
                }
                
                if($cssStringJson->key == 'fontName')
                {
                    $RSSMenuCss['buttonCss']->fontName = $cssStringJson->value;
                }
                
                if($cssStringJson->key == 'fontSize')
                {
                    $RSSMenuCss['buttonCss']->fontSize = $cssStringJson->value.'px';
                }
                
                if($cssStringJson->key == 'paddingTop' || $cssStringJson->key == 'paddingRight' || $cssStringJson->key == 'paddingBottom' || $cssStringJson->key == 'paddingLeft')
                {
                    $getButtonPaddingData = self::togetherPaddingData($cssStringJson, $togetherArray); 

                    if(!is_array($getButtonPaddingData) && !empty($getButtonPaddingData))
                    {
                        $RSSMenuCss['buttonCss']->paddingLeft = $getButtonPaddingData;
                        unset($togetherArray);
                        $togetherArray = array();
                    }
                    else
                    {
                        $togetherArray = $getButtonPaddingData;
                        $RSSMenuCss['buttonCss']->paddingLeft = '';
                    }
                } 

                if($cssStringJson->key =='bgColor') {
                  $RSSMenuCss['backgroundcolor'] = $cssStringJson->value;
                }
                                        
            }
            
        }
        
//      Close foreach loop 
        
        return $RSSMenuCss;   
        
    }
    
    
    public static function getAlbumMenuJsonData($menuTypeAlbumMenuDataDecode)
    {
        $albumMenuCss = array(
                "labelCss"=>new stdClass()
            );
        
        $togetherArray = array();
        
        foreach ($menuTypeAlbumMenuDataDecode as $cssKey => $cssStringJson)
        {            
//          labelCss css json
            
            if(isset($cssStringJson->group) && !empty($cssStringJson->group) && $cssStringJson->group == 'labelCss')
            {
                if($cssStringJson->key == 'paddingTop' || $cssStringJson->key == 'paddingRight' || $cssStringJson->key == 'paddingBottom' || $cssStringJson->key == 'paddingLeft')
                {
                    $getLabelPaddingData = self::togetherPaddingData($cssStringJson, $togetherArray); 

                    if(!is_array($getLabelPaddingData) && !empty($getLabelPaddingData))
                    {
                        $albumMenuCss['labelCss']->paddingLeft = $getLabelPaddingData;
                        unset($togetherArray);
                        $togetherArray = array();
                    }
                    else
                    {
                        $togetherArray = $getLabelPaddingData;
                        $albumMenuCss['labelCss']->paddingLeft = '';
                    }
                } 
                
                if($cssStringJson->key == 'borderSize' || $cssStringJson->key == 'borderColor' || $cssStringJson->key == 'bottomBorderStyle')
                {
                    $getLabelBorderPro = self::togetherBorderData($cssStringJson, $togetherArray); 
                    
                    if(!is_array($getLabelBorderPro) && !empty($getLabelBorderPro))
                    {
                        $albumMenuCss['labelCss']->borderBottom = $getLabelBorderPro;
                        unset($togetherArray);
                        $togetherArray = array();
                    }
                    else
                    {
                        $togetherArray = $getLabelBorderPro;
                        $albumMenuCss['labelCss']->borderBottom = '';
                    }
                }
                
                if($cssStringJson->key == 'fontColor')
                {
                    $albumMenuCss['labelCss']->color = (isset($cssStringJson->value) && !empty($cssStringJson->value)) ? $cssStringJson->value : '#000000';
                }
                if($cssStringJson->key == 'fontName')
                {
                    $albumMenuCss['labelCss']->fontName = $cssStringJson->value;
                }
                if($cssStringJson->key == 'fontSize')
                {
                    $albumMenuCss['labelCss']->size = $cssStringJson->value.'px';
                }
            }
            
        }
        
//      Close foreach loop 
        
        return $albumMenuCss;   
    }
    
    public static function getNotificationJsonData($menuTypeNotificationJsonData)
    {
        $notificationMenuCss = array(
            "labelCss"=>new stdClass(),
            "itemInner"=>new stdClass()
        );
        
        $togetherArray = array();
        
        foreach ($menuTypeNotificationJsonData as $cssKey => $cssStringJson)
        {            
//          labelCss css json
            
            if(isset($cssStringJson->group) && !empty($cssStringJson->group) && $cssStringJson->group == 'labelCss')
            {
                if($cssStringJson->key == 'fontColor')
                {
                    $notificationMenuCss['labelCss']->color = (isset($cssStringJson->value) && !empty($cssStringJson->value)) ? $cssStringJson->value : '#000000';
                }
                
                if($cssStringJson->key == 'fontName')
                {
                    $notificationMenuCss['labelCss']->fontName = $cssStringJson->value;
                }
                
                if($cssStringJson->key == 'fontSize')
                {
                    $notificationMenuCss['labelCss']->size = $cssStringJson->value.'px';
                }
                
                if($cssStringJson->key == 'paddingTop' || $cssStringJson->key == 'paddingRight' || $cssStringJson->key == 'paddingBottom' || $cssStringJson->key == 'paddingLeft')
                {
                    $getLabelPaddingData = self::togetherPaddingData($cssStringJson, $togetherArray); 

                    if(!is_array($getLabelPaddingData) && !empty($getLabelPaddingData))
                    {
                        $notificationMenuCss['labelCss']->paddingLeft = $getLabelPaddingData;
                        unset($togetherArray);
                        $togetherArray = array();
                    }
                    else
                    {
                        $togetherArray = $getLabelPaddingData;
                        $notificationMenuCss['labelCss']->paddingLeft = '';
                    }
                } 
            }
            
            if(isset($cssStringJson->group) && !empty($cssStringJson->group) && $cssStringJson->group == 'itemInner')
            {
                if($cssStringJson->key == 'borderSize' || $cssStringJson->key == 'borderColor' || $cssStringJson->key == 'bottomBorderStyle')
                {
                    $getLabelBorderPro = self::togetherBorderData($cssStringJson, $togetherArray); 

                    if(!is_array($getLabelBorderPro) && !empty($getLabelBorderPro))
                    {
                        $notificationMenuCss['itemInner']->borderBottom = $getLabelBorderPro;
                        unset($togetherArray);
                        $togetherArray = array();
                    }
                    else
                    {
                        $togetherArray = $getLabelBorderPro;
                        $notificationMenuCss['itemInner']->borderBottom = '';
                    }
                }
            }
            
        }
        
//      Close foreach loop 
        
        return $notificationMenuCss;  
    }
    
    public static function getTutorialMenuJsonData($menuTypeTutorialJsonData) 
    {
        $tutorialMenuCss = array(
            "pagerCss" => new stdClass(),
            "imgCss" => new stdClass(),
            "buttonCss" => new stdClass()
        );
        
        $togetherArray = array();
        
        foreach ($menuTypeTutorialJsonData as $cssKey => $cssStringJson)
        {            
//          pagerCss css json
            
            if(isset($cssStringJson->group) && !empty($cssStringJson->group) && $cssStringJson->group == 'pagerCss')
            {
                if($cssStringJson->key == 'backgroundColor')
                {
                    $tutorialMenuCss['pagerCss']->background = (isset($cssStringJson->value) && !empty($cssStringJson->value)) ? $cssStringJson->value : '#000000';
                }
                
                if($cssStringJson->key == 'height')
                {
                    $tutorialMenuCss['pagerCss']->height = $cssStringJson->value.'px';
                }
                
                if($cssStringJson->key == 'width')
                {
                    $tutorialMenuCss['pagerCss']->width = $cssStringJson->value.'px';
                }
                
                if($cssStringJson->key == 'positionBottom')
                {
                    $tutorialMenuCss['pagerCss']->bottom = $cssStringJson->value.'%';                   
                } 
            }
            
//          imgCss css json 
            
            if(isset($cssStringJson->group) && !empty($cssStringJson->group) && $cssStringJson->group == 'imgCss')
            {
                if($cssStringJson->type == 'positionType')
                {
                    $tutorialMenuCss['imgCss']->position = $cssStringJson->value;                   
                }
            }
            
//          buttonCss css json 
            
            if(isset($cssStringJson->group) && !empty($cssStringJson->group) && $cssStringJson->group == 'buttonCss')
            {
                if($cssStringJson->key == 'fontSize')
                {
                    $tutorialMenuCss['buttonCss']->fontSize = $cssStringJson->value.'px';                   
                }
                
                if($cssStringJson->type == 'positionType')
                {
                    $tutorialMenuCss['buttonCss']->position = $cssStringJson->value;                   
                }
                
                if($cssStringJson->key == 'positionTop')
                {
                    $tutorialMenuCss['buttonCss']->top = $cssStringJson->value.'px';                   
                } 
                
                if($cssStringJson->key == 'positionRight')
                {
                    $tutorialMenuCss['buttonCss']->right = $cssStringJson->value.'px';                   
                }
                
                if($cssStringJson->key == 'bottomFontColor')
                {
                    $tutorialMenuCss['buttonCss']->color = $cssStringJson->value;                   
                } 
            }            
        }
        
//      Close foreach loop 
       
        return $tutorialMenuCss;  
    }


    /* **************************************************************************
    Border Value Set
************************************************************************** */
    
    public static function togetherBorderData($cssStringJson, $togetherArray = [])
    {
        if($cssStringJson->type == 'size')
        {
            $size = (isset($cssStringJson->value) && !empty($cssStringJson->value)) ? $cssStringJson->value : '0';
            $togetherArray['size'] = $size.'px';
        }
        elseif($cssStringJson->type == 'borderStyle')
        {
            $borderStyle = (isset($cssStringJson->value) && !empty($cssStringJson->value)) ? $cssStringJson->value : 'solid';
            $togetherArray['stlye'] = $borderStyle;
        }
        elseif($cssStringJson->type == 'color')
        {
           $color = (isset($cssStringJson->value) && !empty($cssStringJson->value)) ? $cssStringJson->value : '#000000';
           $togetherArray['color'] = $color;
        }
        
        if(count($togetherArray) == 3)
        {
            $setBorder = array();            
            if(array_key_exists('size', $togetherArray))
            {
                $setBorder[0] = $togetherArray['size'];
            }
            if(array_key_exists('stlye', $togetherArray))
            {
                $setBorder[1] = $togetherArray['stlye'];
            }
            if(array_key_exists('color', $togetherArray))
            {
                $setBorder[2] = $togetherArray['color'];
            }            
            if(count($setBorder) == 3)
            {
                $getProperty = implode(' ', $setBorder); 
                return $getProperty;
            }
            else
            {
                return $togetherArray;
            }
            
        }
        else
        {
            return $togetherArray;
        }
    }
 
/* **************************************************************************
    Margin Value Set
************************************************************************** */
    
    public static function togetherMarginData($cssStringJson, $togetherArray = [])
    {
        if($cssStringJson->key == 'marginTop')
        {
            $top = (isset($cssStringJson->value) && !empty($cssStringJson->value)) ? $cssStringJson->value : '0';
            $togetherArray['top'] = $top.'px';
        }
        elseif($cssStringJson->key == 'marginRight')
        {
            $right= (isset($cssStringJson->value) && !empty($cssStringJson->value)) ? $cssStringJson->value : '0';
            $togetherArray['right'] = $right.'px';
        }
        elseif($cssStringJson->key == 'marginBottom')
        {
           $bottom = (isset($cssStringJson->value) && !empty($cssStringJson->value)) ? $cssStringJson->value : '0';
           $togetherArray['bottom'] = $bottom.'px';
        }
        elseif($cssStringJson->key == 'marginLeft')
        {
           $left = (isset($cssStringJson->value) && !empty($cssStringJson->value)) ? $cssStringJson->value : '0';
           $togetherArray['left'] = $left.'px';
        }
        
        if(count($togetherArray) == 4)
        {
            $setMargin = array();            
            if(array_key_exists('top', $togetherArray))
            {
                $setMargin[0] = $togetherArray['top'];
            }
            if(array_key_exists('right', $togetherArray))
            {
                $setMargin[1] = $togetherArray['right'];
            }
            if(array_key_exists('bottom', $togetherArray))
            {
                $setMargin[2] = $togetherArray['bottom'];
            }  
            if(array_key_exists('left', $togetherArray))
            {
                $setMargin[3] = $togetherArray['left'];
            } 
            
            if(count($setMargin) == 4)
            {
                $getProperty = implode(' ', $setMargin); 
                return $getProperty;
            }
            else
            {
                return $togetherArray;
            }
            
        }
        else
        {
            return $togetherArray;
        }
    }
    
/* **************************************************************************
    Padding Value Set
************************************************************************** */
    
    public static function togetherPaddingData($cssStringJson, $togetherArray = [])
    {        
        if($cssStringJson->key == 'paddingTop')
        {
            $top = (isset($cssStringJson->value) && !empty($cssStringJson->value)) ? $cssStringJson->value : '0';
            $togetherArray['top'] = $top.'px';
        }
        elseif($cssStringJson->key == 'paddingRight')
        {
            $right= (isset($cssStringJson->value) && !empty($cssStringJson->value)) ? $cssStringJson->value : '0';
            $togetherArray['right'] = $right.'px';
        }
        elseif($cssStringJson->key == 'paddingBottom')
        {
           $bottom = (isset($cssStringJson->value) && !empty($cssStringJson->value)) ? $cssStringJson->value : '0';
           $togetherArray['bottom'] = $bottom.'px';
        }
        elseif($cssStringJson->key == 'paddingLeft')
        {
           $left = (isset($cssStringJson->value) && !empty($cssStringJson->value)) ? $cssStringJson->value : '0';
           $togetherArray['left'] = $left.'px';
        }
        
        if(count($togetherArray) == 4)
        {
            $setPadding = array();            
            if(array_key_exists('top', $togetherArray))
            {
                $setPadding[0] = $togetherArray['top'];
            }
            if(array_key_exists('right', $togetherArray))
            {
                $setPadding[1] = $togetherArray['right'];
            }
            if(array_key_exists('bottom', $togetherArray))
            {
                $setPadding[2] = $togetherArray['bottom'];
            }  
            if(array_key_exists('left', $togetherArray))
            {
                $setPadding[3] = $togetherArray['left'];
            } 
            
            if(count($setPadding) == 4)
            {
                $getProperty = implode(' ', $setPadding); 
                return $getProperty;
            }
            else
            {
                return $togetherArray;
            }
            
        }
        else
        {
            return $togetherArray;
        }
    }
    
/* **************************************************************************
    Hex to rgba converter
************************************************************************** */

    public static function hex2rgba($color, $opacity = '1') 
    { 
        $default = 'rgb(0,0,0)'; 
//      Return default if no color provided        
        if(empty($color))
        {
            return $default;
        }             
 
//      Sanitize $color if "#" is provided 
        
        if ($color[0] == '#' ) 
        {
            $color = substr( $color, 1 );
        }
 
//      Check if color has 6 or 3 characters and get values
        
        if (strlen($color) == 6) 
        {
            $hex = array( $color[0] . $color[1], $color[2] . $color[3], $color[4] . $color[5] );
        } 
        elseif ( strlen( $color ) == 3 ) 
        {
            $hex = array( $color[0] . $color[0], $color[1] . $color[1], $color[2] . $color[2] );
        }
        else 
        {
            return $default;
        } 
//      Convert hexadec to rgb
        $rgb =  array_map('hexdec', $hex);
 
//      Check if opacity is set(rgba or rgb)
        if($opacity)
        {
            if(abs($opacity) > 1)
            {
                $opacity = 1.0;
            }
            $output = 'rgba('.implode(",",$rgb).','.$opacity.')';
        } 
        else 
        {
            $output = 'rgb('.implode(",",$rgb).')';
        }
 
//      Return rgb(a) color string
        return $output;
    }
    
        
}
