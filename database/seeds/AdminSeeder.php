<?php

use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // MEMBER, MAIN, MAGAZINE, WMM, BEATBOX, VINYL
        DB::table('admins')->truncate();
        DB::table('admins')->insert([
            [
                'name' => '최고관리자',
                'email' => 'admin@admin.com',
                'password' => bcrypt('admin12345!@'),
                'role' => 'ADMIN'
            ],
            [
                'name' => 'MEMBER관리자',
                'email' => 'member@admin.com',
                'password' => bcrypt('admin12345!@'),
                'role' => 'MEMBER'
            ],
            [
                'name' => 'MAIN관리자',
                'email' => 'main@admin.com',
                'password' => bcrypt('admin12345!@'),
                'role' => 'MAIN'
            ],
            [
                'name' => 'MAGAZINE관리자',
                'email' => 'feature@admin.com',
                'password' => bcrypt('admin12345!@'),
                'role' => 'MAGAZINE'
            ],
            [
                'name' => 'WMM관리자',
                'email' => 'wmm@admin.com',
                'password' => bcrypt('admin12345!@'),
                'role' => 'WMM'
            ],
            [
                'name' => 'BEATBOX관리자',
                'email' => 'beatbox@admin.com',
                'password' => bcrypt('admin12345!@'),
                'role' => 'BEATBOX'
            ],
            [
                'name' => 'VINYL관리자',
                'email' => 'VINYL@admin.com',
                'password' => bcrypt('admin12345!@'),
                'role' => 'VINYL'
            ],
        ]);
    }
}
