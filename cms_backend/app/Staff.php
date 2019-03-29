<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    protected $table = 'staff';
    protected $fillable = ['username', 'email', 'first_name', 'last_name', 'role', 'passcode', 'password', 'notification', 'app_id'];

    public function setFirstNameAttribute($value)
    {
        $this->attributes['first_name'] = $value == null ? '': $value;
    }

    public function setLastNameAttribute($value)
    {
        $this->attributes['last_name'] = $value == null ? '': $value;
    }

    public function setPasscodeAttribute($value)
    {
        $this->attributes['passcode'] = $value == null ? '': $value;
    }

    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = $value == null ? '': $value;
    }
}
