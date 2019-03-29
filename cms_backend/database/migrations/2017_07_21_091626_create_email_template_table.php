<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmailTemplateTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('email_template'))
        {
            Schema::create('email_template', function (Blueprint $table) 
            {  
                $table->increments('id')->comment('Primary Key');
                $table->string('et_name', 255)->nullable();
                $table->string('et_pseudo_name', 255)->nullable();
                $table->string('et_subject', 255)->nullable();
                $table->longText('et_body')->nullable(); 
                $table->integer('readable')->default(0)->comment('0=>unread, 1=>read');
                $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
                $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
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
        Schema::dropIfExists('email_template');
    }
}
