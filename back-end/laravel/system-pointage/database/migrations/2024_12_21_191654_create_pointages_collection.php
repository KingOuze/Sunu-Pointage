<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        DB::connection('mongodb')->collection('pointages')->insert([
            'date' => now(),
            'heureDebut' => '08:00:00',
            'heureFin' => '17:00:00',
            'etat' => 'validé',
            'utilisateur_id' => null, // ID d'un utilisateur à associer ultérieurement
        ]);
    }

    public function down()
    {
        DB::connection('mongodb')->getMongoDB()->dropCollection('pointages');
    }
};
