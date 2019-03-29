<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAppAssignUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('app_assign_user'))
        {
            Schema::create('app_assign_user', function (Blueprint $table) 
            {
                $table->increments('id')->comment('Primary key');
                $table->integer('app_basic_id')->unsigned()->comment('Foreign key');
                $table->index('app_basic_id');
                $table->foreign('app_basic_id')
                        ->references('id')->on('app_basic')
                        ->onDelete('cascade');
                $table->integer('user_id')->unsigned()->comment('Foreign key');
                $table->index('user_id');
                $table->foreign('user_id')
                        ->references('id')->on('users')
                        ->onDelete('cascade');        
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
        Schema::dropIfExists('app_section');
    }
}
