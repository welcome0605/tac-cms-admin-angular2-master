<?php

namespace App\Services\FitnessChallenge\Contracts;
use App\Services\Repositories\BaseRepository;
use App\Services\FitnessChallenge\Entities\FitnessChallenge;

interface FitnessChallengeRepository extends BaseRepository
{   

 public function getAllFitnessChallenges();

 public function addFitnessChallenge($fitnessData);

 public function addFitnessChallengeDay($data);

 public function deleteFitnessChallenge($id);

 public function fetchFitnessChallengeById($id);
   
 public function updateFitnessChallengeData($id,$data);

 public function getAllFitnessChallengesDay();

 public function getAllActiveFitnessChallenges();

 public function deleteFitnessChallengeDay($id);

 public function fetchFitnessChallengeDayById($id);

 public function updateFitnessChallengeDayData($id,$data);

 public function getAllFitnessChallengeloops();

 public function deleteFitnessChallengeLoop($id);

 public function getAllFitnessChallengeday();

 public function addFitnessChallengeLoop($data);

 public function fetchFitnessChallengeLoopById($id);

 public function updateFitnessChallengeLoopData($data);
   
}
