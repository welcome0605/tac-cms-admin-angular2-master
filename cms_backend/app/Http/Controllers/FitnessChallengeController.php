<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use JWTAuthException;
use Config;
use Mail;
use App\FitnessChallenge;
use App\Services\FitnessChallenge\Contracts\FitnessChallengeRepository;
use Image;
use Illuminate\Support\Facades\Input;
use File;

class FitnessChallengeController extends Controller
{
	public function __construct(FitnessChallengeRepository $FitnessChallengeRepository)
    {
        $this->middleware('jwt.auth');
        $this->objFitnessModel = new FitnessChallenge();
        $this->FitnessChallengeRepository = $FitnessChallengeRepository;
        $this->fitnessimageOriginalImageUploadPath = Config::get('constant.fitnessimageOriginalImageUploadPath');
        $this->fitnessimageThumbImageUploadPath = Config::get('constant.fitnessimageThumbImageUploadPath');
        $this->fitnessimageThumbImageWidth = Config::get('constant.fitnessimageThumbImageWidth');
        $this->fitnessimageThumbImageHeight = Config::get('constant.fitnessimageThumbImageHeight');
        $this->fitnessDayimageOriginalImageUploadPath = Config::get('constant.fitnessDayimageOriginalImageUploadPath');
        $this->fitnessDayimageThumbImageUploadPath = Config::get('constant.fitnessDayimageThumbImageUploadPath');
        $this->fitnessDayimageThumbImageWidth = Config::get('constant.fitnessDayimageThumbImageWidth');
        $this->fitnessDayimageThumbImageHeight = Config::get('constant.fitnessDayimageThumbImageHeight');
    }
	public function fetchAllFitnessChallenge(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        
        if($user)
        {
            $getAllFitnessChallenges =$this->FitnessChallengeRepository->getAllFitnessChallenges();
       
            if($getAllFitnessChallenges)
            {
                $response = $this->getFitnessChallengeResponse($getAllFitnessChallenges);     
            }
            else
            {
                $response['status'] = 0;
                $response['message'] = trans('appmessages.default_error_msg');
            }   
        }
        else
        {
            $response['status'] = 0;
            $response['message'] = trans('appmessages.default_error_msg');
        }
        
        
        return response()->json($response);
        
    }
    public function getFitnessChallengeResponse($getAllFitnessChallenges)
    {
    	$response['status'] = '1';
        $response['message'] = trans('appmessages.fitnesschallengedatagetsuccessfully');
        $response['data'] = array();
        $i = 0;
        foreach ($getAllFitnessChallenges as $key => $data)
        {                
           $response['data'][$i]['id'] = $data->id;
           $response['data'][$i]['title'] = $data->title;
           $response['data'][$i]['image'] = $data->image;
           $response['data'][$i]['video_url'] = $data->video_url;
           $response['data'][$i]['description'] = strip_tags($data->description);
           $response['data'][$i]['price'] = $data->price;               
           $response['data'][$i]['status'] = $data->status;
           $i++;
        }
        return $response;
    }
    public function addFitnessChallenge(Request $request)
    {
    	$user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if($user)
        {
        	if (Input::file()) {
                $file = Input::file('image');
                if (!empty($file)) {
                    // $fileName = 'fitnessImage_' . time() . '.' . $file->getClientOriginalExtension();
                    $fileName = 'fitnessImage_' . time() . '.png';
                    $pathOriginal = public_path($this->fitnessimageOriginalImageUploadPath . $fileName);
                    $pathThumb = public_path($this->fitnessimageThumbImageUploadPath . $fileName);
                    Image::make($file->getRealPath())->save($pathOriginal);
                    Image::make($file->getRealPath())->resize($this->fitnessimageThumbImageWidth, $this->fitnessimageThumbImageHeight)->save($pathThumb);
                   
                }
            }
            $body['image'] = $fileName;
            unset($body['token']);
            $addFitnessData =$this->FitnessChallengeRepository->addFitnessChallenge($body);

            if($addFitnessData)
            {
                $outputArray['data'] = $addFitnessData['id'];
                $outputArray['status'] = 1;
                $outputArray['message'] = trans('appmessages.fitnesschallengeaddedsuccessfully');
            }
            else
            {
                $outputArray['status'] = 0;
                $outputArray['message'] = trans('appmessages.default_error_msg');
            }  
            return response()->json($outputArray);

        }
    }
    public function addFitnessChallengeDay(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if($user)
        {
            if (Input::file()) {
                $file = Input::file('image');
                if (!empty($file)) {
                    // $fileName = 'fitnessDayImage_' . time() . '.' . $file->getClientOriginalExtension();
                    $fileName = 'fitnessDayImage_' . time() . '.png';
                    $pathOriginal = public_path($this->fitnessDayimageOriginalImageUploadPath . $fileName);
                    $pathThumb = public_path($this->fitnessDayimageThumbImageUploadPath . $fileName);
                    Image::make($file->getRealPath())->save($pathOriginal);
                    Image::make($file->getRealPath())->resize($this->fitnessDayimageThumbImageWidth, $this->fitnessDayimageThumbImageHeight)->save($pathThumb);
                   
                }
            }
            $body['image'] = $fileName;
            unset($body['token']);
            $addFitnessDayData =$this->FitnessChallengeRepository->addFitnessChallengeDay($body);

            if($addFitnessDayData)
            {
                $outputArray['data'] = $addFitnessDayData['id'];
                $outputArray['status'] = 1;
                $outputArray['message'] = trans('appmessages.fitnesschallengedayaddedsuccessfully');
            }
            else
            {
                $outputArray['status'] = 0;
                $outputArray['message'] = trans('appmessages.default_error_msg');
            }  
            return response()->json($outputArray);

        }
    }
    public function deleteFitnessChallenge(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $deleteId = $body['id'];
        if($user)
        {
            $return = $this->FitnessChallengeRepository->deleteFitnessChallenge($deleteId);         
            if ($return) 
            {
                $getAllFitnessChallenges = $this->FitnessChallengeRepository->getAllFitnessChallenges();
       
                if($getAllFitnessChallenges)
                {
                  $response = $this->getFitnessChallengeResponse($getAllFitnessChallenges);        
                }
                $response['status'] = 1;
                $response['message'] = trans('appmessages.deletefitnesschallengesuccessfully');
            } else {
                $response['status'] = 0;
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
    public function fetchFitnessChallengeById(Request $request)
    {
    	$user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $editId = $body['id'];
        if($user)
        {
        	$getFitnessData = $this->FitnessChallengeRepository->fetchFitnessChallengeById($editId);
            
            if($getFitnessData && count($getFitnessData) > 0)
            {
                $response['status'] = 1;
                $response['message'] = trans('appmessages.getfitnesschallengebyidsuccessfully');
                
                $response['id'] = $getFitnessData->id;
                $response['title'] = $getFitnessData->title;
                if(File::exists(public_path($this->fitnessimageThumbImageUploadPath . $getFitnessData->image)) &&File::exists(public_path($this->fitnessimageOriginalImageUploadPath . $getFitnessDayData->image)) &&  $getFitnessData->image != '')
                {
                   $response['image'] = $getFitnessData->image;
            	   $response['image_url'] = url($this->fitnessimageOriginalImageUploadPath.$getFitnessData->image);
                }
                $response['video_url'] = $getFitnessData->video_url;
                $response['description'] = $getFitnessData->description;
                $response['price'] = $getFitnessData->price;
                $response['status'] = $getFitnessData->status;
            }
            else
            {
                $response['status'] = 0;
                $response['message'] = trans('appmessages.default_error_msg');
            }
			return response()->json($response); 
		}

    }
    public function updateFitnessChallenge(Request $request)
    {
    	$user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if($user)
        {
        	$updatedId = $body['id'];
        	$fileName = (isset($body['old_image']) && $body['old_image']!='')?$body['old_image']:'';
        	if (Input::file()) 
        	{
                $file = Input::file('image');
                if (!empty($file)) 
                {
                    // $fileName = 'fitnessImage_' . time() . '.' . $file->getClientOriginalExtension();
                    $fileName = 'fitnessImage_' . time() . '.png';
                    $pathOriginal = public_path($this->fitnessimageOriginalImageUploadPath . $fileName);
                    $pathThumb = public_path($this->fitnessimageThumbImageUploadPath . $fileName);
                    Image::make($file->getRealPath())->save($pathOriginal);
                    Image::make($file->getRealPath())->resize($this->fitnessimageThumbImageWidth, $this->fitnessimageThumbImageHeight)->save($pathThumb);
                   	if(isset($body['old_image']) && $body['old_image'] !='')
                    {
                        if(File::exists(public_path($this->fitnessimageThumbImageUploadPath . $body['old_image'])) && $body['old_image'] != ''){
                            File::delete(public_path($this->fitnessimageThumbImageUploadPath . $body['old_image']));      
                        }
                        if(File::exists(public_path($this->fitnessimageOriginalImageUploadPath . $body['old_image'])) && $body['old_image'] != '')
                        {
                            File::delete(public_path($this->fitnessimageOriginalImageUploadPath . $body['old_image']));      
                        }           
                        
                    }
                }
                
            }
            unset($body['token']);
            unset($body['old_image']);
            $body['image'] = $fileName;
            $editFitnessChallengeData =$this->FitnessChallengeRepository->updateFitnessChallengeData($updatedId, $body);

            if($editFitnessChallengeData)
            {
                $response['fitnessId'] = $updatedId;
                $response['status'] = 1;
                $response['message'] = trans('appmessages.fitnesschallengeupdatedsuccessfully');
            }
            else
            {
                $response['status'] = 0;
                $response['message'] = trans('appmessages.default_error_msg');
            } 
        } 
        else
        {
        	$response['status'] = 0;
            $response['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($response); 
    }
    public function fetchAllFitnessChallengeDay(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        
        if($user)
        {
            $getAllFitnessChallengesDay =$this->FitnessChallengeRepository->getAllFitnessChallengesDay();
       
            if($getAllFitnessChallengesDay)
            {
                $response = $this->getFitnessChallengeDayResponse($getAllFitnessChallengesDay);     
            }
            else
            {
                $response['status'] = 0;
                $response['message'] = trans('appmessages.default_error_msg');
            }   
        }
        else
        {
            $response['status'] = 0;
            $response['message'] = trans('appmessages.default_error_msg');
        }
        
        
        return response()->json($response);
    }
    public function fetchAllActiveFitnessChallenge(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        
        if($user)
        {
            $getAllFitnessChallenges =$this->FitnessChallengeRepository->getAllActiveFitnessChallenges();
       
            if($getAllFitnessChallenges)
            {
                $response = $this->getFitnessChallengeResponse($getAllFitnessChallenges);     
            }
            else
            {
                $response['status'] = 0;
                $response['message'] = trans('appmessages.default_error_msg');
            }   
        }
        else
        {
            $response['status'] = 0;
            $response['message'] = trans('appmessages.default_error_msg');
        }
        
        
        return response()->json($response);
    }
    public function deleteFitnessChallengeDay(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $deleteId = $body['id'];
        if($user)
        {
            $return = $this->FitnessChallengeRepository->deleteFitnessChallengeDay($deleteId);         
            if ($return) 
            {
                $getAllFitnessChallengesDay = $this->FitnessChallengeRepository->getAllFitnessChallengesDay();
       
                if($getAllFitnessChallengesDay)
                {
                  $response = $this->getFitnessChallengeDayResponse($getAllFitnessChallengesDay);        
                }
                $response['status'] = 1;
                $response['message'] = trans('appmessages.deletefitnesschallengedaysuccessfully');
            } else {
                $response['status'] = 0;
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
    public function fetchFitnessChallengeDayById(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $editId = $body['id'];
        if($user)
        {
            $getFitnessDayData = $this->FitnessChallengeRepository->fetchFitnessChallengeDayById($editId);
            
            if($getFitnessDayData && count($getFitnessDayData) > 0)
            {
                $response['status'] = 1;
                $response['message'] = trans('appmessages.getfitnesschallengedaybyidsuccessfully');
                
                $response['id'] = $getFitnessDayData->id;
                $response['challenge_id'] = $getFitnessDayData->challenge_id;
                $response['title'] = $getFitnessDayData->title;
                $response['day_no'] = $getFitnessDayData->day_no;
                if(File::exists(public_path($this->fitnessDayimageThumbImageUploadPath . $getFitnessDayData->image)) && File::exists(public_path($this->fitnessDayimageOriginalImageUploadPath . $getFitnessDayData->image)) && $getFitnessDayData->image != '')
                {   
                    $response['image'] = $getFitnessDayData->image;
                    $response['image_url'] = url($this->fitnessDayimageOriginalImageUploadPath.$getFitnessDayData->image);
                }
                $response['video_url'] = $getFitnessDayData->video_url;
                $response['status'] = $getFitnessDayData->status;
            }
            else
            {
                $response['status'] = 0;
                $response['message'] = trans('appmessages.default_error_msg');
            }
            return response()->json($response); 
        }

    }
    public function updateFitnessChallengeDay(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if($user)
        {
            $updatedId = $body['id'];
            $fileName = (isset($body['old_image']) && $body['old_image']!='')?$body['old_image']:'';
            if (Input::file()) 
            {
                $file = Input::file('image');
                if (!empty($file)) 
                {
                    // $fileName = 'fitnessDayImage_' . time() . '.' . $file->getClientOriginalExtension();
                    $fileName = 'fitnessDayImage_' . time() . '.png';
                    $pathOriginal = public_path($this->fitnessDayimageOriginalImageUploadPath . $fileName);
                    $pathThumb = public_path($this->fitnessDayimageThumbImageUploadPath . $fileName);
                    Image::make($file->getRealPath())->save($pathOriginal);
                    Image::make($file->getRealPath())->resize($this->fitnessDayimageThumbImageWidth, $this->fitnessDayimageThumbImageHeight)->save($pathThumb);
                    if(isset($body['old_image']) && $body['old_image'] !='')
                    {
                        if(File::exists(public_path($this->fitnessDayimageThumbImageUploadPath . $body['old_image'])) && $body['old_image'] != ''){
                            File::delete(public_path($this->fitnessDayimageThumbImageUploadPath . $body['old_image']));      
                        }
                        if(File::exists(public_path($this->fitnessDayimageOriginalImageUploadPath . $body['old_image'])) && $body['old_image'] != '')
                        {
                            File::delete(public_path($this->fitnessDayimageOriginalImageUploadPath . $body['old_image']));      
                        }           
                        
                    }
                }
                
            }
            unset($body['token']);
            unset($body['old_image']);
            $body['image'] = $fileName;
            $editFitnessChallengeDayData =$this->FitnessChallengeRepository->updateFitnessChallengeDayData($updatedId, $body);

            if($editFitnessChallengeDayData)
            {
                $response['fitnessId'] = $updatedId;
                $response['status'] = 1;
                $response['message'] = trans('appmessages.fitnesschallengedayupdatedsuccessfully');
            }
            else
            {
                $response['status'] = 0;
                $response['message'] = trans('appmessages.default_error_msg');
            } 
        } 
        else
        {
            $response['status'] = 0;
            $response['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($response); 
    }
    public function updateFitnessChallengeLoop(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if($user)
        {
            $body['id'] = $body['editId'];
            unset($body['token']);
            unset($body['editId']);
            $editFitnessChallengeLoopData =$this->FitnessChallengeRepository->updateFitnessChallengeLoopData($body);

            if($editFitnessChallengeLoopData)
            {
                $response['loopId'] = $body['id'];
                $response['status'] = 1;
                $response['message'] = trans('appmessages.fitnesschallengeloopupdatedsuccessfully');
            }
            else
            {
                $response['status'] = 0;
                $response['message'] = trans('appmessages.default_error_msg');
            } 
        } 
        else
        {
            $response['status'] = 0;
            $response['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($response); 
    }
    public function fetchAllFitnessChallengeloops(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        
        if($user)
        {
            $getAllFitnessChallengeloops =$this->FitnessChallengeRepository->getAllFitnessChallengeloops();
       
            if($getAllFitnessChallengeloops)
            {
                $response = $this->getFitnessChallengeloopsResponse($getAllFitnessChallengeloops);     
            }
            else
            {
                $response['status'] = 0;
                $response['message'] = trans('appmessages.default_error_msg');
            }   
        }
        else
        {
            $response['status'] = 0;
            $response['message'] = trans('appmessages.default_error_msg');
        }
        
        
        return response()->json($response);
    }
    public function fetchAllActiveFitnessChallengeDay(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        
        if($user)
        {
            $getAllFitnessChallengeday =$this->FitnessChallengeRepository->getAllFitnessChallengeday();
            if($getAllFitnessChallengeday)
            {
                $response = $this->getFitnessChallengeDayResponse($getAllFitnessChallengeday);     
            }
            else
            {
                $response['status'] = 0;
                $response['message'] = trans('appmessages.default_error_msg');
            }   
        }
        else
        {
            $response['status'] = 0;
            $response['message'] = trans('appmessages.default_error_msg');
        }
        
        
        return response()->json($response);
    }
    public function deleteFitnessChallengeLoop(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $deleteId = $body['id'];
        if($user)
        {
            $return = $this->FitnessChallengeRepository->deleteFitnessChallengeLoop($deleteId);         
            if ($return) 
            {
                $getAllFitnessChallengeloops = $this->FitnessChallengeRepository->getAllFitnessChallengeloops();
       
                if($getAllFitnessChallengeloops)
                {
                  $response = $this->getFitnessChallengeloopsResponse($getAllFitnessChallengeloops);        
                }
                $response['status'] = 1;
                $response['message'] = trans('appmessages.deletefitnesschallengeloopsuccessfully');
            } else {
                $response['status'] = 0;
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
    public function addFitnessChallengeLoop(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if($user)
        {
            unset($body['token']);
            $addFitnessChallengeLoopData =$this->FitnessChallengeRepository->addFitnessChallengeLoop($body);

            if($addFitnessChallengeLoopData)
            {
                //$response['loopId'] = $addFitnessChallengeLoopData->loop_id;
                $response['status'] = 1;
                $response['message'] = trans('appmessages.fitnesschallengedayloopsavedsuccessfully');
            }
            else
            {
                $response['status'] = 0;
                $response['message'] = trans('appmessages.default_error_msg');
            } 
        } 
        else
        {
            $response['status'] = 0;
            $response['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($response); 
    }
    public function fetchFitnessChallengeLoopById(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $editId = $body['id'];
        if($user)
        {
            $getFitnessLoopData = $this->FitnessChallengeRepository->fetchFitnessChallengeLoopById($editId);
            
            if($getFitnessLoopData && count($getFitnessLoopData) > 0)
            {
                $response['status'] = 1;
                $response['message'] = trans('appmessages.getfitnesschallengeloopbyidsuccessfully');
                
                $response['id'] = $getFitnessLoopData->id;
                $response['day'] = $getFitnessLoopData->day;
                $response['loop_name'] = $getFitnessLoopData->loop_name;
                $response['loop_id'] = $getFitnessLoopData->loop_id;
                $response['video_url'] = $getFitnessLoopData->video_url;
                $response['status'] = $getFitnessLoopData->status;
            }
            else
            {
                $response['status'] = 0;
                $response['message'] = trans('appmessages.default_error_msg');
            }
            return response()->json($response); 
        }

    }
    public function getFitnessChallengeDayResponse($getAllFitnessChallengesDay)
    {
        $response['status'] = '1';
        $response['message'] = trans('appmessages.fitnesschallengedaydatagetsuccessfully');
        $response['data'] = array();
        $i = 0;
        foreach ($getAllFitnessChallengesDay as $key => $data)
        {                
           $response['data'][$i]['id'] = $data->id;
           $response['data'][$i]['challenge_id'] = $data->challenge_id;
           $response['data'][$i]['day_no'] = $data->day_no;
           $response['data'][$i]['title'] = $data->title;
           $response['data'][$i]['image'] = $data->image;
           $response['data'][$i]['video_url'] = $data->video_url; 
           $response['data'][$i]['status'] = $data->status;
           $i++;
        }
        return $response;
    }
    public function getFitnessChallengeloopsResponse($getAllFitnessChallengeloops)
    {
        $response['status'] = '1';
        $response['message'] = trans('appmessages.fitnesschallengedaydatagetsuccessfully');
        $response['data'] = array();
        $i = 0;
        foreach ($getAllFitnessChallengeloops as $key => $data)
        {                
           $response['data'][$i]['id'] = $data->id;
           $response['data'][$i]['day'] = $data->day;
           $response['data'][$i]['loop_name'] = $data->loop_name;
           $response['data'][$i]['loop_id'] = $data->loop_id;
           $response['data'][$i]['video_url'] = $data->video_url; 
           $response['data'][$i]['status'] = $data->status;
           $i++;
        }
        return $response;
    }
}

?>