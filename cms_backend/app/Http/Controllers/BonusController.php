<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use JWTAuthException;
use App\Bonus;

class BonusController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth');
    }

    public function addBonus(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if ($user)
        {
            $bonusData = Bonus::create($body);
        }
        else
        {
            $bonusData['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($bonusData);
    }

    public function fetchAllBonuses(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];
        if ($user)
        {
            $response['data'] = Bonus::where('app_id', $appId)->get();
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }

    public function fetchBonusById(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        
        $editId = $body['id'];

        if($user)
        {
            $response = Bonus::find($editId);
            $response['message'] = trans('appmessages.getBonusbyidsuccessfully');
        }
        else {
            $response['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($response);
    }

    public function updateBonus(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        
        if ($user)
        {
            $editId = $body['id'];
            $BonusData = Bonus::find($editId);
            $BonusData->update($body);
            $response['data'] = Bonus::where('app_id', $BonusData->app_id)->get();
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }

    public function deleteBonus(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];
        $deleteId = $body['id'];
        $s3_url = Bonus::find($deleteId)->image;


        if ($user)
        {
            Bonus::destroy($deleteId);
            $response['data'] = Bonus::where('app_id', $appId)->get();
            $response['s3_url'] = $s3_url;
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }
}
