<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\VinylContent;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class VinylController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function library(Request $request)
    {
        $current_page = 1;
        $per_page = 15;
        $query = $request->query();

        $contents = VinylContent::select('id', 'category_id', 'description', 'image', 'content', 'status');
        $actived = VinylContent::where('status', 'ACTIVE');

        if(!empty($query['page'])){
            $current_page = $query['page'];
        }

        if(!empty($query['perPage'])){
            $per_page = $query['perPage'];
        }

        if(!empty($query['category'])){
            $contents = $contents->where('category_id', $query['category']);
            $actived = $actived->where('category_id', $query['category']);
        }

        if(!empty($query['search'])){
            $search = $query['search'];
            $contents->where(function($q) use ($search) {
                $q->where('description', 'LIKE', "%".$search."%")
                ->orWhere('author', 'LIKE', "%".$search."%")
                ->orWhere('created_at', 'LIKE', "%".$search."%");
            });
        }

        $actived = $actived->first();
        // if(!empty($actived)) $contents = $contents->whereNotIn('id', [$actived->id]);

        $total = $contents->count();
        $contents = $contents->orderBy('created_at', 'desc')
                            ->offset(($current_page - 1 ) * $per_page)
                            ->limit($per_page)
                            ->get();


        return response()->json([
            'status' => 'success',
            'contents' => $contents,
            'total' => $total,
            'actived' => $actived
        ], 200);
    }

    public function library_detail($id)
    {
        $VinylContent = VinylContent::findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $VinylContent
        ], 200);
    }

    public function category_name(Request $request)
    {   
        $names = Category::where('status', 'ACTIVE')->select('id', 'name')->get();

        return response()->json([
            'status' => 'success',
            'names' => $names
        ]);
    }
}
