<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::connection('mongodb')->create('utilisateurs', function ($collection) {
            $collection->index('nom');
            $collection->index('prenom');
            $collection->index('photo');
            $collection->index('email');
            $collection->index('adresse');
            $collection->index('telephone');
            $collection->index('role');
            $collection->index('matricule');
            $collection->index('status');
            $collection->index('cardId');
            $collection->index('password');
            $collection->index('fonction');
            $collection->index('departement');
            $collection->index('cohorte');
        });

        // Ajout de documents initiaux
        DB::connection('mongodb')->collection('utilisateurs')->insert([
            [
                'nom' => 'Admin',
                'prenom' => 'Super',
                'photo' => null,
                'email' => 'admin@example.com',
                'password' => bcrypt('admin123'),
                'adresse' => 'Adresse Admin',
                'telephone' => '123456789',
                'role' => 'admin',
                'matricule' => 'ADM001',
                'status' => 'actif',
            ],
            [
                'nom' => 'Employe',
                'prenom' => 'Tech',
                'photo' => null,
                'email' => 'employe@example.com',
                'adresse' => 'Adresse Employe',
                'telephone' => '987654321',
                'role' => 'employe',
                'matricule' => 'EMP001',
                'status' => 'actif',
                'fonction' => 'Technicien',
                'departement' => 'Informatique',
                'cardId' => 'emp001',
            ],
            [
                'nom' => 'Vigile',
                'prenom' => 'Securite',
                'photo' => null,
                'email' => 'vigile@example.com',
                'password' => bcrypt('vigile123'),
                'adresse' => 'Adresse Vigile',
                'telephone' => '1122334455',
                'role' => 'vigile',
                'matricule' => 'VIG001',
                'status' => 'actif',
            ],
            [
                'nom' => 'Apprenant',
                'prenom' => 'Etudiant',
                'photo' => null,
                'email' => 'apprenant@example.com',
                'adresse' => 'Adresse Apprenant',
                'telephone' => '5566778899',
                'role' => 'apprenant',
                'matricule' => 'APP001',
                'status' => 'actif',
                'cohorte' => '2024',
                'cardId' => 'app001',
            ],
        ]);
    }

    public function down()
    {
        Schema::connection('mongodb')->drop('utilisateurs');
    }
};
