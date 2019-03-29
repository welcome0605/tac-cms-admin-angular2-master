<?php

namespace App\Http\Middleware;

use JWTAuth;
use JWTAuthException;
use Closure;
use App\User;

class IsUserActiveMiddleware
{   
    public function __construct() 
    {   
        // $this->middleware('jwt.auth');
        $this->objUser = new User();
    }
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */

    public function handle($request, Closure $next)
    {
        // $body= $request->all();
        // $user_id = $body['id'];
        $user = JWTAuth::parseToken()->authenticate();
        // print_r($user);
        // die('>>');
        if($user && $user->id) {
            $check = $this->objUser->getUserById($user->id);
            if(isset($check) && ($check->status !='1' || $check->status != 1)){
                return response()->json(['access'=>'Please contact Administrator for more details'],401);
            }
        }
        return $next($request);
    }
}
