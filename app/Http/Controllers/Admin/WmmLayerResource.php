<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\WmmLayer;
use App\Models\LayerContent;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class WmmLayerResource extends Controller
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
        
        $layers = WmmLayer::select('id', 'related_id', 'title', 'status', 'author', 'created_at');

        if(!empty($query['page'])){
            $current_page = $query['page'];
        }

        if(!empty($query['perPage'])){
            $per_page = $query['perPage'];
        }

        if(!empty($query['search'])){
            $layers->where('title', 'LIKE', "%".$query['search']."%");
        }

        if(!empty($query['sort']) && !empty($query['sortDir'])){
            $layers->orderBy($query['sort'], $query['sortDir']);
        }else{
            $layers->orderBy('created_at', 'desc');
        }

        $total = $layers->count();
        $layers = $layers->offset(($current_page - 1 ) * $per_page)
                            ->limit($per_page)
                            ->get();

        return response()->json([
            'status' => 'success',
            'layers' => $layers,
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
            'desc' => 'required|string',
        ]);
        
        try {
            $data = $request->only(['title', 'desc']);
            $data['author'] = Auth::user()->name;
            
            $WmmLayer = WmmLayer::create($data);

            if($request->has('contents') && !empty($request->contents) && count($request->contents) > 0 ){
                $layercontents = array();
                foreach($request->contents as $content){
                    $content['layer_id'] = $WmmLayer->id;
                    // if(!empty($content['date'])) $content['date'] = date('Y-m-d H:i:s', strtotime($content['date']));
                    $layercontents[] = $content;
                }
                LayerContent::insert($layercontents);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Layer created successfully',
                'cotents' => $request->contents
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
        $layer = WmmLayer::where('id', $id)->with('content')->first();

        return response()->json([
            'status' => 'success',
            'layer' => $layer
        ]);
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
            'desc' => 'required|string'
        ]);

        try {
            $data = $request->only(['title', 'desc']);
                        
            $WmmLayer = WmmLayer::where('id', $id)->update($data);

            LayerContent::where('layer_id', $id)->delete();
            if($request->has('contents') && !empty($request->contents) && count($request->contents) > 0 ){
                $layercontents = array();
                foreach($request->contents as $content){
                    $content_data = [
                        'layer_id' => $id,
                        'title' => $content['title'],
                        'content_num' => $content['content_num'],
                        'content' => $content['content'],
                        'order' => $content['order'],
                        'date' => $content['date']
                    ];
                    
                    $layercontents[] = $content_data;
                }
                LayerContent::insert($layercontents);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Layer updated successfully'
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

        $WmmLayer = WmmLayer::findOrFail($id);

        try {
            $WmmLayer->status = $request->status;
            $WmmLayer->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Layer updated successfully'
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
            
            WmmLayer::where('id', $id)->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'WmmLayer deleted successfully'
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
    public function name_list(Request $request)
    {   
        $names = WmmLayer::where('status', 'ACTIVE')->select('id', 'title')->get();

        return response()->json([
            'status' => 'success',
            'layers' => $names
        ]);
    }
   
}
