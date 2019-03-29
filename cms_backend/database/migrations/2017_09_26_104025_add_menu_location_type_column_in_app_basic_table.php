<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMenuLocationTypeColumnInAppBasicTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('app_basic', function (Blueprint $table) {
            $table->enum('menu_location_type', ['1','2'])->default('1')->comment('1 => SideMenu, 2 => TabMenu')->after('app_json_data');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('app_basic', function (Blueprint $table) {
        });
    }
}
