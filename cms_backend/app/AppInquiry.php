<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AppInquiry extends Model
{
    //
    
    protected $table = 'app_inquiry';
    protected $guarded = [];

    public function saveData($data) 
    {
        if(isset($data['id']) && $data['id']>0)
        {
            $return = AppInquiry::where('id', $data['id'])->update($data);
        }
        else
        {
            $return = AppInquiry::create($data);                  
        }
        return $return;
    }
}
