<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStripeSubscriptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

         if(!Schema::hasTable('stripe_subscriptions'))
        {
        Schema::create('stripe_subscriptions', function (Blueprint $table) {
            
            $table->increments('id')->comment('Primary Key');

            $table->integer('user_id')->unsigned()->comment('foreign key');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->integer('pkg_id')->unsigned()->comment('foreign key');
            $table->foreign('pkg_id')->references('id')->on('strip_packages')->onDelete('cascade');
            $table->string('stripe_id')->comment('stripe customer id');
            $table->string('subscription_id')->comment('stripe subscription id');
            $table->tinyInteger('stripe_active')->comment('customer active status');
            $table->string('stripe_token')->comment('customer card token');
            $table->tinyInteger('stripe_payment_failure')->comment('flag status if payment fails');            
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
        Schema::dropIfExists('stripe_subscriptions');
    }
}
