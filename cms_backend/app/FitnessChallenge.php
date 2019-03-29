<?php

namespace App;
use Config;

use Illuminate\Database\Eloquent\Model;
use DB;
use App\Quotation;
class FitnessChallenge extends Model 
{

  /**
   * The database table used by the model.
   *
   * @var string
   */
    
    protected $table = 'fitness_challenge';
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
    public function saveFitnessChallengeLoop($data)
    {
        $result = DB::table('fitness_challenge_loop')->insert($data);
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
    public function deleteFitnessChallengeLoop($id)
    {
        $result = DB::table('fitness_challenge_loop')->where('id', $id)->update(['status' => Config::get('constant.DELETED_FLAG')]);
        return $result;
    }
    public function getAllFitnessChallengeday()
    {
        $result = DB::table('fitness_challenge_day')->whereRaw('status IN (1)')->get();
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
    public function getFitnessChallengeLoopById($id)
    {
        $result = DB::table('fitness_challenge_loop')->where('id', $id)->whereRaw('status IN (1,2)')->first();
        return $result;
    }
    public function updateFitnessChallengeData($updatedId, $fitnessData) 
    {
        $result = FitnessChallenge::where('id', $updatedId)->update($fitnessData);
        return $result;
    }
    public function updateFitnessChallengeDayData($updatedId, $fitnessDayData) 
    {
        $result = DB::table('fitness_challenge_day')->where('id', $updatedId)->update(['challenge_id'=>$fitnessDayData['challenge_id'],'title'=>$fitnessDayData['title'],'day_no'=>$fitnessDayData['day_no'],'image'=>$fitnessDayData['image'],'video_url'=>$fitnessDayData['video_url'],'status'=>$fitnessDayData['status']]);
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
    public function getAllFitnessChallengeloops() 
    {
        $getData = DB::table('fitness_challenge_loop')->whereRaw('status IN (1,2)')->get();
        return $getData;
    }
}


?>