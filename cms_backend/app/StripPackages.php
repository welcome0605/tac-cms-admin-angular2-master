<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class StripPackages extends Model
{
    //
    protected $table = 'strip_packages';
    protected $guarded = [];

    public function getActivePackages()
    {
        # code...
        return StripPackages::where('status',1)->get();
    }
    public function getActivePackagesById($id)
    {
        # code...
        return StripPackages::where('id',$id)->where('status',1)->first();
    }
    public function getActivePackagesByUniqueId($id)
    {
        # code...
        return StripPackages::where('unique_id',$id)->where('status',1)->first();
    }
}
