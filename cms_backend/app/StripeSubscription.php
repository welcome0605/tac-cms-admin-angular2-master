<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Config;
use DB;

class StripeSubscription extends Model
{
    //
    protected $table = 'stripe_subscriptions';
    protected $guarded = [];

    protected $hidden = [];

    public function saveData($data) 
    {
        if(isset($data['id']) && $data['id']>0)
        {
            $return = StripeSubscription::where('id', $data['id'])->update($data);
        }
        else
        {
            $return = StripeSubscription::create($data);
        }   
        return $return;
    }
    /**
     * Method to set stripe status inactive
     * @return user object
     */
    public function setInactiveById($inactiveID)
    {
        $result = StripeSubscription::where('stripe_id',$inactiveID)->update(['stripe_active' => Config::get('strip_enum.STRIPE_EVENT_JSON.strip_inactive')]);
        return $result;
    }
     /**
     * Method to retrive subscription details by user id
     * @return subscription object
     */
    public function fetchStripedetailsByUser($user_id)
    {
        # code...
        $result = StripeSubscription::where('user_id',$user_id)->first();
        return $result;

    }
    /**
     * Method to retrive all subscription details with additional user details
     * @return subscription array
     */
    public function getSubscriptionData()
    {
        # code...
        $result = DB::table('stripe_subscriptions as ss')
                ->join('users as u','u.id','=','ss.user_id')
                ->select('u.first_name','u.last_name','u.email','ss.*')
                ->orderBy('ss.id','desc')
                ->get()
                ->toArray();
        
        return $result;
    }
}
