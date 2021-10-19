<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class BannerResource extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $current_page = 1;
        $per_page = 15;
        $query = $request->query();
        
        $banners = Banner::select('id', 'title', 'description', 'link', 'link_target', 'image', 'type', 'status', 'author', 'created_at');

        if(!empty($query['page'])){
            $current_page = $query['page'];
        }

        if(!empty($query['perPage'])){
            $per_page = $query['perPage'];
        }

        if(!empty($query['type'])){
            $banners->where('type', $query['type']);
        }

        if(!empty($query['search'])){
            $search = $query['search'];
            $banners->where(function($q) use ($search) {
                $q->where('title', 'LIKE', "%".$search."%")
                ->orWhere('description', 'LIKE', "%".$search."%")
                ->orWhere('author', 'LIKE', "%".$search."%")
                ->orWhere('created_at', 'LIKE', "%".$search."%");
            });
                    
        }

        if(!empty($query['sort']) && !empty($query['sortDir'])){
            $banners->orderBy($query['sort'], $query['sortDir']);
        }else{
            $banners->orderBy('created_at', 'desc');
        }

        $total = $banners->count();
        $banners = $banners->offset(($current_page - 1 ) * $per_page)
                            ->limit($per_page)
                            ->get();

        

        return response()->json([
            'status' => 'success',
            'banners' => $banners,
            'total' => $total
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
        $this->validate($request, [
            'title' => 'required|string',
            'file' => 'required|mimes:jpeg,png,bmp,gif,svg',
        ]);
        
        try {
            $data = $request->only(['title', 'description', 'link', 'link_target', 'type']);
            $data['author'] = Auth::user()->name;
            $data['status'] = 'DISABLE';
            
            if($request->has('file')){
                $data['image'] = asset('storage/'.$request->file->store('banners', ['disk' => 'public']));
            }

            $Banner = Banner::create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Banner created successfully'
            ], 200);

        } catch(Exception $err) {

            return response()->json([
                'message' => 'server error'
            ], 500);
        }
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
            'title' => 'required|string',
            'image' => 'required_without:file|string',
            'file' => 'required_without:image|mimes:jpeg,png,bmp,gif,svg',
        ]);

        try {
            $data = $request->only(['title', 'description', 'link', 'link_target']);
            
            if($request->has('file')){
                $data['image'] = asset('storage/'.$request->file->store('banners', ['disk' => 'public']));
            }

            $Banner = Banner::where('id', $id)->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Banner updated successfully'
            ], 200);

        } catch(Exception $err) {

            return response()->json([
                'message' => 'server error'
            ], 500);
        }
    }

    public function update_status(Request $request, $id)
    {
        $this->validate($request, [
            'status' => 'required|string'
        ]);

        $Banner = Banner::findOrFail($id);

        try {
            // if($request->status == 'ACTIVE'){
            //     Banner::where('status', 'ACTIVE')->where('type', $Banner->type)->update(['status' => 'DISABLE']);
            // }

            $Banner->status = $request->status;
            $Banner->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Banner updated successfully'
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
            
            Banner::where('id', $id)->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Banner deleted successfully'
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
