<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Transformers\Json;
use App\User;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use Illuminate\Http\Request;

class ForgotPasswordController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset emails and
    | includes a trait which assists in sending these notifications from
    | your application to your users. Feel free to explore this trait.
    |
    */

    use SendsPasswordResetEmails;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Send a reset link to the given user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getResetToken(Request $request)
    {
        $this->validate($request, ['email' => 'required|email']);
        
        $user = User::where('email', $request->input('email'))->first();
        if (!$user) {
            return response()->json(Json::response(null, trans('passwords.user')));
        }
        $token = $this->broker()->createToken($user);
        return response()->json(Json::response(['token' => $token]));
    }
}
