<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class FaqController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $per_page = 10;
        $query = $request->query();

        $faqs = Faq::where('status', 'ACTIVE')->select('id', 'question', 'answer', 'author', 'created_at');

        if(!empty($query['perPage'])){
            $per_page = $query['perPage'];
        }

        if(!empty($query['search'])){
            $faqs->where('question', 'LIKE', "%".$query['search']."%");
        }

        $faqs = $faqs->orderBy('created_at', 'desc')
                    ->limit($per_page)
                    ->get();

        return response()->json([
            'status' => 'success',
            'faqs' => $faqs
        ], 200);
    }
}
