<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
Route::get('/phpinfo', function () {
    return phpinfo();
});
Route::get('login/{provider}', 'Api\Auth\SocialController@redirectToProvider');
Route::get('login/{provider}/callback', 'Api\Auth\SocialController@handleProviderCallback');

Route::view('/{path?}/{type?}/{id?}', 'welcome');