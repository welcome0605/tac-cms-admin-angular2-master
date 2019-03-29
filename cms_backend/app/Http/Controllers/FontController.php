<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use JWTAuthException;
use App\FontFamilyModel;

class FontController extends Controller {

    protected $user = null;
	function __construct()
	{
		$this->user = JWTAuth::parseToken()->authenticate();
	}

    public function get_font_family_info(Request $request){
        if(FontFamilyModel::get()){
            $response['status'] = 1;
            $data = FontFamilyModel::get();
        }
        else{
            $response['status'] = 0;
        }
        $response['data'] = $data;

        return response()->json($response);
    }
}
