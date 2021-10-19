<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Rda;
use App\Models\RdaBanner;
use App\Models\RdaLogo;
use App\Models\RdaMusic;
use App\Models\RdaCategory;
use App\Models\Setting;
use App\Models\RdaContent;
use App\Models\RdaFaq;
use App\Models\RdaCampaign;
use App\Models\RdaCampaignApplicant;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Helpers\EmailHelper;
use Illuminate\Support\Str;

class RdaController extends Controller
{
    public function options(Request $request)
    {
        $categories = RdaCategory::where('status', 'ACTIVE')->select('key as value', 'name as label')->get();
        $banners = RdaBanner::where('status', 'ACTIVE')->select('image', 'link', 'link_target')->orderBy('created_at', 'DESC')->get();
        $logos = RdaLogo::where('status', 'ACTIVE')->select('url')->get();
        $musics = RdaMusic::where('status', 'ACTIVE')->select('name')->get();
        $settings = Setting::whereIn('type', ['rda_setting', 'rda_logo'])->get();
        $contents = RdaContent::all();
        $faqs = RdaFaq::where('status', 'ACTIVE')->get();

        return response()->json([
            'status' => 'success',
            'banners' => $banners,
            'logos' => $logos,
            'musics' => $musics,
            'categories' => $categories,
            'contents' => $contents,
            'faqs' => $faqs,
            'settings' => $settings
        ], 200);
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'artist_name' => 'required|string',
            'song_name' => 'required|string',
            'email' => 'required|string',
            'phone' => 'required|string',
            'genre' => 'required|string'
        ]);

        $data = $request->only(['artist_name', 'song_name', 'email', 'phone', 'genre']);
        $rda = Rda::create($data);
        
        $rda->code = date('ym').$rda->genre.strtoupper(Str::random(5));
        if($request->has('file')){
            $rda->file_name = $request->file('file')->getClientOriginalName();
            $_filename = $rda->code.".".$request->file('file')->getClientOriginalExtension();
            $rda->url = asset('storage/'.$request->file->storeAs('propose', $_filename, ['disk' => 'public']));
        }

        $rda->save();

        (new EmailHelper())->sendRdaEmail($rda);

        return response()->json([
            'status' => 'success',
            'data' => $rda
        ]);
    }

    public function campaigns(Request $request)
    {
        $campaigns = RdaCampaign::where('status', 'ACTIVE')->select('id', 'title', 'url', 'description')->orderBy('created_at', 'desc')->get();
        return response()->json([
            'status' => 'success',
            'campaigns' => $campaigns
        ]);
    }

    public function campaign_request(Request $request)
    {
        $this->validate($request, [
            'id' => 'required',
            'code' => 'required|string',
        ]);
        $data = $request->only(['id', 'code']);
        $matched = Rda::where('code', $data['code'])->first();

        if(empty($matched)){
            return response()->json([
                'status' => 'fail',
                'message' => 'not found'
            ], 404);
        }else{
            $request = RdaCampaignApplicant::where('campaign_id', $data['id'])->where('applicant_id', $matched->id)->first();
            if(empty($request)){
                RdaCampaignApplicant::create([
                    'campaign_id' => $data['id'],
                    'applicant_id' => $matched->id
                ]);
            }
            return response()->json([
                'status' => 'success',
                'message' => 'requested successfully'
            ]);
        }
    }
}
