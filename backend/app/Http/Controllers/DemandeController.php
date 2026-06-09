<?php

namespace App\Http\Controllers;

use App\Models\Demande;
use App\Models\Citizen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DemandeController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Demande::with('citoyen');
            if ($request->has('statut') && $request->statut) {
                $query->where('statut', $request->statut);
            }
            $demandes = $query->orderBy('created_at', 'desc')->paginate(10);
            return response()->json(['success' => true, 'data' => $demandes]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'citoyen_id' => 'required|exists:citizens,id',
                'type_demande' => 'required|in:شهادة الميلاد,نسخة كاملة,شهادة الإقامة,شهادة الوفاة,شهادة الزواج,بطاقة التعريف الوطنية,جواز السفر,شهادة السكنى,شهادة العمل,شهادة التسجيل',
                'date_demande' => 'required|date',
                'statut' => 'required|in:En attente,Validée,Refusée'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false, 
                    'errors' => $validator->errors()
                ], 422);
            }

            $demande = Demande::create([
                'citoyen_id' => $request->citoyen_id,
                'type_demande' => $request->type_demande,
                'date_demande' => $request->date_demande,
                'statut' => $request->statut
            ]);

            return response()->json([
                'success' => true, 
                'data' => $demande->load('citoyen'), 
                'message' => 'تم الإضافة بنجاح'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false, 
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $demande = Demande::with('citoyen')->find($id);
            if (!$demande) {
                return response()->json(['success' => false, 'message' => 'الطلب غير موجود'], 404);
            }
            return response()->json(['success' => true, 'data' => $demande]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $demande = Demande::find($id);
            if (!$demande) {
                return response()->json(['success' => false, 'message' => 'الطلب غير موجود'], 404);
            }

            $validator = Validator::make($request->all(), [
                'citoyen_id' => 'required|exists:citizens,id',
                'type_demande' => 'required|in:شهادة الميلاد,نسخة كاملة,شهادة الإقامة,شهادة الوفاة,شهادة الزواج,بطاقة التعريف الوطنية,جواز السفر,شهادة السكنى,شهادة العمل,شهادة التسجيل',
                'date_demande' => 'required|date',
                'statut' => 'required|in:En attente,Validée,Refusée'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false, 
                    'errors' => $validator->errors()
                ], 422);
            }

            $demande->update([
                'citoyen_id' => $request->citoyen_id,
                'type_demande' => $request->type_demande,
                'date_demande' => $request->date_demande,
                'statut' => $request->statut
            ]);

            return response()->json([
                'success' => true, 
                'data' => $demande->load('citoyen'), 
                'message' => 'تم التعديل بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $demande = Demande::find($id);
            if (!$demande) {
                return response()->json(['success' => false, 'message' => 'الطلب غير موجود'], 404);
            }
            $demande->delete();
            return response()->json(['success' => true, 'message' => 'تم الحذف بنجاح']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function updateStatut(Request $request, $id)
    {
        try {
            $demande = Demande::find($id);
            if (!$demande) {
                return response()->json(['success' => false, 'message' => 'الطلب غير موجود'], 404);
            }

            $validator = Validator::make($request->all(), [
                'statut' => 'required|in:En attente,Validée,Refusée'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false, 
                    'errors' => $validator->errors()
                ], 422);
            }

            $demande->update(['statut' => $request->statut]);
            return response()->json([
                'success' => true, 
                'data' => $demande, 
                'message' => 'تم تحديث الحالة بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}