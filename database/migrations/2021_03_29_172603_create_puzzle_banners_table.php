<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePuzzleBannersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('puzzle_banners', function (Blueprint $table) {
            $table->id();
            $table->string('layer_id')->nullable();
            $table->enum('type', [
                'LIVE',
                'SOON',
                'FIXED'
            ])->default('SOON');
            $table->string('base_image')->nullable();
            $table->string('live_image')->nullable();
            $table->string('soon_image')->nullable();
            $table->enum('display', [
                'DESKTOP',
                'MOBILE',
            ])->default('DESKTOP');
            $table->string('author')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('puzzle_banners');
    }
}
