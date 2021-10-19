<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Notice;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class NoticeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $current_page = 1;
        $per_page = 10;
        $query = $request->query();

        $notices = Notice::where('status', 'ACTIVE')->select('id', 'title', 'content', 'type', 'author', 'created_at');

        if(!empty($query['page'])){
            $current_page = $query['page'];
        }

        if(!empty($query['perPage'])){
            $per_page = $query['perPage'];
        }

        $total = $notices->count();
        $notices = $notices->orderBy('created_at', 'desc')
                            ->offset(($current_page - 1 ) * $per_page)
                            ->limit($per_page)
                            ->get();

        return response()->json([
            'status' => 'success',
            'notices' => $notices
        ], 200);
    }

    public function show($id)
    {
        $notice = Notice::where('id', $id)
                        ->where('status', 'ACTIVE')
                        ->first();
        
        return response()->json([
            'status' => 'success',
            'notice' => $notice
        ], 200);
    }

    public function recent(Request $request)
    {
        $notices = Notice::where('status', 'ACTIVE')
                        ->select('id', 'title', 'type', 'created_at')
                        ->orderBy('created_at', 'DESC')
                        ->limit(4)
                        ->get();
                        
        return response()->json([
            'notices' => $notices
        ]);
    }
}
