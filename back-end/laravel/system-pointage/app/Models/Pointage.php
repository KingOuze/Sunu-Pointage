<?php

namespace App\Models;

use Mongodb\Laravel\Eloquent\Model;


class Pointage extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'pointages';

    protected $fillable = ['date', 'heureDebut', 'heureFin', 'etat', 'utilisateur_id'];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class);
    }
}
