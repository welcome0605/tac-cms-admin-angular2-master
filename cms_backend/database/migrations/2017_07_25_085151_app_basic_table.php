<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AppBasicTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('app_basic'))
        {
            Schema::create('app_basic', function (Blueprint $table)
            {
                $table->increments('id')->comment('Primary key');
                $table->string('app_unique_id',50);
                $table->string('app_name',100)->nullable();
                $table->longText('app_json_data')->nullable();
                $table->string('version',20)->nullable();

                $table->integer('app_created_by')->unsigned()->nullable()->comment('Foreign key');
                $table->index('app_created_by');
                $table->foreign('app_created_by')
                        ->references('id')->on('users')
                        ->onDelete('SET NULL');

                $table->integer('app_updated_by')->unsigned()->nullable()->comment('Foreign key');
                $table->index('app_updated_by');
                $table->foreign('app_updated_by')
                        ->references('id')->on('users')
                        ->onDelete('SET NULL');

                $table->timestamps();
                $table->enum('status',['1','2','3','4'])->default('1')->comment('1=>active, 2=>inactive, 3=>deleted, 4=>Not selected');
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
        Schema::dropIfExists('app_basic');
    }
}
