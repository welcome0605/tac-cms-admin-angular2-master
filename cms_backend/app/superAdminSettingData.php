<?php

namespace App;
use DB;
use Illuminate\Database\Eloquent\Model;

class superAdminSettingData extends Model
{

    protected $table = 'industry_type';
    protected $guarded = [];

    public function saveSuperAdminSettingDataFun($body)
    {        
     // $data = DB::table('super_admin_setting')->get()->toArray();    
        $data = DB::table('super_admin_setting')->first();
        $data_len = DB::table('super_admin_setting')->count();
        if($data_len > 0)
        {     
            DB::beginTransaction();
            try 
            {
                $updateData = DB::table('super_admin_setting')
                            ->where('id', $data->id)
                            ->update(['app_super_admin_json_data'=>json_encode($body)]);
                DB::commit();
                return 1;
            } catch (Exception $ex)  {
                DB::rollback();
                return 0;
            }
        } else {

            $result = DB::table('super_admin_setting')->insert(
                      ['app_super_admin_json_data'=>json_encode($body)] 
                    );
            return $result;
        }        
    }

    public function getSuperAdminSettingDataFun()
    {
    	$data = DB::table('super_admin_setting')->get()->toArray();

        return $data;

    }
}
