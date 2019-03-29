<?php

namespace App\Services\AppAssignUser\Repositories;

use DB;
use Config;
use App\Services\AppAssignUser\Contracts\AppAssignUserRepository;
use App\AppAssignUser;
use App\Services\Repositories\Eloquent\EloquentBaseRepository;

class EloquentAppAssignUserRepository extends EloquentBaseRepository implements AppAssignUserRepository {

    public function __construct() 
    {
        $this->objAppAssignUser = new AppAssignUser();
    }

    public function saveAppAssignUserData($appAssignUserData)
    {
        return $this->objAppAssignUser->saveData($appAssignUserData);
    }

    public function getAllAppAssignUserData()
    {
        return $this->objAppAssignUser->fetchAllAppUserData();
    }

    public function getAppByAssignUser($user_id)
    {
        return $this->objAppAssignUser->getAppByAssignUser($user_id);
    }


    public function deleteAppAssignUser($id)
    {
        return $this->objAppAssignUser->deleteAppAssignUser($id);
    }

    public function deleteAppAssignUserByUserId($id)
    {
        return $this->objAppAssignUser->deleteAppAssignUserByUserId($id);
    }
    public function getUserByAppId($app_id)
    {
        return $this->objAppAssignUser->getUserByAppId($app_id);
    }

    
}
