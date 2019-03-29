<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use DB;

class Role extends Model
{
    protected $table = 'role';

    protected $guarded = [];

    public function getRoleUserData( $role_key ){

      return  $return = DB::table('role')
                ->join('users', 'users.role_id','=', 'role.id')
                ->where('role.id', $role_key)
                ->select('users.id as user_id','users.*','role.id as role_id','role.*')
                ->get();
    }

    public function IsRoleAdmin( $role_key ){
        
        //
        $return = Role::where('id', $role_key)->first();

        if( isset($return) && $return->name == 'Admin User'){

            return true;
        }
        else{

            return false;
        }

    }
}
