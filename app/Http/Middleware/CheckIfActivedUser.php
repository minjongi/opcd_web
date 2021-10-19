<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class CheckIfActivedUser
{
	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @param  string|null  $guard
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
	    if(Auth::user()->status !== 'ACTIVED'){
			return response()->json([
				'status' => 'fail',
				'message' => trans('message.not_approved')
			], 400);
		}

		return $next($request);
	}
}