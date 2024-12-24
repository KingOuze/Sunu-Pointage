<?php

namespace App\Models;

use Mongodb\Laravel\Eloquent\Model;

class Carte extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'cartes';

    protected $fillable = ['cardId', 'utilisateur_id'];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class);
    }

    public function verifierCarte()
    {
        // Implémentation de la vérification de carte
    }
}
