<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    public function profile(Request $request)
    {
        $user_id = Auth::user()->id;
        $user = User::where('id', $user_id)->first();

        if(!empty($user)){
            if(!empty($user->google_id)) $user->google_id = true;
            if(!empty($user->naver_id)) $user->naver_id = true;
            if(!empty($user->kakao_id)) $user->kakao_id = true;
        }

        return response()->json([
            'status' => 'success',
            'user' => $user
        ]);
    }

    public function artist_profile(Request $request, $id)
    {
        $profile = User::where('status', 'ACTIVED')
                    ->where('artist_id', $id)
                    ->select('artist_id', 'artist_name', 'avatar', 'position', 'social_1', 'social_2', 'social_3', 'social_4')
                    ->first();

        return response()->json([
            'status' => 'success',
            'profile' => $profile
        ]);
    }

    public function update_profile(Request $request)
    {
        $user_id = Auth::user()->id;

        $this->validate($request, [
            // 'name' => 'required|string|min:3',
            // 'birthday' => 'required|numeric',
            'email' => "required|string|email|max:255|unique:users,email,$user_id",
            'phone' => "required|min:6|numeric|unique:users,phone,$user_id",
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

            User::where('id', $user_id)->update($data);

            $user = User::find($user_id);

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
}
