<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Config;
use Helpers;
use Mail;
use DB;

use App\User;
use App\AppBasic;
use App\AppInquiry;
use App\StripPackages;
use App\StripeTransaction;
use App\StripeSubscription;

use App\Services\App\Contracts\AppRepository;
use App\Services\User\Contracts\UserRepository;
use App\Services\AppAssignUser\Contracts\AppAssignUserRepository;
use App\Services\EmailTemplate\Contracts\EmailTemplateRepository;

class StripPackagesController extends Controller {
    //
    public function __construct(UserRepository $UserRepository, AppRepository $AppRepository, AppAssignUserRepository $AppAssignUserRepository, EmailTemplateRepository $EmailTemplateRepository) {
       
        $this->objUser = new User();
        $this->objAppInqiry = new AppInquiry();
        $this->StripObj = new StripPackages();
        $this->SubObj = new StripeSubscription();
        $this->transObj = new StripeTransaction();
       
        $this->UserRepository = $UserRepository;
        $this->AppRepository = $AppRepository;
        $this->AppAssignUserRepository = $AppAssignUserRepository;
        $this->EmailTemplateRepository = $EmailTemplateRepository;
       
    }
    public function allActivePackage() {
        # code...
        $data = $this->StripObj->getActivePackages();
        return response()->json(["data" => $data], 200);
    }
    public function allActivePackageByUniqueKey($id)
    {
        $data = $this->StripObj->getActivePackagesByUniqueId($id);
        return response()->json(["data" => $data], 200);
    }
    public function CheckoutForm($id) {
        # code...
        $active_package = $this->StripObj->getActivePackagesById($id);
        return view('stripe_checkout', ['pkg_name' => $active_package->pa_name, 'pkg_desc' => $active_package->pa_desc, 'pkg_price' => $active_package->pa_price]);
    }
    public function postCheckoutForm($request) {
        # code...
        //return response()->json(["post-req" => $request]);
       return response()->json(['res'=>$this->objUser->getUserByStripeId($request)]);
    }
    public function testSignup(Request $request) {
        $body = $request->all();
        // Set your secret key: remember to change this to your live secret key in production
        // See your keys here: https://dashboard.stripe.com/account/apikeys
        \Stripe\Stripe::setApiKey(Config::get('services.stripe.secret'));
        // Token is created using Stripe.js or Checkout!
        // Get the payment token ID submitted by the form:
        $token = $body['stripe_token'];
        // plan data
        $pkg_id = $body['basic_plan_id'];
        $charge_price = $body['basic_plan_price'];
        $plan_name = $body['basic_plan_name'];
        $is_refer_true = $body['is_refer'];
        // user data
        $first_name = $body['first_name'];
        $last_name = $body['last_name'];
        $email = $body['email'];
        $user = json_encode(array('first_name' => $first_name, 'last_name' => $last_name, 'email' => $email));
        $password = bcrypt($body['password']);
        $mob_number = $body['mob_number'];

        //prepare mailer obj data
        $sendMailerdata = (object)['first_name'=>$first_name, 'last_name'=>$last_name, 'email'=>$email, 'plan_name'=>$plan_name];        
        // application data
        $app_name = $body['app_name'];

        $charge = $this->create_stripe_customer($user, $pkg_id, $token);
        
        // if  stripe customer charge object present
        if ($charge->charge && $charge->subscriptions) {
            $decode_charge = $charge->charge;        
            // try {
            //     file_put_contents("TransactionCharge-".date('Y-m-d-H-i-s').'.txt', print_r($decode_charge,true));
            // } catch(Exception $e){
            //     echo $e->getMessage();
            // }
        }
        // set stripe charges data
        $st_id = $decode_charge->id;
        $st_object = $decode_charge->object;
        $st_amount = $decode_charge->amount;
        $st_balance_transaction = $decode_charge->balance_transaction;
        $st_created = $decode_charge->created;
        $st_currency = $decode_charge->currency;
        $st_source_id = $decode_charge->source->id;
        $st_source_object = $decode_charge->source->object;
        $st_source_name = $decode_charge->source->name;
        $st_status = $decode_charge->status;
        //
        $user = $this->UserRepository->checkEmail($email);
        if (!$user && $st_status === "succeeded") {
            // prepare user model data
            $insertData['first_name'] = $first_name;
            $insertData['last_name'] = $last_name;
            $insertData['email'] = $email;
            $insertData['password'] = $password;
            $insertData['role_id'] = 2;
            $insertData['status'] = 1;
            $userDetail = $this->UserRepository->saveUserData($insertData);
            if ($userDetail) {
                
                // store transaction details
                $insertTrans['st_id'] = $st_id;
                $insertTrans['st_object'] = $st_object;
                $insertTrans['st_amount'] = $st_amount;
                $insertTrans['st_balance_transaction'] = $st_balance_transaction;
                $insertTrans['st_created'] = date('Y-m-d H:i:s', $st_created);
                $insertTrans['st_currency'] = $st_currency;
                $insertTrans['st_source_id'] = $st_source_id;
                $insertTrans['st_source_object'] = $st_source_object;
                $insertTrans['st_source_name'] = $st_source_name;
                $insertTrans['st_status'] = $st_status;
                $insertTrans['pkg_id'] = $pkg_id;
                $insertTrans['user_id'] = $userDetail->id;
                $insertTrans['is_refer'] = $is_refer_true;
                $saveTrans = $this->transObj->saveData($insertTrans);
                
                // store subscription details
                $insertSub['user_id'] = $userDetail->id;
                $insertSub['pkg_id'] = $pkg_id;
                $insertSub['stripe_id'] = $charge->id;
                $insertSub['subscription_id'] = $charge->subscriptions->id;
                $insertSub['stripe_active'] = 1;
                $insertSub['stripe_token'] = $token;
                $insertSub['stripe_payment_failure'] = 0;
                $saveSub = $this->SubObj->saveData($insertSub);
                
                // store app basic deatails
                $insertAppBasic = (object)['user_id' => $userDetail->id, 'app_name' => $app_name];
                $resAppBasic = $this->StoreAppBasicDetail($insertAppBasic);

                // send signup mail
                
                $sendmail = $this->sendSignupMail($sendMailerdata);

                // prepare reponse
                // $outputArray['data'] = $userDetail;
                // $outputArray['save_trans'] = $saveTrans;
                // $outputArray['user'] = $userDetail;
                // $outputArray['app_basic'] = $resAppBasic;
                $outputArray['mailer_res'] = $sendmail;
                $outputArray['status'] = '1';
                $outputArray['message'] = trans('appmessages.user_success_msg');
                // if stripe one time package charge successful start subscription
                

            }
        } else {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.userexistwithemail');
        }
        return response()->json($outputArray);
    }
    /**
     * To create stripe profile of customer and charge a fix package amount and enable subscription
     * @inputparam Object of user model along with stripe CC token
     *
     * @return Object of stripe
     */
    public function create_stripe_customer($user, $plan_id, $stripe_token, $card_holdername = null) {
        $customer = null;
        $user = json_decode($user);
        try {
            \Stripe\Stripe::setApiKey(Config::get('services.stripe.secret'));
            $subscription_plan = $this->StripObj->getActivePackagesById($plan_id);
            if ($subscription_plan) {
                $plan_options = array("plan" => $subscription_plan->sub_id);
            }
            // if (!empty($trial) && is_numeric($trial) && $trial > 0) {
            //     $trial_end = Carbon::now()->addDays($trial);
            //     $plan_options['trial_end'] = $trial_end->getTimestamp();
            // }
            if (empty($card_holdername)) {
                $card_holdername = $user->first_name . ' ' . $user->last_name;
            }
            // Create a Customer
            $customer = \Stripe\Customer::create(array("source" => $stripe_token, "email" => $user->email, "description" => $user->email . "::" . $card_holdername));
            // One time Charge
            $customer->charge = \Stripe\Charge::create(array("amount" => $subscription_plan->pa_price * 100, "currency" => "usd", "description" => "Charges for account activation to" . $user->email, "customer" => $customer->id));
            $customer->subscriptions = $customer->subscriptions->create($plan_options);
        }
        catch(\Stripe\Error\Card $e) {
            throw $e;
        }
        catch(\Stripe\Error\InvalidRequest $e) {
            // Invalid parameters were supplied to Stripe's API
            throw $e;
        }
        catch(\Stripe\Error\Authentication $e) {
            // Authentication with Stripe's API failed
            // (maybe you changed API keys recently)
            throw $e;
        }
        catch(\Stripe\Error\ApiConnection $e) {
            // Network communication with Stripe failed
            throw $e;
        }
        catch(\Stripe\Error\Base $e) {
            // Display a very generic error to the user, and maybe send
            // yourself an email
            throw $e;
        }
        catch(Exception $e) {
            // Something else happened, completely unrelated to Stripe
            throw $e;
        }
        return $customer;
    }
    public static function cancel_stripe_subscription($user) {

        \Stripe\Stripe::setApiKey(Config::get('services.stripe.secret'));
        $customer = null;
        try {
            $customer = \Stripe\Customer::retrieve($user->stripe_id);
            $customer->subscriptions = $customer->subscriptions->retrieve($user->stripe_subscription)->cancel(array("at_period_end" => true));
            /* if (!empty($subscriptions)){
                              foreach ($subscriptions->data as $key => $subscription) {
                              $customer->subscriptions = $customer->subscriptions->retrieve($subscription->id)->cancel(array("at_period_end" => true));
                              }
                              } */
        }
        catch(\Stripe\Error\Card $e) {
            // Invalid card supplied to Stripe's API
            throw $e;
        }
        catch(\Stripe\Error\InvalidRequest $e) {
            // Invalid parameters were supplied to Stripe's API
            throw $e;
        }
        catch(\Stripe\Error\Authentication $e) {
            // Authentication with Stripe's API failed
            // (maybe you changed API keys recently)
            throw $e;
        }
        catch(\Stripe\Error\ApiConnection $e) {
            // Network communication with Stripe failed
            throw $e;
        }
        catch(\Stripe\Error\Base $e) {
            // Display a very generic error to the user, and maybe send
            // yourself an email
            throw $e;
        }
        catch(Exception $e) {
            // Something else happened, completely unrelated to Stripe
            throw $e;
        }
        return $customer;
    }

    public function webhookListener() {
        try {
            // Set your secret key: remember to change this to your live secret key in production
            // See your keys here https://dashboard.stripe.com/account/apikeys

            \Stripe\Stripe::setApiKey(Config::get('services.stripe.secret'));
            
            // Retrieve the request's body and parse it as JSON
            $input = @file_get_contents("php://input");
            $event_json = json_decode($input);
           
            // file_put_contents("temp/type-".date('Y-m-d-H-i-s').'.txt', gettype($event_json));
            file_put_contents("webhook-".date('Y-m-d-H-i-s').'.txt', print_r($event_json,true));
            
            // get user obj by stripe id
            $user = $this->objUser->getUserByStripeId($event_json->data->object->customer);
           
            if ( (sizeof($user) == 1  && $event_json->type == Config::get('strip_enum.STRIPE_EVENT_JSON.charge_failed')) || ($event_json->type == Config::get('strip_enum.STRIPE_EVENT_JSON.customer_subscription_deleted') && $user->status)) {
              
                if ($user->status) {
                    // set user status as inactive
                   $useInactive =  $this->objUser->setInactiveById($user->id);
                    // mark stripe_active status as inactive
                   $subInactive =  $this->SubObj->setInactiveById($event_json->data->object->customer);
                }
            }
        }
        catch(Exception $e) {
            //throw $e;
            $response['msg'] = 'Other exception';
            $response['status'] = 'error';
        }
        http_response_code(200); // PHP 5.4 or greater
        
    }
    /**
     * Private method to store app basic details
     * @param Object type data
     * @return Array contain successful response
     */
    private function StoreAppBasicDetail($data) {
        // store app_basic
        $user_id = $data->user_id;
        $app_name = $data->app_name;
        $insertData['app_name'] = $app_name;
        $insertData['app_code'] = str_slug($app_name, "_");
        $insertData['app_unique_id'] = Helpers::generateRandomString();
        $insertData['app_created_by'] = $user_id;
        $insertData['version'] = '1.0';
        $appDetail = $this->AppRepository->saveAppData($insertData);
        $app_id = $appDetail->id;
        $allAppSection = $appDetail = $this->AppRepository->getAllAppSection();
        // store app_basic_detail
        foreach ($allAppSection as $key => $val) {
            $insertAppBasicData = array();
            $insertAppBasicData['app_basic_id'] = $app_id;
            $insertAppBasicData['app_section_slug'] = $val->app_section_slug;
            $insertAppBasicData['app_section_id'] = $val->id;
            $appBasicDetail = $this->AppRepository->saveAppBasicDetailData($insertAppBasicData);
        }
        
        // add css 

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


            $cssMenuIcon[] =  $result['menuicon_css'][0];
            $cssMenuHeader[] =  $result['header_css'][0];
            $cssMenuStatusbar[] =  $result['statusbar_css'][0];

            $mainMenuCss['menuIconCss'] = json_decode($cssMenuIcon[0]);
            $mainMenuCss['headerCss'] = json_decode($cssMenuHeader[0]);
            $mainMenuCss['statusBarCss'] = json_decode($cssMenuStatusbar[0]);
            
            $finalMenuJson = []; 
            $finalMenuJson[0]['menuIconCss'] = $mainMenuCss['menuIconCss'];
            $finalMenuJson[1]['headerCss'] = $mainMenuCss['headerCss'];
            $finalMenuJson[2]['statusBarCss'] = $mainMenuCss['statusBarCss'];
 
            $updateQry = DB::table('app_basic')
                            ->where('id', $app_id)
                            ->update(['app_general_css_json_data' => json_encode($finalMenuJson)]);
                                    
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

            // print_r($result['menu css']);            
            $cssSideMenuCss[] =  $result['menu css'][0];
            $cssSideMenuArrowCss[] =  $result['arrow css'][0];
            $cssSideMenuSubmenuCss[] =  $result['submenu css'][0];
            $cssSideMenuTabCss[] =  $result['tab css'][0];

            
            $sideMenuCss = [];
            $sideMenuCss['mainMenu'] = json_decode($cssSideMenuCss[0]);
            $sideMenuCss['subMenu'] = json_decode($cssSideMenuSubmenuCss[0]);
            $sideMenuCss['arrow'] = json_decode($cssSideMenuArrowCss[0]);
            $sideMenuCss['tabMenu'] = json_decode($cssSideMenuTabCss[0]);
             
            $finalSideMenuJson = []; 
            $finalSideMenuJson[0]['mainMenu'] = $sideMenuCss['mainMenu'];
            $finalSideMenuJson[1]['subMenu'] = $sideMenuCss['subMenu'];
            $finalSideMenuJson[2]['arrow'] = $sideMenuCss['arrow'];
            $finalSideMenuJson[3]['tabMenu'] = $sideMenuCss['tabMenu']; 
            
            $finalSideData['sideMenuCss'] = $finalSideMenuJson; 
            
            $updateQry = DB::table('app_basic')
                            ->where('id', $app_id)
                            ->update(['app_side_menu_css_json_data' => json_encode($finalSideData)]);
        
        // store app_assign_user
        $insertAppAssignUserData['app_basic_id'] = $app_id;
        $insertAppAssignUserData['user_id'] = $user_id;
        $insertAppAssignUserData['status'] = 1;
        $AppAssignUserData = $this->AppAssignUserRepository->saveAppAssignUserData($insertAppAssignUserData);
        $outputArray['status'] = 1;
        $outputArray['message'] = trans('appmessages.app_create_msg');
        return $outputArray;
    }
    /**
     * Private method to send sign up mail
     * @param Object type $data
     * @return Array contain successful response
     */
    private function sendSignupMail($data)
    {
        # code...
        // get sign up page template code
        if(is_object($data)){
        $emailTemplateContent = $this->EmailTemplateRepository->getEmailTemplateDataByName(Config::get('constant.SIGN_UP'));
        
        if($emailTemplateContent)
        {
            $user_name = $data->first_name.' '.$data->last_name;
            $user_plan = $data->plan_name;
            $user_email = $data->email;
            // declare local array
            $data = array();
            $replaceArray = array();
    
            $replaceArray['toName'] = $user_name;
            $replaceArray['setPlan'] = $user_plan;
                      
            $content = $this->EmailTemplateRepository->getEmailContent($emailTemplateContent->et_body, $replaceArray);

            $data['subject'] = $emailTemplateContent->et_subject;
            $data['toEmail'] = $user_email;
            $data['toName'] = $user_name;            
            $data['content'] = $content;

            if($data)
            {
                Mail::send(['html' => 'emails.Template'], $data, function($message) use ($data) {
                $message->subject($data['subject']);
                $message->to($data['toEmail'], $data['toName']);
                });
                $outputArray['status'] = '1';
                $outputArray['message'] = trans('appmessages.success_sign_up');
            }
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.not_found_email_template');
        }
        return $outputArray;
    }
    else{
        $outputArray['status'] = '0';
        return $outputArray;
    }
    }
    /**
     * To check wheather email user is exist or not
     * @param Req (Request)
     *
     * @return array message
     */
    public function checkEmailAppExist(Request $req)
    {
        # code...
        $body = $req->all();
        $outputArray = [];

        $email = $body['email'];
        $app = $body['app_name'];

        if( isset($email) && isset($app) ){
            $email_exist = $this->UserRepository->checkEmail($email);

            // prepare matching string  
            $string = preg_replace('/\s+/', '', $app);
            $app_exist = AppBasic::where('app_name',$app)->first();

            if($email_exist != null){
                $outputArray['email'] = 'Email Already Exist';
            } else {
                $outputArray['email'] = null;
            }
            if($app_exist != null) {
                $outputArray['app_name'] = 'Please choose diffrent app name ';
            } else {
                $outputArray['app_name'] = null;
            }
            return response()->json($outputArray);
           
            
        }
        
        
    }
    /**
     * handler to serve custom form registration 
     * @param Req (Request)
     *
     * @return array message
     */
    public function sendCustomMail(Request $var)
    {
        # code...
        $body = $var->all();

        // fetch admin mail id
        $admin_data = DB::table('super_admin_setting')->where('status', 1)->first();
        
        
        if($admin_data)
        {   
            $emailTemplateContent = $this->EmailTemplateRepository->getEmailTemplateDataByName(Config::get('constant.INQUIRY_CUSTOM'));

            $inquiry_name = $body['name'];
            $inquiry_email = $body['email'];
            $inquiry_budget = $body['budget'];
            $inquiry_app_desc = $body['app_desc'];
            $admin_mail = json_decode($admin_data->app_super_admin_json_data)->email;
            if(isset($admin_mail)){
                $expand_mail = explode(',',$admin_mail);
            }
            
            $arr['name'] = $inquiry_name;
            $arr['email'] = $inquiry_email;
            $arr['budget'] = $inquiry_budget;
            $arr['app_description'] = $inquiry_app_desc;

            

            // declare local array
            $emaildata = array();
            $replaceArray = array();            
            
            $replaceArray['inName'] = $inquiry_name;
            $replaceArray['inEmail'] = $inquiry_email;
            $replaceArray['inBudget'] = '$'.$inquiry_budget;
            $replaceArray['inAppDesc'] = $inquiry_app_desc;
            
            if($emailTemplateContent){

          
                $content = $this->EmailTemplateRepository->getEmailContent($emailTemplateContent->et_body, $replaceArray);

                $emaildata['subject'] = $emailTemplateContent->et_subject;
                $emaildata['toEmail'] = $expand_mail;
                $emaildata['fromEmail'] = $inquiry_email;
                $emaildata['fromName'] = $inquiry_name;
                $emaildata['content'] = $content;

                if($content)
                {
                    Mail::send(['html' => 'emails.Template'], $emaildata, function($message) use ($emaildata) {
                    $message->subject($emaildata['subject']);
                    $message->to($emaildata['toEmail']);
                    $message->from($emaildata['fromEmail'], $emaildata['fromName']);
                    });
                    $outputArray['status'] = 1;
                    $outputArray['message'] = trans('Your Request Reach us Successfully');
                    // save inquiry after mail sent
                    $saveInqiry = $this->objAppInqiry->saveData($arr);
                } else {
                    $outputArray['status'] = 0;
                    $outputArray['message'] = trans('Mail content not found');
                }
            } else {
                $outputArray['status'] = 0;
                $outputArray['message'] = trans('appmessages.not_found_email_template');
            }
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('admin mail not configured');
        }
        return response()->json($outputArray);
    }
 
}
