<?php

namespace App\Http\Controllers;

use App\Models\Citizen;
use App\Models\Demande;

class DashboardController extends Controller
{
    public function stats()
    {
        try {
            return response()->json([
                'success' => true,
                'data' => [
                    'total_citizens' => Citizen::count(),
                    'total_demandes' => Demande::count(),
                    'demandes_en_attente' => Demande::where('statut', 'En attente')->count(),
                    'demandes_validees' => Demande::where('statut', 'Validée')->count()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}