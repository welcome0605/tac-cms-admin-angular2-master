<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddStatusToCheckinTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('checkin', function (Blueprint $table) {
            $table->enum('status',[1,2])->default(1)->comment('1=>active, 2=>inactive');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('checkin', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
}
