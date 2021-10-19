<?php

namespace App\Http\Controllers\Api\Auth;


use App\Models\User;
use App\Models\Verification;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Laravel\Socialite\Facades\Socialite;

class SocialController extends Controller
{
    public function redirectToProvider(Request $request, $provider)
    {
        $query = $request->query();

        if(!empty($query['id'])){
            $id = $query['id'];
            $code = $this->generate_code($id);
            Verification::where('user_id', $id)->delete();
            Verification::create([
                'user_id' => $id,
                'code' => $code,
                'type' => 'PROFILE'
            ]);
            session(['redirect_code' => $code]);    
        }else{
            session(['redirect_code' => null]);
        }
        
        return Socialite::driver($provider)->redirect();
    }

    public function handleProviderCallback($provider)
    {
        $user = Socialite::driver($provider)->user();

        try {
            $social_id = $user->getId();

            if(!empty(session('redirect_code'))){
                $redirect_user = Verification::where('code', session('redirect_code'))
                                            ->where('type', 'PROFILE')
                                            ->first();
                if(!empty($redirect_user)){
                    if($provider === 'google'){
                        $data = ['google_id' => $social_id];
                    }elseif($provider === 'naver'){
                        $data = ['naver_id' => $social_id];
                    }elseif($provider === 'kakao'){
                        $data = ['kakao_id' => $social_id];
                    };

                    User::where('id', $redirect_user->user_id)->update($data);
                    Verification::where('user_id', $redirect_user->user_id)->delete();

                    return redirect("/my_page");
                }
            }

            $data = [
                'name' => $user->getName(),
                'email' => $user->getEmail(),
                'avatar' => $user->getAvatar()
            ];

            if($provider === 'google'){
                $logged_user = User::where('google_id', $social_id)->first();
                $data['google_id'] = $social_id;
            }elseif($provider === 'naver'){
                $logged_user = User::where('naver_id', $social_id)->first();
                $data['naver_id'] = $social_id;
            }elseif($provider === 'kakao'){
                $logged_user = User::where('kakao_id', $social_id)->first();
                $data['kakao_id'] = $social_id;
            };

            if(empty($logged_user)){
                $logged_user = User::create($data);

                $rand = bin2hex(random_bytes(20));
                $rand = substr($rand, 0, 3).$logged_user->id."f".substr($rand, 4);
                $logged_user->artist_id = substr($rand, 0, 10);

                $logged_user->save();
            }

            Verification::where('user_id', $logged_user->id)->delete();

            $code = $this->generate_code($logged_user->id);

            Verification::create([
                'user_id' => $logged_user->id,
                'code' => $code,
                'type' => 'LOGIN'
            ]);

            return redirect("/login_success/$code");

        } catch(Exception $err) {
            return redirect("/login");
        }
    }

    /// Register
    public function verify(Request $request)
    {
        $this->validate($request, [
            'code' => 'required|string',
        ]);

        try {
            $verify = Verification::where('code', $request->code)->first();

            if(empty($verify)){
                return response()->json([
                    'status' => 'fail',
                    'message' => 'not verified'
                ]);
            }

            $user = User::where('id', $verify->user_id)->first();
            
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
            ], 500);
        }
    }

    public function generate_code($id)
    {
        $rand = bin2hex(random_bytes(30));
        $rand = substr($rand, 0, 4).'-'.substr($rand, 5, 4).'-'.$id."f".substr($rand, 9);
        $code = substr($rand, 0, 22);

        return $code;
    }
}
