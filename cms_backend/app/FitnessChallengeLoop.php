<?php

namespace App;
use Config;

use Illuminate\Database\Eloquent\Model;
use DB;
use App\Quotation;
class FitnessChallengeLoop extends Model 
{
	/**
   * The database table used by the model.
   *
   * @var string
   */
    
    protected $table = 'fitness_challenge_loop';
    protected $guarded = [];
    public function updateFitnessChallengeLoopData($data)
    {
        $result = FitnessChallengeLoop::where('id', $data['id'])->update($data);
        return $result;
    }

}
?>
