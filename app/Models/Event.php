<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $appends = [
		'is_end'
	];

	public function getIsEndAttribute()
	{
        if(empty($this->end_date)){
            return 0;
        }else{
            return strtotime("now") > strtotime($this->end_date) ? 1 : 0;
        }
	}

    protected $fillable = [
        'title', 'desc', 'image', 'link', 'link_target', 'status', 'author', 'category', 'start_date', 'end_date'
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
