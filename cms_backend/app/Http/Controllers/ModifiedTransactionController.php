<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use JWTAuthException;
use App\ModifiedTransaction;
use DB;

class ModifiedTransactionController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth');
    }

    public function addModifiedTransaction(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if ($user)
        {
            $modified_transactionData = ModifiedTransaction::create($body);
        }
        else
        {
            $modified_transactionData['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($modified_transactionData);
    }

    public function fetchAllModifiedTransactions(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];
        if ($user)
        {
            $response['data'] = DB::table('modified_transaction')
            ->join('users', 'users.id', '=', 'modified_transaction.member_id')
            ->join('staff', 'staff.id', '=', 'modified_transaction.staff_id')
            ->where('modified_transaction.app_id', '=', $appId)
            ->select('users.first_name as member_first_name', 
                'users.last_name as member_last_name', 
                'users.email as member_email', 
                'staff.id as staff_id',
                'staff.first_name as staff_first_name', 
                'staff.last_name as staff_last_name',  
                'modified_transaction.*')
            ->get();
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }

    public function fetchModifiedTransactionsByCondition(Request $request) {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];
        
        if ($user)
        {
            $query = DB::table('modified_transaction')
            ->join('users', 'users.id', '=', 'modified_transaction.member_id')
            ->join('staff', 'staff.id', '=', 'modified_transaction.staff_id')
            ->where('modified_transaction.app_id', '=', $appId)
            ->select('users.first_name as member_first_name', 
                'users.last_name as member_last_name', 
                'users.email as member_email', 
                'staff.id as staff_id',
                'staff.first_name as staff_first_name', 
                'staff.last_name as staff_last_name', 
                'modified_transaction.*');
            if (isset($body['staff_id'])) {
                $staff_id = $body['staff_id'];    
                $query->where('modified_transaction.staff_id', '=', $staff_id);
            }
            $response['data'] = $query->get();
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }

    public function fetchModifiedTransactionById(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        
        $editId = $body['id'];

        if($user)
        {
            $response = ModifiedTransaction::find($editId);
            $response['message'] = trans('appmessages.getModifiedTransactionbyidsuccessfully');
        }
        else {
            $response['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($response);
    }

    public function updateModifiedTransaction(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        
        if ($user)
        {
            $editId = $body['id'];
            $ModifiedTransactionData = ModifiedTransaction::find($editId);
            $ModifiedTransactionData->update($body);
            $response['data'] = ModifiedTransaction::where('app_id', $ModifiedTransactionData->app_id)->get();
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }

    public function deleteModifiedTransaction(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];
        $deleteId = $body['id'];

        if ($user)
        {
            ModifiedTransaction::destroy($deleteId);
            $response['data'] = DB::table('modified_transaction')
                ->join('users', 'users.id', '=', 'modified_transaction.member_id')
                ->join('staff', 'staff.id', '=', 'modified_transaction.staff_id')
                ->where('modified_transaction.app_id', '=', $appId)
                ->select('users.first_name as member_first_name', 
                    'users.last_name as member_last_name', 
                    'users.email as member_email', 
                    'staff.id as staff_id',
                    'staff.first_name as staff_first_name', 
                    'staff.last_name as staff_last_name', 
                    'modified_transaction.*')
                ->get();
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }
}
