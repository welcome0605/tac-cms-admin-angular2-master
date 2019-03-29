<?php

use Illuminate\Database\Seeder;

class CheckinTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('checkin')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        DB::table('checkin')->insert([
            'member_id' => 1,
            'staff_id'=> 2,
            'points' => 10,
            'note' => '',
            'app_id' => 112
        ]);
        DB::table('checkin')->insert([
            'member_id' => 2,
            'staff_id'=> 3,
            'points' => 10,
            'note' => '',
            'app_id' => 112
        ]);
        DB::table('checkin')->insert([
            'member_id' => 3,
            'staff_id'=> 4,
            'points' => 10,
            'note' => '',
            'app_id' => 112
        ]);
        DB::table('checkin')->insert([
            'member_id' => 7,
            'staff_id'=> 5,
            'points' => 10,
            'note' => '',
            'app_id' => 112
        ]);
        DB::table('checkin')->insert([
            'member_id' => 9,
            'staff_id'=> 6,
            'points' => 10,
            'note' => '',
            'app_id' => 112
        ]);
        DB::table('checkin')->insert([
            'member_id' => 1,
            'staff_id'=> 8,
            'points' => 10,
            'note' => '',
            'app_id' => 112
        ]);
        DB::table('checkin')->insert([
            'member_id' => 2,
            'staff_id'=> 2,
            'points' => 10,
            'note' => '',
            'app_id' => 112
        ]);
        DB::table('checkin')->insert([
            'member_id' => 3,
            'staff_id'=> 3,
            'points' => 10,
            'note' => '',
            'app_id' => 112
        ]);
        DB::table('checkin')->insert([
            'member_id' => 7,
            'staff_id'=> 4,
            'points' => 10,
            'note' => '',
            'app_id' => 112
        ]);
        DB::table('checkin')->insert([
            'member_id' => 9,
            'staff_id'=> 5,
            'points' => 10,
            'note' => '',
            'app_id' => 112
        ]);
    }
}
