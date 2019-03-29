<?php

namespace App\Services\AppAssignUser\Contracts;
use App\Services\Repositories\BaseRepository;
use App\Services\AppAssignUser\Entities\App;

interface AppAssignUserRepository extends BaseRepository
{  
   public function saveAppAssignUserData($appData);
   public function getAllAppAssignUserData();
   public function deleteAppAssignUser($id);
   public function getAppByAssignUser($user_id);
   public function getUserByAppId($app_id);
}
