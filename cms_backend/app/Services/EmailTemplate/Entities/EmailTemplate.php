<?php

namespace App\Services\EmailTemplate\Entities;
use Illuminate\Database\Eloquent\Model;

class EmailTemplate extends Model
{
    protected $table = 'email_template';
    protected $fillable = ['id','et_name','et_pseudo_name','et_subject','et_body', 'created_at', 'updated_at', 'status'];
}
