<?php

namespace App\Services\User\Contracts;
use App\Services\Repositories\BaseRepository;
use App\Services\User\Entities\User;

interface UserRepository extends BaseRepository
{   
   public function checkEmail($email);
   public function checkRewardEmail($email, $app_id, $type);
   public function saveUserData($userData);
   public function checkOtp($otp);
   public function checkRewardOtp($otp, $email);
   public function checkEmailExist($email,$user_id);
   public function getUserByOtp($otp);
   public function getUsersDataById($editId);
   public function getUserNameById($user_id);
   public function getAllUsersData();
   public function getAllUsersMoreDetails();//gjc 0407
   public function getAppMembersData($app_id);
   public function deleteUserDetails($deleteId);
   
}
