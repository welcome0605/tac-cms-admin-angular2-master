<?php

use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('role')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        DB::table('role')->insert([
            'name' => 'Admin User',
        ]);
        DB::table('role')->insert([
            'name' => 'General User',
        ]);
        DB::table('role')->insert([
            'name' => 'Member',
        ]);
    }
}
