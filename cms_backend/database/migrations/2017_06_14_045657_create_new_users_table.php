<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNewUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('users'))
        {
            Schema::create('users', function (Blueprint $table) 
            {
                $table->increments('id')->comment('Primary key');
                
                $table->integer('role_id')->unsigned()->nullable()->comment('Foreign key');
                $table->index('role_id');
                $table->foreign('role_id')
                        ->references('id')->on('role')
                        ->onDelete('SET NULL');
                
                $table->string('first_name',100)->nullable();
                $table->string('last_name',100)->nullable();
                $table->string('email',100)->unique();
                $table->string('password',255)->nullable();
                $table->integer('otp')->default('0');
                $table->string('photo',255)->nullable();

                $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
}
