<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php', // Assurez-vous que ce fichier existe
        api: null, // L'API a été supprimée, donc cela peut être mis à `null`
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function () {
        // Nettoyer les références aux middlewares ou alias non utilisés
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();