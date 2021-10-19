<?php

namespace App\Http\Controllers\Api\Auth;

use App\Models\User;
use App\Models\Verification;
use App\Models\Visit;
use App\Models\Temp;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Helpers\EmailHelper;

class AuthController extends Controller
{
    /// Register
    public function check(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|unique:users|min:6|numeric',
            'password' => 'required|string',
            'birthday' => 'required|numeric',
            'address' => 'required|string'
        ]);

        try {
            return response()->json([
                'status' => 'success'
            ], 200);

        } catch(Exception $err) {
            
            return response()->json([
                'status' => 'fail',
                'message' => trans('message.register_failed')
            ], 400);

        }
    }

    public function register(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|unique:users|min:6|numeric',
            'password' => 'required|string',
            'birthday' => 'required|numeric',
            'address' => 'required|string'
        ]);

        try {
            $data = $request->all();
            $data['role'] = "USER";
            $data['password'] = bcrypt($request->password);

            $user = User::create($data);
            
            $rand = bin2hex(random_bytes(20));
            $rand = substr($rand, 0, 3).$user->id."f".substr($rand, 4);
            $user->artist_id = substr($rand, 0, 10);

            $user->save();

            $token = $user->createToken($user->id.'user')->accessToken;

            return response()->json([
                'status' => 'success',
                'message' => trans('message.register_success'),
                'user' => [
                    'id' => $user->id,
                    'artist_id' => $user->artist_id,
                    'name' => $user->name,
                    'artist_name' => $user->artist_name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role
                ],
                'access_token' => $token
            ], 200);

        } catch(Exception $err) {
            
            return response()->json([
                'status' => 'fail',
                'message' => trans('message.register_failed')
            ], 400);

        }
    }

    // Login
    public function login(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|string',
            'password' => 'required|string'
        ]);

        try{

            $user = User::where('email', $request->email)->where('role', 'USER')->first();

            if(empty($user) || $user->status !== 'ACTIVED'){
                return response()->json([
                    'status' => 'fail',
                    'message' => 'User not found',
                    'type' => 'email'
                ], 400);
            }

            if(!Hash::check($request->password, $user->password)){

                $temp_user = Temp::where('email', $user->email)->first();
                if(empty($temp_user) || !Hash::check($request->password, $temp_user->password)){
                    return response()->json([
                        'status' => 'fail',
                        'message' => 'Password is wrong',
                        'type' => 'password'
                    ], 400);
                }
            }

            Temp::where('email', $user->email)->delete();
            $token = $user->createToken($user->id.'user')->accessToken;

            return response()->json([
                'status' => 'success',
                'message' => 'logged in successfully',
                'user' => [
                    'id' => $user->id,
                    'artist_id' => $user->artist_id,
                    'name' => $user->name,
                    'artist_name' => $user->artist_name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role
                ],
                'access_token' => $token
            ]);

        }catch(Exception $err){
            return response()->json([
                'status' => 'fail',
                'message' => trans('message.login_failed'),
            ], 500);
        }
    }

    public function forgot_email(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string',
            'birthday' => 'required|string'
        ]);

        try{
            $user = User::where('name', $request->name)
                        ->where('birthday', $request->birthday)
                        ->where('status', 'ACTIVED')
                        ->first();
            
            if(empty($user)){
                return response()->json([
                    'status' => 'fail',
                    'message' => 'Use not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'email' => $user->email
            ]);

        }catch(Exception $err){
            return response()->json([
                'status' => 'fail',
                'message' => trans('message.login_failed'),
            ], 500);
        }
    }

    public function forgot_password(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|email',
        ]);

        try{
            $user = User::where('email', $request->email)
                        ->where('role', 'USER')
                        ->where('status', 'ACTIVED')
                        ->first();

            if(empty($user)){
                return response()->json([
                    'status' => 'fail',
                    'message' => 'User not found'
                ], 404);
            }

            // TODO:  send email with password
            $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            $password = substr(str_shuffle($chars),0,6);

            Temp::where('email', $user->email)->delete();
            Temp::create([
                'email' => $user->email,
                'password' => bcrypt($password)
            ]);
            
            $sentEmail = (new EmailHelper())->sendEmail($user->email, $user->name, $password);

            if(empty($sentEmail)){
                return response()->json([
                    'status' => 'success',
                    'message' => "email can't send"
                ], 400);
            }else{
                return response()->json([
                    'status' => 'success',
                    'message' => 'password sent to your email successfully'
                ]);
            }

        }catch(Exception $err){
            return response()->json([
                'status' => 'fail',
                'message' => trans('message.login_failed'),
            ], 500);
        }
    }

    public function delete(Request $request)
    {
        $user_id = Auth::user()->id;

        User::where('id', $user_id)->delete();
        Verification::where('user_id', $user_id)->delete();
        Visit::where('user_id', $user_id)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'account deleted successfully'
        ]);
    }
}
