<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use JWTAuthException;
use App\ReviewSetting;

class ReviewSettingController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth');
    }

    public function getSettingsById(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];

        if ($user)
        {
            $response['data'] = ReviewSetting::where('app_id', $appId)->get();
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }

    public function updateSetting(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        
        if ($user)
        {
            $editId = $body['app_id'];
            $data = ReviewSetting::where('app_id', $editId)->get();
            // add new element when does not exist
            $buffer['app_id'] = $body['app_id'];
            $buffer['json'] = $body['json'];
            if ($data->count() == 0) {
                $settingData = ReviewSetting::create($buffer);
            } else {
              $settingData = ReviewSetting::where('app_id', $editId)->update($buffer);   
            }
        }
        else
        {
            $settingData['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($settingData);
    }

}