<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FireBaseToken extends Model
{
    protected $table = 'firebase';
    protected $fillable = ['token','server_key'];

    public function setTokenAttribute($value)
    {
        $this->attributes['token'] = $value == null ? '': $value;
    }

}
