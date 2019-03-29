<?php

use Illuminate\Database\Seeder;

class AppIndustryTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('industry_type')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        DB::table('industry_type')->insert([
            [ 'name' => 'Art and Design'],
            [ 'name' => 'Auto and Vehicles'],
            [ 'name' => 'Beauty'],
            [ 'name' => 'Books and Reference'],
            [ 'name' => 'Business'],
            [ 'name' => 'Comics'],
            [ 'name' => 'Communication'],
            [ 'name' => 'Dating'],
            [ 'name' => 'Education'],
            [ 'name' => 'Entertainment'],
            [ 'name' => 'Events'],
            [ 'name' => 'Finance'],
            [ 'name' => 'Food and Drink'],
            [ 'name' => 'Health and Fitness'],
            [ 'name' => 'House and Home'],
            [ 'name' => 'Libraries and Demo'],
            [ 'name' => 'Lifestyle'],
            [ 'name' => 'Maps and Navigation'],
            [ 'name' => 'Medical'],
            [ 'name' => 'Music and Audio'],
            [ 'name' => 'News and Magazines'],
            [ 'name' => 'Parenting'],
            [ 'name' => 'Personalization'],
            [ 'name' => 'Photography'],
            [ 'name' => 'Productivity'],
            [ 'name' => 'Shopping'],
            [ 'name' => 'Social'],
            [ 'name' => 'Sports'],
            [ 'name' => 'Tools'],
            [ 'name' => 'Travel and Local'],
            [ 'name' => 'Video Players and Editors'],
            [ 'name' => 'Weather']
        ]);
    }
}
