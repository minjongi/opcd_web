<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Feature;
use App\Models\Tag;
use App\Models\Visit;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use \DB;

class FeatureResource extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $current_page = 1;
        $per_page = 20;
        $query = $request->query();

        $features = Feature::where('status', 'ACTIVE');

        if(!empty($query['page'])){
            $current_page = $query['page'];
        }

        if(!empty($query['perPage'])){
            $per_page = $query['perPage'];
        }

        if(!empty($query['type'])){
            $features = $features->where('type', $query['type']);
        }

        $total = $features->count();
        $features = $features->with('tag')
                            ->orderBy('created_at', 'desc')
                            ->offset(($current_page - 1 ) * $per_page)
                            ->limit($per_page)
                            ->get();

        return response()->json([
            'status' => 'success',
            'features' => $features,
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
        $feature = Feature::where('id', $id)->with('tag')->first();

        $dateOffset = \Carbon\Carbon::today()->subDays(90);
        Visit::where('created_at', '<', $dateOffset)->delete();
        Visit::insert([
            'related_id' => $feature->id,
            'user_id' => 1, // TODO update in the future
            // 'type' => $feature->type
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $feature
        ], 200);
    }

    public function related(Request $request, $id)
    {
        $current_page = 1;
        $per_page = 9;
        $query = $request->all();

        if(!empty($query['page'])){
            $current_page = $query['page'];
        }

        if(!empty($query['perPage'])){
            $per_page = $query['perPage'];
        }

        $feature = Feature::where('id', $id)->first();
        $tags = Tag::where('related_id', $id)->pluck('tag')->toArray();
        $tagstr = "('".implode("','", $tags)."')";
        $offset = ($current_page - 1 ) * $per_page;

        $sql = "SELECT x.*, IF(x.author = '$feature->author' , 1 , 0) AS a_mark, y.tag_mark AS t_mark, z.visit_mark AS v_mark FROM features as x 
                LEFT OUTER JOIN (SELECT COUNT(related_id) AS tag_mark, related_id FROM tags WHERE tag IN $tagstr GROUP BY related_id ) AS y ON x.id = y.related_id 
                LEFT OUTER JOIN (SELECT COUNT(related_id) AS visit_mark, related_id FROM visits GROUP BY related_id) AS z ON x.id = z.related_id
                WHERE id <> $id ORDER BY a_mark DESC, t_mark DESC, v_mark DESC LIMIT $per_page OFFSET $offset";
        $related_features = collect(DB::select($sql));

        $related_result = $related_features->map(function($r) {
            $r->tag = Tag::where('related_id', $r->id)->get();
            return $r;
        });

        return response()->json([
            'status' => 'success',
            'related' => $related_result,
            'offset' => $offset
        ]);
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
        // 
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        
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
