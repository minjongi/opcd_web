<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LayerContent extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'layer_id', 'title', 'content_num', 'date', 'content', 'status', 'order'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'created_at', 'updated_at'
    ];
}
