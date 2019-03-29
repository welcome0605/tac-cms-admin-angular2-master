<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ReviewSetting extends Model
{
    protected $table = 'reviewsetting';
    protected $fillable = ['app_id', 'json'];

    public function setJsonAttribute($value)
    {
        $this->attributes['json'] = $value == null ? '': $value;
    }

}
