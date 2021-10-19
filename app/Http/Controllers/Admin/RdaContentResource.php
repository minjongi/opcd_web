<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\RdaContent;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class RdaContentResource extends Controller
{
    public function index(Request $request)
    {
        $contents = RdaContent::all();

        return response()->json([
            'status' => 'success',
            'contents' => $contents
        ], 200);
    }

    public function store(Request $request)
    {
        try {
            $data = $request->all();
        
            $main_data = $data['main'];
            $uncut_gems_data = $data['uncut_gems'];
            $content_list_data = $data['content_list'];

            if($request->has('main_file')){
                $main_data['image'] = asset('storage/'.$request->main_file->store('rda', ['disk' => 'public']));
            }
            
            if($request->has('uncut_file')){
                $uncut_gems_data['image'] = asset('storage/'.$request->uncut_file->store('rda', ['disk' => 'public']));
            }

            $main = RdaContent::where('type', 'main')->first();
            if(empty($main)){
                $main_data['type'] = 'main';
                RdaContent::create($main_data);
            }else{
                $main->update($main_data);
            }
            
            $uncut_gems = RdaContent::where('type', 'uncut_gems')->first();
            if(empty($uncut_gems)){
                $uncut_gems_data['type'] = 'uncut_gems';
                RdaContent::create($uncut_gems_data);
            }else{
                $uncut_gems->update($uncut_gems_data);
            }

            $content_list = RdaContent::where('type', 'content_list')->first();
            if(empty($content_list)){
                $content_list_data['type'] = 'content_list';
                RdaContent::create($content_list_data);
            }else{
                $content_list->update($content_list_data);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Rda created successfully'
            ], 200);

        } catch(Exception $err) {

            return response()->json([
                'message' => 'server error'
            ], 500);
        }
    }
   
}
