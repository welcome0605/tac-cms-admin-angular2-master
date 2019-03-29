<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Bonus extends Model
{
    protected $table = 'bonus';
    protected $fillable = ['name', 'description', 'cost', 'image', 'active', 'app_id'];

    public function setDescriptionAttribute($value)
    {
        $this->attributes['description'] = $value == null ? '': $value;
    }

    public function setCostAttribute($value)
    {
        $this->attributes['cost'] = $value == null ? 0: $value;
    }

    public function setImageAttribute($value)
    {
        $this->attributes['image'] = $value == null ? '': $value;
    }

    public function setActiveAttribute($value)
    {
        $this->attributes['active'] = $value == null ? 1 : $value;
    }
}
