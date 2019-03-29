<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AppMenuType extends Model 
{

    protected $table = 'menu_type';
    protected $guarded = [];

   
    public function getMenuTypeData()
    {
        $return = AppMenuType::where('status','1')->get();        
        return $return;
    }
    public function getMenuTypeSlugById($menu_type)
    {
        $return['data'] = AppMenuType::where('id', $menu_type)->first();
        $return['length'] = AppMenuType::where('id', $menu_type)->count();
        return $return;
    }

}
