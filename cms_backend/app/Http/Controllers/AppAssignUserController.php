<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use JWTAuthException;
use Config;
use Auth;
use Helpers;
use App\Services\AppAssignUser\Contracts\AppAssignUserRepository;
use App\Services\User\Contracts\UserRepository;
use App\Services\App\Contracts\AppRepository;


class AppAssignUserController extends Controller {

    public function __construct(AppAssignUserRepository $AppAssignUserRepository,UserRepository $UserRepository,AppRepository $AppRepository)
    {
        $this->middleware('jwt.auth');
        $this->AppAssignUserRepository = $AppAssignUserRepository;
        $this->UserRepository = $UserRepository;
        $this->AppRepository = $AppRepository;
    }

    public function index()
    {
        $user = JWTAuth::parseToken()->authenticate();

        if($user)
        {
            $appAssignData = $this->AppAssignUserRepository->getAllAppAssignUserData();
            $data = array();
            foreach($appAssignData as $key=>$val)
            {
                $appDetail = $val->getAppData;
                $userDetail = $val->getUserData;
                $value = array();
                $value['id'] = $val->id;
                $value['app_id'] = $appDetail->app_unique_id;
                $value['app_name'] = $appDetail->app_name;
                $value['user_name'] = $userDetail->first_name.' '.$userDetail->last_name;
                $data[] = $value;
            }
            $outputArray['data'] = $data;
            $outputArray['status'] = '1';
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function saveAssignUser(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $body = $request->all();
       // echo JWTAuth::getToken(); exit;
        if($user)
        {
            if($body['user_id'])
            {

                $Detail = $this->AppAssignUserRepository->deleteAppAssignUserByUserId($body['user_id']);
            }

            $app_basic_id = $body['app_basic_id'];
            $user_id = $body['user_id'];
            $insertData['app_basic_id'] = explode(",", $app_basic_id);
            $insertData['user_id'] = $user_id;

            foreach ($insertData['app_basic_id'] as $key => $value) {
                 $insertAppData['app_basic_id'] = $value;
                 $insertAppData['user_id'] = $user_id;
                 $Detail = $this->AppAssignUserRepository->saveAppAssignUserData($insertAppData);
            }

            $outputArray['status'] = '1';
            $outputArray['message'] = trans('appmessages.app_user_assigned_msg');
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function getAllApp()
    {
        $user = JWTAuth::parseToken()->authenticate();

        if($user)
        {
            $appData = $this->AppRepository->getAppForAssignUser();
            $data_array = $appData->toArray();
            $uniqueArray = array_values(array_map("unserialize", array_unique(array_map("serialize", $data_array))));
            $outputArray['data'] = $uniqueArray;
            $outputArray['status'] = '1';
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function getAllUsers()
    {
        $user = JWTAuth::parseToken()->authenticate();

        if($user)
        {
            $getAllUsers = $this->UserRepository->getAllUsersData('1');
            $data = $getAllUsers->toArray();
            $outputArray['data'] = $data;
            $outputArray['status'] = '1';
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function deleteAssignUser(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $body = $request->all();
        if($user)
        {
            $id = $body['id'];
            $Detail = $this->AppAssignUserRepository->deleteAppAssignUser($id);

            $outputArray['status'] = '1';
            $outputArray['message'] = trans('appmessages.delete_app_user_assigned_msg');
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

}
