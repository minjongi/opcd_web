<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApplicantForm extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'form_name', 'campaign_id', 'type', 'applicant_form', 'status', 'author'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'updated_at'
    ];

    public function campaign()
    {
        return $this->belongsTo("App\Models\Campaign", 'campaign_id', 'id')->select('id', 'name');
    }
}
