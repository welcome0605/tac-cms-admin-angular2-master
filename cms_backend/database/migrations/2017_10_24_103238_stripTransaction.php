<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class StripTransaction extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        if(!Schema::hasTable('strip_transaction'))
        {
            Schema::create('strip_transaction', function (Blueprint $table)
            {
                $table->increments('id')->comment('Primary Key');
                $table->integer('pkg_id')->unsigned();
                $table->foreign('pkg_id')
                            ->references('id')
                            ->on('strip_packages')
                            ->onDelete('cascade');

                $table->integer('user_id')->unsigned();
                $table->foreign('user_id')
                        ->references('id')
                        ->on('users')
                        ->onDelete('cascade');

                $table->string('is_refer',100)->nullable()->comment('name of referer businesses');

                $table->string('st_id')->comment('transaction id');
                $table->string('st_object')->comment('transaction object');
                $table->integer('st_amount')->comment('transaction charge amount');
                $table->string('st_balance_transaction')->comment('balance transaction token');
                $table->timestamp('st_created')->comment('transaction creation date');
                $table->string('st_currency')->comment('transaction charge currency');
                $table->string('st_source_id')->comment('transaction source id');
                $table->string('st_source_object')->comment('transaction source object');
                $table->string('st_source_name')->comment('transaction source name');
                $table->string('st_status')->comment('transaction status');

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
        //
        Schema::dropIfExists('strip_transaction');
    }
}
