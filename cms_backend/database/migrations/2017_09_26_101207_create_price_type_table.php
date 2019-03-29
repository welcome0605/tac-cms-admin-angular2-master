<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePriceTypeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('price_type'))
        {
            Schema::create('price_type', function (Blueprint $table) 
            {  
                $table->increments('id')->comment('Primary Key');
                $table->string('name', 255)->nullable();
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
           Schema::dropIfExists('price_type');
    }
}
