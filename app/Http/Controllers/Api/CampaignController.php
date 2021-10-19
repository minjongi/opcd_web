<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Applicant;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CampaignController extends Controller
{
    public function index(Request $request)
    {
        $type = 'WMM';
        $query = $request->query();
        if(!empty($query['type'])){
            $type = $query['type'];
        }

        $campaigns = Campaign::where('status', 'ACTIVE')
                            ->where('type', $type)
                            ->with('form')
                            ->select('id', 'name', 'description')
                            ->limit(3)
                            ->orderBy('created_at', 'DESC')
                            ->get();

        return response()->json([
            'status' => 'success',
            'campaigns' => $campaigns,
            'type' => $type
        ], 200);
    }

    

    public function upload_file(Request $request)
    {
        if($request->has('file')){
            $file_path = asset('storage/'.$request->file->store('propose', ['disk' => 'public']));
        }

        if(empty($file_path)){
            return response()->json([
                'status' => 'fail',
                'message' => 'file not exist'
            ], 400);
        }

        return response()->json([
            'status' => 'success',
            'path' => $file_path
        ], 200);
    }

    public function create_propose(Request $request)
    {
        $user_id = Auth::user()->id;

        $this->validate($request, [
            'campaign_id' => 'required',
            'type' => 'required|string',
            'security' => 'required:string',
            'applicant_content' => 'required|string'
        ]);

        try{
            $data = $request->all();
            $data['user_id'] = $user_id;

            $rand = bin2hex(random_bytes(20));
            $rand = substr($rand, 0, 3).$data['user_id']."a".substr($rand, 4);
            $rand = substr($rand, 0, 10);
            $data['applicant_id'] = $rand;

            $applicant = Applicant::create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'propose sent successfully'
            ]);

        } catch(Exception $err) {

            return response()->json([
                'message' => 'server error'
            ], 500);
        }
        
    }

    public function applicants(Request $request)
    {
        $current_page = 1;
        $per_page = 15;
        $query = $request->query();

        if(empty($query['campaign_id']) || empty($query['type'])){
            return response()->json([
                'status' => 'success',
                'message' => 'Applicant not found'
            ], 400);
        }

        $applicants = Applicant::where('status', 'ACTIVE')
                                ->where('type', $query['type'])
                                ->where('campaign_id', $query['campaign_id'])
                                ->with('campaign:id,name')
                                ->with('user:id,name')
                                ->select('id', 'user_id', 'campaign_id', 'applicant_id', 'type', 'security', 'status');

        if(!empty($query['page'])){
            $current_page = $query['page'];
        }

        if(!empty($query['perPage'])){
            $per_page = $query['perPage'];
        }

        if(!empty($query['sort']) && !empty($query['sortDir'])){
            $applicants->orderBy('status')->orderBy($query['sort'], $query['sortDir']);
        }else{
            $applicants->orderBy('status')->orderBy('created_at', 'desc');
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

    public function applicant(Request $request, $id)
    {
        $user_id = Auth::user()->id;
        $applicant = Applicant::where('id', $id)
                                ->where('status', 'ACTIVE')
                                ->where('user_id', $user_id)
                                ->first();
        
        return response()->json([
            'status' => 'success',
            'applicant' => $applicant
        ]);
    }

    public function my_applicants(Request $request)
    {
        $user_id = Auth::user()->id;
        $wmm = Applicant::where('user_id', $user_id)
                        ->where('status', 'ACTIVE')
                        ->with('campaign:id,name')
                        ->where('type', 'WMM')
                        ->select('id', 'user_id', 'campaign_id', 'applicant_id', 'type', 'security', 'status')
                        ->get();
        $beatbox = Applicant::where('user_id', $user_id)
                        ->where('status', 'ACTIVE')
                        ->with('campaign:id,name')
                        ->where('type', 'BEATBOX')
                        ->select('id', 'user_id', 'campaign_id', 'applicant_id', 'type', 'security', 'status')
                        ->get();
        $vinyl = Applicant::where('user_id', $user_id)
                        ->where('status', 'ACTIVE')
                        ->with('campaign:id,name')
                        ->where('type', 'VINYL')
                        ->select('id', 'user_id', 'campaign_id', 'applicant_id', 'type', 'security', 'status')
                        ->get();

        return response()->json([
            'status' => 'success',
            'wmm_applicants' => $wmm,
            'beatbox_applicants' => $beatbox,
            'vinyl_applicants' => $vinyl,
        ]);
    }
}
