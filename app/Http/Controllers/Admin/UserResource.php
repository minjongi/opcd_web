<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Applicant;
use App\Models\Visit;
use App\Models\Verification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class UserResource extends Controller
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
        
        $users = User::select('id', 'name', 'artist_name', 'email', 'birthday', 'phone', 'address', 'status');

        if(!empty($query['page'])){
            $current_page = $query['page'];
        }

        if(!empty($query['perPage'])){
            $per_page = $query['perPage'];
        }

        if(!empty($query['search'])){
            $users->where('name', 'LIKE', "%".$query['search']."%")
                     ->orWhere('artist_name', 'LIKE', "%".$query['search']."%")
                     ->orWhere('birthday', 'LIKE', "%".$query['search']."%")
                     ->orWhere('phone', 'LIKE', "%".$query['search']."%")
                     ->orWhere('address', 'LIKE', "%".$query['search']."%")
                     ->orWhere('email', 'LIKE', "%".$query['search']."%");
        }

        if(!empty($query['sort']) && !empty($query['sortDir'])){
            $users->orderBy($query['sort'], $query['sortDir']);
        }else{
            $users->orderBy('created_at', 'desc');
        }

        $total = $users->count();
        $users = $users->offset(($current_page - 1 ) * $per_page)
                            ->limit($per_page)
                            ->get();

        

        return response()->json([
            'status' => 'success',
            'users' => $users,
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
        $member = User::findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $member
        ], 200);
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
            // 'name' => 'required|string|min:3',
            // 'birthday' => 'required|numeric',
            'email' => "required|string|email|max:255|unique:users,email,$id",
            'phone' => "required|min:6|numeric|unique:users,phone,$id",
            'address' => 'required|string'
        ]);

        try{

            $data = $request->only([
                'phone',
                'email',
                'address',
                'address_detail',
                'artist_name',
                'position',
                'social_1',
                'social_2',
                'social_3',
                'social_4',
                'market_message',
                'market_mail'
            ]);

            if($request->has('file')){
                $data['avatar'] = asset('storage/'.$request->file->store('avatar', ['disk' => 'public']));
            }

            if($request->has('password')){
                $data['password'] = bcrypt($request->password);
            }

            User::where('id', $id)->update($data);

            $user = User::find($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Profile updated successfully',
                'user' => [
                    'email' => $user->email,
                    'artist_name' => $user->artist_name,
                    'phone' => $user->phone,
                ]
            ]);

        }catch(Exception $err) {
            
            return response()->json([
                'status' => 'fail',
                'message' => trans('message.register_failed')
            ], 400);

        }
    }

    public function update_status(Request $request, $id)
    {
        $this->validate($request, [
            'status' => 'required|string'
        ]);

        $User = User::findOrFail($id);

        try {
            $User->status = $request->status;
            $User->save();

            return response()->json([
                'status' => 'success',
                'message' => 'User updated successfully'
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
            
            User::where('id', $id)->delete();
            Applicant::where('user_id', $id)->delete();
            Visit::where('user_id', $id)->delete();
            Verification::where('user_id', $id)->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'User deleted successfully'
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
