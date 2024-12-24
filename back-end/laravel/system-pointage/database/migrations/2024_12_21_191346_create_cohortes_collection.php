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
        DB::connection('mongodb')->collection('cohortes')->insert([
            'nom' => 'Cohorte 2024',
        ]);
    }

    public function down()
    {
        DB::connection('mongodb')->getMongoDB()->dropCollection('cohortes');    }
};
