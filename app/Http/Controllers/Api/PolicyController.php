<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Policy;

class PolicyController extends Controller
{
    public function index(Request $request)
    {
        $policies = Policy::select('id', 'content', 'type')->get();

        return response()->json([
            'status' => 'success',
            'policies' => $policies
        ]);
    }
}
