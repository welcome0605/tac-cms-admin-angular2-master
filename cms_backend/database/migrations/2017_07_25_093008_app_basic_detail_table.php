<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AppBasicDetailTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('app_basic_detail'))
        {
            Schema::create('app_basic_detail', function (Blueprint $table) 
            {
                $table->increments('id')->comment('Primary key');

                $table->integer('app_basic_id')->unsigned()->comment('Foreign key');
                $table->index('app_basic_id');
                $table->foreign('app_basic_id')
                        ->references('id')->on('app_basic')
                        ->onDelete('cascade');

                $table->integer('app_section_id')->unsigned()->comment('Foreign key');
                $table->index('app_section_id');
                $table->foreign('app_section_id')
                        ->references('id')->on('app_section')
                        ->onDelete('cascade');

                $table->string('app_section_slug',255)->nullable();
                $table->longText('section_json_data')->nullable();
                $table->string('app_version',20)->nullable();

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
        Schema::dropIfExists('app_basic_detail');
    }
}
