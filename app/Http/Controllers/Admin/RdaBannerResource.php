<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\RdaBanner;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class RdaBannerResource extends Controller
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
        
        $banners = RdaBanner::select('id', 'title', 'link', 'link_target', 'image', 'status', 'author', 'created_at');

        if(!empty($query['page'])){
            $current_page = $query['page'];
        }

        if(!empty($query['perPage'])){
            $per_page = $query['perPage'];
        }

        if(!empty($query['search'])){
            $search = $query['search'];
            $banners->where(function($q) use ($search) {
                $q->where('link', 'LIKE', "%".$search."%")
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
            'file' => 'required|mimes:jpeg,png,bmp,gif,svg,mp4',
        ]);
        
        try {
            $data = $request->only(['title', 'link', 'link_target']);
            $data['author'] = Auth::user()->name;
            $data['status'] = 'DISABLE';
            
            if($request->has('file')){
                $data['image'] = asset('storage/'.$request->file->store('banners', ['disk' => 'public']));
            }

            $RdaBanner = RdaBanner::create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'RdaBanner created successfully'
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
            'image' => 'required_without:file|string',
            'file' => 'required_without:image|mimes:jpeg,png,bmp,gif,svg,mp4',
        ]);

        try {
            $data = $request->only(['title', 'link', 'link_target']);
            
            if($request->has('file')){
                $data['image'] = asset('storage/'.$request->file->store('banners', ['disk' => 'public']));
            }

            $RdaBanner = RdaBanner::where('id', $id)->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'RdaBanner updated successfully'
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

        $RdaBanner = RdaBanner::findOrFail($id);

        try {
            // if($request->status == 'ACTIVE'){
            //     RdaBanner::where('status', 'ACTIVE')->where('type', $RdaBanner->type)->update(['status' => 'DISABLE']);
            // }

            $RdaBanner->status = $request->status;
            $RdaBanner->save();

            return response()->json([
                'status' => 'success',
                'message' => 'RdaBanner updated successfully'
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
            
            RdaBanner::where('id', $id)->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'RdaBanner deleted successfully'
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
