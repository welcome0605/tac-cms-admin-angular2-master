<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAppMenuTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('app_menu'))
        {
            Schema::create('app_menu', function (Blueprint $table) 
            {
                $table->increments('id')->comment('Primary key');
                $table->integer('is_parent')->default('0');
                $table->integer('app_basic_id')->unsigned()->comment('Foreign key');
                $table->index('app_basic_id');
                $table->foreign('app_basic_id')
                        ->references('id')->on('app_basic')
                        ->onDelete('cascade');
                $table->string('menu_name',255)->nullable();
                $table->string('menu_icon',255)->nullable();
                $table->integer('tab_show')->default('0');
                $table->integer('order')->default('0');
                $table->integer('menu_type')->default('0')->unsigned()->comment('Foreign key');
                $table->index('menu_type');
                $table->foreign('menu_type')
                        ->references('id')->on('menu_type')
                        ->onDelete('cascade'); 
                $table->longText('menu_type_json_data')->nullable();       
                $table->enum('is_display_on_app', ['0','1'])->default('1')->comment('0 => Not display, 1 => Display');       
                $table->timestamps();
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
        Schema::dropIfExists('app_menu');
    }
}
