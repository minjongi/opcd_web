<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\ApplicantForm;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class ApplicantFormResource extends Controller
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
        
        $forms = ApplicantForm::leftJoin('campaigns', 'campaigns.id', '=', 'applicant_forms.campaign_id')
                                ->select(
                                    'applicant_forms.id',
                                    'applicant_forms.form_name',
                                    'applicant_forms.campaign_id',
                                    'applicant_forms.type',
                                    'applicant_forms.status',
                                    'applicant_forms.author',
                                    'applicant_forms.created_at',
                                    'campaigns.name as campaign_name'
                                );

        if(!empty($query['page'])){
            $current_page = $query['page'];
        }

        if(!empty($query['perPage'])){
            $per_page = $query['perPage'];
        }

        if(!empty($query['type'])){
            $forms->where('applicant_forms.type', $query['type']);
        }

        if(!empty($query['search'])){
            $search = $query['search'];
            $forms->where(function($q) use ($search){
                $q->where('applicant_forms.form_name', 'LIKE', "%".$search."%")
                    ->orWhere('campaigns.name', 'LIKE', "%".$search."%")
                    ->orWhere('applicant_forms.created_at', 'LIKE', "%".$search."%");
            });
        }

        if(!empty($query['sort']) && !empty($query['sortDir'])){
            $forms->orderBy($query['sort'], $query['sortDir']);
        }else{
            $forms->orderBy('applicant_forms.created_at', 'desc');
        }

        $total = $forms->count();
        $forms = $forms->offset(($current_page - 1 ) * $per_page)
                            ->limit($per_page)
                            ->get();

        return response()->json([
            'status' => 'success',
            'forms' => $forms,
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
            'form_name' => 'required|string',
            'campaign_id' => 'required|exists:campaigns,id',
            'type' => 'required|string',
        ]);
        
        try {
            $data = $request->only(['form_name', 'campaign_id', 'type', 'applicant_form']);
            $data['author'] = Auth::user()->name;

            $ApplicantForm = ApplicantForm::create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'ApplicantForm created successfully'
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
        $form = ApplicantForm::where('id', $id)->with('campaign')->first();

        return response()->json([
            'status' => 'success',
            'data' => $form
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
            'form_name' => 'required|string',
            'campaign_id' => 'required|exists:campaigns,id',
            'type' => 'required|string',
        ]);
        
        try {
            $data = $request->only(['form_name', 'campaign_id', 'type', 'applicant_form']);
            ApplicantForm::where('id', $id)->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'ApplicantForm created successfully'
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

        $ApplicantForm = ApplicantForm::findOrFail($id);

        try {
            if($request->status == 'ACTIVE'){
                ApplicantForm::where('status', 'ACTIVE')
                            ->where('campaign_id', $ApplicantForm->campaign_id)
                            ->where('type', $ApplicantForm->type)
                            ->update(['status' => 'DISABLE']);
            }

            $ApplicantForm->status = $request->status;
            $ApplicantForm->save();

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
            
            ApplicantForm::where('id', $id)->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'ApplicantForm deleted successfully'
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
