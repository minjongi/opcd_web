<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class EventResource extends Controller
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
        
        $events = Event::query();

        if(!empty($query['page'])){
            $current_page = $query['page'];
        }

        if(!empty($query['perPage'])){
            $per_page = $query['perPage'];
        }

        if(!empty($query['search'])){
            $events->where('title', 'LIKE', "%".$query['search']."%")
                     ->orWhere('author', 'LIKE', "%".$query['search']."%")
                     ->orWhere('created_at', 'LIKE', "%".$query['search']."%");
        }

        if(!empty($query['sort']) && !empty($query['sortDir'])){
            $events->orderBy($query['sort'], $query['sortDir']);
        }else{
            $events->orderBy('created_at', 'desc');
        }

        $total = $events->count();
        $events = $events->offset(($current_page - 1 ) * $per_page)
                            ->limit($per_page)
                            ->get();


        return response()->json([
            'status' => 'success',
            'events' => $events,
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
            'title' => 'required|string',
            'link' => 'required|string',
            'file' => 'required|mimes:jpeg,png,bmp,gif,svg',
        ]);
        
        try {
            $data = $request->only(['title', 'desc', 'link', 'link_target', 'category', 'start_date', 'end_date']);
            $data['author'] = Auth::user()->name;
            $data['status'] = 'DISABLE';
            
            if($request->has('file')){
                $data['image'] = asset('storage/'.$request->file->store('events', ['disk' => 'public']));
            }

            $Event = Event::create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Event created successfully'
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
            'title' => 'required|string',
            'link' => 'required|string',
            'image' => 'required_without:file|string',
            'file' => 'required_without:image|mimes:jpeg,png,bmp,gif,svg',
        ]);

        try {
            $data = $request->only(['title', 'link', 'link_target', 'desc', 'category', 'start_date', 'end_date']);
            
            if($request->has('file')){
                $data['image'] = asset('storage/'.$request->file->store('events', ['disk' => 'public']));
            }

            $Event = Event::where('id', $id)->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Event updated successfully'
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

        $Event = Event::findOrFail($id);

        try {
            $Event->status = $request->status;
            $Event->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Event updated successfully'
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
            
            Event::where('id', $id)->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Event deleted successfully'
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
