<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VinylContent extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'category_id', 'description', 'image', 'content', 'status', 'author'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'updated_at'
    ];

    public function category()
    {
        return $this->belongsTo('App\Models\Category', 'category_id', 'id')->where('status', 'ACTIVE')->select('id', 'name');
    }
}
