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
        if(DB::table('users')->get()->count() == 0){
            DB::table('users')->insert([
                'role_id' => 1,
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'email' => 'admin@theappcompany.com',
                'password' => bcrypt('admin@123'),
                'status' => '1',
            ]);
        }
    }
}
