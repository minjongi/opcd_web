<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'type', 'description', 'status'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'updated_at'
    ];

    public function form()
    {
        return $this->hasOne('App\Models\ApplicantForm', 'campaign_id', 'id')->where('status', 'ACTIVE')->select('id', 'campaign_id', 'form_name', 'applicant_form');
    }
}
