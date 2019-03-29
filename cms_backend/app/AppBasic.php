<?php

namespace App;
use DB;
use File;
use Illuminate\Database\Eloquent\Model;
use App\AppBasicDetail;
use App\AppMenu;
use Session;

class AppBasic extends Model 
{

    protected $table = 'app_basic';
    protected $guarded = [];

    public function saveData($data) 
    {
        if(isset($data['id']) && $data['id']>0)
        {
            $return = AppBasic::where('id', $data['id'])->update($data);
        }
        else
        {
            $return = AppBasic::create($data);
            //Update the app code with new generated unique id 
            AppBasic::where('id', $return->id)->update(['app_code'=>$data['app_code'].$return->id]);                       
        }
        return $return;
    }

    public function getAllAppData($appArray = array(),$userRole,$status=1)
    {
        if($userRole != 1)
        {
            $return = AppBasic::where('status', $status)->whereIn('id', $appArray)->orderBy('id', 'desc')->get();
        }
        else
        {
            $return = AppBasic::where('status', $status)->orderBy('id', 'desc')->get();        
        }
        return $return;
    }   

    public function getBlockAppData($appArray = array(),$userRole,$status=1,$paginum)
    {
        $offset_value = ($paginum - 1) * 12;
        if($userRole != 1)
        {
            $return['data'] = AppBasic::where('status', $status)->whereIn('id', $appArray)->orderBy('id', 'desc')
                        ->offset($offset_value)
                        ->limit(12)
                        ->get();
            $return['length'] = AppBasic::where('status', $status)->whereIn('id', $appArray)->orderBy('id', 'desc')->count();
        }
        else
        {
            $return['data'] = AppBasic::where('status', $status)->orderBy('id', 'desc')->offset($offset_value)
                        ->limit(12)
                        ->get(); 
            $return['length'] = AppBasic::where('status', $status)->orderBy('id', 'desc')->count(); 
        }
        return $return;
    } 

    public function getSingleAppData($id)
    {
        $return = AppBasic::where('id',$id)->first();        
        return $return;
    }

    public function getAllBasicDetailData()
    {
        $return = $this->hasMany('App\AppBasicDetail');
        return $return;
    }

    public function getAppForAssignUser()
    {
        $return = DB::table('app_basic')
            ->leftJoin('app_assign_user', 'app_assign_user.app_basic_id', '=', 'app_basic.id')
            ->select('app_basic.*')
            ->where('app_basic.status', 1)
            ->where('app_basic.app_publish_status', 1)
//            ->where('app_basic.app_publish_status', '1')
//            ->whereNull('app_assign_user.id')
            ->get();  
        return $return;
    }
    
    public function getAppForNotAssignedUser()
    {
        $return = DB::table('app_basic')
            ->select('app_basic.*')        
            ->leftJoin('app_assign_user', 'app_assign_user.app_basic_id', '=', 'app_basic.id')           
            ->where('app_basic.status', 1)
//          ->where('app_basic.app_publish_status', 1)
            ->whereNull('app_assign_user.id')
            ->get();  
        
        return $return;
    }
    
    public function saveModuleCssData($request)
    {     
        $columnName = $request['dbColumn'];
        $return = DB::table('app_basic')
            ->where('id', $request['appId'])
            ->update([$columnName => $request['data']]);
        return $return;
    }

    public function getDataCss($body)
    {
        $columnName = $body['dbColumn'];
        $a = json_decode($body['id']);
        $appId = trim($a);
        $users = DB::table('app_basic')
                    ->where(['id' => $appId])
                    ->first([$columnName]);


        if($columnName == 'app_general_css_json_data'){
            if($users && $users->$columnName != null)
            {
                // $users->$columnName;
                $allMenuData = json_decode($users->$columnName);
                
                $result['menuicon_css'] = json_encode($allMenuData[0]->menuIconCss);
                $result['header_css'] = json_encode($allMenuData[1]->headerCss);
                $result['statusbar_css'] = json_encode($allMenuData[2]->statusBarCss);         
            }
            else
            {
                $result['menuicon_css'] = DB::table('app_css')
                                            ->where('css_component','menuicon_css')
                                            ->pluck('css_properties')
                                            ->toArray();

                $result['header_css'] = DB::table('app_css')
                                            ->where('css_component','header_css')
                                            ->pluck('css_properties')
                                            ->toArray();

                $result['statusbar_css'] = DB::table('app_css')
                                            ->where('css_component','statusbar_css')
                                            ->pluck('css_properties')
                                            ->toArray();
            }
        }else{

            if($users && $users->$columnName != null)
            {          
                $allMenuData = json_decode($users->$columnName);
                
                $result['menu css'] = json_encode($allMenuData->sideMenuCss[0]->mainMenu);
                $result['submenu css'] = json_encode($allMenuData->sideMenuCss[1]->subMenu);
                $result['arrow css'] = json_encode($allMenuData->sideMenuCss[2]->arrow);
                $result['tab css'] = json_encode($allMenuData->sideMenuCss[3]->tabMenu);
            }
            else
            {
                $result['menu css'] = DB::table('app_css')
                                            ->where('css_component','menu_css')
                                            ->pluck('css_properties')
                                            ->toArray();

                $result['arrow css'] = DB::table('app_css')
                                            ->where('css_component','arrow_css')
                                            ->pluck('css_properties')
                                            ->toArray();

                $result['submenu css'] = DB::table('app_css')
                                            ->where('css_component','submenu_css')
                                            ->pluck('css_properties')
                                            ->toArray();

                $result['tab css'] = DB::table('app_css')
                                            ->where('css_component','tab_css')
                                            ->pluck('css_properties')
                                            ->toArray();                                            
            }
        }
        return $result;
    }
    
    public function getSubMenuCss($body)
    {
        $result = DB::table('app_css')
                    ->where('css_component', $body['cssComponent'])
                    ->first();
        return $result;
    }

    public function updateFinalJsonData($body,$finalJSON)
    {        
        $result = DB::table('app_basic')
                    ->where('id', $body['id'])
                    ->update(['app_json_data' => $finalJSON]);
        return $result;           
    }
    
    public function getAppDataUsingUniqueId($uniqueId)
    {
        $appUniqueId = trim($uniqueId); 
        $result = AppBasic::where('app_unique_id', (string)$appUniqueId)->whereRaw('status IN (1,2,4)')->get(); 
       
        return $result;
    }
    
    public function getAppBasicDataUsingVersion($body)
    {
       $appUniqueId = trim($body['appUniqId']);   
       //Check if same version name already exist 
       $versionExist = AppBasic::where('app_unique_id', (string)$appUniqueId)->where('version', $body['new_version'])->whereRaw('status IN (1,2)')->first(); 
      // $versionExist = DB::select(DB::raw("SELECT * FROM app_basic WHERE app_unique_id=".$appUniqueId." AND version = ".$body['new_version']." AND status = 1 LIMIT 0,1"));
       
       if(empty($versionExist)){           
           //$appData = DB::select(DB::raw("SELECT * FROM app_basic WHERE app_unique_id=".$appUniqueId." AND version = ".$body['base_version']." AND status = 1 LIMIT 0,1"));       
           $appData = AppBasic::where('app_unique_id', (string)$appUniqueId)->where('version', $body['base_version'])->whereRaw('status IN (1,2)')->first();   
       
           return $appData;
       }else{
           return $appData = array();
       }        
       
       
    }

    public function generateNewJsonVersion($newData,$basicData,$menuData){
       if(!empty($newData)){
         $newId = AppBasic::create($newData);  
         //Update the app code with new created id 
//         $result = DB::table('app_basic')
//                    ->where('id', $newId->id)
//                    ->update(['app_code' => $newData['app_code'].$newId->id]);
         
         return $newId->id;
       } 
       if(!empty($basicData))
       {
         $newbasicId = AppBasicDetail::create($basicData);
         return $newbasicId->id;
       }
       if(!empty($menuData))
       {
          $newmenuId = AppMenu::create($menuData);                    
          return $newmenuId->id;
       }                              
    }
    
    public function publishVersion($body){
        $appUniqueId = trim($body['appUniqueId']);   
        $result = DB::table('app_basic')
                    ->where('app_unique_id', $appUniqueId)
                    ->where('status', 1)
                    ->update(['status' => '4']);
        
        $result = DB::table('app_basic')
                    ->where('app_unique_id', $appUniqueId)
                    ->where('id', $body['appId'])
                    ->update(['status' => '1']);
        
        $appVersionData = $this->getAppDataUsingUniqueId($appUniqueId);
        return $appVersionData; 
    }       
}
    
