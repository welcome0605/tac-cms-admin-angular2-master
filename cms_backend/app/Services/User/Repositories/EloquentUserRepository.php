<?php

namespace App\Services\User\Repositories;

use DB;
use Config;
use App\Services\User\Contracts\UserRepository;
use App\User;
use App\Services\Repositories\Eloquent\EloquentBaseRepository;

class EloquentUserRepository extends EloquentBaseRepository implements UserRepository {

    public function __construct() 
    {
        $this->objUser = new User();
    }

    public function checkEmail($email) {
        return $this->objUser->checkEmail($email);
    }

    public function checkRewardEmail($email, $app_id, $type) {
        // return $this->objUser->checkEmail($email);
        return DB::table('users')
            ->join('app_assign_user', 'users.id', '=', 'app_assign_user.user_id')
            ->where('users.email', '=', $email)
            ->where('users.status', '=', '1')
            ->where('users.role_id', '=', '3')
            ->where('users.type', '=', $type)
            ->where('app_assign_user.app_basic_id', '=', $app_id)
            ->select('users.*')
            ->first();
    }    

    public function saveUserData($userData)
    {
        return $this->objUser->saveData($userData);
    }

    public function checkOtp($otp)
    {
        return $this->objUser->checkOtp($otp);
    }

    public function checkRewardOtp($otp, $email)
    {
        return $this->objUser->checkRewardOtp($otp, $email);   
    }

    public function checkEmailExist($email,$user_id)
    {
        return $this->objUser->checkEmailExist($email,$user_id);
    }

    public function getUserByOtp($otp)
    {
        if ((int)$otp == 0)
            return null;
        return $this->objUser->getUserByOtp($otp);
    }
    
    public function getUsersDataById($editId)
    {
        $data = $this->objUser->getUserDetailsById($editId);
        return $data;
    }
    
    public function getAllUsersData()
    {
        return $this->objUser->getAllUsersDetails();
    }

    //gjc 0407
    public function getAllUsersMoreDetails()
    {
        return $this->objUser->getAllUsersMoreDetails();
    }

    public function getUserNameById($user_id)
    {
        return $this->objUser->getUserNameById($user_id);
    }

    public function getAppMembersData($app_id)
    {
        return $this->objUser->getAppMembersDetails($app_id);
    }
    
    public function deleteUserDetails($deleteId)
    {
        return $this->objUser->deleteUser($deleteId);
    }
}
