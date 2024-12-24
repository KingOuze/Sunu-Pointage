<?php

namespace App\Models;

use Mongodb\Laravel\Eloquent\Model;

class Cohorte extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'cohortes';

    protected $fillable = ['nom'];

   
}
