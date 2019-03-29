<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;

class AppGeneralDiscussion extends Model
{
    //
    protected $table = 'app_general_dicussions';
    protected $guarded = [];

    public function saveData($data) 
    {
        if( isset($data['id']) && $data['id'] > 0)
        {
            $return = AppGeneralDiscussion::where('id', $data['id'])->update($data);
        }
        else
        {
            $return = AppGeneralDiscussion::create($data);
        }
        return $return;
    }
    
    public function getDicussionByAppId($appId)
    {
        # code...
      //  $return = AppGeneralDiscussion::where('app_id',$appId)->get();
        $return = DB::table('app_general_dicussions as agd')
                    ->join('users as s','s.id','=','agd.sender_id')
                    ->join('users as r','r.id','=','agd.receiver_id')

                    ->where('agd.app_id', $appId)
                    ->select('agd.*','s.first_name as s_first_name','s.last_name as s_last_name','s.email as s_email','r.first_name as r_first_name','r.last_name as r_last_name','r.email as r_email')
                    ->orderBy('agd.id','asc')
                    ->get(); 
    
        return $return;
    }

    public function getDicussionBySenderId($senderId)
    {
        # code...
        $return = AppGeneralDiscussion::where('sender_id',$senderId)->get();

        return $return;
    }
}
