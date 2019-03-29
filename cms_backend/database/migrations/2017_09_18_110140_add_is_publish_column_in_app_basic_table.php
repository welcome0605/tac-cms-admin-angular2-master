<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIsPublishColumnInAppBasicTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('app_basic', function (Blueprint $table) {
            $table->enum('app_publish_status',['1','2','3','4'])->default('1')->comment('1 => Working, 2=> Awaiting Publish, 3=> Published, 4=> On Hold')->after('version');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
        Schema::table('app_basic', function (Blueprint $table) {
            //
        });
    }
}
