<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['status' => 'ok']);
});

Route::get('/login', function () {
    return response()->json(['message' => 'Please use the frontend to login'], 200);
})->name('login');
