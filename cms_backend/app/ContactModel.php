<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ContactModel extends Model
{
    //
    protected $table = 'contact_us_ticket';
	protected $primaryKey = 'ticket_id';
}
