<?php

use Illuminate\Database\Seeder;

class PuzzleBannerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('puzzle_banners')->truncate();
        DB::table('puzzle_banners')->insert([
            [
                'type' => 'SOON',
                'display' => 'DESKTOP'
            ],
            [
                'type' => 'SOON',
                'display' => 'DESKTOP'
            ],
            [
                'type' => 'FIXED',
                'display' => 'DESKTOP'
            ],
            [
                'type' => 'SOON',
                'display' => 'DESKTOP'
            ],
            [
                'type' => 'SOON',
                'display' => 'DESKTOP'
            ],
            [
                'type' => 'SOON',
                'display' => 'DESKTOP'
            ],
            [
                'type' => 'SOON',
                'display' => 'DESKTOP'
            ],
            [
                'type' => 'SOON',
                'display' => 'DESKTOP'
            ],
            [
                'type' => 'SOON',
                'display' => 'DESKTOP'
            ],
            [
                'type' => 'FIXED',
                'display' => 'DESKTOP'
            ],
            [
                'type' => 'SOON',
                'display' => 'DESKTOP'
            ],
            [
                'type' => 'SOON',
                'display' => 'DESKTOP'
            ],

            [
                'type' => 'SOON',
                'display' => 'MOBILE'
            ],
            [
                'type' => 'SOON',
                'display' => 'MOBILE'
            ],
            [
                'type' => 'FIXED',
                'display' => 'MOBILE'
            ],
            [
                'type' => 'SOON',
                'display' => 'MOBILE'
            ],
            [
                'type' => 'SOON',
                'display' => 'MOBILE'
            ],
            [
                'type' => 'SOON',
                'display' => 'MOBILE'
            ],
            [
                'type' => 'SOON',
                'display' => 'MOBILE'
            ],
            [
                'type' => 'SOON',
                'display' => 'MOBILE'
            ],
            [
                'type' => 'SOON',
                'display' => 'MOBILE'
            ],
            [
                'type' => 'FIXED',
                'display' => 'MOBILE'
            ],
            [
                'type' => 'SOON',
                'display' => 'MOBILE'
            ],
            [
                'type' => 'SOON',
                'display' => 'MOBILE'
            ]
        ]);
    }
}
