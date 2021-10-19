<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Applicant;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class ApplicantResource extends Controller
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
        
        $applicants = Applicant::leftJoin('users', 'users.id', '=', 'applicants.user_id')
                                ->leftJoin('campaigns', 'campaigns.id', '=', 'applicants.campaign_id')
                                ->select(
                                    'applicants.id',
                                    'applicants.user_id',
                                    'applicants.campaign_id',
                                    'applicants.applicant_id',
                                    'applicants.security',
                                    'applicants.status',
                                    'applicants.type',
                                    'applicants.created_at',
                                    'users.name as user_name',
                                    'campaigns.name as campaign_name'
                                );

        if(!empty($query['page'])){
            $current_page = $query['page'];
        }

        if(!empty($query['perPage'])){
            $per_page = $query['perPage'];
        }

        if(!empty($query['type'])){
            $applicants->where('applicants.type', $query['type']);
        }

        if(!empty($query['search'])){
            $search = $query['search'];
            $applicants->where(function($q) use ($search) {
                $q->where('applicants.applicant_id', 'LIKE', "%".$search."%")
                ->orWhere('users.name', 'LIKE', "%".$search."%") 
                ->orWhere('campaigns.name', 'LIKE', "%".$search."%");
            });
        }

        if(!empty($query['sort']) && !empty($query['sortDir'])){
            $applicants->orderBy($query['sort'], $query['sortDir']);
        }else{
            $applicants->orderBy('applicants.created_at', 'desc');
        }

        $total = $applicants->count();
        $applicants = $applicants->offset(($current_page - 1 ) * $per_page)
                            ->limit($per_page)
                            ->get();

        return response()->json([
            'status' => 'success',
            'applicants' => $applicants,
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
        $applicant = Applicant::where('id', $id)->with('user', 'campaign')->first();

        return response()->json([
            'status' => 'success',
            'data' => $applicant
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
            'applicant_content' => 'required|string',
            'security' => 'required|string'
        ]);
        
        try {
            $data = $request->only(['applicant_content', 'security']);
            Applicant::where('id', $id)->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Applicant created successfully'
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

        $Applicant = Applicant::findOrFail($id);

        try {
            $Applicant->status = $request->status;
            $Applicant->save();

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
            
            Applicant::where('id', $id)->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Applicant deleted successfully'
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
