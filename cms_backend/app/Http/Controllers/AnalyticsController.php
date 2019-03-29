<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\AnalyticsModel;
use App\AppMenu;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    protected $user = null;
	function __construct()
	{
		//$this->user = JWTAuth::parseToken()->authenticate();
    }
    
    //save anayltics data in DB
    public function record_action(Request $request)
    {
        $body = $request->all();
        if($body)
        {
            $anayltics_model = new AnalyticsModel;

            $anayltics_model->action        = $body['action'];
            $anayltics_model->app_id        = $body['app_id'];
            $anayltics_model->bundle_id     = $body['bundle_id'];
            $anayltics_model->platform      = $body['platform'];
            $anayltics_model->device_type   = $body['device_type'];
            $anayltics_model->locale        = $body['locale'];
            // $anayltics_model->location_lat = $body['location_lat'];
            // $anayltics_model->location_lon = $body['location_lon'];

            if($body['action'] == "open_item")//when open_item or event
            {
                $anayltics_model->item_id   = $body['item_id'];
                $anayltics_model->item_name = $body['item_name'];
                $anayltics_model->item_type = $body['item_type'];
            }
            if($anayltics_model->save()){
                $response['status'] = 1;
                $response['message'] = "Successfully record analytics data";
            }
            else
            {
                $response['status'] = 0;
                $response['message'] = "Faild record analytics data";
            }
        }
        else
        {
            $response['status'] = 0;
            $response['message'] = "Data rqueired";
        }
        return response()->json($response);
    }

    public function get_installed_count_country(Request $request)
    {
        $body = $request->all();

        if($body)
        {
            $from_date = (new Carbon)->parse($body['from_date']);
            $to_date = (new Carbon)->parse($body['to_date']);
            $last_next_date = Date('Y-m-d', strtotime(Date($body['to_date']) .' +1 day'));

            if(AnalyticsModel::where('action', "install")->where('app_id', $body['app_id'])
                        ->where('created_at', ">", Date($body['from_date']))
                        ->where('created_at', "<", $last_next_date)
                        ->exists())
            {
                $data = AnalyticsModel::where('action', "install")
                        ->where('app_id', $body['app_id'])
                        ->groupBy('locale')
                        ->where('created_at', ">", Date($body['from_date']))
                        ->where('created_at', "<", $last_next_date)
                        ->get();
                
                for($i = 0; $i < count($data); $i++)
                {
                    $count  = AnalyticsModel::where('action', "install")
                        ->where('app_id', $body['app_id'])
                        ->where('locale', $data[$i]['locale'])
                        ->where('created_at', ">", Date($body['from_date']))
                        ->where('created_at', "<", $last_next_date)
                        ->get();
                    $count = count($count);
                    $value[$data[$i]['locale']] = $count;
                }
                
                $response['status']  = 1;
                $response['message'] = "Successfully get installed count";
                $response['data']    = $value;
            }
            else
            {
                $response['status']  = 1;
                $response['message'] = "Nothign exist installed count";
                $response['data']    = [];
            }
        }
        else
        {
            $response['status']  = 0;
            $response['message'] = "Required input data";
            $response['data']    = "";
        }
        return response()->json($response);
    }

    public function get_event_count(Request $request)
    {
        $body = $request->all();

        if($body)
        {
            $from_date = (new Carbon)->parse($body['from_date']);
            $to_date = (new Carbon)->parse($body['to_date']);
            $last_next_date = Date('Y-m-d', strtotime(Date($body['to_date']) .' +1 day'));

            if(AppMenu::where('app_basic_id', $body['app_id'])
                ->where('app_menu.status', '1')->exists())
            {
                $menu_list = AppMenu::where('app_basic_id', $body['app_id'])->get();

                $response['data'] = [];
                $menu_name = []; 
                for($i = 0; $i < count($menu_list); $i++)
                {
                    $menu_id[$i] = $menu_list[$i]['id'];
                    
                    if(AnalyticsModel::where('action', "open_item")
                                    ->where('app_id', $body['app_id'])
                                    ->where('item_id', $menu_id[$i])
                                    ->where('created_at', ">", Date($body['from_date']))
                                    ->where('created_at', "<", $last_next_date)
                                    ->exists())
                    {
                        $response['status']  = 1;
                        $response['message'] = "Successfully get event count"; 
                        $value = AnalyticsModel::where('action', "open_item")
                                ->where('app_id', $body['app_id'])
                                ->where('item_id', $menu_id[$i])                      
                                ->where('created_at', ">", Date($body['from_date']))
                                ->where('created_at', "<", $last_next_date)
                                ->count();
                        
                        $menu_name[$i] = AppMenu::where('app_menu.status', '1')
                        ->where('app_basic_id', $body['app_id'])->where('id', $menu_id[$i])
                                ->orderBy('updated_at', 'desc')->first();
                        $data[$menu_name[$i]['menu_name']] = $value;

                        $response['data'] = $data;
                    }
                    else
                    {
                        $value = 0;
                        $menu_name[$i] = AppMenu::where('app_menu.status', '1')->where('app_basic_id', $body['app_id'])->where('id', $menu_id[$i])
                                ->orderBy('updated_at', 'desc')->first();
                        $data[$menu_name[$i]['menu_name']] = $value;
                        $response['data'] = $data;
                    }
                }
            }
            else
            {
                $response['status']  = 0;
                $response['message'] = "Nothing exist event";
                $response['data']    = "";
            }
        }
        return response()->json($response);
    }

    public function get_session_count(Request $request)
    {
        $body = $request->all();

        if($body)
        {
            $from_date = (new Carbon)->parse($body['from_date']);
            $to_date = (new Carbon)->parse($body['to_date']);
            $last_next_date = Date('Y-m-d', strtotime(Date($body['to_date']) .' +1 day'));
            //because start am 00:00
        
            // How many days between two dates
            $diffInDays = $to_date->diffInDays($from_date);
            
            if(AnalyticsModel::where('action', 'launch')->where('app_id', $body['app_id'])
                            ->where('created_at', ">", Date($body['from_date']))
                            ->where('created_at', "<", $last_next_date)
                            ->exists())
            {
                $date_range;
                if($diffInDays <= 10)
                {
                    $response['period'] = "daily";
                    $date_range = 1;
                }
                elseif($diffInDays > 10 && $diffInDays <= 50)
                {
                    $response['period'] = "weekly";
                    $date_range = 7;
                }
                elseif($diffInDays > 50 && $diffInDays < 365)
                {
                    $response['period'] = "monthly";
                    $date_range = 30;
                }
                elseif($diffInDays >= 365)
                {
                    $response['period'] = "yearly";
                    $date_range = 360;
                } 
               
                for($i = 0; $i < ceil(((integer)$diffInDays)/$date_range); $i++)
                {
                    $date_arr = Date($body['from_date']) ;
                    $arr_date = date('Y-m-d', strtotime($date_arr .' +'.($i * $date_range).' day'));
                    $arr_next_date = Date('Y-m-d', strtotime($arr_date .' +1 day'));
                    $value[$arr_date] = AnalyticsModel::where('action', 'launch')
                        ->where('app_id', $body['app_id'])
                        ->where('created_at', ">", $arr_date)
                        ->where('created_at', "<", $arr_next_date)
                        ->count();
                }
                $value[Date($body['to_date'])] = AnalyticsModel::where('action', 'launch')
                        ->where('app_id', $body['app_id'])
                        ->where('created_at', ">", Date($body['to_date']))
                        ->where('created_at', "<", $last_next_date)
                        ->count();

                $response['message'] = "";
                $response['data'] = $value;
                $response['status'] = 1;
            }
            else
            {
                $response['status']  = 0;
                $response['message'] = "Faild get session count";
                $response['data']    = [];
            }
            return response()->json($response);
        }
    }

    public function get_installed_count(Request $request)
    {
        $body = $request->all();
        if($body)
        {
            $from_date = (new Carbon)->parse($body['from_date']);
            $to_date = (new Carbon)->parse($body['to_date']);
            $last_next_date = Date('Y-m-d', strtotime(Date($body['to_date']) .' +1 day'));

            if(AnalyticsModel::where('action', 'install')->where('app_id', $body['app_id'])
                                ->where('platform', 'android')
                                ->where('created_at', ">", Date($body['from_date']))
                                ->where('created_at', "<", $last_next_date)->exists())
            {
                $data = AnalyticsModel::where('action', 'install')->where('app_id', $body['app_id'])
                                                            ->where('platform', 'android')
                                                            ->where('created_at', ">", Date($body['from_date']))
                                                            ->where('created_at', "<", $last_next_date)->get();
                $response['status'] = 1;
                $response['android_count'] = count($data);
            }
            else{
                $response['status'] = 1;
                $response['android_count'] = 0;
            }
            
            if(AnalyticsModel::where('action', 'install')->where('app_id', $body['app_id'])
                                ->where('platform', 'ios')
                                ->where('created_at', ">", Date($body['from_date']))
                                ->where('created_at', "<",$last_next_date)->exists())
            {
                $data1 = AnalyticsModel::where('action', 'install')->where('app_id', $body['app_id'])
                                                            ->where('platform', 'ios')
                                                            ->where('created_at', ">", Date($body['from_date']))
                                                            ->where('created_at', "<", $last_next_date)->get();
                $response['status'] = 1;
                $response['ios_count'] = count($data1);
            }
            else{
                $response['status'] = 1;
                $response['ios_count'] = 0;
            }
        }
        else
        {
            $response['status'] = 0;
            $response['message'] = "input data required";
            $response['ios_count'] = 0;
            $response['android_count'] = 0;
        }
        return response()->json($response);
    }
}