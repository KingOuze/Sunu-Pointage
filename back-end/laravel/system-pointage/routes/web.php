<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return 'welcome';
});


Route::get('/login', function () {
    return "Welcome";
});