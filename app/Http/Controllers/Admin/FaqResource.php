<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class FaqResource extends Controller
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
        
        $faqs = Faq::select('id', 'question', 'answer', 'status', 'author', 'created_at');

        if(!empty($query['page'])){
            $current_page = $query['page'];
        }

        if(!empty($query['perPage'])){
            $per_page = $query['perPage'];
        }

        if(!empty($query['search'])){
            $faqs->where('question', 'LIKE', "%".$query['search']."%");
        }

        if(!empty($query['sort']) && !empty($query['sortDir'])){
            $faqs->orderBy($query['sort'], $query['sortDir']);
        }else{
            $faqs->orderBy('created_at', 'desc');
        }

        $total = $faqs->count();
        $faqs = $faqs->offset(($current_page - 1 ) * $per_page)
                    ->limit($per_page)
                    ->get();


        return response()->json([
            'status' => 'success',
            'faqs' => $faqs,
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
            'question' => 'required|string',
        ]);
        
        try {
            $data = $request->only(['question', 'answer']);
            $data['author'] = Auth::user()->name;
            $data['status'] = 'DISABLE';
            
            $Faq = Faq::create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Faq created successfully'
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
        // 
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
            'question' => 'required|string'
        ]);

        try {
            $data = $request->only(['question', 'answer']);
            
            $Faq = Faq::where('id', $id)->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Faq updated successfully'
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

        $Faq = Faq::findOrFail($id);

        try {
            $Faq->status = $request->status;
            $Faq->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Faq updated successfully'
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
            
            Faq::where('id', $id)->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Faq deleted successfully'
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
