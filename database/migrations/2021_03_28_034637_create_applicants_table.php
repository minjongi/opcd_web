<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApplicantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('applicants', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->integer('campaign_id');
            $table->string('applicant_id');
            $table->longText('applicant_content');
            $table->longText('propose')->nullable();
            $table->enum('security', [
                'PUBLIC',
                'PRIVATE',
            ])->default('PUBLIC');
            $table->enum('status', [
                'ACTIVE',
                'DISABLE',
            ])->default('ACTIVE');
            $table->enum('type', [
                'WMM',
                'BEATBOX',
                'VINYL'
            ])->default('WMM');
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
        Schema::dropIfExists('applicants');
    }
}
