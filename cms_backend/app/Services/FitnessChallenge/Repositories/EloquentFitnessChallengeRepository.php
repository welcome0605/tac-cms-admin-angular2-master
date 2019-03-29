<?php

namespace App\Services\FitnessChallenge\Repositories;

use DB;
use Config;
use App\Services\FitnessChallenge\Contracts\FitnessChallengeRepository;
use App\FitnessChallenge;
use App\FitnessChallengeDay;
use App\FitnessChallengeLoop;

use App\Services\Repositories\Eloquent\EloquentBaseRepository;

class EloquentFitnessChallengeRepository extends EloquentBaseRepository implements FitnessChallengeRepository 
{

    public function __construct() 
    {
        $this->objFitnessModel = new FitnessChallenge();
        $this->objFitnessDayModel = new FitnessChallengeDay();
        $this->objFitnessLoopModel = new FitnessChallengeLoop();
    }
    public function getAllFitnessChallenges() 
    {
        $result = $this->objFitnessModel->getAllFitnessChallenges();
        return $result;
    }
    public function addFitnessChallenge($data)
    {
    	$result = $this->objFitnessModel->saveFitnessChallenge($data);
        return $result;
    }
    public function addFitnessChallengeLoop($data)
    {
        $result = $this->objFitnessModel->saveFitnessChallengeLoop($data);
        return $result;
    }
    public function addFitnessChallengeDay($data)
    {
        $result = $this->objFitnessModel->saveFitnessChallengeDay($data);
        return $result;
    }
    public function deleteFitnessChallenge($id)
    {
        $data = $this->objFitnessModel->deleteFitnessChallenge($id);
        return $data;
    }
    public function deleteFitnessChallengeDay($id)
    {
        $data = $this->objFitnessModel->deleteFitnessChallengeDay($id);
        return $data;
    }
    public function deleteFitnessChallengeLoop($id)
    {
        $data = $this->objFitnessModel->deleteFitnessChallengeLoop($id);
        return $data;
    }
    public function fetchFitnessChallengeById($id)
    {
    	$data = $this->objFitnessModel->getFitnessChallengeById($id);
        return $data;
    }
    public function fetchFitnessChallengeDayById($id)
    {
        $data = $this->objFitnessModel->getFitnessChallengeDayById($id);
        return $data;
    }
    public function updateFitnessChallengeData($id,$data)
    {
    	$data = $this->objFitnessModel->updateFitnessChallengeData($id,$data);
    	return $data;
    }
    public function updateFitnessChallengeDayData($id,$data)
    {
        $data = $this->objFitnessDayModel->updateFitnessChallengeDayData($id,$data);
        return $data;
    }
    public function getAllFitnessChallengesDay() 
    {
        $result = $this->objFitnessModel->getAllFitnessChallengesDay();
        return $result;
    }
    public function getAllActiveFitnessChallenges() 
    {
        $result = $this->objFitnessModel->getAllActiveFitnessChallenges();
        return $result;
    }
    public function getAllFitnessChallengeloops() 
    {
        $result = $this->objFitnessModel->getAllFitnessChallengeloops();
        return $result;
    }
    public function getAllFitnessChallengeday()
    {
        $result = $this->objFitnessModel->getAllFitnessChallengeday();
        return $result;
    }
    public function fetchFitnessChallengeLoopById($id)
    {
        $data = $this->objFitnessModel->getFitnessChallengeLoopById($id);
        return $data;
    }
    public function updateFitnessChallengeLoopData($data)
    {
        $data = $this->objFitnessLoopModel->updateFitnessChallengeLoopData($data);
        return $data;
    }
}
