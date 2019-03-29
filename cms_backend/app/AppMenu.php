<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;
class AppMenu extends Model 
{

    protected $table = 'app_menu';
    protected $guarded = [];

    public function saveData($data) 
    {
        if(isset($data['id']) && $data['id'] > 0)
        {
            $return = AppMenu::where('id', $data['id'])->update($data);
        }        
        else
        {
            $return = AppMenu::create($data);
        }
        return $return;
    }

    public function getAppMenuData($appId)
    {
//        $return = AppMenu::where('app_basic_id', $appId)->where('status','1')->orderBy('order','asc')->get();      
//        return $return;
        
        $return =   DB::table('app_menu')
                    ->select('app_menu.*', 'menu_type.name', 'menu_type.slug', 'menu_type.menu_type_icon', 'menu_type.id as menuTypeId')
                    ->leftJoin('menu_type', 'app_menu.menu_type', '=', 'menu_type.id')
                    ->where('app_menu.app_basic_id', $appId)
                    ->where('app_menu.status', '1')
                    ->whereRaw('app_menu.status IN (1,2)')
                    ->orderBy('app_menu.order', 'asc')
                    ->get();
          return $return;
        
    }

    public function getMenuDataById($id)
    {
        return AppMenu::find($id);
    }
    
    public function checkParentMenuCount($app_id) 
    {
        $return = AppMenu::where('app_basic_id', $app_id)->where('status','1')->where('is_parent','0')->count();
        return $return;
    }

    public function checkTabMenuCount($app_id) 
    {
      $return = AppMenu::where('app_basic_id', $app_id)->where('status','1')->where('is_parent','0')->where('tab_show','1')->count();
      return $return;
    }
    
    public function setDefaultTabMenu($app_id)
    {
      $parentMenuCount = $this->checkParentMenuCount($app_id);
      if($parentMenuCount > 5);
        $parentMenuCount = 5;

      
        $parentArr = AppMenu::select('id')
          ->where('app_basic_id', $app_id)
          ->where('status','1')
          ->where('is_parent','0')
          ->orderBy('order','asc')
          ->limit(5)
          ->get();

        foreach($parentArr as $key=>$parentMenu) {
          AppMenu::where('id', $parentMenu['id'])->update(['tab_show'=>1]);
        }
    }

    public function checkListMenuShowChildOnCount($app_id) 
    {
        $result = AppMenu::where('app_basic_id', $app_id)
                    ->where('status', 1)
                    ->where('is_parent', 0)
                    ->where('menu_type', 4)
                    ->where('menu_type_json_data->show_child_on', '1')
                    ->count();
       
        // count 0 means tab menu selected otherwise not
        
        if($result == 0)
        {
            return '1';
        }
        else
        {
            return '2';
        }
    }
    
    public function getParentMenuData($parentId)
    {
        $return = AppMenu::where('id', $parentId)->where('status', '1')->first();       
        return $return;
    }
    
    public function deleteAppMenu($id)
    {
        $return = AppMenu::where('id', $id)->delete();        
        return $return;
    }

    public function getOrder($app_basic_id,$is_parent)
    {
        if($is_parent!=0)
        {
            $return = AppMenu::where('is_parent', $is_parent)->where('status','1')->orderBy('order','desc')->first(); 
        }
        else
        {
            $return = AppMenu::where('app_basic_id', $app_basic_id)->where('status','1')->orderBy('order','desc')->first(); 
        }
        return $return;
    }

    public function updateOrder($app_basic_id,$is_parent,$order)
    {
        if($is_parent!=0)
        {
            $return = AppMenu::where('is_parent', $is_parent)->where('status','1')->where('order','>',$order)->decrement('order'); 
        }
        else
        {
            $return = AppMenu::where('app_basic_id', $app_basic_id)->where('status','1')->where('order','>',$order)->decrement('order'); 
        }
        return $return;
    }
    
    public function getAllMenuData($menuData,$subMenuData)
    {
        # code...
        $a = count($menuData);

            for($i = 0; $i < $a; $i++)
            {
                $updatedIndex = ($i === 0) ? 1 : $i+1 ; 
                    $data = $menuData[$i];
                    $menuName = $data['menu'];
                    $menuId = $data['ide'];

                    $updateParent = DB::table('app_menu')
                            ->where('id',$menuId)
                            ->update(['order' => $updatedIndex]);
                            
            }   
        return $updateParent; 
    }

    public function getSubMenuForParent($parentId,$newCreatedId,$basicId) {
        $result =  AppMenu::where('is_parent', $parentId)->where('status','1')->orderBy('order','asc')->get();
        
        //save sub menu for this child menu
        if(isset($result) && !empty($result)){
            foreach($result as $key=>$menu)
            {
                $subMenuData = [];
                $subMenuData['is_parent'] = $newCreatedId;
                $subMenuData['app_basic_id'] = $basicId;
                $subMenuData['menu_name'] = $menu->menu_name;
                $subMenuData['menu_icon'] = $menu->menu_icon;
                $subMenuData['order'] = $menu->order;  
                $subMenuData['menu_type'] = $menu->menu_type;  
                $subMenuData['menu_type_json_data'] = $menu->menu_type_json_data;  
                $subMenuData['is_display_on_app'] = $menu->is_display_on_app;  
                $subMenuData['status'] = $menu->status;
                $data = AppMenu::create($subMenuData); 
            }
        }
        return $result;
    }
    public function getMenuDetailsByAppid($id)
    {
        # code...

        $getAll = AppMenu::where('app_basic_id', $id)->where('status',1)->get();

        return $getAll;
    }
}
