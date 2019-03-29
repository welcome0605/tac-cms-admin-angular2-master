<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAppCss extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('app_css'))
        {
            Schema::create('app_css', function (Blueprint $table) 
            {
                $table->increments('id')->comment('Primary key');
                $table->string('css_component',255)->nullable();
                $table->longText('css_properties')->nullable(); 
                $table->timestamps();
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
        Schema::dropIfExists('app_css');
    }
}
