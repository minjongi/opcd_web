<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WmmContent extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title', 'desc', 'image', 'link', 'link_target', 'type', 'status', 'author'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'updated_at'
    ];
}
