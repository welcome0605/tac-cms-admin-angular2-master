<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Config;
use DB;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'users';
    protected $guarded = [];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'otp' => 'binary',
    ];

    public function checkEmail($email)
    {
        //print_r($email);die("soso");
        return User::where('email', $email)->where('status','1')->first();
    }
    
    public function checkOtp($otp)
    {
        return User::where(DB::raw("CONVERT(otp, CHAR)"), $otp)->first();
    }

    public function checkRewardOtp($otp, $email)
    {
        return User::where(DB::raw("CONVERT(otp, CHAR)"), $otp)->where('email', $email)->first();   
    }
    
    public function checkEmailExist($email,$user_id)
    {
        return User::where([['email', $email],['id','!=',$user_id]])->first();
    }

    public function saveData($data) 
    {
        if(isset($data['id']) && $data['id'] > 0)
        {
            $return = User::where('id', $data['id'])->update($data);
        }
        else
        {
            $return = User::create($data);
        }
        return $return;
    }

    public function getUserByOtp($otp)
    {
        $getData = User::where('otp', $otp)->first();
        return $getData;
    }
    
    public function getUserDetailsById($editId)
    {
        $getData = User::where('id', $editId)->first();
        return $getData;
    }

    //gjc 0407
    public function getAllUsersDetails()
    {
        //  $getData = User::where('role_id', 2)->whereRaw('status IN ('.$status.')')->with('getData')->get();
        // $getData = User::where('role_id', 2)->whereRaw('status IN (1,2)')->with('getData')->get();
        // 2018-2-7
        $getData = User::select('id')->where('role_id', 2)
                    ->with('getData')
                    ->join('strip_transaction','strip_transaction.user_id','=','users.id')
                    ->join('strip_packages','strip_packages.id','=','strip_transaction.pkg_id')
                    ->select('users.*','strip_transaction.st_amount','strip_transaction.st_created',
                            'strip_transaction.pkg_id','strip_packages.pa_price','strip_packages.sub_charge')
                    ->where('users.status',1)
                    ->orwhere('users.status',2)
                    ->get();
        return $getData;
    }

    public function getUserNameById($user_id)
    {
        // 2018-4-9
        $getData = User::select('email', 'first_name', 'last_name')->where('role_id', 2)
                    ->where('id', $user_id)
                    ->first();
        return $getData;
    }

    //gjc 0407
    public function getAllUsersMoreDetails()
    {
        // 2018-4-7
        $getData['allUserData']  = User::where('role_id', "!=", 1)->where('users.status',1)
                ->orwhere('users.status',2)->get();

        if(User::select('id')->where('role_id', 2)
                ->with('getData')
                ->join('strip_transaction','strip_transaction.user_id','=','users.id')
                ->join('strip_packages','strip_packages.id','=','strip_transaction.pkg_id')
                ->select('users.*','strip_transaction.st_amount','strip_transaction.st_created',
                        'strip_transaction.pkg_id','strip_packages.pa_price','strip_packages.sub_charge')
                ->where('users.status',1)
                ->orwhere('users.status',2)
                ->exists())
        {
            $getData['paidUserData'] = User::select('id')->where('role_id', 2)
                ->with('getData')
                ->join('strip_transaction','strip_transaction.user_id','=','users.id')
                ->join('strip_packages','strip_packages.id','=','strip_transaction.pkg_id')
                ->select('users.*','strip_transaction.st_amount','strip_transaction.st_created',
                        'strip_transaction.pkg_id','strip_packages.pa_price','strip_packages.sub_charge')
                ->where('users.status',1)
                ->orwhere('users.status',2)
                ->get();
        }
        else{
            $getData['paidUserData'] = [];
        }

        return $getData;
    }

    public function getAppMembersDetails($app_id)
    {
        $getData = User::where('role_id', 3)
                    ->join('app_assign_user', 'app_assign_user.user_id', '=', 'users.id')
                    ->join('user_types','users.type', '=', 'user_types.id')
                    ->leftJoin(DB::raw('(select *, SUM(points) as total from checkin
                        where status = 1 and app_id = ' . $app_id . ' group by member_id) AS checkin2'), function($join) {
                        $join->on('users.id', '=', 'checkin2.member_id');
                    })
                    ->leftJoin(DB::raw('(select *, SUM(points) as total, COUNT(id) as redeem_count
                        from redemption where status = 1 and app_id = ' . $app_id . ' group by member_id) AS redemption2'), function($join) {
                        $join->on('users.id', '=', 'redemption2.member_id');
                    }) 
                    ->select('users.*', 'user_types.name as type', DB::raw('COALESCE(checkin2.total, 0) as total, COALESCE(checkin2.total - redemption2.total, 0) as current, COALESCE(redemption2.redeem_count, 0) as redemptions'))
                    ->where('users.status',1)
                    ->where('app_assign_user.app_basic_id',$app_id)
                    ->get();
        return $getData;
    }
    
    public function deleteUser($deleteId)
    {
        // $result = User::where('role_id', 2)->where('id', $deleteId)->update(['status' => Config::get('constant.DELETED_FLAG')]);
        if(User::where('id', $deleteId)//->where('role_id', 2)
                ->exists())
        {
            $result = User::where('id', $deleteId)->update(['status' => 3]);
        }
        else
        {
            return "error";
        }
        return $result;
    }

    public function getData()
    {
        $return = $this->hasMany('App\AppAssignUser','user_id');
        return $return;
    } 
    /**
     * Method to fetch record by stripe id
     * @return user object
     */
    public function getUserByStripeId($stripe_id)
    {
        # code...
        $return = DB::table('users as us')
                    ->join('stripe_subscriptions as ss','ss.user_id','=','us.id')
                    ->where('ss.stripe_id',$stripe_id)
                    ->select('us.*')
                    ->first();
        
        return $return;
    }
    /**
     * Method to set user status inactive
     * @return user object
     */
    public function setInactiveById($inactiveID)
    {
        $result = User::where('role_id', 2)->where('id', $inactiveID)->update(['status' => Config::get('constant.INACTIVE_FLAG')]);
       
        return $result;
    }
        /**
     * Method to fetch record by email id
     * @return user object
     */
    public function getUserByEmailId($email)
    {
        # code...
        $return = User::where('email', $email)->first();
       
        return $return;
    }
    public function getUserById($user_id)
    {
        #code...
        $return = User::where('id',$user_id)->first();

        return $return;
    }
}

