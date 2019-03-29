<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Migrations\Migration;

use DB;
use Config;
use Exception;

class MigrateReloadCommand extends Command 
{
    protected $signature = 'migrate:reload-all';
    protected $name = 'migrate:reload-all';
    protected $description = 'Drop all tables systematically. And Running seeders.';

    public function handle()
    {
        if (! \App::environment('local') && ! $this->option('force')) {
            $this->error('If you are not in a local environment, you must use the --force option.');
            return;
        }
        $tables = DB::select('SHOW TABLES');
        $tables_in_database = "Tables_in_".Config::get('database.connections.mysql.database');
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        foreach ($tables as $table) {
            Schema::drop($table->$tables_in_database);
            $this->info("<info>Dropped: </info>".$table->$tables_in_database);
        }

        exec('php artisan migrate --force -vvv', $migrateOutput);
        $this->info(implode("\n", $migrateOutput));
        $this->info('Migrated');
        exec('php artisan db:seed --force -vvv', $seedOutput);
        $this->info(implode("\n", $seedOutput));
        $this->info('Seeded');

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }

    /**
     * Get the console command options.
     *
     * @return array
     */
    protected function getOptions()
    {
        /*return array(
            ['force', 'f', InputOption::VALUE_NONE, true],
        );*/
    }
}