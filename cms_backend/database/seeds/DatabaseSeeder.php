<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    	$this->call(RoleSeeder::class);
        $this->command->info('Role table seeded!');

        $this->call(AdminSeeder::class);
        $this->command->info('User table seeded!');

        $this->call(AppSectionTableSeeder::class);
        $this->command->info('App Section table seeded!');

        $this->call(MenuTypeTableSeeder::class);
        $this->command->info('Menu Type table seeded!');

        $this->call(AppCssTableSeeder::class);
        $this->command->info('App Css table seeded!');

        $this->call(AppIndustryTableSeeder::class);
        $this->command->info('App Industry type table seeded!');

        $this->call(AppCategoryTableSeeder::class);
        $this->command->info('App Category table seeded!');

        $this->call(AppPriceTableSeeder::class);
        $this->command->info('App Price table seeded!');

        $this->call(AppLanguageSeeder::class);
        $this->command->info('App Language table seeded!');

        $this->call(AppFontFamilySeeder::class);
        $this->command->info('App FontFamily table seeded!');

        $this->call(StripPackagesTableSeeder::class);
        $this->command->info('App Strip Packages table seeded!');
        
        $this->call(MenuIcon::class);
        $this->command->info('app icon seeder');

        $this->call(CheckinTableSeeder::class);
        $this->command->info('Checkin table seeded!');

        $this->call(ContentThemesTableSeeder::class);
        $this->command->info('Content Themes table seeded!');

        $this->call(ModifiedTransactionTableSeeder::class);
        $this->command->info('Modified Transaction table seeded!');

        $this->call(RedemptionTableSeeder::class);
        $this->command->info('Redemption table seeded!');

        $this->call(UserTypeSeeder::class);
        $this->command->info('UserType table seeded!');

        $this->call(EmailTemplateSeeder::class);
        $this->command->info('EmailTemplate table seeded!');
    }
}
