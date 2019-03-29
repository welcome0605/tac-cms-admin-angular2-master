<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use JWTAuthException;
use App\User;
use App\Services\User\Contracts\UserRepository;
use App\Services\AppAssignUser\Contracts\AppAssignUserRepository;
use DB;

const FAIL = 0;
const SUCCESS = 1;

class MemberController extends Controller
{
    public function __construct(
        UserRepository $UserRepository,
        AppAssignUserRepository $AppAssignUserRepository
    )
    {
        $this->middleware('jwt.auth', ['except' => ['createMember', 'loginMember', 'forgotMember']]);
        $this->objUser = new User();
        $this->UserRepository = $UserRepository;
        $this->AppAssignUserRepository = $AppAssignUserRepository;
    }

    public function addMember(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if ($user)
        {
            $member = $this->UserRepository->checkEmail($body['email']);

            if (!$member) {
                $body['notification'] = ($body['notification'] == "true" ? 1 : 0);
                $body['password'] = bcrypt($body['password']);
                $body['role_id'] = 3;
                $body['status'] = 1;
                $app_id = $body['app_id'];
                unset($body['app_id']);
                unset($body['token']);

                $MemberDetail = $this->UserRepository->saveUserData($body);
                if ($MemberDetail) {
                    $insertData['app_basic_id'] = $app_id;
                    $insertData['user_id'] = $MemberDetail['id'];
                    $this->AppAssignUserRepository->saveAppAssignUserData($insertData);
                }
                $outputArray['data'] = $MemberDetail;
                $outputArray['status'] = '1';
                $outputArray['message'] = trans('appmessages.user_success_msg');
            } else {
                $outputArray['status'] = '0';
                $outputArray['message'] = trans('appmessages.userexistwithemail');
            }
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($outputArray);
    }

    public function createMember(Request $request)
    {
        try {
            $body = $request->all();
            $member = $this->UserRepository->checkRewardEmail($body['email'], $body['app_id'], 1);
            if(!$member) {
                $body['notification'] = 0;
                $body['username'] = $body['first_name'] . '_' . $body['last_name'];
                $password = $body['password'];      
                
                $body['password'] = bcrypt($password);

                $body['role_id'] = 3;
                $body['status'] = 1;
                $app_id = $body['app_id'];
                unset($body['app_id']);

                $MemberDetail = $this->UserRepository->saveUserData($body);
                if ($MemberDetail) {
                    $insertData['app_basic_id'] = $app_id;
                    $insertData['user_id'] = $MemberDetail['id'];
                    $this->AppAssignUserRepository->saveAppAssignUserData($insertData);
                }
                // return response()->json(
                //     ['email' => $MemberDetail['email'], 'password' => $password]
                // );
                if (!$token = JWTAuth::fromUser($MemberDetail))
                {
                    $response['status'] = FAIL;
                    $response['message'] = trans('appmessages.token_create_failed');   
                } else {
                    $response['status'] = SUCCESS;
                    $response['token'] = $token;    
                }
            } else {
                $response['status'] = FAIL;
                $response['message'] = trans('appmessages.userexistwithemail');
            }
        } catch (Exception $e) {
            $response['status'] = FAIL;
        }
        return response()->json($response);
        
    }

    private function processOfUserNotFound($credentials) {
        $type = (int)$credentials['type'];
        
        if ($type > 1) {
            // Create user based on social type with email
            $credentials['notification'] = 0;
            $credentials['username'] = '';
            $password = 'Social';      
            $credentials['password'] = bcrypt($password);

            $credentials['role_id'] = 3;
            $credentials['status'] = 1;
            $app_id = $credentials['app_id'];
            unset($credentials['app_id']);

            $MemberDetail = $this->UserRepository->saveUserData($credentials);
            if ($MemberDetail) {
                $insertData['app_basic_id'] = $app_id;
                $insertData['user_id'] = $MemberDetail['id'];
                $this->AppAssignUserRepository->saveAppAssignUserData($insertData);
            }
            // if (!$token = JWTAuth::attempt(['email' => $MemberDetail['email'], 'password' => $password]))
            if (!$token = JWTAuth::fromUser($MemberDetail))
            {
                $response['status'] = FAIL;
                
                $response['email'] = $MemberDetail['email'];
                $response['password'] = $password;
                $response['message'] = trans('appmessages.token_create_failed');   
            } else {
                $response['status'] = SUCCESS;
                $response['token'] = $token;    
            }
            return response()->json($response);
        } else {
            $outputArray['status'] = FAIL;
            $outputArray['message'] = trans('appmessages.usernotexistwithemail');
            return response()->json($outputArray);    
        }
    }

    public function loginMember(Request $request)
    {
        $credentials = $request->only('email', 'password', 'type', 'app_id');

        $token = null;
        $outputArray = [];
        $outputArray['status'] = FAIL;
        $outputArray['message'] = trans('appmessages.default_error_msg');
        $email = trim($credentials['email']);
        $password = trim($credentials['password']);
        $type = (int)$credentials['type'];
        
        $user = $this->UserRepository->checkRewardEmail($email, $credentials['app_id'], $type);
        if (!$user) {
            return $this->processOfUserNotFound($credentials);
        } else {
            // else user exist
            if ($user->role_id != 3) {
                $outputArray['status'] = FAIL;
                $outputArray['message'] = trans('appmessages.usernotmemberwithemail');
                return response()->json($outputArray);
            }
            try {
                //old if condition !$token = JWTAuth::attempt($credentials)
                if ($type > 1) {
                    $token = JWTAuth::fromUser($user);
                } else {
                    if (!$token = JWTAuth::attempt(['email'=>$email,'password'=>$password])) 
                    {
                        $outputArray['status'] = FAIL;
                        $outputArray['message'] = $type == 1 ? trans('appmessages.invalid_pwd_msg') : trans('appmessages.usernotexistwithemail');
                        return response()->json($outputArray);
                    }    
                }              
            } catch (JWTAuthException $e) {
                $outputArray['status'] = FAIL;
                $outputArray['message'] = trans('appmessages.please_contact_to_admin'); // 'Action failed to create token'
                return response()->json($outputArray, 200);
            }

            $outputArray['token'] = $token;
            $outputArray['status'] = SUCCESS;
            $outputArray['message'] = trans('appmessages.login_success_msg');          
            return response()->json($outputArray, 200);
        }
    }

    public function fetchAllMembers(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];
        if ($user)
        {
            $response['data'] = $this->UserRepository->getAppMembersData($appId);
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }

    public function fetchMemberById(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        
        $editId = $body['id'];

        if($user)
        {
            $response = $this->UserRepository->getUsersDataById($editId);
            $response['message'] = trans('appmessages.getMemberbyidsuccessfully');
        }
        else {
            $response['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($response);
    }

    public function updateMember(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        
        if ($user)
        {
            unset($body['app_id']);
            unset($body['token']);
            $MemberData = $this->UserRepository->saveUserData($body);
        }
        else
        {
            $MemberData['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($MemberData);
    }

    public function deleteMember(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $appId = $body['app_id'];
        $deleteId = $body['id'];

        if ($user)
        {
            $this->AppAssignUserRepository->deleteAppAssignUserByUserId($deleteId);
            $this->UserRepository->deleteUserDetails($deleteId);

            $response['data'] = $this->UserRepository->getAppMembersData($appId);
        }
        else
        {
            $response['message'] = trans('appmessages.default_error_msg');
        }

        return response()->json($response);
    }
}
