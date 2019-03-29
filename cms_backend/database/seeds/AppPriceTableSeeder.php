<?php

use Illuminate\Database\Seeder;

class AppPriceTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('price_type')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        DB::table('price_type')->insert([
            [ 'name' => 'USD 0 (Free)'],
            [ 'name' => 'USD 0.99 (Tier 1)'],
            [ 'name' => 'USD 1.99 (Tier 2)'],
            [ 'name' => 'USD 2.99 (Tier 3)'],
            [ 'name' => 'USD 3.99 (Tier 4)'],
            [ 'name' => 'USD 4.99 (Tier 5)'],
            [ 'name' => 'USD 5.99 (Tier 6)'],
            [ 'name' => 'USD 6.99 (Tier 7)'],
            [ 'name' => 'USD 7.99 (Tier 8)'],
            [ 'name' => 'USD 8.99 (Tier 9)'],
            [ 'name' => 'USD 9.99 (Tier 10)'],
            [ 'name' => 'USD 10.99 (Tier 11)'],
            [ 'name' => 'USD 11.99 (Tier 12)'],
            [ 'name' => 'USD 12.99 (Tier 13)'],
            [ 'name' => 'USD 13.99 (Tier 14)'],
            [ 'name' => 'USD 14.99 (Tier 15)'],
            [ 'name' => 'USD 15.99 (Tier 16)'],
            [ 'name' => 'USD 16.99 (Tier 17)'],
            [ 'name' => 'USD 17.99 (Tier 18)'],
            [ 'name' => 'USD 18.99 (Tier 19)'],
            [ 'name' => 'USD 19.99 (Tier 20)'],
            [ 'name' => 'USD 20.99 (Tier 21)'],
            [ 'name' => 'USD 21.99 (Tier 22)'],
            [ 'name' => 'USD 22.99 (Tier 23)'],
            [ 'name' => 'USD 23.99 (Tier 24)'],
            [ 'name' => 'USD 24.99 (Tier 25)'],
            [ 'name' => 'USD 25.99 (Tier 26)'],
            [ 'name' => 'USD 26.99 (Tier 27)'],
            [ 'name' => 'USD 27.99 (Tier 28)'],
            [ 'name' => 'USD 28.99 (Tier 29)'],
            [ 'name' => 'USD 29.99 (Tier 30)'],
            [ 'name' => 'USD 30.99 (Tier 31)'],
            [ 'name' => 'USD 31.99 (Tier 32)'],
            [ 'name' => 'USD 32.99 (Tier 33)'],
            [ 'name' => 'USD 33.99 (Tier 34)'],
            [ 'name' => 'USD 34.99 (Tier 35)'],
            [ 'name' => 'USD 35.99 (Tier 36)'],
            [ 'name' => 'USD 36.99 (Tier 37)'],
            [ 'name' => 'USD 37.99 (Tier 38)'],
            [ 'name' => 'USD 38.99 (Tier 39)'],
            [ 'name' => 'USD 39.99 (Tier 40)'],
            [ 'name' => 'USD 40.99 (Tier 41)'],
            [ 'name' => 'USD 41.99 (Tier 42)'],
            [ 'name' => 'USD 42.99 (Tier 43)'],
            [ 'name' => 'USD 43.99 (Tier 44)'],
            [ 'name' => 'USD 44.99 (Tier 45)'],
            [ 'name' => 'USD 45.99 (Tier 46)'],
            [ 'name' => 'USD 46.99 (Tier 47)'],
            [ 'name' => 'USD 47.99 (Tier 48)'],
            [ 'name' => 'USD 48.99 (Tier 49)'],
            [ 'name' => 'USD 49.99 (Tier 50)'],
            [ 'name' => 'USD 54.99 (Tier 51)'],
            [ 'name' => 'USD 59.99 (Tier 52)'],
            [ 'name' => 'USD 64.99 (Tier 53)'],
            [ 'name' => 'USD 74.99 (Tier 54)'],
            [ 'name' => 'USD 79.99 (Tier 55)'],
            [ 'name' => 'USD 84.99 (Tier 56)'],
            [ 'name' => 'USD 89.99 (Tier 57)'],
            [ 'name' => 'USD 94.99 (Tier 58)'],
            [ 'name' => 'USD 99.99 (Tier 59)'],
            [ 'name' => 'USD 109.99 (Tier 60)'],
            [ 'name' => 'USD 119.99 (Tier 61)'],
            [ 'name' => 'USD 124.99 (Tier 62)'],
            [ 'name' => 'USD 129.99 (Tier 63)'],
            [ 'name' => 'USD 139.99 (Tier 64)'],
            [ 'name' => 'USD 149.99 (Tier 65)'],
            [ 'name' => 'USD 159.99 (Tier 66)'],
            [ 'name' => 'USD 169.99 (Tier 67)'],
            [ 'name' => 'USD 174.99 (Tier 68)'],
            [ 'name' => 'USD 179.99 (Tier 69)'],
            [ 'name' => 'USD 189.99 (Tier 70)'],
            [ 'name' => 'USD 199.99 (Tier 71)'],
            [ 'name' => 'USD 209.99 (Tier 72)'],
            [ 'name' => 'USD 219.99 (Tier 73)'],
            [ 'name' => 'USD 229.99 (Tier 74)'],
            [ 'name' => 'USD 239.99 (Tier 75)'],
            [ 'name' => 'USD 249.99 (Tier 76)'],
            [ 'name' => 'USD 299.99 (Tier 77)'],
            [ 'name' => 'USD 349.99 (Tier 78)'],
            [ 'name' => 'USD 399.99 (Tier 79)'],
            [ 'name' => 'USD 449.99 (Tier 80)'],
            [ 'name' => 'USD 499.99 (Tier 81)'],
            [ 'name' => 'USD 599.99 (Tier 82)'],
            [ 'name' => 'USD 699.99 (Tier 83)'],
            [ 'name' => 'USD 799.99 (Tier 84)'],
            [ 'name' => 'USD 899.99 (Tier 85)'],
            [ 'name' => 'USD 999.99 (Tier 86)']
        ]);
    }
}
