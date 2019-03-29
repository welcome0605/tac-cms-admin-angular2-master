<?php

namespace App;
use Config;

use Illuminate\Database\Eloquent\Model;
use DB;
use App\Quotation;
class FitnessChallengeDay extends Model 
{

  /**
   * The database table used by the model.
   *
   * @var string
   */
    
    protected $table = 'fitness_challenge_day';
    protected $guarded = [];

    public function getAllFitnessChallenges() 
    {
        $getData = FitnessChallenge::whereRaw('status IN (1,2)')->get();
        return $getData;
    }
    public function saveFitnessChallenge($fitnessData)
    {
        $result = FitnessChallenge::create($fitnessData);
        return $result;
    }
    public function saveFitnessChallengeDay($data)
    {
        $result = DB::table('fitness_challenge_day')->insert($data);
        return $result;
    }
    public function deleteFitnessChallenge($id)
    {
       $result = FitnessChallenge::where('id', $id)->update(['status' => Config::get('constant.DELETED_FLAG')]);
        return $result;
    }
    public function deleteFitnessChallengeDay($id)
    {
        $result = DB::table('fitness_challenge_day')->where('id', $id)->update(['status' => Config::get('constant.DELETED_FLAG')]);
        return $result;
    }
    public function getFitnessChallengeById($id)
    {
        $result = FitnessChallenge::where('id', $id)->whereRaw('status IN (1,2)')->first();
        return $result;
    }
    public function getFitnessChallengeDayById($id)
    {
        $result = DB::table('fitness_challenge_day')->where('id', $id)->whereRaw('status IN (1,2)')->first();
        return $result;
    }
    public function updateFitnessChallengeData($updatedId, $fitnessData) 
    {
        $result = FitnessChallenge::where('id', $updatedId)->update($fitnessData);
        return $result;
    }
    public function updateFitnessChallengeDayData($updatedId, $fitnessDayData) 
    {
        //print_r($fitnessDayData);die;  
        $result = FitnessChallengeDay::where('id', $updatedId)->update($fitnessDayData);
            
        return $result;
    }
    public function getAllFitnessChallengesDay() 
    {
        $getData = DB::table('fitness_challenge_day')->whereRaw('status IN (1,2)')->get();
        return $getData;
    }
    public function getAllActiveFitnessChallenges()
    {
        $getData = FitnessChallenge::whereRaw('status IN (1)')->get();
        return $getData;
    }
}


?>