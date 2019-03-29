<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSuperAdminSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('super_admin_setting'))
        {
            Schema::create('super_admin_setting', function (Blueprint $table) 
            {  
                $table->increments('id')->comment('Primary Key');
                $table->longText('app_super_admin_json_data')->nullable();
                $table->enum('status',['1','2','3'])->default('1')->comment('1=>active, 2=>inactive, 3=>deleted');         
            });
        }    
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('super_admin_setting');
    }
}
