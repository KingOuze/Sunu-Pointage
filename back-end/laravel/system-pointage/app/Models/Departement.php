<?php

namespace App\Models;

use Mongodb\Laravel\Eloquent\Model;

class Departement extends Model
{
    
    protected $connection = 'mongodb';
    protected $collection = 'departements';

    protected $fillable = ['nom','dateDebut','dateFin'];

}
