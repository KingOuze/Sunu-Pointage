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
        DB::connection('mongodb')->collection('cartes')->insert([
            'cardId' => 'CARD123',
            'utilisateur_id' => null, // ID d'un utilisateur à associer ultérieurement
        ]);
    }

    public function down()
    {
        DB::connection('mongodb')->getMongoDB()->dropCollection('cartes');
    }
};
