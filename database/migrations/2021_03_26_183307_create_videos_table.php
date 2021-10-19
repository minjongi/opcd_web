<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVideosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->text('title')->nullable();
            $table->text('desc')->nullable();
            $table->string('image');
            $table->string('link');
            $table->enum('link_target', [
                'BLANK',
                'SELF',
            ])->default('BLANK');
            $table->enum('status', [
                'ACTIVE',
                'DISABLE',
            ])->default('DISABLE');
            $table->string('author');
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
        Schema::dropIfExists('videos');
    }
}
