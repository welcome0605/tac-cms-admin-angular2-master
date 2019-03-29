<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AppSection extends Model
{
    protected $table = 'app_section';

    protected $guarded = [];


    public function getSectionData($slug)
    {
        $return = AppSection::select('*')->where('app_section_slug',$slug)->first();
        return $return;
    }
    public function getAllAppSection()
    {
        $return = AppSection::select('*')->get();
        return $return;
    }
}
