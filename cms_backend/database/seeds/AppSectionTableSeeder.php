<?php

use Illuminate\Database\Seeder;

class AppSectionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('app_section')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        DB::table('app_section')->insert([
            'app_section_name' => 'Splash Screen','app_section_slug'=>'splash_screen'
        ]);
        DB::table('app_section')->insert([
            'app_section_name' => 'Sponsor Splash','app_section_slug'=>'sponsor_splash'
        ]);
        DB::table('app_section')->insert([
            'app_section_name' => 'App Icon','app_section_slug'=>'app_icon'
        ]);
        DB::table('app_section')->insert([
            'app_section_name' => 'Basic Information','app_section_slug'=>'basic_information'
        ]);
        DB::table('app_section')->insert([
            'app_section_name' => 'Google Analytic','app_section_slug'=>'google_analytic'
        ]);
        DB::table('app_section')->insert([
            'app_section_name' => 'Add Screenshot','app_section_slug'=>'add_screenshot'
        ]);
        DB::table('app_section')->insert([
            'app_section_name' => 'Notification Popup','app_section_slug'=>'notification_popup'
        ]);
        DB::table('app_section')->insert([
            'app_section_name' => 'Auto Upgrade Popup','app_section_slug'=>'auto_upgrade_popup'
        ]);
        DB::table('app_section')->insert([
            'app_section_name' => 'Rate Popup','app_section_slug'=>'rate_popup'
        ]);

        DB::table('app_section')->insert([
            'app_section_name' => 'Home Screen','app_section_slug'=>'home_screen'
        ]);

        DB::table('app_section')->insert([
            'app_section_name' => 'Menu Configuration','app_section_slug'=>'menu_configuration'
        ]);

        DB::table('app_section')->insert([
            'app_section_name' => 'Add Ipad Screenshot','app_section_slug'=>'add_ipad_screenshot'
        ]);
    }
}
