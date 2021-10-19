<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWmmcontentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('wmm_contents', function (Blueprint $table) {
            $table->id();
            $table->text('title');
            $table->text('desc');
            $table->string('image');
            $table->string('link');
            $table->enum('link_target', [
                'BLANK',
                'SELF',
            ])->default('BLANK');
            $table->enum('type', [
                'PACK',
                'CONTEST',
                'CONTENT'
            ])->default('PACK');
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
        Schema::dropIfExists('wmm_contents');
    }
}
