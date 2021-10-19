<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\PuzzleBanner;
use App\Models\WmmLayer;
use App\Models\WmmContent;

class WMMController extends Controller
{
    public function puzzle(Request $request)
    {
        
        $puzzles = PuzzleBanner::select('id', 'layer_id', 'type', 'base_image', 'live_image', 'soon_image', 'display')->get();

        $layer_ids = PuzzleBanner::select('layer_id')->pluck('layer_id');
        $layers = WmmLayer::whereIn('id', $layer_ids)->where('status', 'ACTIVE')->with('content')->get();

        return response()->json([
            'status' => 'success',
            'puzzles' => $puzzles,
            'layers' => $layers
        ], 200);
    }

    public function history_content(Request $request)
    {
        $samplepacks = WmmContent::where('type', 'PACK')->where('status', 'ACTIVE')->orderBy('created_at', 'DESC')->get();
        $contests = WmmContent::where('type', 'CONTEST')->where('status', 'ACTIVE')->orderBy('created_at', 'DESC')->get();
        $contents = WmmContent::where('type', 'CONTENT')->where('status', 'ACTIVE')->orderBy('created_at', 'DESC')->get();

        return response()->json([
            'status' => 'success',
            'sample_packs' => $samplepacks,
            'contests' => $contests,
            'contents' => $contents
        ], 200);
    }
       
}
