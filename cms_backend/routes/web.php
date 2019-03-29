<?php
/*
|--------------------------------------------------------------------------s
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
	// return response()->json(['url' => url('/')]);
    return view('welcome');
});

/*
|--------------------------------------------------------------------------
|stripe checkout routes
|--------------------------------------------------------------------------
|
*/
// test routes
// Route::get('/checkout/{id}',['as'=>'checkout','uses'=>'StripPackagesController@CheckoutForm']);

// Route::get('/checkout/{id}',['as'=>'post-checkout','uses'=>'StripPackagesController@postCheckoutForm']);

// Stripe Webhook URL

Route::post('/stripe/webhook', array('uses' => 'StripPackagesController@webhookListener'));

//header('Access-Control-Allow-Origin: *');
//header( 'Access-Control-Allow-Headers: Authorization, Content-Type' );
//header('Access-Control-Allow-Methods:  POST, GET, OPTIONS, PUT, DELETE');
//header('Access-Control-Allow-Headers:  Content-Type, X-Auth-Token, Origin, Authorization');
//
//Route::post('login', 'UserController@login');
//Route::post('signup', 'UserController@signup');
//Route::post('editprofile', 'UserController@editprofile');
//Route::post('changepassword', 'UserController@changepassword');
//Route::post('forgotpassword', 'UserController@forgotpassword');
//Route::any('otp', 'UserController@otp');
//Route::any('newPasswordUpdated', 'UserController@newPasswordUpdated');
//
//
//Route::post('test_login', 'TestController@login');
//Route::group(['middleware' => 'jwt.auth'], function () {
//    Route::post('getuser', 'TestController@getAuthUser');
//});

