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
use DB;

const FAIL = 0;
const SUCCESS = 1;

class CheckinController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth.ionic', ['only' => ['addCheckin']]);
        $this->middleware('jwt.auth', ['except' => ['addCheckin']]);

        $this->staffObj = new Staff();
    }

    public function addCheckin(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if ($user)
        {
            $staff = $this->staffObj->where('passcode', $body['passcode'])->where('app_id', $body['app_id'])->first();
            if (!$staff) {
                $response['status'] = FAIL;
                $response['message'] = trans('appmessages.not_found_staff');
            } else {
                $body['member_id'] = $user['id'];
                $body['staff_id'] = $staff['id'];
                if(!Checkin::create($body))
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

    private function getAllCheckinsForApp($appId)
    {
        return DB::table('checkin')
            ->join('users', 'users.id', '=', 'checkin.member_id')
            ->join('staff', 'staff.id', '=', 'checkin.staff_id')
            ->where('checkin.app_id', '=', $appId)
            ->where('checkin.status', '=', 1)
            ->select('users.first_name as member_first_name', 
                'users.last_name as member_last_name', 
                'users.email as member_email', 
                'staff.id as staff_id',
                'staff.first_name as staff_first_name', 
                'staff.last_name as staff_last_name',  
                'checkin.*')
            ->get();
    }

    public function fetchAllCheckins(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];
        if ($user)
        {
            $response['data'] = $this->getAllCheckinsForApp($appId);
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }

    public function fetchCheckinsByCondition(Request $request) {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];
        
        if ($user)
        {
            $query = DB::table('checkin')
            ->join('users', 'users.id', '=', 'checkin.member_id')
            ->join('staff', 'staff.id', '=', 'checkin.staff_id')
            ->where('checkin.app_id', '=', $appId)
            ->select('users.first_name as member_first_name', 
                'users.last_name as member_last_name', 
                'users.email as member_email', 
                'staff.id as staff_id',
                'staff.first_name as staff_first_name', 
                'staff.last_name as staff_last_name', 
                'checkin.*');
            if (isset($body['staff_id'])) {
                $staff_id = $body['staff_id'];    
                $query->where('checkin.staff_id', '=', $staff_id);
            }
            $response['data'] = $query->get();
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }

    public function fetchCheckinById(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        
        $editId = $body['id'];

        if($user)
        {
            $response = Checkin::find($editId);
            $response['message'] = trans('appmessages.getCheckinbyidsuccessfully');
        }
        else {
            $response['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($response);
    }

    public function updateCheckin(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        
        if ($user)
        {
            $editId = $body['id'];
            $CheckinData = Checkin::find($editId);
            $CheckinData->update($body);
            $response['data'] = Checkin::where('app_id', $CheckinData->app_id)->get();
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }

    public function deleteCheckin(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];
        $deleteId = $body['id'];

        if ($user)
        {
            $checkinData = Checkin::find($deleteId);
            if ($checkinData) {
                ModifiedTransaction::create([
                    'member_id' => $checkinData->member_id, 
                    'staff_id' => $checkinData->staff_id,
                    'points' => 0 - $checkinData->points,
                    'app_id' => $checkinData->app_id,
                    'note' => 'Removed Points'
                ]);
            }
            Checkin::destroy($deleteId);
            $response['data'] = $this->getAllCheckinsForApp($appId);
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }
}
