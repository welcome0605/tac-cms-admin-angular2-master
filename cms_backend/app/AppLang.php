<?php

namespace App;
use DB;
use Illuminate\Database\Eloquent\Model;

class AppLang extends Model
{

    protected $table = 'industry_type';
    protected $guarded = [];

    public function getLangData()
    {

        $result = DB::table('language_type')
                    ->get()
                    ->toArray();
        
        return $result;
    }
}
