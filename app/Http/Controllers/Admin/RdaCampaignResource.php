<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\RdaCampaign;
use App\Models\RdaCampaignApplicant;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class RdaCampaignResource extends Controller
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
        
        $campaigns = RdaCampaign::select('id', 'title', 'url', 'description', 'author', 'status', 'created_at');

        if(!empty($query['page'])){
            $current_page = $query['page'];
        }

        if(!empty($query['perPage'])){
            $per_page = $query['perPage'];
        }

        if(!empty($query['search'])){
            $campaigns->where('title', 'LIKE', "%".$query['search']."%")
                     ->orWhere('author', 'LIKE', "%".$query['search']."%")
                     ->orWhere('created_at', 'LIKE', "%".$query['search']."%");
        }

        if(!empty($query['sort']) && !empty($query['sortDir'])){
            $campaigns->orderBy($query['sort'], $query['sortDir']);
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
            'title' => 'required|string',
            'url' => 'required|string'
        ]);
        
        try {
            $data = $request->only(['title', 'url', 'description']);
            $data['author'] = Auth::user()->name;

            $RdaCampaign = RdaCampaign::create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'RdaCampaign created successfully'
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
        $campaign = RdaCampaign::findOrFail($id);

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
            'title' => 'required|string',
            'url' => 'required|string'
        ]);
        
        try {
            $data = $request->only(['title', 'url', 'description']);
            RdaCampaign::where('id', $id)->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'RdaCampaign created successfully'
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

        $RdaCampaign = RdaCampaign::findOrFail($id);

        try {
            $RdaCampaign->status = $request->status;
            $RdaCampaign->save();

            return response()->json([
                'status' => 'success',
                'message' => 'RdaCampaign updated successfully'
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
            
            RdaCampaign::where('id', $id)->delete();
            RdaCampaignApplicant::where('campaign_id', $id)->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'RdaCampaign deleted successfully'
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
        $names = RdaCampaign::select('id', 'name')->get();

        return response()->json([
            'status' => 'success',
            'names' => $names
        ]);
    }
}
