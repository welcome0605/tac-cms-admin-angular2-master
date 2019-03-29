<?php

use Illuminate\Database\Seeder;

class AppCssTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('app_css')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        DB::table('app_css')->insert([
          'css_component' => 'menuicon_css', 'css_properties'=>'[
              {
                 "key":"backgroundColorMenu",
                 "value":"#000000",
                 "label":"Menu Icon Color",
                 "type":"color"
              }
           ]'
        ]);

        DB::table('app_css')->insert([
          'css_component' => 'header_css', 'css_properties'=>'[
              {
                 "key":"background color",
                 "value":"#ffffff",
                 "label":"Header Color",
                 "type":"color"
              },
              {
                 "key":"height",
                 "value":"70",
                 "label":"Header Height",
                 "type":"size"
              },
              {
                 "key":"borderbottom",
                 "value":"2",
                 "label":"Header Border Bottom",
                 "type":"size"
              },
              {
                 "key":"background color border",
                 "value":"#000000",
                 "label":"Header Border Bottom",
                 "type":"color"
              },
              {
                 "key":"headerIcon",
                 "value":"' . url('/') . '/upload/appicon/original/default.png",
                 "label":"headerIcon",
                 "type":"image"
              },
              {
                 "key":"headerAlignment",
                 "value":"center",
                 "label":"Header Alignment",
                 "type":"drpAlignment"
              }
           ]'
        ]);

        DB::table('app_css')->insert([
            'css_component' => 'menu_css','css_properties'=>'[
                {
                   "key":"fontSize",
                   "value":"22",
                   "label":"Font Size",
                   "type":"size"
                },
                {
                   "key":"fontName",
                   "value":"Alegreya",
                   "label":"Font Style",
                   "type":"font"
                },
                {
                   "key":"paddingLeft",
                   "value":"15",
                   "label":"Padding Left",
                   "type":"size"
                },
                {
                   "key":"paddingTop",
                   "value":"0",
                   "label":"Padding Top",
                   "type":"size"
                },
                {
                   "key":"lineDividerHeight",
                   "value":"2",
                   "label":"Menu Separator Height",
                   "type":"size"
                },
                {
                   "key":"borderBottom",
                   "value":"2px solid #ffffff",
                   "label":"Header Separator Color",
                   "type":"color"
                },
                {
                   "key":"lineDividerColor",
                   "value":"#000000",
                   "label":"Separator Color",
                   "type":"color"
                },
                {
                   "key":"selectedColor",
                   "value":"#c9c9c9",
                   "label":"Selected Menu Color",
                   "type":"color"
                },
                {
                   "key":"selectedFontColor",
                   "value":"#000000",
                   "label":"Selected Menu Font Color",
                   "type":"color"
                },
                {
                   "key":"nonSelectedColor",
                   "value":"#ffffff",
                   "label":"Non-Selected Menu Color",
                   "type":"color"
                },
                {
                   "key":"nonSelectedFontColor",
                   "value":"#000000",
                   "label":"Non-Selected Menu Font Color",
                   "type":"color"
                },
                {
                   "key":"backgroundColor",
                   "value":"#ffffff",
                   "label":"Header Background Color",
                   "type":"color"
                },
                {
                   "key":"sideMenuImg",
                   "value":"' . url('/') . '/upload/appicon/original/default.png",
                   "label":"",
                   "type":"color"
                }
             ]'
        ]);

        DB::table('app_css')->insert([
            'css_component' => 'submenu_css','css_properties'=>'[
                {
                   "key":"fontSize",
                   "value":"20",
                   "label":"Font Size",
                   "type":"size"
                },
                {
                   "key":"color",
                   "value":"#000000",
                   "label":"Font Color",
                   "type":"color"
                },
                {
                   "key":"fontName",
                   "value":"Alegreya",
                   "label":"Font Style",
                   "type":"font"
                },
                {
                   "key":"paddingLeft",
                   "value":"15",
                   "label":"Padding Left",
                   "type":"paddingleft"
                },
                {
                   "key":"paddingTop",
                   "value":"",
                   "label":"Padding Top",
                   "type":"paddingtop"
                },
                {
                   "key":"selectedColor",
                   "value":"#c9c9c9",
                   "label":"Selected SubMenu Color",
                   "type":"color"
                },
                {
                   "key":"selectedFontColor",
                   "value":"#000000",
                   "label":"Selected SubMenu Font Color",
                   "type":"color"
                },
                {
                   "key":"nonSelectedColor",
                   "value":"#ffffff",
                   "label":"Non-Selected SubMenu Color",
                   "type":"color"
                },
                {
                   "key":"nonSelectedFontColor",
                   "value":"#000000",
                   "label":"Non-Selected SubMenu Font Color",
                   "type":"color"
                },
                {
                   "key":"borderBottom",
                   "value":"2",
                   "label":"Submenu Separator Height",
                   "type":"size"
                },
                {
                   "key":"borderColor",
                   "value":"#000000",
                   "label":"Submenu Separator Color",
                   "type":"color"
                },
                {
                   "key":"marginTop",
                   "value":"10",
                   "label":"Margin Top",
                   "type":"margintop"
                }
             ]'
        ]);

        DB::table('app_css')->insert([
            'css_component' => 'arrow_css','css_properties'=>'[
                {
                   "key":"arrowColor",
                   "value":"#000000",
                   "label":"Arrow Color",
                   "type":"color"
                },
                {
                   "key":"arrow padding left",
                   "value":"10",
                   "label":"Right",
                   "type":"size"
                },
                {
                   "key":"size",
                   "value":"30",
                   "label":"Arrow Size",
                   "type":"size"
                },
                {
                   "key":"position",
                   "value":"absolute",
                   "label":"Position",
                   "type":"position"
                },
                {
                   "key":"backarrowcolor",
                   "value":"#000000",
                   "label":"Back Arrow Color",
                   "type":"color"
                },
                {
                   "key":"toggleouter",
                   "value":"#000000",
                   "label":"Toggle Outer Color",
                   "type":"color"
                },
                {
                   "key":"toggleinner",
                   "value":"#ffffff",
                   "label":"Toggle Inner Color",
                   "type":"color"
                }
             ]'
        ]);

        DB::table('app_css')->insert([
          'css_component' => 'image_menu_css', 'css_properties'=>'[
              {
                 "group":"kenburnHeader",
                 "time":"always",
                 "key":"textAlignment",
                 "value":"right",
                 "label":"Panel Text Alignment",
                 "type":"align"
              },
              {
                 "group":"kenburnHeader",
                 "time":"always",
                 "key":"kenburnHeaderColor",
                 "value":"",
                 "label":"Panel Font Color",
                 "type":"color"
              },
              {
                 "group":"kenburnHeader",
                 "time":"always",
                 "key":"bottomBorderWidth",
                 "value":"2",
                 "label":"Panel Border Size",
                 "type":"size"
              },
              {
                 "group":"kenburnHeader",
                 "time":"always",
                 "key":"bottomBorderStyle",
                 "value":"solid",
                 "label":"Panel Border Style",
                 "type":"borderStyle"
              },
              {
                 "group":"kenburnHeader",
                 "time":"always",
                 "key":"bottomBorderColor",
                 "value":"#ffffff7d",
                 "label":"Panel Border Color",
                 "type":"color"
              },
              {
                 "group":"kenburnListBanner",
                 "key":"radius",
                 "value":"0",
                 "label":"Panel Border Radius",
                 "type":"size"
              },
              {
                 "group":"kenburnListBanner",
                 "key":"listBannerBackground",
                 "value":"#ffffff7d",
                 "label":"Panel List Banner Background",
                 "type":"color"
              },
              {
                "group":"kenburnListBanner",
                "key":"listBannerBorderWidth",
                "value":"2",
                "label":"Panel List Banner Border Size",
                "type":"size"
              },
              {
                 "group":"kenburnListBanner",
                 "key":"listBannerBorderStyle",
                 "value":"solid",
                 "label":"Panel List Banner Border Style",
                 "type":"borderStyle"
              },
              {
                 "group":"kenburnListBanner",
                 "key":"listBannerBorderColor",
                 "value":"#ffffff7d",
                 "label":"Panel Banner Border Color",
                 "type":"color"
              },
              {
                 "group":"kenburnListBanner",
                 "time":"always",
                 "key":"marginTop",
                 "value":"0",
                 "label":"Top Margin",
                 "type":"size"
              },
              {
                 "group":"kenburnListBanner",
                 "time":"always",
                 "key":"marginRight",
                 "value":"0",
                 "label":"Right Margin",
                 "type":"size"
              },
              {
                 "group":"kenburnListBanner",
                 "time":"always",
                 "key":"marginBottom",
                 "value":"0",
                 "label":"Bottom Margin",
                 "type":"size"
              },
              {
                 "group":"kenburnListBanner",
                 "time":"always",
                 "key":"marginLeft",
                 "value":"0",
                 "label":"Left Margin",
                 "type":"size"
              },
              {
                 "group":"kenburnListBanner",
                 "time":"always",
                 "key":"width",
                 "value":"100",
                 "label":"Panel Banner Width",
                 "type":"sizeper"
              },
              {
                 "group":"kenburnListBanner",
                 "key":"paddingTop",
                 "value":"1",
                 "label":"Top Padding",
                 "type":"size"
              },
              {
                 "group":"kenburnListBanner",
                 "key":"paddingRight",
                 "value":"4",
                 "label":"Right Padding",
                 "type":"size"
              },
              {
                 "group":"kenburnListBanner",
                 "key":"paddingBottom",
                 "value":"1",
                 "label":"Bottom Padding",
                 "type":"size"
              },
              {
                "group":"kenburnListBanner",
                "key":"paddingLeft",
                "value":"4",
                "label":"Left Padding",
                "type":"size"
              },
              {
                 "group":"kenburnListTitle",
                 "time":"always",
                 "key":"positionBottom",
                 "value":"0",
                 "label":"Bottom Position",
                 "type":"size"
              },
              {
                 "group":"kenburnListTitle",
                 "key":"kenburnListTitleHeight",
                 "value":"23",
                 "label":"Panel List Title Height",
                 "type":"size"
              },
              {
                 "group":"kenburnListTitle",
                 "key":"listTitleFontColor",
                 "value":"#ffffff",
                 "label":"List Title Font Color",
                 "type":"color"
              },
              {
                 "group":"kenburnListTitle",
                 "key":"listTitleFontSize",
                 "value":"24",
                 "label":"List Title Font Size",
                 "type":"sizeem"
              },
              {
                 "group":"kenburnListTitle",
                 "key":"kenburnListTitleAlignment",
                 "value":"right",
                 "label":"List Title Alignment",
                 "type":"align"
              },
              {
                 "group":"kenburnListTitle",
                 "key":"listTitleBackgroundColor",
                 "value":"#0000007d",
                 "label":"List Title Background Color",
                 "type":"color"
              },
              {
                 "group":"kenburnListTitle",
                 "time":"always",
                 "key":"display",
                 "value":"block",
                 "label":"List Title Display",
                 "type":"displayDrop"
              },
              {
                 "group":"kenburnListTitle",
                 "key":"fontName",
                 "value":"Alegreya",
                 "label":"Font Style",
                 "type":"font"
              },
              {
                 "group":"kenburnListTitle",
                 "time":"always",
                 "key":"lineHeight",
                 "value":"20",
                 "label":"List Title Line Height",
                 "type":"size"
              }
           ]'
        ]);

        DB::table('app_css')->insert([
        'css_component' => 'single_video_menu_css','css_properties'=> null
        ]);

        DB::table('app_css')->insert([
        'css_component' => 'youtube_video_menu_css','css_properties'=>'[
            {
               "group":"contentCss",
               "key":"fontColor",
               "value":"#000000",
               "label":"Content Font Color",
               "type":"color"
            },
            {
               "group":"contentCss",
               "key":"fontName",
               "value":"Alegreya",
               "label":"Content Font Style",
               "type":"font"
            },
            {
               "group":"contentCss",
               "key":"fontSize",
               "value":"28",
               "label":"Content Font Size",
               "type":"size"
            },
            {
               "group":"contentCss",
               "time":"always",
               "key":"paddingTop",
               "value":"0",
               "label":"Content Top Padding",
               "type":"size"
            },
            {
               "group":"contentCss",
               "time":"always",
               "key":"paddingRight",
               "value":"0",
               "label":"Content Right Padding",
               "type":"size"
            },
            {
               "group":"contentCss",
               "time":"always",
               "key":"paddingBottom",
               "value":"0",
               "label":"Content Bottom Padding",
               "type":"size"
            },
            {
               "group":"contentCss",
               "time":"always",
               "key":"paddingLeft",
               "value":"10",
               "label":"Content Left Padding",
               "type":"size"
            },
            {
               "group":"contentCss",
               "time":"always",
               "key":"height",
               "value":"0",
               "label":"Height",
               "type":"size"
            },
            {
               "group":"videoListCss",
               "key":"marginTop",
               "value":"3",
               "label":"Video List Top Margin",
               "type":"size"
            },
            {
               "group":"videoListCss",
               "key":"marginRight",
               "value":"0",
               "label":"Video List Right Margin",
               "type":"size"
            },
            {
               "group":"videoListCss",
               "key":"marginBottom",
               "value":"0",
               "label":"Video List Bottom Margin",
               "type":"size"
            },
            {
               "group":"videoListCss",
               "key":"marginLeft",
               "value":"16",
               "label":"Video List Left Margin",
               "type":"size"
            },
            {
               "group":"videoListCss",
               "key":"paddingTop",
               "value":"0",
               "label":"Video List Top Padding",
               "type":"size"
            },
            {
               "group":"videoListCss",
               "key":"paddingRight",
               "value":"0",
               "label":"Video List Right Padding",
               "type":"size"
            },
            {
               "group":"videoListCss",
               "key":"paddingBottom",
               "value":"0",
               "label":"Video List Bottom Padding",
               "type":"size"
            },
            {
               "group":"videoListCss",
               "key":"paddingLeft",
               "value":"10",
               "label":"Video List Left Padding",
               "type":"size"
            },
            {
               "group":"videoListCss",
               "key":"borderSize",
               "value":"2",
               "label":"Video List Border Size",
               "type":"size"
            },
            {
               "group":"videoListCss",
               "key":"borderColor",
               "value":"#000000",
               "label":"Video List Border Color",
               "type":"color"
            },
            {
               "group":"videoListCss",
               "key":"bottomBorderStyle",
               "value":"solid",
               "label":"Video List Border Style",
               "type":"borderStyle"
            },
            {
               "group":"textCss",
               "time":"always",
               "key":"marginTop",
               "value":"10",
               "label":"Text Top Margin",
               "type":"size"
            },
            {
               "group":"textCss",
               "time":"always",
               "key":"marginRight",
               "value":"0",
               "label":"Text Right Margin",
               "type":"size"
            },
            {
               "group":"textCss",
               "time":"always",
               "key":"marginBottom",
               "value":"0",
               "label":"Text Bottom Margin",
               "type":"size"
            },
            {
               "group":"textCss",
               "time":"always",
               "key":"marginLeft",
               "value":"0",
               "label":"Text Left Margin",
               "type":"size"
            },
            {
               "group":"arrowCss",
               "time":"always",
               "key":"marginTop",
               "value":"12",
               "label":"Arrow Top Margin",
               "type":"size"
            },
            {
               "group":"arrowCss",
               "time":"always",
               "key":"marginRight",
               "value":"0",
               "label":"Arrow Right Margin",
               "type":"size"
            },
            {
               "group":"arrowCss",
               "time":"always",
               "key":"marginBottom",
               "value":"0",
               "label":"Arrow Bottom Margin",
               "type":"size"
            },
            {
               "group":"arrowCss",
               "time":"always",
               "key":"marginLeft",
               "value":"0",
               "label":"Arrow Left Margin",
               "type":"size"
            },
            {
               "group":"arrowCss",
               "key":"fontSize",
               "value":"28",
               "label":"Arrow Font Size",
               "type":"size"
            },
            {
               "group":"arrowCss",
               "key":"positionLeft",
               "value":"20",
               "label":"Arrow Left Position",
               "type":"size"
            },
            {
               "group":"arrowCss",
               "time":"always",
               "key":"positionRight",
               "value":"",
               "label":"Arrow Right Position",
               "type":"size"
            },
            {
               "group":"arrowCss",
               "time":"always",
               "key":"positionBottom",
               "value":"",
               "label":"Arrow Bottom Position",
               "type":"size"
            }
         ]'
        ]);

        DB::table('app_css')->insert([
          'css_component' => 'list_menu_css','css_properties'=>'[
              {
                 "group":"labelCss",
                 "key":"paddingTop",
                 "value":"0",
                 "label":"Top Padding",
                 "type":"size"
              },
              {
                 "group":"labelCss",
                 "key":"paddingRight",
                 "value":"0",
                 "label":"Right Padding",
                 "type":"size"
              },
              {
                 "group":"labelCss",
                 "key":"paddingBottom",
                 "value":"0",
                 "label":"Bottom Padding",
                 "type":"size"
              },
              {
                 "group":"labelCss",
                 "key":"paddingLeft",
                 "value":"15",
                 "label":"Left Padding",
                 "type":"size"
              },
              {
                 "group":"labelCss",
                 "key":"borderSize",
                 "value":"1",
                 "label":"Border Size",
                 "type":"size"
              },
              {
                 "group":"labelCss",
                 "key":"borderColor",
                 "value":"#000000",
                 "label":"Border Color",
                 "type":"color"
              },
              {
                 "group":"labelCss",
                 "key":"bottomBorderStyle",
                 "value":"solid",
                 "label":"Border Style",
                 "type":"borderStyle"
              },
              {
                 "group":"labelCss",
                 "key":"fontName",
                 "value":"Alegreya",
                 "label":"Font Style",
                 "type":"font"
              },
              {
                 "group":"labelCss",
                 "key":"fontSize",
                 "value":"18",
                 "label":"Font Size",
                 "type":"size"
              },
              {
                 "group":"labelCss",
                 "key":"fontColor",
                 "value":"#000000",
                 "label":"Font Color",
                 "type":"color"
              }
           ]'
        ]);

        DB::table('app_css')->insert([
        'css_component' => 'rss_feed_menu_css','css_properties'=>'[
            {
               "group":"buttonCss",
               "key":"bgColor",
               "value":"#ffffff7d",
               "label":"Background Color",
               "type":"color"
            },
            {
               "group":"buttonCss",
               "key":"borderSize",
               "value":"1",
               "label":"Button Border Size",
               "type":"size"
            },
            {
               "group":"buttonCss",
               "key":"borderColor",
               "value":"#000000",
               "label":"Button Border Color",
               "type":"color"
            },
            {
               "group":"buttonCss",
               "key":"bottomBorderStyle",
               "value":"solid",
               "label":"Button Border Style",
               "type":"borderStyle"
            },
            {
               "group":"buttonCss",
               "key":"paddingTop",
               "value":"0",
               "label":"Button Top Padding",
               "type":"size"
            },
            {
               "group":"buttonCss",
               "key":"paddingRight",
               "value":"0",
               "label":"Button Right Padding",
               "type":"size"
            },
            {
               "group":"buttonCss",
               "key":"paddingBottom",
               "value":"0",
               "label":"Button Bottom Padding",
               "type":"size"
            },
            {
               "group":"buttonCss",
               "key":"paddingLeft",
               "value":"15",
               "label":"Button Left Padding",
               "type":"size"
            },
            {
               "group":"buttonCss",
               "key":"fontColor",
               "value":"#000000",
               "label":"Font Color",
               "type":"color"
            },
            {
               "group":"buttonCss",
               "key":"fontName",
               "value":"Alegreya",
               "label":"Font Style",
               "type":"font"
            },
            {
               "group":"buttonCss",
               "key":"fontSize",
               "value":"16",
               "label":"Font Size",
               "type":"size"
            }
         ]'
        ]);

        DB::table('app_css')->insert([
        'css_component' => 'notification_menu_css','css_properties'=>'[
            {
               "group":"labelCss",
               "key":"fontColor",
               "value":"#000000",
               "label":"Font Color",
               "type":"color"
            },
            {
               "group":"labelCss",
               "key":"fontName",
               "value":"Alegreya",
               "label":"Font Style",
               "type":"font"
            },
            {
               "group":"labelCss",
               "key":"fontSize",
               "value":"18",
               "label":"Font Size",
               "type":"size"
            },
            {
               "group":"labelCss",
               "key":"paddingTop",
               "value":"0",
               "label":"Top Padding",
               "type":"size"
            },
            {
               "group":"labelCss",
               "key":"paddingRight",
               "value":"0",
               "label":"Right Padding",
               "type":"size"
            },
            {
               "group":"labelCss",
               "key":"paddingBottom",
               "value":"0",
               "label":"Bottom Padding",
               "type":"size"
            },
            {
               "group":"labelCss",
               "key":"paddingLeft",
               "value":"15",
               "label":"Left Padding",
               "type":"size"
            },
            {
               "group":"itemInner",
               "key":"borderSize",
               "value":"1",
               "label":"Border Size",
               "type":"size"
            },
            {
               "group":"itemInner",
               "key":"borderColor",
               "value":"#000000",
               "label":"Border Color",
               "type":"color"
            },
            {
               "group":"itemInner",
               "key":"bottomBorderStyle",
               "value":"solid",
               "label":"Border Style",
               "type":"borderStyle"
            }
         ]'
        ]);

        DB::table('app_css')->insert([
          'css_component' => 'picasa_album_menu_css','css_properties'=>'[
              {
                 "group":"labelCss",
                 "key":"paddingTop",
                 "value":"0",
                 "label":"Top Padding",
                 "type":"size"
              },
              {
                 "group":"labelCss",
                 "key":"paddingRight",
                 "value":"0",
                 "label":"Right Padding",
                 "type":"size"
              },
              {
                 "group":"labelCss",
                 "key":"paddingBottom",
                 "value":"0",
                 "label":"Bottom Padding",
                 "type":"size"
              },
              {
                 "group":"labelCss",
                 "key":"paddingLeft",
                 "value":"15",
                 "label":"Left Padding",
                 "type":"size"
              },
              {
                 "group":"labelCss",
                 "key":"borderSize",
                 "value":"1",
                 "label":"Border Size",
                 "type":"size"
              },
              {
                 "group":"labelCss",
                 "key":"borderColor",
                 "value":"#000000",
                 "label":"Border Color",
                 "type":"color"
              },
              {
                 "group":"labelCss",
                 "key":"bottomBorderStyle",
                 "value":"solid",
                 "label":"Border Style",
                 "type":"borderStyle"
              },
              {
                 "group":"labelCss",
                 "key":"fontName",
                 "value":"Alegreya",
                 "label":"Font Style",
                 "type":"font"
              },
              {
                 "group":"labelCss",
                 "key":"fontSize",
                 "value":"18",
                 "label":"Font Size",
                 "type":"size"
              },
              {
                 "group":"labelCss",
                 "key":"fontColor",
                 "value":"#000000",
                 "label":"Font Color",
                 "type":"color"
              }
           ]'
        ]);

        DB::table('app_css')->insert([
          'css_component' => 'web_view_menu_css','css_properties'=> null
        ]);

        DB::table('app_css')->insert([
          'css_component' => 'tutorial_menu_css','css_properties'=>'[
              {
                 "group":"imgCss",
                 "time":"always",
                 "key":"imgPositionType",
                 "value":"relative",
                 "label":"Image Position Type",
                 "type":"positionType"
              },
              {
                 "group":"buttonCss",
                 "key":"firstView",
                 "value":"true",
                 "label":"First Time Start",
                 "type":"checkbox"
              },
              {
                 "group":"buttonCss",
                 "key":"fontSize",
                 "value":"50",
                 "label":"Close Button Font Size",
                 "type":"size"
              },
              {
                 "group":"buttonCss",
                 "time":"always",
                 "key":"buttonPositionType",
                 "value":"absolute",
                 "label":"Close Button Position Type",
                 "type":"positionType"
              },
              {
                 "group":"buttonCss",
                 "time":"always",
                 "key":"positionTop",
                 "value":"0",
                 "label":"Close Button Bottom Position",
                 "type":"size"
              },
              {
                 "group":"buttonCss",
                 "time":"always",
                 "key":"positionRight",
                 "value":"20",
                 "label":"Close Button Right Position",
                 "type":"size"
              },
              {
                 "group":"buttonCss",
                 "key":"bottomFontColor",
                 "value":"#ffffff",
                 "label":"Close Button Font Color",
                 "type":"color"
              }
           ]'
        ]);


        DB::table('app_css')->insert([
            'css_component' => 'statusbar_css','css_properties'=>'[
                {
                   "key":"background color",
                   "value":"#000000",
                   "label":"Status Bar Color",
                   "type":"color"
                }
             ]'
        ]);

        DB::table('app_css')->insert([
            'css_component' => 'tab_css','css_properties'=>'[
                {
                   "key":"fontsizetab",
                   "value":"22",
                   "label":"Font Size",
                   "type":"size"
                },
                {
                   "key":"fontcolor",
                   "value":"#0fd243",
                   "label":"Font Color",
                   "type":"color"
                },
                {
                   "key":"fontName",
                   "value":"Alegreya",
                   "label":"Font Name",
                   "type":"font"
                },
                {
                    "key":"backgroundColor",
                    "value":"#ff0000",
                    "label":"Background Color",
                    "type":"color"
                },
                {
                    "key":"tab-position",
                    "value":"1",
                    "label":"Tab Position",
                    "type":"position"
                },
                {
                   "key":"tabheight",
                   "value":"64",
                   "label":"Tab Height",
                   "type":"size"
                },
                {
                    "key":"tabcount",
                    "value":"5",
                    "label":"Tab Count",
                    "type":"count"
                }
             ]'
        ]);

        DB::table('app_css')->insert([
            'css_component' => 'contact_menu_css','css_properties'=>'[
              {
                "type": "header",
                "subtype": "h1",
                "label": "Contact Us"
              },
              {
                "type": "text",
                "subtype": "email",
                "label": "Email",
                "className": "form-control",
                "name": "text-1521921526935",
                "placeholder": "Please enter your email"
              },
              {
                "type": "textbox",
                "label": "Text Box",
                "className": "form-control",
                "name": "textbox-1524727968418",
                "placeholder": "Please enter content here ...",
                "paddingTop": "0",
                "paddingRight": "0",
                "paddingBottom": "0",
                "paddingLeft": "0"
              },
              {
                "type": "button",
                "subtype": "submit",
                "label": "Send",
                "className": "btn pull-right full-width btn-primary",
                "name": "button-1521921607323",
                "style": "primary"
              }
            ]'
        ]);

    }
}
