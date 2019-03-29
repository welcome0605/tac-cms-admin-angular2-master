<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use JWTAuthException;
use Config;
use Mail;
use App\EmailTemplate;
use App\Services\EmailTemplate\Contracts\EmailTemplateRepository;


class EmailTemplateController extends Controller
{
    public function __construct(EmailTemplateRepository $EmailTemplateRepository)
    {
        $this->middleware('jwt.auth');
        $this->objEmailTemplateModel = new EmailTemplate();
        $this->EmailTemplateRepository = $EmailTemplateRepository;
    }
    
    public function addEmailTemplate(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
      
        if($user)
        {
            $emailData['et_name'] = $body['et_name'];
            
            $str = $body['et_name'];
            $delimiter = '_';
           
            $et_pseudo_name_slug = strtolower(trim(preg_replace('/[\s-]+/', $delimiter, preg_replace('/[^A-Za-z0-9-]+/', $delimiter, preg_replace('/[&]/', 'and', preg_replace('/[\']/', '', iconv('UTF-8', 'ASCII//TRANSLIT', $str))))), $delimiter));
       
            $emailData['et_pseudo_name'] = $et_pseudo_name_slug;
            $emailData['et_subject'] = $body['et_subject'];
            $emailData['et_body'] = $body['et_body'];
            $emailData['status'] = $body['status'];
            $emailData['readable'] = 0;

            $addEmailTemplateData =$this->EmailTemplateRepository->addEmailTamplate($emailData);

            if($addEmailTemplateData)
            {
                $outputArray['emailId'] = $addEmailTemplateData->id;
                $outputArray['status'] = '1';
                $outputArray['message'] = trans('appmessages.emailtemplatesaved');
            }
            else
            {
                $outputArray['status'] = '0';
                $outputArray['message'] = trans('appmessages.default_error_msg');
            }
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
              
        return response()->json($outputArray);
    }
    
    public function updateEmailTemplate(Request $request) 
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
      
        if($user)
        {
            $updatedId = $body['id'];
            $emailData['et_name'] = $body['et_name'];
            
            $str = $body['et_name'];
            $delimiter = '_';
           
            $et_pseudo_name_slug = strtolower(trim(preg_replace('/[\s-]+/', $delimiter, preg_replace('/[^A-Za-z0-9-]+/', $delimiter, preg_replace('/[&]/', 'and', preg_replace('/[\']/', '', iconv('UTF-8', 'ASCII//TRANSLIT', $str))))), $delimiter));
       
            $emailData['et_pseudo_name'] = $et_pseudo_name_slug;
            $emailData['et_subject'] = $body['et_subject'];
            $emailData['et_body'] = $body['et_body'];
            $emailData['status'] = $body['status'];
            
            $editEmailTemplateData =$this->EmailTemplateRepository->updateEmailTemplateData($updatedId, $emailData);

            if($editEmailTemplateData)
            {
                $response['emailId'] = $updatedId;
                $response['status'] = '1';
                $response['message'] = trans('appmessages.emailtemplateupdatedsuccessfully');
            }
            else
            {
                $response['status'] = '0';
                $response['message'] = trans('appmessages.default_error_msg');
            }  
        }
        else
        {
            $response['status'] = '0';
            $response['message'] = trans('appmessages.default_error_msg');
        }
       
        return response()->json($response);
    }
    
    public function fetchAllEmailTemplate(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $role_id = $user['role_id'];
        $body = $request->all();
        
        if($user)
        {
            $getAllEmailTemplates =$this->EmailTemplateRepository->getAllEmailTemplates();
       
            if($getAllEmailTemplates)
            {
                $response = $this->getEmailTemplateResponse($getAllEmailTemplates);     
            }
            else
            {
                $response['status'] = '0';
                $response['message'] = trans('appmessages.default_error_msg');
            }  
        }
        else
        {
            $response['status'] = '0';
            $response['message'] = trans('appmessages.default_error_msg');
        }
        
        
        return response()->json($response);
        
    }
    
    public function fetchEmailTemplateById(Request $request) 
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $editId = $body['id'];
        if($user)
        {
            $getEmailData = $this->EmailTemplateRepository->fetchEmailTempById($editId);
            
            // if($getEmailData && count($getEmailData) > 0)
            //gjc
            if($getEmailData)
            {
                $response['status'] = 1;
                $response['message'] = trans('appmessages.getemailtemplatebyidsuccessfully');
                
                $response['id'] = $getEmailData->id;
                $response['et_name'] = $getEmailData->et_name;
                $response['et_pseudo_name'] = $getEmailData->et_pseudo_name;
            
                $response['et_subject'] = $getEmailData->et_subject;
                $response['et_body'] = $getEmailData->et_body;
                $response['status'] = $getEmailData->status;
            }
            else
            {
                $response['status'] = '0';
                $response['message'] = trans('appmessages.default_error_msg');
            }
        }
        else
        {
            $response['status'] = '0';
            $response['message'] = trans('appmessages.default_error_msg');
        }
        
        return response()->json($response);    
        
    }
    
    public function delete(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $deleteId = $body['id'];
        if($user)
        {
            $return = $this->EmailTemplateRepository->deletEmailTemplate($deleteId);         
            if ($return) 
            {
                $getAllEmailTemplates =$this->EmailTemplateRepository->getAllEmailTemplates();
       
                if($getAllEmailTemplates)
                {
                  $response = $this->getEmailTemplateResponse($getAllEmailTemplates);        
                }
                $response['status'] = '1';
                $response['message'] = trans('appmessages.deleteemailtemplatesuccessfully');
            } else {
                $response['status'] = '0';
                $response['message'] = trans('appmessages.default_error_msg');
            }
        }
        else
        {
            $response['status'] = '0';
            $response['message'] = trans('appmessages.tokennotmatched');
        }
        
        return response()->json($response);        
    }
    
    public function getEmailTemplateResponse($getAllEmailTemplates) 
    {
        $response['status'] = '1';
        $response['message'] = trans('appmessages.emailtemplatedatagetsuccessfully');
        $response['data'] = array();
        $i = 0;
        foreach ($getAllEmailTemplates as $key => $data)
        {                
           $response['data'][$i]['id'] = $data->id;
           $response['data'][$i]['et_name'] = $data->et_name;
           $response['data'][$i]['et_pseudo_name'] = $data->et_pseudo_name;
           $response['data'][$i]['et_subject'] = $data->et_subject;
           $response['data'][$i]['status'] = $data->status;
           $response['data'][$i]['body'] = $data->et_body;             
           $response['data'][$i]['readable'] = $data->readable;
           $i++;
        }
        return $response;
    }
}
