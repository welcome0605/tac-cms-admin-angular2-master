<?php

use Illuminate\Database\Seeder;

class MenuTypeTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('menu_type')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        DB::table('menu_type')->insert([
            'name' => 'Animated Panels', 'slug'=>'animated_panels', 'menu_type_icon'=>'fa fa-bars'
        ]);
        DB::table('menu_type')->insert([
            'name' => 'Video', 'slug'=>'video', 'menu_type_icon'=>'fa fa-film'
        ]);
        DB::table('menu_type')->insert([
            'name' => 'YouTube Playlist', 'slug'=>'youtube_playlist', 'menu_type_icon'=>'fa fa-youtube-play'
        ]);
        DB::table('menu_type')->insert([
            'name' => 'List Menu', 'slug'=>'list_menu', 'menu_type_icon'=>'fa fa-list'
        ]);
        DB::table('menu_type')->insert([
            'name' => 'RSS Feed', 'slug'=>'rss_feed', 'menu_type_icon'=>'fa fa-rss'
        ]);
        DB::table('menu_type')->insert([
            'name' => 'Notifications', 'slug'=>'notifications', 'menu_type_icon'=>'fa fa-bell-o'
        ]);
        DB::table('menu_type')->insert([
            'name' => 'Google/Picasa Album', 'slug'=>'picasa_album', 'menu_type_icon'=>'fa fa-product-hunt'
        ]);
        DB::table('menu_type')->insert([
            'name' => 'PDF', 'slug'=>'pdf', 'menu_type_icon'=>'fa fa-file-powerpoint-o'
        ]);
        DB::table('menu_type')->insert([
            'name' => 'Website', 'slug'=>'website', 'menu_type_icon'=>'icmn-sphere'
        ]);
        DB::table('menu_type')->insert([
            'name' => 'App Tutorial', 'slug'=>'tutorial', 'menu_type_icon'=>'fa fa-file-text'
        ]);
        DB::table('menu_type')->insert([
            'name' => 'Contact Form', 'slug'=>'contact', 'menu_type_icon'=>'fa fa-drivers-license'
        ]);
        DB::table('menu_type')->insert([
            'name' => 'Content', 'slug'=>'content_editor', 'menu_type_icon'=>'fa fa-edit'
        ]);
        DB::table('menu_type')->insert([
            'name' => 'Rewards', 'slug'=>'rewards', 'menu_type_icon'=>'fa fa-gift'
        ]);
    }
}
