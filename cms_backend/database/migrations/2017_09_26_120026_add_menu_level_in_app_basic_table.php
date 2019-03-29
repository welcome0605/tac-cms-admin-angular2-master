<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMenuLevelInAppBasicTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('app_menu', function (Blueprint $table)
        {
            $table->smallInteger('menu_level')->default(1)->after('order')->comment('Menu Level');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('app_menu', function (Blueprint $table) {
        });
    }
}
