<?php

namespace App;
use DB;
use Illuminate\Database\Eloquent\Model;

class StripeTransaction extends Model
{
    //
    protected $table = 'strip_transaction';
    protected $guarded = [];

    protected $hidden = [];

    public function saveData($data) 
    {
        if(isset($data['id']) && $data['id']>0)
        {
            $return = StripeTransaction::where('id', $data['id'])->update($data);
        }
        else
        {
            $return = StripeTransaction::create($data);
        }
        return $return;
    }

    public function getTraData() 
    {

        $result = DB::table('strip_transaction as st')
                    ->join('users as u','u.id','=','st.user_id')
                    ->select('u.first_name','u.last_name','u.email','st.id','st.st_id','st.st_amount','st.st_status','st.st_created','st.is_refer')
                    ->orderBy('st.id','desc')
                    ->get()
                    ->toArray();

        return $result;
    }
}
