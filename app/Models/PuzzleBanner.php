<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PuzzleBanner extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'layer_id', 'type', 'base_image', 'live_image', 'soon_image', 'display', 'author'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'updated_at'
    ];

    public function popup()
    {
        return $this->belongsTo('App\Models\WmmLayer', 'layer_id', 'id')->where('status', 'ACTIVE')->select('id', 'title', 'desc');
    }
}
