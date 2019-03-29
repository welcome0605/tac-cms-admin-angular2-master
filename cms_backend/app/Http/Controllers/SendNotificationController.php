<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use JWTAuthException;
use App\FireBaseToken;
use App\PushNotificationModel;
use App\NotificationFirebaseModel;
use App\NotificationModel;
use Carbon\Carbon;
use DB;

class SendNotificationController extends Controller
{
	
    public function __construct()
    {
		// $this->user = JWTAuth::parseToken()->authenticate();
        // $this->middleware('jwt.auth');
		//$this->middleware('jwt.auth', ['except' => ['sendFCMMessage','registerFirebaseTokenIDs','getFBToken','saveFBToken']]);
    }

	public function sendFCMMessage(Request $request)
    {
		$this->middleware('jwt.auth', ['except' => ['sendFCMMessage','registerFirebaseTokenIDs']]);
        $user = JWTAuth::parseToken()->authenticate();
		$body = $request->all();
        if ($user)
        {
			if($body['ios_check'] == "undefined"){
				$body['ios_check'] = 0;
			}
			if($body['android_check'] == "undefined"){
				$body['android_check'] = 0;
			}
			// if($body['web_check'] == "undefined"){
			// 	$body['web_check'] = 0;
			// }
			
			// $fcmMsg = array(
			// 	'app_id' => $body['id'],
			// 	'ios' => $body['ios_check'],
			// 	'android' => $body['android_check'],
			// 	'web' => $body['web_check'],
			// 	'all_type' => $body['all_type_check'],
			// 	'title' => $body['title'],
			// 	'description' => $body['text'],
			// 	'server_key' => $body['server_key']
			// );

			$fcmMsg['app_id'] = $body['id'];
			$fcmMsg['ios'] = $body['ios_check'];
			$fcmMsg['android'] = $body['android_check'];
			// $fcmMsg['web'] = $body['web_check'];
			$fcmMsg['title'] = $body['title'];
			$fcmMsg['all_type'] = $body['all_type_check'];
			$fcmMsg['description'] = $body['text'];
			$fcmMsg['server_key'] = $body['server_key'];
			$fcmMsg['time'] = $body['currnet_time'];

			// return response()->json($fcmMsg);
			
			$result = DB::table('push_notification_table')->insert($fcmMsg);
		
			// $m_notification = new PushNotificationModel();
			// $result = $m_notification->saveNotificationData($fcmMsg);
			// $result = PushNotificationModel::saveNotificationData($fcmMsg);
			if($result)
			{
				$result = $fcmMsg;
				$outputArray['data'] = $result;
				$outputArray['status'] = '1';
                $outputArray['message'] = trans('appmessages.profile_success_update_msg');
			}
			else
			{
				$outputArray['status'] = '0';
				$outputArray['message'] = trans('appmessages.default_error_msg');
			}
			//$registrationIDs = $this->refreshSavedToken($body['server_key'],$body['expires']);
			
			//$response['registrationIDs'] = $registrationIDs;
			// $fcmFields = array(
			// 	// 'to' => $singleID,
		    //     'priority' => 'high',
		    //     'registration_ids' => $registrationIDs,
			// 	'notification' => $fcmMsg
			// );

			// $headers = array(
			// 	'Authorization: key=' . $body['server_key'],
			// 	'Content-Type: application/json'
			// );
			 
			// $ch = curl_init();
			// curl_setopt( $ch,CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send' );
			// curl_setopt( $ch,CURLOPT_POST, true );
			// curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
			// curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
			// curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
			// curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fcmFields ) );
			// $result = curl_exec($ch );
			// curl_close( $ch );
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.tokennotmatched');
        }

        return response()->json($outputArray);
    }
	public function deleteCheckedItem(Request $request)
	{
		$this->middleware('jwt.auth', ['except' => ['sendFCMMessage','registerFirebaseTokenIDs']]);
		$user = JWTAuth::parseToken()->authenticate();
		$body = $request->all();
		if($user)
		{
			$checked_data = $body['data'];
			$ids = explode(",", $checked_data);
			$outputArray['status'] = '1';
			$outputArray['message'] = trans('appmessages.profile_success_update_msg');
			DB::table('push_notification_table')
				->whereIn('id', $ids)
				->delete();
			$outputArray['app_type'] = $body['app_type'];									
		}
		else
		{
			$outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
		}
		return response()->json($outputArray);
	}
    public function registerFirebaseTokenIDs(Request $request)
    {
		$this->middleware('jwt.auth', ['except' => ['sendFCMMessage','registerFirebaseTokenIDs']]);
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if ($user)
    	// if (true)
        {
        	$body['server_key'] = 'AAAAQEUnQMU:APA91bEUIwq6vi_48FO26Qyl0UmiVONRvj3KiiCkCTRINNovLktxXBPWd9xRUY9ObTkoQI3_H9_FhX2ph7AouubjyGR-e-AWNJJSt-xwKrWF-z0Mht5uJZVqnTcuk15W7wmLDB5aG2JL'; 

            $tokeId = $body['token'];
            $serverKey = $body['server_key'];
            $data = FireBaseToken::where('server_key', $serverKey)->where('token', $tokeId)->get();
            // add new element when does not exist
            $buffer['token'] = $body['token'];
            $buffer['server_key'] = $body['server_key'];
            if ($data->count() == 0) {
                $settingData = FireBaseToken::create($buffer);
            } else {
              $settingData = FireBaseToken::where('server_key', $serverKey)
              						->where('token', $tokeId)
              						->update($buffer);   
            }
        } else
        {
            $settingData['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($settingData);
	}

	public function refreshSavedToken($server_key,$expires) {

		$this->middleware('jwt.auth', ['except' => ['sendFCMMessage','registerFirebaseTokenIDs']]);
		$current_time = Carbon::now();
		$backward_time = $current_time->subHour($expires);
		$backward_time = $backward_time->toDateTimeString();
        $tokenListSorted = FireBaseToken::where('server_key', $server_key)
        							->where('updated_at', "<" , $backward_time)
        							->delete(); 
        $tokenList =   FireBaseToken::where('server_key', $server_key)->get();
        return $tokenList->toArray();
	}
	
	public function getAllNotificationData(Request $request)
	{
		$this->middleware('jwt.auth', ['except' => ['sendFCMMessage','registerFirebaseTokenIDs']]);
		$user = JWTAuth::parseToken()->authenticate();
		$body = $request->all(); 
		
		if($user)
		{
			$result['status'] = 1;
            $result['message'] = trans('appmessages.setting_save_success');
			$result['data'] = DB::table('push_notification_table')->where('app_id',$body['app_id'] )->get();
		}
		else{
			$result['message'] = trans('appmessages.default_error_msg');
		}
		return response()->json($result);
	}

	public function getAlliosData(Request $request)
	{
		$this->middleware('jwt.auth', ['except' => ['sendFCMMessage','registerFirebaseTokenIDs']]);
		$user = JWTAuth::parseToken()->authenticate();
		$body = $request->all(); 
		
		if($user)
		{
			$result['status'] = 1;
            $result['message'] = trans('appmessages.setting_save_success');
			$result['data'] = DB::table('push_notification_table')->where('app_id',$body['app_id'])
															->where('ios', '1')
															->get();
		}
		else{
			$result['message'] = trans('appmessages.default_error_msg');
		}
		return response()->json($result);
	}

	public function getAllAndroidData(Request $request)
	{
		$this->middleware('jwt.auth', ['except' => ['sendFCMMessage','registerFirebaseTokenIDs']]);
		$user = JWTAuth::parseToken()->authenticate();
		$body = $request->all(); 
		
		if($user)
		{
			$result['status'] = 1;
            $result['message'] = trans('appmessages.setting_save_success');
			$result['data'] = DB::table('push_notification_table')->where('app_id',$body['app_id'] )
															->where('android', '1')
															->get();
		}
		else{
			$result['message'] = trans('appmessages.default_error_msg');
		}
		return response()->json($result);
	}

	public function getAllWebData(Request $request)
	{
		$this->middleware('jwt.auth', ['except' => ['sendFCMMessage','registerFirebaseTokenIDs']]);
		$user = JWTAuth::parseToken()->authenticate();
		$body = $request->all(); 
		
		if($user)
		{
			$result['status'] = 1;
            $result['message'] = trans('appmessages.setting_save_success');
			$result['data'] = DB::table('push_notification_table')->where('app_id',$body['app_id'] )
															->where('web', '1')
															->get();
		}
		else{
			$result['message'] = trans('appmessages.default_error_msg');
		}
		return response()->json($result);
	}

	public function getAllTypeData(Request $request)
	{
		$this->middleware('jwt.auth', ['except' => ['sendFCMMessage','registerFirebaseTokenIDs']]);
		$user = JWTAuth::parseToken()->authenticate();
		$body = $request->all(); 
		
		if($user)
		{
			$result['status'] = 1;
            $result['message'] = trans('appmessages.setting_save_success');
			$result['data'] = DB::table('push_notification_table')->where('app_id',$body['app_id'])
															->where('all_type','1')
															->get();
		}
		else{
			$result['message'] = trans('appmessages.default_error_msg');
		}
		return response()->json($result);
	}
    //gjc 03.30 firebase app token
	public function save_firebase_app_token( Request $request )
	{
		$body = $request->all();
		if($body['platform'] == "android"){
			$platform = 1;
		}
		elseif($body['platform'] == "ios"){
			$platform = 2;
		}

		if(NotificationFirebaseModel::where('app_id', $body['app_id'])
									->where('device_token', $body['device_token'])
									->exists())
		{
				$response['status'] = 0;
				$response['message'] = "This device Registered already.";
		}
		else{
			$firebase = new NotificationFirebaseModel;
			$firebase->app_id	 	= $body['app_id'];
			$firebase->platform 	= $platform;
			$firebase->device_token	= $body['device_token'];

			if( $firebase->save() )
			{
				$response['status'] = 1;
				$response['message'] = "Successfully device token saved";
			}
			else
			{
				$response['status'] = 0;
				$response['message'] = "Failed device token saved";
			}
		}
		
		return response()->json($response);
	}

	public function getFBToken( Request $request )
	{
		$body = $request->all();

		if (NotificationFirebaseModel::where('app_id', '=', $body['app_id'])
										->where('device_k', '=', $body['device_k'])
										->exists()) 
		{
			$response['status']  = 1;
			$response['message'] = trans('appmessages.get_notification_success');
			$response['data']    = NotificationFirebaseModel::where('app_id', '=', $body['app_id'])
									->where('device_k', '=', $body['device_k'])->get();
		}
		else
		{
			$response['status'] = 0;
			$response['message'] = trans('appmessages.get_notification_failed');
			$response['data'] = "";
		}
		return response()->json($response);
	}
	//gjc 03.30 push notification
	public function saveNotification( Request $request )
	{
		// $user = JWTAuth::parseToken()->authenticate();
		// // $user = JWTAuth::toUser($request->token);

		// if($user)
		// {
			$body = $request->all();
			unset( $body['token']);

			if (NotificationModel::where('app_id', '=', $body['app_id'])
										->where('device_k', '=', $body['device_k'])
										->where('notify_title', '=', $body['notify_title'])
										->where('status', 1)
										->exists()) 
			{
				NotificationModel::where('app_id', '=', $body['app_id'])
											->where('device_k', '=', $body['device_k'])
											->where('notify_title', '=', $body['notify_title'])
											->where('status', 1)
											->update($body);
				$response['status'] = 1;
				$response['message'] = trans('appmessages.update_push_notification_success');
			}
			//nice add
			else
			{
				$notify = new NotificationModel;
				$notify->app_id	 	= $body['app_id'];
				$notify->device_k 	= $body['device_k'];
				$notify->notify_title	= $body['notify_title'];
				$notify->notify_text	= $body['notify_text'];

				if( $notify->save() )
				{
					$response['status'] = 1;
					$response['message'] = trans('appmessages.save_push_notification_success');
				}
				else
				{
					$response['status'] = 0;
					$response['message'] = trans('appmessages.save_push_notification_failed');
				}
			}
		// }

		return response()->json($response);
	}

	public function getNotification( Request $request )
	{
		// $this->middleware('jwt.auth');
		// $user = JWTAuth::parseToken()->authenticate();

		// if($user)
		// {
			$body = $request->all();
			if($body['device_k'] != 4){
				if(NotificationModel::where('app_id', '=', $body['app_id'])->where('device_k', '=', $body['device_k'])->exists()){
					$response['status']  = 1;
					$response['message'] = trans('appmessages.get_push_all_notification_success');
					$response['data']    = NotificationModel::where('app_id', '=', $body['app_id'])
														->where('device_k', '=', $body['device_k'])
														->where('status', '=', 1)
														->get();
				}
				else
				{
					$response['status'] = 0;
					$response['message'] = trans('appmessages.get_push_all_notification_failed');
					$response['data'] = "";
				}
			}
			else{
				if(NotificationModel::where('app_id', '=', $body['app_id'])->where('status', '=', 1)->exists()){
					$response['status']  = 1;
					$response['message'] = trans('appmessages.get_push_all_notification_success');
					$data    = NotificationModel::where('app_id', '=', $body['app_id'])->where('status', '=', 1)->get();
					$response['data'] = $data;
				}
				else
				{
					$response['status'] = 0;
					$response['message'] = trans('appmessages.get_push_all_notification_failed');
					$response['data'] = "";
				}
			}
		// }
		return response()->json($response);
	}

	public function delNotification( Request $request )
	{
		// if($user)
		// {
			$body = $request->get('ids');
			$body = json_decode($body, true);
			if($body){
				for($nIndex = 0; $nIndex < count($body); $nIndex++)
				{
					if(NotificationModel::where('id', '=', $body[$nIndex]['id'])->where('status', '=', 1)->exists()){
						$response['status']  = 1;
						$response['message'] = trans('appmessages.del_push_sel_notification_success');
						NotificationModel::where('id', '=', $body[$nIndex]['id'])
															->where('status', '=', 1)
															->update(array('status' => 2));
					}
					else
					{
						$response['status'] = 0;
						$response['message'] = trans('appmessages.del_push_sel_notification_failed');
						$response['data'] = "";
						break;
					}
				}
			}
			else{
					$response['status'] = 0;
					$response['message'] =  "mistake sending json data";
			}
		// }
		return response()->json($response);
	}

	public function pushNotificationMsg( Request $request ){

		$body = $request->all();
		if($body){

			$app_id   = $body['app_id'];
			$platform = $body['device_k'];
			$response = null;
			$api_keys;

			//get app_id
			if($platform == 2)
			{
				$api_keys[0] = DB::table('settings')->where('app_unique_id', '=', $app_id)->value('server_key_iOS');
			}
			elseif($platform == 1){
				$api_keys[0] = DB::table('settings')->where('app_unique_id', '=', $app_id)->value('server_key_android');
			}
			elseif($platform == 3){
				$api_keys[0] = DB::table('settings')->where('app_unique_id', '=', $app_id)->value('server_key_android');
				$api_keys[1] = DB::table('settings')->where('app_unique_id', '=', $app_id)->value('server_key_iOS');
			}
			//send notification to device
			if(NotificationModel::where('app_id', $app_id)->where('device_k', $platform)->where('status', '=', 1)->exists()){
				$data = NotificationModel::select('notify_title', 'notify_text')->where('app_id', '=', $app_id)
													->where('device_k', '=', $platform)
													->where('status', '=', 1)->orderBy('updated_at', 'desc')
													->first();
			}
			else
			{
				$response['status']  = 0;
				$response['message'] = "Nothing exist notify";
				return response()->json($response);
			}
			//serkey kind

			foreach ($api_keys as $key => $api_key) {
				//notificaiton kind
				if ($api_key != null){

					$notify_title = $data['notify_title'];
					$notify_body  = $data['notify_text'];

					//ios and android
					if($platform == 3){
						if(NotificationFirebaseModel::where('app_id', $app_id)->exists()){

							$allDeviceToken = NotificationFirebaseModel::where('app_id', $app_id)->get();
							//device kind
							foreach ($allDeviceToken as $deviceKey => $eachDevice){
								$sendData = array("to" => $eachDevice['device_token'], "notification" => array( "title" => $notify_title, "body" => $notify_body, "sound" => "default" , "icon" => "icon.png", "click_action" => "http://shareurcodes.com"));
								$data_string = json_encode($sendData);

								$headers = array
								(
								     'Authorization: key=' . $api_key, 
								     'Content-Type: application/json'
								);                                                                                 
								                                                                                                                     
								$ch = curl_init();  

								curl_setopt( $ch,CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send' );                                                                  
								curl_setopt( $ch,CURLOPT_POST, true );  
								curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
								curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
								curl_setopt( $ch,CURLOPT_POSTFIELDS, $data_string);                                                                  
								                                                                                                                     
								$result = curl_exec($ch);

								curl_close ($ch);
								echo "device = ".$eachDevice['device_token'];
								echo "\n";
								echo "result = ".$result;
								echo "\n";

								// $response['status']  = 1;
								// $response['message'] = " The Result : ".$result;
								// $response['send_data'] = "The Json Data : ".$data_string;
							}
						}
						else{
							$response['status']  = 0;
							$response['message'] = " Not exist installed device ";
						}
					}else{
						if(NotificationFirebaseModel::where('app_id', $app_id)->where('platform', $platform)->exists()){

							$allDeviceToken = NotificationFirebaseModel::where('app_id', $app_id)->where('platform', $platform)->get();
							//device kind
							foreach ($allDeviceToken as $deviceKey => $eachDevice){
								$sendData = array("to" => $eachDevice['device_token'], "notification" => array( "title" => $notify_title, "body" => $notify_body,"icon" => "icon.png", "click_action" => "http://shareurcodes.com"));
								$data_string = json_encode($sendData);

								$headers = array
								(
								     'Authorization: key=' . $api_key, 
								     'Content-Type: application/json'
								);                                                                                 
								                                                                                                                     
								$ch = curl_init();  

								curl_setopt( $ch,CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send' );                                                                  
								curl_setopt( $ch,CURLOPT_POST, true );  
								curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
								curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
								curl_setopt( $ch,CURLOPT_POSTFIELDS, $data_string);                                                                  
								                                                                                                                     
								$result = curl_exec($ch);

								curl_close ($ch);

								$response['status']  = 1;
								$response['message'] = " The Result : ".$result;
								$response['send_data'] = "The Json Data : ".$data_string;
							}
						}
						else{
							$response['status']  = 0;
							$response['message'] = " Not exist installed device ";
						}
					}
				}
				else{
					// $response['status']  = 0;
					$response['warning'] = " Not exist Server Key for iOS or Android ";
				}
			}
			// after then
			return response()->json($response);
		}
	}
}
