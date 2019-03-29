<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use JWTAuthException;
use App\Checkin;
use App\Staff;
use App\ModifiedTransaction;
use App\ReviewSetting;
use DB;

const FAIL = 0;
const SUCCESS = 1;

class IonicController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth.ionic', ['except' => ['getRewardSettingsForApp']]);

        $this->staffObj = new Staff();
    }

    public function fetchCurrentPoints(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];

        if ($user)
        {
        	$checkin_total = DB::table('checkin')
        		->where('member_id', '=', $user->id)
        		->where('app_id', '=', $appId)
        		->where('status', '=', 1)
        		->sum('points');
        	
        	$redemption_total = DB::table('redemption')
        		->where('member_id', '=', $user->id)
        		->where('app_id', '=', $appId)
        		->where('status', '=', 1)
        		->sum('points');

        	$response['point'] = $checkin_total - $redemption_total;
        	$response['status'] = SUCCESS;
        } else {
        	$response['status'] = FAIL;
        	$response['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($response);
    }

    public function fetchTotalPoints(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];

        if ($user)
        {
            $checkin_total = DB::table('checkin')
                ->where('member_id', '=', $user->id)
                ->where('app_id', '=', $appId)
                ->where('status', '=', 1)
                ->sum('points');

            $response['point'] = $checkin_total;
            $response['status'] = SUCCESS;
        } else {
            $response['status'] = FAIL;
            $response['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($response);
    }

    public function fetchAllRewards(Request $request)
    {
    	$user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];

        if ($user)
        {
        	$response['data'] = DB::table('bonus')
        		->where('app_id', '=', $appId)
        		->where('active', '=', 1)
        		->select('*')
        		->get();

        	$response['status'] = SUCCESS;
        } else {
        	$response['status'] = FAIL;
        	$response['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($response);	
    }

    public function fetchAllRedemptionsForUser(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];
        if ($user)
        {
            $response['redeems'] = DB::table('redemption')
            ->join('users', 'users.id', '=', 'redemption.member_id')
            ->join('staff', 'staff.id', '=', 'redemption.staff_id')
            ->join('bonus', 'bonus.id', '=', 'redemption.bonus_id')
            ->where('redemption.app_id', '=', $appId)
            ->where('redemption.member_id', '=', $user->id)
            ->where('redemption.status', '=', 1)
            ->select(
                'bonus.*', 
                'redemption.created_at as redemption_date')
            ->get();
            $response['status'] = SUCCESS;
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
            $response['status'] = FAIL;
        }

        return response()->json($response);
    }

    public function getRewardSettingsForApp(Request $request)
    {
        $body = $request->all();
        $appId = $body['app_id'];
        $settings = ReviewSetting::where('app_id', $appId)->first();
        if ($settings)
        {
            $response['settings'] = json_decode($settings->json);
            $response['status'] = SUCCESS;
        } else {
            $response['status'] = FAIL;
            $response['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($response);
    }
}
