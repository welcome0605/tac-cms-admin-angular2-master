<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;

class AppBasicDetail extends Model
{

    protected $table = 'app_basic_detail';
    protected $guarded = [];

    public function saveData($data)
    { 
        // print_r($data['id']);
        // die("__asdasd");
        if(isset($data['id']) && $data['id']>0)
        {
        
        
            $return = AppBasicDetail::where('id', $data['id'])->update($data);                 
            // $return = DB::table('app_basic_detail')
            //                  ->where('app_basic_id', $data['id'])
            //                  ->where('app_section_slug', 'google_analytic')
            //                  ->update([
            //                     'section_json_data' => '22222222222222222'
            //                     ]);
        }
        else
        {
            $return = AppBasicDetail::create($data);
        }
        return $return;
    }

    public function getData($id)
    {
        $return = AppBasicDetail::where('id', $id)->first();
        return $return;
    }
}
