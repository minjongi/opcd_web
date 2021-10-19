<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApplicantFormsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('applicant_forms', function (Blueprint $table) {
            $table->id();
            $table->string('form_name');
            $table->integer('campaign_id')->nullable();
            $table->enum('type', [
                'WMM',
                'BEATBOX',
                'VINYL'
            ])->default('WMM');
            $table->longText('applicant_form')->nullable();
            $table->enum('status', [
                'ACTIVE',
                'DISABLE',
            ])->default('DISABLE');
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
        Schema::dropIfExists('applicant_forms');
    }
}
