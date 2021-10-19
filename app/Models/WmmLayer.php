<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WmmLayer extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'related_id', 'title', 'desc', 'status', 'author'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'updated_at'
    ];

    public function content()
    {
        return $this->hasMany('App\Models\LayerContent', 'layer_id', 'id')->orderBy('order');
    }
}
