<?php

use Illuminate\Database\Seeder;

class StripPackagesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        if(DB::table('strip_packages')->get()->count() == 0){
            DB::table('strip_packages')->insert([
                'unique_id' => Helpers::generateRandomString(),
                'pa_name' => 'Bronze',
                'pa_desc' => '<li><strong>iOS (iPhone and iPad) and Android (Phone and Tablet) App</strong></li>
                <li><strong>24/7 Access to App Platform (Manual Setup)</strong></li>
                <li><strong>Managed Submission into Apple App Store and Google Play Store</strong></li>
                <li><strong>24/7 Support and Maintenance</strong></li>',
                'pa_price' => 999,
                'sub_charge' => 149,
                'sub_id'=> 'app_basic',
                'sub_name' => 'Basic',
                'status' => '1',
            ]);
            DB::table('strip_packages')->insert([
                'unique_id' => Helpers::generateRandomString(),
                'pa_name' => 'Silver',
                'pa_desc' => '<li><strong>iOS (iPhone and iPad) and Android (Phone and Tablet) App</strong></li>
                <li><strong>24/7 Access to App Platform</strong></li>
                <li><strong>Managed Submission into Apple App Store and Google Play Store</strong></li>
                <li><strong>24/7 Support and Maintenance</strong></li>
                <li><strong>Complete Design Package</strong></li>
                <li><strong>Fully Configured Setup up to 5 Pages</strong></li>',
                'pa_price' => 1999,
                'sub_charge' => 149,
                'sub_id'=> 'app_basic',
                'sub_name' => 'Basic',
                'status' => '1',

            ]);
            DB::table('strip_packages')->insert([
                'unique_id' => Helpers::generateRandomString(),
                'pa_name' => 'Gold',
                'pa_desc' => '<li><strong>iOS (iPhone and iPad) and Android (Phone and Tablet) App</strong></li>
                <li><strong>24/7 Access to App Platform</strong></li>
                <li><strong>Managed Submission into Apple App Store and Google Play Store</strong></li>
                <li><strong>24/7 Support and Maintenance</strong></li>
                <li><strong>Complete Design Package</strong></li>
                <li><strong>Fully Configured Setup up to 15 Pages</strong></li>',
                'pa_price' => 2999,
                'sub_charge' => 149,
                'sub_id'=> 'app_basic',
                'sub_name' => 'Basic',
                'status' => '1',
            ]);
            DB::table('strip_packages')->insert([
                'unique_id' => Helpers::generateRandomString(),
                'pa_name' => 'Custom',
                'pa_desc' => '<h2>Contact Us</h2><p>Contact Us if you are a large business and/or if you need custom software development.</p>',
                'pa_price' => 0,
                'sub_charge' => 149,
                'sub_id'=> '',
                'sub_name' => '',
                'status' => '1',
            ]);
        }
    }
}
