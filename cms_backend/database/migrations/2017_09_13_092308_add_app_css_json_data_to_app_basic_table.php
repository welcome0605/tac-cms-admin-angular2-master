<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAppCssJsonDataToAppBasicTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('app_basic', function (Blueprint $table) {
            $table->longText('app_general_css_json_data')->nullable()->after('app_json_data'); 
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
            //
        });
    }
}
