<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Models\Admin;
use App\Notifications\ResetPassword;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Login
    public function login(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|email|exists:admins',
            'password' => 'required|string|min:6'
        ]);

        try{

            $admin = Admin::where('email', $request->email)->first();
            if(!Hash::check($request->password, $admin->password)){
                return response()->json([
                    'errors' => [
                        'password' => 'invalid password'
                    ],
                    'message' => 'Password not correct'
                ], 400);
            }

            $token = $admin->createToken($admin->id. 'admin')->accessToken;

            return response()->json([
                'status' => 'success',
                'user' => $admin,
                'token' => $token
            ]);
        }catch(Exception $err){
            return response()->json([
                'message' => 'server error'
            ], 500);
        }
    }

    public function check_token(Request $request)
    {
        $admin = Auth::user();
        $token = $admin->createToken($admin->id. 'admin')->accessToken;

        return response()->json([
            'status' => 'success',
            'user' => $admin,
            'token' => $token
        ]);
    }

    /// Register
    public function register(Request $request)
    {
        // MEMBER, MAIN, MAGAZINE, WMM, BEATBOX, VINYL
        $this->validate($request, [
            'name' => 'required|min:3',
            'email' => 'required|email|unique:admins,email',
            'password' => 'required|min:6',
            'role' => 'required|string'
        ]);

        try{
            $admin = Admin::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'role' => $request->role
            ]);

            return response()->json([
                'message' => 'admin created successfully'
            ], 200);
        }catch(Exception $err){
            return response()->json([
                'message' => 'admin register failed'
            ], 400);
        }
    }

    //resetPassword
    public function resetPassword(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|exists:admins,email',
            'password' => 'required|min:6',
            'new_password' => 'required|min:6'
        ]);

        try {
            $admin = Admin::where('email', $request->email)->first();
            if(!Hash::check($request->password, $admin->password)){
                return response()->json([
                    'message' => 'User name or Password not correct'
                ], 400);
            }

            $admin->password = bcrypt($request->new_password);
            $admin->save();
            $admin->notify(new ResetPassword($request->password));
            
            return resposne()->json([
                'message' => 'password reset successfully'
            ], 200);
        } catch (Exception $err) {
            return response()->json([
                'message' => 'server error'
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->token()->revoke();

            return response()->json([
                'message' => 'logout successfully'
            ], 200);

        } catch(Exception $err) {

            return response()->json([
                'message' => 'sever error'
            ], 500);
        }
    }
}
