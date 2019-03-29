<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class StripPacakages extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('strip_packages'))
        {
            Schema::create('strip_packages', function (Blueprint $table)
            {
                $table->increments('id')->comment('Primary Key');
                $table->string('unique_id', 15)->comment('Unique Id')->nullable();
                $table->string('pa_name', 255)->comment('Package name')->nullable();
                $table->longText('pa_desc')->comment('Package description');
                $table->integer('pa_price')->comment('Package price');

                $table->integer('sub_charge')->comment('Subscription charge for package');

                $table->string('sub_id')->comment('Subscription unique identifier');

                $table->string('sub_name')->comment('Subscription name');

                $table->enum('status',['1','2','3'])->default('1')->comment('1=>active, 2=>inactive, 3=>deleted');
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
        Schema::dropIfExists('strip_packages');
    }
}
