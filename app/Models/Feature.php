<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feature extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title', 'image', 'description', 'content', 'type', 'status', 'author'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'updated_at'
    ];

    public function tag()
    {
        return $this->hasMany('App\Models\Tag', 'related_id', 'id')->where('type', 'MAGAZINE')->select('related_id', 'tag');
    }
}
