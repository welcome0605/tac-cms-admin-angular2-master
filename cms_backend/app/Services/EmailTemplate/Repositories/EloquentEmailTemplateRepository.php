<?php

namespace App\Services\EmailTemplate\Repositories;

use DB;
use Config;
use App\Services\EmailTemplate\Contracts\EmailTemplateRepository;
use App\EmailTemplate;
use App\Services\Repositories\Eloquent\EloquentBaseRepository;

class EloquentEmailTemplateRepository extends EloquentBaseRepository implements EmailTemplateRepository 
{

    public function __construct() 
    {
        $this->objEmailTemplateModel = new EmailTemplate();
    }

    public function addEmailTamplate($emailData)
    {
        $result = $this->objEmailTemplateModel->saveEmailTemplate($emailData);
        return $result;
    }
    
    public function updateEmailTemplateData($updatedId, $emailData)
    {
        $result = $this->objEmailTemplateModel->updateEmailTemp($updatedId, $emailData);
        return $result;
    }
    
    public function getAllEmailTemplates() 
    {
        $result = $this->objEmailTemplateModel->getAllEmailTemplates();
        return $result;
    }

    //gjc 0407
    public function getAllEmailTemplatesByAppId_Pseudo($app_ids, $pseudoName)
    {
        $result = $this->objEmailTemplateModel->getAllEmailTemplatesByAppId_Pseudo($app_ids, $pseudoName);
        return $result;
    }
    
    /*
     return : array of placeholder of email template
     */
    
    public function getEmailTemplateDataByName($pseudoName) 
    {
        $data = $this->objEmailTemplateModel->getEmailDataByName($pseudoName);
//      $data = $this->objEmailTemplateModel->where('et_pseudo_name',$pseudoName)->where('deleted','1')->first();
        return $data;
    }
    
    public function deletEmailTemplate($id)
    {
        $data = $this->objEmailTemplateModel->deleteEmailTemplateData($id);
        return $data;
    }
    
    public function fetchEmailTempById($id) 
    {
        $data = $this->objEmailTemplateModel->getEmailTemplateDataById($id);
        return $data;
    }
    
    /*
     *change place holder with dynamic value
     */
    
    public function getEmailContent($str , $arr) 
    {
        if (is_array($arr))
        {
            reset($arr);
            $keys = array_keys($arr);
            //gjc 0413 comment force
            //array_walk($keys, create_function('&$val', '$val = "[$val]";'));
            $vals = array_values($arr);
            //return ereg_replace( "[([0-9A-Za-z\_\s\-]+)]", "", str_replace( $keys, $vals, $str));
            return preg_replace('/^[0-9a-zA-Z\/_\/s\/-]+/', '', str_replace($keys, $vals, $str));
        }
        else
        {
            return $str;
        }
    }
    
    
}
