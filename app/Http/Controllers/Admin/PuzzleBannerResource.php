<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\PuzzleBanner;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PuzzleBannerResource extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $banners = PuzzleBanner::all();

        return response()->json([
            'status' => 'success',
            'banners' => $banners,
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // 
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // 
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'type' => 'required|string'
        ]);

        try {
            $data = $request->only(['layer_id', 'type']);
            
            if($request->has('base_file')){
                $data['base_image'] = asset('storage/'.$request->base_file->store('banners', ['disk' => 'public']));
            }

            if($request->has('live_file')){
                $data['live_image'] = asset('storage/'.$request->live_file->store('banners', ['disk' => 'public']));
            }

            if($request->has('soon_file')){
                $data['soon_image'] = asset('storage/'.$request->soon_file->store('banners', ['disk' => 'public']));
            }

            $banner = PuzzleBanner::where('id', $id)->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Puzzle banner updated successfully'
            ], 200);

        } catch(Exception $err) {

            return response()->json([
                'message' => 'server error'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            
            PuzzleBanner::where('id', $id)->update([
                'layer_id' => NULL,
                'base_image' => NULL,
                'live_image' => NULL,
                'soon_image' => NULL,
                'author' => NULL
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Puzzle banner deleted successfully'
            ], 200);

        } catch(Exception $err) {

            return response()->json([
                'message' => 'server error'
            ], 500);
        }
    }


    /**
     * Custom route.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function custom(Request $request)
    {   

    }
   
}
