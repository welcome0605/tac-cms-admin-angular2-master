<?php

namespace App\Services\FitnessChallenge\Entities;
use Illuminate\Database\Eloquent\Model;

class FitnessChallenge extends Model
{
    protected $table = 'fitness_challenge';
    protected $fillable = ['id','title','image','video_url','description', 'price','created_at', 'updated_at'];
}
