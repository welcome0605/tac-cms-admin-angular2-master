<?php

use Illuminate\Database\Seeder;

class EmailTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    	DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('email_template')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        //gjc
        DB::table('email_template')->insert(
        	[
	            'et_name' => "AppPublish Template",
	            'et_pseudo_name' => "apppublish_template",
	            'et_subject' => "App publish request - First time",
	            'et_body' => "<p>User [toUser] [toEmail] has initiated process to publish App [toApp] for the first time.<br></p><p></p>",
	            'readable' => 0,
	            'status' => 1
        	]
        );

        DB::table('email_template')->insert(
        	[
	            'et_name' => "Custom Inquiry",
	            'et_pseudo_name' => "custom_inquiry",
	            'et_subject' => "Inquiry",
	            'et_body' => "<p><b>Inquiry Details:</b></p><p><b>Name </b>: [inName]</p><p><b>Email </b>: [inEmail]</p><p><b>Budget</b> : [inBudget]</p><p><b>App Description </b>: [inAppDesc]<br></p><p><br></p><p></p>",
	            'readable' => 0,
	            'status' => 1
        	]
        );

        DB::table('email_template')->insert(
        	[
	            'et_name' => "Discussion Mail",
	            'et_pseudo_name' => "discussion_mail",
	            'et_subject' => "Conversation",
	            'et_body' => "<p><b>Conversation Details:</b></p><p><b>Name </b>: [userName]</p><p><b>Email </b>: [userEmail]</p><p><b>Message</b> : [userMsg]</p><p><b>Date</b>: [timeStamp]</p><p></p>",
	            'readable' => 0,
	            'status' => 1
        	]
        );

        DB::table('email_template')->insert(
        	[
	            'et_name' => "Otp Mail",
	            'et_pseudo_name' => "otp_mail",
	            'et_subject' => "OTP",
	            'et_body' => "<p>Dear [toName],</p>\n<p>We received a request to reset your account password.</p><p>Please enter the following <b>OTP</b> for the password reset::</p><p><b>[otp]</b><br><br></p>",
	            'readable' => 0,
	            'status' => 1
        	]
        );

        DB::table('email_template')->insert(
        	[
	            'et_name' => "Sign-up Success",
	            'et_pseudo_name' => "sign_up_success",
	            'et_subject' => "sign up success",
	            'et_body' => "<p>Dear [toName],</p><p>Your Purchase was Successful, for plan [setPlan].</p><p>Thank You For Connecting With Us.</p>",
	            'readable' => 0,
	            'status' => 1
        	]
        );

        DB::table('email_template')->insert(
            [
                'et_name' => "Password Reset",
                'et_pseudo_name' => "password_reset",
                'et_subject' => "Password Otp",
                'et_body' => "Password Reset.",
                'readable' => 0,
                'status' => 1
            ]
        );
    }
}
