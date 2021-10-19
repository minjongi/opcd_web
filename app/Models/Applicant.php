<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Applicant extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'campaign_id', 'applicant_id', 'applicant_content', 'propose', 'security', 'status', 'type'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'updated_at'
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id', 'id')->where('status', 'ACTIVED')
                                ->select('id', 'name', 'email', 'birthday', 'phone', 'address', 'address_detail', 'avatar');
    }

    public function campaign()
    {
        return $this->belongsTo('App\Models\Campaign', 'campaign_id', 'id')->where('status', 'ACTIVE')
                                ->select('id', 'name', 'type');
    }
}
