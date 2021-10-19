<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Campaign;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class CampaignResource extends Controller
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
        
        $campaigns = Campaign::select('id', 'name', 'type', 'description', 'status', 'created_at');

        if(!empty($query['page'])){
            $current_page = $query['page'];
        }

        if(!empty($query['perPage'])){
            $per_page = $query['perPage'];
        }

        if(!empty($query['type'])){
            $campaigns->where('type', $query['type']);
        }

        if(!empty($query['search'])){
            $search = $query['search'];
            $campaigns->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%".$search."%")
                ->orWhere('created_at', 'LIKE', "%".$search."%");
            });
        }

        if(!empty($query['sort']) && !empty($query['sortDir'])){
            $campaigns->orderBy($query['sort'], $query['sortDir']);
        }else{
            $campaigns->orderBy('created_at', 'desc');
        }

        $total = $campaigns->count();
        $campaigns = $campaigns->offset(($current_page - 1 ) * $per_page)
                            ->limit($per_page)
                            ->get();

        return response()->json([
            'status' => 'success',
            'campaigns' => $campaigns,
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
            'name' => 'required|string',
            'type' => 'required|string',
        ]);
        
        try {
            $data = $request->only(['name', 'type', 'description']);
            $Campaign = Campaign::create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Campaign created successfully'
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
        $campaign = Campaign::findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $campaign
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
            'name' => 'required|string'
        ]);
        
        try {
            $data = $request->only(['name', 'description']);
            Campaign::where('id', $id)->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Campaign created successfully'
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

        $Campaign = Campaign::findOrFail($id);

        try {
            $count = Campaign::where('type', $Campaign->type)
                    ->where('status', 'ACTIVE')
                    ->count();
            
            if($request->status === 'ACTIVE' && $count >= 3){
                return response()->json([
                    'status' => 'fail',
                    'message' => 'campaign available count is 3'
                ], 400);
            }

            $Campaign->status = $request->status;
            $Campaign->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Campaign updated successfully'
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
            
            Campaign::where('id', $id)->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Campaign deleted successfully'
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
        $query = $request->query();
        $names = Campaign::select('id', 'name');

        if(!empty($query['type'])){
            $names->where('type', $query['type']);
        }

        $names = $names->get();

        return response()->json([
            'status' => 'success',
            'names' => $names
        ]);
    }
}
