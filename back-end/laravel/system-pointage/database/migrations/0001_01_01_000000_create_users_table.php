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
            Schema::connection('mongodb')->create('users', function ($collection) {
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
        

    
        }


        public function down()
        {
            Schema::connection('mongodb')->drop('users');
        }
};