<?php

use Illuminate\Database\Seeder;

class RedemptionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('redemption')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        DB::table('redemption')->insert([
            'member_id' => 1,
            'staff_id'=> 2,
            'bonus_id' => 3,
            'points' => 10,
            'note' => '',
            'app_id' => 112
        ]);
        DB::table('redemption')->insert([
            'member_id' => 2,
            'staff_id'=> 3,
            'bonus_id' => 5,
            'points' => 10,
            'note' => '',
            'app_id' => 112
        ]);
        DB::table('redemption')->insert([
            'member_id' => 3,
            'staff_id'=> 4,
            'bonus_id' => 15,
            'points' => 10,
            'note' => '',
            'app_id' => 112
        ]);
        DB::table('redemption')->insert([
            'member_id' => 7,
            'staff_id'=> 5,
            'bonus_id' => 3,
            'points' => 10,
            'note' => '',
            'app_id' => 112
        ]);
        DB::table('redemption')->insert([
            'member_id' => 9,
            'staff_id'=> 6,
            'bonus_id' => 5,
            'points' => 10,
            'note' => '',
            'app_id' => 112
        ]);
        DB::table('redemption')->insert([
            'member_id' => 1,
            'staff_id'=> 8,
            'bonus_id' => 15,
            'points' => 10,
            'note' => '',
            'app_id' => 112
        ]);
        DB::table('redemption')->insert([
            'member_id' => 2,
            'staff_id'=> 2,
            'bonus_id' => 3,
            'points' => 10,
            'note' => '',
            'app_id' => 112
        ]);
        DB::table('redemption')->insert([
            'member_id' => 3,
            'staff_id'=> 3,
            'bonus_id' => 5,
            'points' => 10,
            'note' => '',
            'app_id' => 112
        ]);
        DB::table('redemption')->insert([
            'member_id' => 7,
            'staff_id'=> 4,
            'bonus_id' => 15,
            'points' => 10,
            'note' => '',
            'app_id' => 112
        ]);
        DB::table('redemption')->insert([
            'member_id' => 9,
            'staff_id'=> 5,
            'bonus_id' => 3,
            'points' => 10,
            'note' => '',
            'app_id' => 112
        ]);
    }
}
