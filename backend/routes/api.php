<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CitizenController;
use App\Http\Controllers\DemandeController;
use App\Http\Controllers\DashboardController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::apiResource('citizens', CitizenController::class);
    Route::apiResource('demandes', DemandeController::class);
    Route::patch('/demandes/{id}/statut', [DemandeController::class, 'updateStatut']);
});