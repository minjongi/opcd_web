<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRdaCampaignsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rda_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('url');
            $table->text('description')->nullable();
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
        Schema::dropIfExists('rda_campaigns');
    }
}
