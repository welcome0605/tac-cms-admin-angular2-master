<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AppAssignUser extends Model 
{

    protected $table = 'app_assign_user';
    protected $guarded = [];

    public function saveData($data) 
    {
        if(isset($data['id']) && $data['id'] > 0)
        {
            $return = AppAssignUser::where('id', $data['id'])->update($data);
        }
        else
        {
            $return = AppAssignUser::create($data);
        }
        return $return;
    }

    public function getAppAssignUserData()
    {
        $return = AppAssignUser::where('status', 1)->get();        
        return $return;
    }

    public function getAppData()
    {
        $return = $this->belongsTo('App\AppBasic', 'app_basic_id');
        return $return;
    }
    public function getUserData()
    {
        $return = $this->belongsTo('App\User', 'user_id');
        return $return;
    }

    public function deleteAppAssignUser($id)
    {
        
        $return = AppAssignUser::where('id', $id)->delete();        
        return $return;
    }

    public function deleteAppAssignUserByUserId($id)
    {
        $return = AppAssignUser::where('user_id', $id)->delete();        
        return $return;
    }

    public function getAppByAssignUser($user_id)
    {
        $return = AppAssignUser::where('user_id', $user_id)->get();        
        return $return;
    }

    public function getMyUserData()
    {
        $return = $this->belongsTo('App\User', 'id');
        return $return;
    }
    
    public function getUserByAppId($app_id)
    {
        $return = AppAssignUser::where('app_basic_id', $app_id)->get();        
        return $return;
    }
}
