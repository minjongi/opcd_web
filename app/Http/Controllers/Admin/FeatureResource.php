<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Feature;
use App\Models\Tag;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class FeatureResource extends Controller
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
        
        $features = Feature::select('id', 'title', 'description', 'type', 'status', 'author', 'created_at');

        if(!empty($query['page'])){
            $current_page = $query['page'];
        }

        if(!empty($query['perPage'])){
            $per_page = $query['perPage'];
        }

        if(!empty($query['type'])){
            $features = $features->where('type', $query['type']);
        }

        if(!empty($query['search'])){
            $search = $query['search'];
            $features->where(function($q) use ($search) {
                $q->where('title', 'LIKE', "%".$search."%")
                ->orWhere('description', 'LIKE', "%".$search."%")
                ->orWhere('author', 'LIKE', "%".$search."%")
                ->orWhere('created_at', 'LIKE', "%".$search."%");
            });
        }

        if(!empty($query['sort']) && !empty($query['sortDir'])){
            $features->orderBy($query['sort'], $query['sortDir']);
        }else{
            $features->orderBy('created_at', 'desc');
        }

        $total = $features->count();
        $features = $features->offset(($current_page - 1 ) * $per_page)
                            ->limit($per_page)
                            ->get();

        

        return response()->json([
            'status' => 'success',
            'features' => $features,
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
            'image' => 'required_without:file|string',
            'file' => 'required_without:image|mimes:jpeg,png,bmp,gif,svg',
        ]);
        
        try {
            $data = $request->only(['title', 'type', 'image', 'description', 'content']);
            $data['author'] = Auth::user()->name;
            
            if($request->has('file')){
                $data['image'] = asset('storage/'.$request->file->store('features', ['disk' => 'public']));
            }

            $Feature = Feature::create($data);

            if($request->has('tag') && !empty($request->tag)){
                $tag_array = explode(',', $request->tag);
                if(count($tag_array) > 0){
                    foreach($tag_array as &$tag){
                        $tag = [
                            'related_id' => $Feature->id,
                            'type' => 'MAGAZINE',
                            'tag' => $tag
                        ];
                    }
                    Tag::insert($tag_array);
                }
            }
            
            return response()->json([
                'status' => 'success',
                'message' => 'Feature created successfully'
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
        $feature = Feature::with('tag')->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $feature
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
            'title' => 'required|string',
            'image' => 'required_without:file|string',
            'file' => 'required_without:image|mimes:jpeg,png,bmp,gif,svg',
        ]);
        
        try {
            $data = $request->only(['title', 'type', 'image', 'description', 'content']);
            $data['author'] = Auth::user()->name;
            
            if($request->has('file')){
                $data['image'] = asset('storage/'.$request->file->store('features', ['disk' => 'public']));
            }

            Feature::where('id', $id)->update($data);

            Tag::where('related_id', $id)->where('type', 'MAGAZINE')->delete();
            if($request->has('tag') && !empty($request->tag)){
                $tag_array = explode(',', $request->tag);
                if(count($tag_array) > 0){
                    foreach($tag_array as &$tag){
                        $tag = [
                            'related_id' => $id,
                            'type' => 'MAGAZINE',
                            'tag' => $tag
                        ];
                    }
                    Tag::insert($tag_array);
                }
            }
            
            return response()->json([
                'status' => 'success',
                'message' => 'Feature created successfully'
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
            
            Feature::where('id', $id)->delete();
            Tag::where('related_id', $id)->where('type', 'MAGAZINE')->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Feature deleted successfully'
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

        $Feature = Feature::findOrFail($id);

        try {
            $Feature->status = $request->status;
            $Feature->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Notice updated successfully'
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
