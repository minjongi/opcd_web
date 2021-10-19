<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

//Auth
Route::post('login', 'Api\Auth\AuthController@login');
Route::post('register', 'Api\Auth\AuthController@register');
Route::post('check_register', 'Api\Auth\AuthController@check');

Route::post('verify_user', 'Api\Auth\SocialController@verify');


Route::post('forgot_email', 'Api\Auth\AuthController@forgot_email');
Route::post('forgot_password', 'Api\Auth\AuthController@forgot_password');

Route::get('artist_profile/{id}', 'Api\ProfileController@artist_profile');

Route::get('main_banners', 'Api\MainController@main_banners');
Route::get('home', 'Api\MainController@home');

Route::post('related_features/{id}', 'Api\FeatureResource@related');
Route::resource('features', 'Api\FeatureResource')->only(['index', 'show']);

Route::get('wmm_puzzles', 'Api\WMMController@puzzle');
Route::get('wmm_contents', 'Api\WMMController@history_content');

Route::get('campaigns', 'Api\CampaignController@index');
Route::get('applicants', 'Api\CampaignController@applicants');

Route::get('policies', 'Api\PolicyController@index');

Route::get('faqs', 'Api\FaqController@index');

Route::get('notices', 'Api\NoticeController@index');
Route::get('notice/{id}', 'Api\NoticeController@show');
Route::get('recent_notices', 'Api\NoticeController@recent');

Route::get('search', 'Api\MainController@search');

Route::get('category_names', 'Api\VinylController@category_name');
Route::get('vinylcontents', 'Api\VinylController@library');
Route::get('vinylcontent/{id}', 'Api\VinylController@library_detail');

Route::get('rda_options', 'Api\RdaController@options');
Route::post('rda', 'Api\RdaController@create');
Route::get('rda_campaigns', 'Api\RdaController@campaigns');
Route::post('rda_campaign_request', 'Api\RdaController@campaign_request');

Route::group(['middleware' => ['auth:api']], function() {
    // Auth
    Route::get('check_token', 'Api\Auth\AuthController@check_token');
    Route::delete('delete_account', 'Api\Auth\AuthController@delete');

    Route::post('profile', 'Api\ProfileController@update_profile');
    Route::get('profile', 'Api\ProfileController@profile');

    Route::post('propose_file', 'Api\CampaignController@upload_file');
    Route::post('propose', 'Api\CampaignController@create_propose');
    Route::get('applicant/{id}', 'Api\CampaignController@applicant');

    Route::get('my_applicants', 'Api\CampaignController@my_applicants');
});
