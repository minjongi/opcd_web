<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class SettingsController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->query();

        if(!empty($query['type'])){
            $settings = Setting::whereIn('type', explode(",", $query['type']))->get();
        }else{
            $settings = Setting::select('id', 'content', 'type')->get();
        }

        return response()->json([
            'status' => 'success',
            'settings' => $settings
        ]);
    }

    public function updateRda(Request $request)
    {
        try {
            $data = $request->only(['rda_setting', 'rda_logo']);
            
            if($request->has('file')){
                $data['rda_logo'] = asset('storage/'.$request->file->store('rda', ['disk' => 'public']));
            }

            $settings = Setting::where('type', 'rda_setting')->first();
            if(empty($settings)){
                Setting::create(['type' => 'rda_setting', 'content' => $data['rda_setting']]);
            }else{
                $settings->update(['content' => $data['rda_setting']]);
            }

            $logo = Setting::where('type', 'rda_logo')->first();
            if(empty($logo)){
                Setting::create(['type' => 'rda_logo', 'content' => $data['rda_logo']]);
            }else{
                $logo->update(['content' => $data['rda_logo']]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'settings updated successfully'
            ]);

        } catch(Exception $err) {

            return response()->json([
                'message' => 'server error'
            ], 500);
        }
    }
}
