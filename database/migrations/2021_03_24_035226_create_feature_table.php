<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFeatureTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('features', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('image');
            $table->text('description')->nullable();
            $table->longText('content')->nullable();
            $table->enum('type', [
                'MAGAZINE',
                'BEATBOX',
                'VINYL'
            ])->default('MAGAZINE');
            $table->enum('status', [
                'ACTIVE',
                'DISABLE',
            ])->default('ACTIVE');
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
        Schema::dropIfExists('features');
    }
}
