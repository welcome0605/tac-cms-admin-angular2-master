<?php

namespace App;
use DB;
use Illuminate\Database\Eloquent\Model;

class AppIndustryType extends Model
{

    protected $table = 'industry_type';
    protected $guarded = [];

    public function getIndustryType()
    {
        $mainArray = [];
        $resultIndustry = DB::table('industry_type')
                    ->get()
                    ->toArray();
        $mainArray['industry_type'] = $resultIndustry;

        $resultCategory = DB::table('category_type')
                    ->get()
                    ->toArray();
        $mainArray['category_type'] = $resultCategory;

        $resultPrice = DB::table('price_type')
                    ->get()
                    ->toArray();
        $mainArray['price_type'] = $resultPrice;

        return $mainArray;                     
    }
}
