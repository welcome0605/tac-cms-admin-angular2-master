<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $table = 'members';
    protected $fillable = ['username', 'email', 'first_name', 'last_name', 'password', 'point', 'notification', 'app_id'];

    public function setFirstNameAttribute($value)
    {
        $this->attributes['first_name'] = $value == null ? '': $value;
    }

    public function setLastNameAttribute($value)
    {
        $this->attributes['last_name'] = $value == null ? '': $value;
    }

    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = $value == null ? '': $value;
    }
}
