<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rda extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'genre', 'artist_name', 'song_name', 'email', 'phone', 'code', 'url', 'file_name', 'status'
    ];

    protected $appends = [
        'genre_text'
    ];

	public function getGenreTextAttribute()
	{
        $category = RdaCategory::where('key', $this->genre)->first();
        if(empty($category)){
            return '';
        }else{
            return $category->name;
        }
	}


    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'updated_at'
    ];
}
