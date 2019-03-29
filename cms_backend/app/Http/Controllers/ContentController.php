<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\ContentThemes;

class ContentController extends Controller
{
    public function fetchAllContentThemes(Request $request)
    {
        $response['data'] = ContentThemes::all();

        return response()->json($response);
    }
}
