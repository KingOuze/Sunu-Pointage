<?php

namespace App\Models;

use Mongodb\Laravel\Eloquent\Model;

class Utilisateur extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'utilisateurs';

    protected $fillable = ['nom', 'prenom', 'photo', 'email', 'adresse', 'telephone', 'role', 'matricule', 'status', 'cardId', 'password', 'fonction', 'departement', 'cohorte'];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Mutator pour hacher le mot de passe
    public function setPasswordAttribute($password)
    {
        $this->attributes['password'] = bcrypt($password);
    }
    

    public function carte()
    {
        return $this->hasOne(Carte::class);
    }

    public function pointages()
    {
        return $this->hasMany(Pointage::class);
    }
}
