<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('artist_name')->nullable();
            $table->string('artist_id')->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable();
            $table->string('birthday')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('address_detail')->nullable();
            $table->enum('role', [
                'USER',
                'ADMIN'
            ])->default('USER');
            $table->enum('status', [
                'DISABLED',
                'ACTIVED'
            ])->default('ACTIVED');
            $table->string('avatar')->nullable();
            $table->string('position')->nullable();
            $table->string('social_1')->nullable();
            $table->string('social_2')->nullable();
            $table->string('social_3')->nullable();
            $table->string('social_4')->nullable();
            $table->tinyinteger('market_message')->default(true);
            $table->tinyinteger('market_mail')->default(true);
            $table->string('google_id')->nullable();
            $table->string('naver_id')->nullable();
            $table->string('kakao_id')->nullable();
            $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
}
