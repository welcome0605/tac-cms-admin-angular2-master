<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMenuTypeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('menu_type'))
        {
            Schema::create('menu_type', function (Blueprint $table) 
            {
                $table->increments('id')->comment('Primary key');
                $table->string('name',255)->nullable();
                $table->string('slug',255)->nullable();
                $table->string('menu_type_icon',255)->nullable();     
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
        Schema::dropIfExists('menu_type');
    }
}
