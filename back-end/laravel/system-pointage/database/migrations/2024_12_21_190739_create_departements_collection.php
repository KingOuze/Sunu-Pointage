<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Création de la collection
        DB::connection('mongodb')->collection('departements')->insert([
            'nom' => 'Informatique',
            'description' => 'sroefle,jpojergope',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::connection('mongodb')->getMongoDB()->dropCollection('departements');    }
};
