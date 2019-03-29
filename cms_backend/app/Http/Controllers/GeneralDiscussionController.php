<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use JWTAuth;
use JWTAuthException;

use App\AppGeneralDiscussion;
use App\Role;
use App\User;

use App\Services\EmailTemplate\Contracts\EmailTemplateRepository;

use DB;
use Mail;
use Config;
use Carbon\Carbon;


class GeneralDiscussionController extends Controller
{
    //
    public function __construct(EmailTemplateRepository $EmailTemplateRepository)
    {   
        $this->middleware('jwt.auth');

       
        $this->appGeneralDicussObj = new AppGeneralDiscussion(); 
        $this->userObj = new User();
        $this->roleObj = new Role();
        $this->EmailTemplateRepository = $EmailTemplateRepository;
    }
    public function storeDicussion(Request $req) {

        // return $req;
        $body = $req->all();

        $prepareArrMailer= [];
        $email = $body['email'];
        $sender_role_id = $body['role_id'];
        $app_id = $body['app_id'];
        $text = $body['dicussion_text'];

        $sender_id = $this->userObj->getUserByEmailId($email);
        $is_admin = $this->roleObj->IsRoleAdmin($sender_role_id);

        $getAppCreatorId =  $this->getAppCreatorId($app_id);
        
        // if sender is admin then receiver will be app creator user
        if( $is_admin && isset($getAppCreatorId) && count($getAppCreatorId) > 0)
        {   
            //
            $receiver_id = $getAppCreatorId[0]->sender_id;
            $prepareArrMailer['user_name'] = $getAppCreatorId[0]->first_name.' '.$getAppCreatorId[0]->last_name;
            $prepareArrMailer['user_email'] = $getAppCreatorId[0]->sender_email;
        } 
        else
        {
            // (false) then receiver will be admin and app is not assig to any user
            $receiver_id = $this->getAdminid();
            // set sender name (normal user)
            $prepareArrMailer['user_name'] = $sender_id->first_name.' '.$sender_id->last_name;
            $prepareArrMailer['user_email'] = $sender_id->email;
        }
        if(isset($receiver_id) && isset($sender_id) && isset($app_id) && isset($text)){

            $arr['app_id'] = $app_id;
            $arr['sender_id'] = $sender_id->id;
            $arr['receiver_id'] = $receiver_id;
            $arr['dicussion'] = $text;
            
            $prepareArrMailer['message'] = $text;
            $prepareArrMailer['isSenderAdmin'] = $is_admin;

            $mailerData=(object)$prepareArrMailer;
                
            $saveDicussion = $this->appGeneralDicussObj->saveData($arr);
            $sendMail = $this->sendDicussionMail($mailerData);

            if(isset($saveDicussion) && !empty($saveDicussion)){
                $outArr['status'] = 1;
                $outArr['message'] = 'Your Message Sent Successfully';
                
                // return response()->json(['data'=>$outArr]);
            }
            else
            {
                $outArr['status'] = 0;
                $outArr['message'] = 'Ooops Something wrong Happen While Saving Data';
                
                // return response()->json(['data'=>$outArr]);
            }
            // check mail data received or not
            if(isset($sendMail) && !empty($sendMail)){
                
                $outArr['mailer'] = $sendMail;
                // return response()->json(['data'=>$outArr]);
            }
            else
            {
                $outArr['mail_status'] = 0;
                $outArr['mail_message'] = 'Ooops Something wrong Happen While sending mail';
                
                // return response()->json(['data'=>$outArr]);
            }

        }
        else
        {
            $outArr['status'] = 0;
            $outArr['message'] = 'Required Data not Found';

            // return response()->json(['data'=>$outArr]);
        }
        return response()->json(['data'=>$outArr]);

    }

    public function getDicussionByAppID(Request $req)
    {
        # code...
        $body = $req->all();
        $appid = $body['app_id'];

        if( isset($appid) )
        {
            $getDicussion = $this->appGeneralDicussObj->getDicussionByAppId($appid);

            if(isset($getDicussion) && !empty($getDicussion))
            {

                $outArr['status'] = 1;
                $outArr['data'] = $getDicussion;
    
                return response()->json($outArr);
            }
            else
            {
                $outArr['status'] = 0;
                $outArr['data'] = 'NO DATA FOUND';
    
                return response()->json($outArr);
            }
        }
        else
        {
            $outArr['status'] = 0;
            $outArr['data'] = 'application id missing';

            return response()->json($outArr);
        }

        
    }
    private function getAdminid(){

        //
        $return = $this->roleObj->getRoleUserData(1);
        $return = $return[0]->user_id;

        return $return;
    }
    private function checkRoleIsAdmin( $role_id ){
        
        //
        $return = User::where('email', $email)->select('id as sender_id')->first();

        return $return;
    }
    
    public function getAppCreatorId($app_id)
    {
        # code...
        $return  = DB::table('app_assign_user as ab')
                ->join('users as u', 'u.id', '=', 'ab.user_id')
                ->where('ab.app_basic_id', $app_id)
                ->select('u.id as sender_id','u.first_name','u.last_name','u.email as sender_email')
                ->get();
        
        return $return;
    }

    public function sendDicussionMail($data){
        // fetch admin mail id
        $admin_data = DB::table('super_admin_setting')->where('status', 1)->first();
        
        if($admin_data)
            {   
                // get admin mail string
                $admin_mail = json_decode($admin_data->app_super_admin_json_data)->email;
                if(isset($admin_mail)){
                    // save all mails into var expand_mail
                    $expand_mail = explode(',',$admin_mail);
                }
                // get template data
                $emailTemplateContent = $this->EmailTemplateRepository->getEmailTemplateDataByName(Config::get('constant.GENERAL_DISCUSSION'));
                if($emailTemplateContent) {
                    
                    $current_timestamp = Carbon::now();
                    // declare local array
                    $emaildata = array();
                    $replaceArray = array();            
                    
                    $replaceArray['userName'] = $data->user_name;
                    $replaceArray['userEmail'] = $data->user_email;
                    $replaceArray['userMsg'] = $data->message;
                    $replaceArray['timeStamp'] = $current_timestamp->format('m-d-Y H:i A'); 

                    // get mail content
                    $content = $this->EmailTemplateRepository->getEmailContent($emailTemplateContent->et_body, $replaceArray);
                    
                    // set up email data
                    $emaildata['subject'] = $emailTemplateContent->et_subject;
                    $emaildata['content'] = $content;
                    // if sender is admin
                    if($data->isSenderAdmin) {
                        $emaildata['toEmail'] = $data->user_email;
                        $emaildata['fromEmail'] = $expand_mail;
                        $emaildata['fromName'] = 'Admin The APP Company';
                    }
                    else {
                        $emaildata['toEmail'] = $expand_mail;
                        $emaildata['fromEmail'] = $data->user_email;
                        $emaildata['fromName'] = $data->user_name;
                    }         
                    
                    if($content) {
                        
                        Mail::send(['html' => 'emails.Template'], $emaildata, function($message) use ($emaildata) {
                            $message->subject($emaildata['subject']);
                            $message->to($emaildata['toEmail']);
                            $message->from($emaildata['fromEmail'], $emaildata['fromName']);
                        });
 
                            $outputArray['mail_status'] = 1;
                            $outputArray['mail_message'] = trans('Your Request Reach us Successfully');

                    } else {
                        $outputArray['mail_status'] = 0;
                        $outputArray['mail_message'] = trans('Mail content not found');
                    }
                } else {
                    $outputArray['mail_status'] = 0;
                    $outputArray['mail_message'] = trans('appmessages.not_found_email_template');
                }
            }
            else {
                $outputArray['mail_status'] = 0;
                $outputArray['mail_message'] = trans('admin mail not configured');
            }
        return $outputArray;
    }

    

}
