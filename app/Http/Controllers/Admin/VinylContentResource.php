<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\VinylContent;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class VinylContentResource extends Controller
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
        
        $contents = VinylContent::with('category')->select('id', 'category_id', 'description', 'image', 'status', 'author', 'created_at');

        if(!empty($query['page'])){
            $current_page = $query['page'];
        }

        if(!empty($query['perPage'])){
            $per_page = $query['perPage'];
        }

        if(!empty($query['category'])){
            $contents = $contents->where('category_id', $query['category']);
        }

        if(!empty($query['search'])){
            $search = $query['search'];
            $contents->where(function($q) use ($search) {
                $q->where('description', 'LIKE', "%".$search."%")
                ->orWhere('author', 'LIKE', "%".$search."%")
                ->orWhere('created_at', 'LIKE', "%".$search."%");
            });
        }

        if(!empty($query['sort']) && !empty($query['sortDir'])){
            $contents->orderBy($query['sort'], $query['sortDir']);
        }else{
            $contents->orderBy('created_at', 'desc');
        }

        $total = $contents->count();
        $contents = $contents->offset(($current_page - 1 ) * $per_page)
                            ->limit($per_page)
                            ->get();


        return response()->json([
            'status' => 'success',
            'contents' => $contents,
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
            'category_id' => 'required',
            'description' => 'required',
            'file' => 'required|mimes:jpeg,png,bmp,gif,svg',
        ]);
        
        try {
            $data = $request->only(['category_id', 'description', 'content']);
            $data['author'] = Auth::user()->name;
            $data['status'] = 'DISABLE';
            
            if($request->has('file')){
                $data['image'] = asset('storage/'.$request->file->store('contents', ['disk' => 'public']));
            }

            $VinylContent = VinylContent::create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'VinylContent created successfully'
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
        $VinylContent = VinylContent::findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $VinylContent
        ], 200);
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
            'category_id' => 'required',
            'image' => 'required_without:file|string',
            'file' => 'required_without:image|mimes:jpeg,png,bmp,gif,svg',
        ]);

        try {
            $data = $request->only(['category_id', 'description', 'content']);
            
            if($request->has('file')){
                $data['image'] = asset('storage/'.$request->file->store('contents', ['disk' => 'public']));
            }

            $VinylContent = VinylContent::where('id', $id)->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'VinylContent updated successfully'
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

        $VinylContent = VinylContent::findOrFail($id);

        try {
            if($request->status == 'ACTIVE'){
                VinylContent::where('category_id', $VinylContent->category_id)
                            ->where('status', 'ACTIVE')
                            ->update(['status' => 'DISABLE']);
            }

            $VinylContent->status = $request->status;
            $VinylContent->save();

            return response()->json([
                'status' => 'success',
                'message' => 'VinylContent updated successfully'
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
            
            VinylContent::where('id', $id)->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'VinylContent deleted successfully'
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
