<?php

namespace App;
use DB;
use Illuminate\Database\Eloquent\Model;

class AppFontFamily extends Model
{

    protected $table = 'industry_type';
    protected $guarded = [];

    public function getFontTypeData()
    {
        $getFontFamily = DB::table('fontfamily_type')
                    ->orderBy('name','asc')
                    ->get();
//                  ->toArray();
        
        $result = $getFontFamily->toArray();
        return $result;
    }
}
