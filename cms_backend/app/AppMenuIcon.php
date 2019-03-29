<?php

namespace App;
use DB;
use Illuminate\Database\Eloquent\Model;

class AppMenuIcon extends Model
{
 
    public function getMenuIconDataFun(){
        $result = DB::table('menu_icon')->get()->toArray();
        return $result;    
    }
}
