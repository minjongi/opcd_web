<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Policy;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class PolicyController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->query();

        if(!empty($query['type'])){
            $policies = Policy::where('type', $query['type'])
                                ->select('id', 'content', 'type')->first();
        }else{
            $policies = Policy::select('id', 'content', 'type')->get();
        }

        return response()->json([
            'status' => 'success',
            'policies' => $policies
        ]);
    }

    public function update(Request $request)
    {
        $this->validate($request, [
            'type' => 'required|string',
        ]);

        try {
            $data = $request->only(['content', 'type']);

            $policy = Policy::where('type', $request->type)->first();

            if(empty($policy)){
                Policy::create($data);
            }else{
                $policy->update($data);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'policy updated successfully'
            ]);

        } catch(Exception $err) {

            return response()->json([
                'message' => 'server error'
            ], 500);
        }
    }
}
