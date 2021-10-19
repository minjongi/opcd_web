<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRdasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rdas', function (Blueprint $table) {
            $table->id();
            $table->integer('genre');
            $table->string('artist_name');
            $table->string('song_name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('code')->nullable();
            $table->string('url')->nullable();
            $table->string('file_name')->nullable();
            $table->enum('status', [
                'ACTIVE',
                'DISABLE',
            ])->default('DISABLE');
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
        Schema::dropIfExists('rdas');
    }
}
