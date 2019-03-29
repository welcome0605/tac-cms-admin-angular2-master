<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMainmenuCssTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('menu_css'))
        {
            Schema::create('menu_css', function (Blueprint $table) 
            {  
                $table->increments('id')->comment('Primary Key');
                $table->longText('css_properties')->nullable(); 
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
           Schema::dropIfExists('menu_css');
    }
}
