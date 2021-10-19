<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

//Amin Auth
Route::post('login', 'Admin\Auth\AuthController@login')->name('admin.login');
Route::post('register', 'Admin\Auth\AuthController@register')->name('admin.register');

Route::group(['middleware' => ['auth:admin']], function() {
    // Dashboard
    Route::get('check_token', 'Admin\Auth\AuthController@check_token');

    Route::post('opmembers/{id}', 'Admin\UserResource@update');
    Route::post('opmember_status/{id}', 'Admin\UserResource@update_status');
    Route::resource('opmembers', 'Admin\UserResource')->except(['update', 'edit']);

    Route::post('features/{id}', 'Admin\FeatureResource@update');
    Route::post('feature_status/{id}', 'Admin\FeatureResource@update_status');
    Route::resource('features', 'Admin\FeatureResource')->except(['update', 'edit']);

    Route::post('banners/{id}', 'Admin\BannerResource@update');
    Route::post('banner_status/{id}', 'Admin\BannerResource@update_status');
    Route::resource('banners', 'Admin\BannerResource')->except(['update', 'edit']);

    Route::post('events/{id}', 'Admin\EventResource@update');
    Route::post('event_status/{id}', 'Admin\EventResource@update_status');
    Route::resource('events', 'Admin\EventResource')->except(['update', 'edit']);

    Route::post('videos/{id}', 'Admin\VideoResource@update');
    Route::post('video_status/{id}', 'Admin\VideoResource@update_status');
    Route::resource('videos', 'Admin\VideoResource')->except(['update', 'edit']);

    // WMM
    Route::post('puzzlebanners/{id}', 'Admin\PuzzleBannerResource@update');
    Route::resource('puzzlebanners', 'Admin\PuzzleBannerResource')->except(['update', 'edit']);

    Route::post('wmmcontents/{id}', 'Admin\WmmContentResource@update');
    Route::post('wmmcontent_status/{id}', 'Admin\WmmContentResource@update_status');
    Route::resource('wmmcontents', 'Admin\WmmContentResource')->except(['update', 'edit']);

    Route::post('wmmlayers/{id}', 'Admin\WmmLayerResource@update');
    Route::post('wmmlayer_status/{id}', 'Admin\WmmLayerResource@update_status');
    Route::get('wmmlayer_names', 'Admin\WmmLayerResource@name_list');
    Route::resource('wmmlayers', 'Admin\WmmLayerResource')->except(['update', 'edit']);

    Route::post('campaigns/{id}', 'Admin\CampaignResource@update');
    Route::post('campaign_status/{id}', 'Admin\CampaignResource@update_status');
    Route::get('campaign_names', 'Admin\CampaignResource@name_list');
    Route::resource('campaigns', 'Admin\CampaignResource')->except(['update', 'edit']);

    Route::post('applicants/{id}', 'Admin\ApplicantResource@update');
    Route::post('applicant_status/{id}', 'Admin\ApplicantResource@update_status');
    Route::resource('applicants', 'Admin\ApplicantResource')->except(['update', 'edit']);

    Route::post('applicant_forms/{id}', 'Admin\ApplicantFormResource@update');
    Route::post('applicant_form_status/{id}', 'Admin\ApplicantFormResource@update_status');
    Route::resource('applicant_forms', 'Admin\ApplicantFormResource')->except(['update', 'edit']);

    Route::post('categories/{id}', 'Admin\CategoryResource@update');
    Route::post('category_status/{id}', 'Admin\CategoryResource@update_status');
    Route::get('category_names', 'Admin\CategoryResource@name_list');
    Route::resource('categories', 'Admin\CategoryResource')->except(['update', 'edit']);

    Route::post('vinylcontents/{id}', 'Admin\VinylContentResource@update');
    Route::post('vinylcontent_status/{id}', 'Admin\VinylContentResource@update_status');
    Route::resource('vinylcontents', 'Admin\VinylContentResource')->except(['update', 'edit']);

    Route::get('policy', 'Admin\PolicyController@index');
    Route::post('policy', 'Admin\PolicyController@update');

    Route::post('faqs/{id}', 'Admin\FaqResource@update');
    Route::post('faq_status/{id}', 'Admin\FaqResource@update_status');
    Route::resource('faqs', 'Admin\FaqResource')->except(['update', 'edit']);

    Route::post('notices/{id}', 'Admin\NoticeResource@update');
    Route::post('notice_status/{id}', 'Admin\NoticeResource@update_status');
    Route::resource('notices', 'Admin\NoticeResource')->except(['update', 'edit']);

    Route::post('rda_zip_download', 'Admin\RdaResource@download_zip');
    Route::post('rda_excel_download', 'Admin\RdaResource@download_excel');
    Route::post('rda_file_download', 'Admin\RdaResource@download_file');
    Route::post('rda_status/{id}', 'Admin\RdaResource@update_status');
    Route::resource('rdas', 'Admin\RdaResource')->except(['update', 'edit']);

    Route::post('rda_campaign/{id}', 'Admin\RdaCampaignResource@update');
    Route::post('rda_campaign_status/{id}', 'Admin\RdaCampaignResource@update_status');
    Route::resource('rda_campaign', 'Admin\RdaCampaignResource')->except(['update', 'edit']);

    Route::post('rda_logo_status/{id}', 'Admin\RdaLogoResource@update_status');
    Route::resource('rda_logo', 'Admin\RdaLogoResource')->except(['update', 'edit']);

    Route::post('rda_music_status/{id}', 'Admin\RdaMusicResource@update_status');
    Route::resource('rda_music', 'Admin\RdaMusicResource')->except(['update', 'edit']);

    Route::get('settings', 'Admin\SettingsController@index');
    Route::post('rda_settings', 'Admin\SettingsController@updateRda');

    Route::post('rda_faq_status/{id}', 'Admin\RdaFaqResource@update_status');
    Route::resource('rda_faq', 'Admin\RdaFaqResource')->except(['create', 'edit']);

    Route::get('rda_content', 'Admin\RdaContentResource@index');
    Route::post('rda_content', 'Admin\RdaContentResource@store');

    Route::post('rda_banner/{id}', 'Admin\RdaBannerResource@update');
    Route::post('rda_banner_status/{id}', 'Admin\RdaBannerResource@update_status');
    Route::resource('rda_banner', 'Admin\RdaBannerResource')->except(['update', 'edit']);
});
