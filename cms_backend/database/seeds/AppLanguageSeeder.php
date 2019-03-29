<?php

use Illuminate\Database\Seeder;

class AppLanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('language_type')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        DB::table('language_type')->insert([
            [ 'name' => 'English (U.S.)'],
            [ 'name' => 'Chinese (Traditional)'],
            [ 'name' => 'Danish'],
            [ 'name' => 'Dutch'],
            [ 'name' => 'English (Australia)'],
            [ 'name' => 'English (Canada)'],
            [ 'name' => 'English (U.K.)'],
            [ 'name' => 'Chinese (Simplified)'],
            [ 'name' => 'Finnish'],
            [ 'name' => 'French'],
            [ 'name' => 'French (Canada)'],
            [ 'name' => 'German'],
            [ 'name' => 'Greek'],
            [ 'name' => 'Indonesian'],
            [ 'name' => 'Italian'],
            [ 'name' => 'Japanese'],
            [ 'name' => 'Korean'],
            [ 'name' => 'Malay'],
            [ 'name' => 'Norwegian'],
            [ 'name' => 'Portuguese (Brazil)'],
            [ 'name' => 'Portuguese (Portugal)'],
            [ 'name' => 'Russian'],
            [ 'name' => 'Spanish (Mexico)'],
            [ 'name' => 'Spanish (Spain)'],
            [ 'name' => 'Swedish'],
            [ 'name' => 'Thai'],
            [ 'name' => 'Turkish'],
            [ 'name' => 'Vietnamese']
        ]);
    }
}
