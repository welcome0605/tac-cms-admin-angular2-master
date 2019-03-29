<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class AnalyticsModel extends Model
{
    //
    use Notifiable;

    protected $table = 'analytics_record';

    protected $fillable = [
        'app_id', 'platform', 'device_type'
    ];

    protected $hidden = [
        'bundle_id', 'item_id', 'install', 'launch', 'close', 'platform', 'device_type',
        'item_name', 'item_type', 'locale', 'location_lat', 'location_lon'
    ];
}
