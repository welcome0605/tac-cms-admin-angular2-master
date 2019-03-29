<?php

namespace App;
use DB;
use Illuminate\Database\Eloquent\Model;

class SettingData extends Model
{

    protected $table = 'industry_type';
    protected $guarded = [];

    public function saveSettingDataFun($body)
    {   
        $updateData['app_unique_id'] = (isset($body['app_unique_id']) && !empty($body['app_unique_id'])) ? $body['app_unique_id'] : "";
        $updateData['ios_app_id'] = (isset($body['ios_app_id']) && !empty($body['ios_app_id'])) ? $body['ios_app_id'] : "";
        $updateData['ios_appstore_id'] = (isset($body['ios_appstore_id']) && !empty($body['ios_appstore_id'])) ? $body['ios_appstore_id'] : "";
        $updateData['andr_app_id'] = (isset($body['andr_app_id']) && !empty($body['andr_app_id'])) ? $body['andr_app_id'] : "";
        $updateData['firebase_id_iOS'] = (isset($body['firebase_id_iOS']) && !empty($body['firebase_id_iOS'])) ? $body['firebase_id_iOS'] : "";
        $updateData['server_key_iOS'] = (isset($body['server_key_iOS']) && !empty($body['server_key_iOS'])) ? $body['server_key_iOS'] : "";
        $updateData['firebase_ios_plist'] = (isset($body['firebase_ios_plist']) && !empty($body['firebase_ios_plist'])) ? $body['firebase_ios_plist'] : "";
        $updateData['firebase_id_android'] = (isset($body['firebase_id_android']) && !empty($body['firebase_id_android'])) ? $body['firebase_id_android'] : "";
        $updateData['server_key_android'] = (isset($body['server_key_android']) && !empty($body['server_key_android'])) ? $body['server_key_android'] : "";
        $updateData['firebase_android_json'] = (isset($body['firebase_android_json']) && !empty($body['firebase_android_json'])) ? $body['firebase_android_json'] : "";
        
        $data = DB::table('settings')->where('app_unique_id', '=', $body['app_unique_id'])->get()->toArray();
        
        if(sizeof($data) != 0)
        {
              $result = DB::table('settings')
                             ->where('app_unique_id', $body['app_unique_id'])
                             ->update($updateData);
        } else {
            $result = DB::table('settings')->insert($updateData);
            
        }
        return $result;
    }

    public function getSettingDataFun($body)
    {

        $data = DB::table('settings')->where('app_unique_id', '=', $body['id'])->get()->toArray();
    	return $data;

    }
}
