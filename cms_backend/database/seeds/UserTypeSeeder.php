<?php

use Illuminate\Database\Seeder;

class UserTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('user_types')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        DB::table('user_types')->insert([
            'name' => 'Email',
        ]);
        DB::table('user_types')->insert([
            'name' => 'Facebook',
        ]);
        DB::table('user_types')->insert([
            'name' => 'Google',
        ]);
    }
}
