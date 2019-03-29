<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use JWTAuthException;
use App\Redemption;
use App\ModifiedTransaction;
use App\Staff;
use App\Bonus;
use DB;

const FAIL = 0;
const SUCCESS = 1;

class RedemptionController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth.ionic', ['only' => ['addRedemption']]);
        $this->middleware('jwt.auth', ['except' => ['addRedemption']]);
        $this->staffObj = new Staff();
    }

    public function addRedemption(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if ($user)
        {
            $staff = $this->staffObj->where('passcode', $body['passcode'])->where('app_id', $body['app_id'])->first();
            if (!$staff) {
                $response['status'] = FAIL;
                $response['message'] = trans('appmessages.not_found_staff');
            }
            else {
                $body['member_id'] = $user->id;
                $body['staff_id'] = $staff['id'];
                $body['points'] = Bonus::find($body['bonus_id'])->cost;
                if (!Redemption::create($body))
                {
                    $response['status'] = FAIL;
                    $response['message'] = trans('appmessages.create_record_failed');
                }
                else {
                    $response['status'] = SUCCESS;
                }
            }
        }
        else
        {
            $response['status'] = FAIL;
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }

    public function fetchAllRedemptions(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];
        if ($user)
        {
            $response['data'] = $this->getAllRedemptionsForApp($appId);
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }

    private function getAllRedemptionsForApp($appId)
    {
        return DB::table('redemption')
            ->join('users', 'users.id', '=', 'redemption.member_id')
            ->join('staff', 'staff.id', '=', 'redemption.staff_id')
            ->join('bonus', 'bonus.id', '=', 'redemption.bonus_id')
            ->where('redemption.app_id', '=', $appId)
            ->where('redemption.status', '=', 1)
            ->select('users.first_name as member_first_name', 
                'users.last_name as member_last_name', 
                'users.email as member_email', 
                'staff.id as staff_id',
                'staff.first_name as staff_first_name', 
                'staff.last_name as staff_last_name', 
                'bonus.name as bonus_name', 
                'redemption.*')
            ->get();
    }

    public function fetchRedemptionsByCondition(Request $request) {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];
        
        if ($user)
        {
            $query = DB::table('redemption')
            ->join('users', 'users.id', '=', 'redemption.member_id')
            ->join('staff', 'staff.id', '=', 'redemption.staff_id')
            ->join('bonus', 'bonus.id', '=', 'redemption.bonus_id')
            ->where('redemption.app_id', '=', $appId)
            ->select('users.first_name as member_first_name', 
                'users.last_name as member_last_name', 
                'users.email as member_email', 
                'staff.id as staff_id',
                'staff.first_name as staff_first_name', 
                'staff.last_name as staff_last_name', 
                'bonus.name as bonus_name', 
                'redemption.*');
            if (isset($body['staff_id'])) {
                $staff_id = $body['staff_id'];    
                $query->where('redemption.staff_id', '=', $staff_id);
            }
            $response['data'] = $query->get();
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }

    public function fetchRedemptionById(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        
        $editId = $body['id'];

        if($user)
        {
            $response = Redemption::find($editId);
            $response['message'] = trans('appmessages.getRedemptionbyidsuccessfully');
        }
        else {
            $response['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($response);
    }

    public function updateRedemption(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        
        if ($user)
        {
            $editId = $body['id'];
            $RedemptionData = Redemption::find($editId);
            $RedemptionData->update($body);
            $response['data'] = Redemption::where('app_id', $RedemptionData->app_id)->get();
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }

    public function deleteRedemption(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];
        $deleteId = $body['id'];

        if ($user)
        {
            $redemptionData = Redemption::find($deleteId);
            if ($redemptionData) {
                ModifiedTransaction::create([
                    'member_id' => $redemptionData->member_id,
                    'staff_id' => $redemptionData->staff_id,
                    'points' => $redemptionData->points,
                    'app_id' => $redemptionData->app_id,
                    'note' => 'Refunded Redemption'
                ]);
            }
            Redemption::destroy($deleteId);
            $response['data'] = $this->getAllRedemptionsForApp($appId);
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }
}
