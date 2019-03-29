<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateContactUsTicket extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contact_us_ticket', function (Blueprint $table) {
            $table->increments('ticket_id');
            $table->integer('user_id')->unsigned();
            $table->string('sender_name');
            $table->string('subject');
            $table->string('body');
            $table->string('department');
            $table->integer('priority');
                // 0 : high
                // 1 : normal
                // 2 : low
            $table->string('attach_ticket_url');
            $table->integer('state');
                // 0 : open state
                // 1 : closed state
                // 2 : new reply state
                // 3 : all state
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contact_us_ticket');
    }
}
