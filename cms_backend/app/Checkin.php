<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Checkin extends Model
{
    protected $table = 'checkin';
    protected $fillable = ['member_id', 'staff_id', 'note', 'points', 'status', 'app_id'];

    public function setNoteAttribute($value)
    {
        $this->attributes['note'] = $value == null ? '': $value;
    }

    public function setMemberIdAttribute($value)
    {
        $this->attributes['member_id'] = $value == null ? 0: $value;
    }

    public function setStaffIdAttribute($value)
    {
        $this->attributes['staff_id'] = $value == null ? 0: $value;
    }

    public function setPointsAttribute($value)
    {
        $this->attributes['points'] = $value == null ? 0: $value;
    }
}
