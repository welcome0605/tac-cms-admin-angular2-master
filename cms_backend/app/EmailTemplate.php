<?php

namespace App;
use Config;

use Illuminate\Database\Eloquent\Model;

class EmailTemplate extends Model 
{

  /**
   * The database table used by the model.
   *
   * @var string
   */
    
    protected $table = 'email_template';
    protected $guarded = [];
    
    public function saveEmailTemplate($emailData)
    {
        $result = EmailTemplate::create($emailData);
        return $result;
    }
    
    public function updateEmailTemp($updatedId, $emailData) 
    {
        $result = EmailTemplate::where('id', $updatedId)->update($emailData);
        return $result;
    }
    
    public function getAllEmailTemplates()
    {
        $getData = EmailTemplate::whereRaw('status IN (1,2)')->get();
        return $getData;
    }
    //gjc 0407
    public function getAllEmailTemplatesByAppId_Pseudo($app_ids, $pseudoName)
    {
        // for($i){
        //     # code...
        //     $getData[] = EmailTemplate::where('app_id', $ids)->
        //             where('et_pseudo_name', $pseudoName)->where('status','1')->get();
        // }
        // return $getData;
    }
    
    public function getEmailDataByName($pseudoName) 
    {
        $getData = EmailTemplate::where('et_pseudo_name', $pseudoName)->where('status','1')->first();
        return $getData;
    }
    
    public function getEmailTemplateDataById($id)
    {
        //gjc 0409
        EmailTemplate::where('id', $id)->whereRaw('status IN (1,2)')->update(array('readable'=> 1));
        $result = EmailTemplate::where('id', $id)->whereRaw('status IN (1,2)')->first();
        return $result;
    }
    
    public function deleteEmailTemplateData($id)
    {
        $result = EmailTemplate::where('id', $id)->update(['status' => Config::get('constant.DELETED_FLAG')]);
        return $result;
    }
    
}
