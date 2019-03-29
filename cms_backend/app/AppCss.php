<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;
class AppCss extends Model 
{

    protected $table = 'app_css';
    protected $guarded = [];

    public function getAllCssData() 
    {
     $result =  DB::table('app_css')->get();
     return $result;
    }
    
    public function getAppCssBySlug($appCssSlug) 
    {
        $result['data'] =  AppCss::where('css_component', $appCssSlug)->first();
        $result['length'] = AppCss::where('css_component', $appCssSlug)->count();
        return $result;
    }
}
