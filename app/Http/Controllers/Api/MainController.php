<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Feature;
use App\Models\Event;
use App\Models\Video;
use App\Models\User;
use App\Models\WmmContent;
use App\Models\Campaign;
use App\Models\VinylContent;

class MainController extends Controller
{
    public function home(Request $request)
    {
        $mdBanner = Banner::where('type', 'MEDIUM')->where('status', 'ACTIVE')->orderBy('created_at', 'DESC')->first();
        $btBanner = Banner::where('type', 'BOTTOM')->where('status', 'ACTIVE')->orderBy('created_at', 'DESC')->first();

        $events = Event::where('status', 'ACTIVE')->limit(3)->orderBy('created_at', 'DESC')->get();
        $features = Feature::where('status', 'ACTIVE')->with('tag')->limit(9)->orderBy('created_at', 'DESC')->get();
        $videos = Video::where('status', 'ACTIVE')->limit(6)->orderBy('created_at', 'DESC')->get();

        return response()->json([
            'status' => 'success',
            'medium_banner' => $mdBanner,
            'bottom_banner' => $btBanner,
            'events' => $events,
            'features' => $features,
            'videos' => $videos
        ], 200);
    }

    public function main_banners(Request $request)
    {
        $banners = Banner::where('type', 'MAIN')
                        ->where('status', 'ACTIVE')
                        ->limit(5)
                        ->orderBy('updated_at', 'DESC')
                        ->get();

        return response()->json([
            'status' => 'success',
            'main_banners' => $banners,
        ], 200);
    }
    
    public function search(Request $request)
    {
        $query = $request->query();

        if(empty($query['text'])){
            return response()->json([
                'status' => 'success',
                'message' => 'No Found'
            ]);
        }

        $search = $query['text'];
        $events = Event::where('status', 'ACTIVE')
                        ->where(function($q) use ($search) {
                            $q->where('title', 'LIKE', "%".$search."%")
                            ->orWhere('desc', 'LIKE', "%".$search."%");
                        })
                        ->select('id', 'title', 'desc', 'image', 'link')
                        ->orderBy('created_at', 'DESC')
                        ->get();
        
        $features = Feature::with('tag')
                        ->leftJoin('tags', 'features.id', '=', 'tags.related_id')
                        ->where('features.status', 'ACTIVE')
                        ->where(function($q) use ($search) {
                            $q->where('features.title', 'LIKE', "%".$search."%")
                            ->orWhere('features.content', 'LIKE', "%".$search."%")
                            ->orWhere('tags.tag', 'LIKE', "%".$search."%");
                        })
                        ->select('features.id', 'features.title', 'features.image', 'features.type', 'features.author', 'features.created_at')
                        ->groupBy('features.id')
                        ->orderBy('features.created_at', 'DESC')
                        ->get();

        $videos = Video::where('status', 'ACTIVE')
                        ->where(function($q) use ($search) {
                            $q->where('title', 'LIKE', "%".$search."%")
                            ->orWhere('desc', 'LIKE', "%".$search."%");
                        })
                        ->select('id', 'title', 'desc', 'image', 'link')
                        ->orderBy('created_at', 'DESC')
                        ->get();

        $artists = User::where('status', 'ACTIVED')
                        ->where(function($q) use ($search) {
                            $q->where('artist_name', 'LIKE', "%".$search."%")
                            ->orWhere('position', 'LIKE', "%".$search."%");
                        })
                        ->select('id', 'artist_name', 'avatar', 'position')
                        ->orderBy('created_at', 'DESC')
                        ->get();

        $history = WmmContent::where('status', 'ACTIVE')
                            ->where(function($q) use ($search) {
                                $q->where('title', 'LIKE', "%".$search."%")
                                ->orWhere('desc', 'LIKE', "%".$search."%");
                            })
                            ->select('id', 'title', 'desc')
                            ->orderBy('created_at', 'DESC')
                            ->get();

        $songcamps = Campaign::where('type', 'WMM')
                            ->where('status', 'ACTIVE')
                            ->where('description', 'LIKE', "%".$search."%")
                            ->select('id', 'description')
                            ->orderBy('created_at', 'DESC')
                            ->get();
        
        $bb_programs = Campaign::where('description', 'LIKE', "%".$search."%")
                            ->where('type', 'BEATBOX')
                            ->where('status', 'ACTIVE')
                            ->select('id', 'description')
                            ->orderBy('created_at', 'DESC')
                            ->get();
        $vi_programs = Campaign::where('description', 'LIKE', "%".$search."%")
                            ->where('type', 'VINYL')
                            ->where('status', 'ACTIVE')
                            ->select('id', 'description')
                            ->orderBy('created_at', 'DESC')
                            ->get();

        $libraries = VinylContent::where('description', 'LIKE', "%".$search."%")
                            ->where('status', 'ACTIVE')
                            ->select('id', 'description', 'image')
                            ->orderBy('created_at', 'DESC')
                            ->get();

        return response()->json([
            'status' => 'success',
            'events' => $events,
            'features' => $features,
            'videos' => $videos,
            'artists' => $artists,
            'history' => $history,
            'songcamps' => $songcamps,
            'bb_programs' => $bb_programs,
            'vi_programs' => $vi_programs,
            'libraries' => $libraries
        ]);
    }
}
