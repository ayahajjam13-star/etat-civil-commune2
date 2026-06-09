<?php

namespace App\Http\Controllers;

use App\Models\Citizen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CitizenController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Citizen::query();
            
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('cin', 'like', "%{$search}%")
                      ->orWhere('nom', 'like', "%{$search}%")
                      ->orWhere('prenom', 'like', "%{$search}%");
                });
            }
            
            $citizens = $query->orderBy('created_at', 'desc')->paginate(10);
            
            return response()->json([
                'success' => true,
                'data' => $citizens
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'cin' => 'required|unique:citizens,cin',
                'nom' => 'required|string|max:100',
                'prenom' => 'required|string|max:100',
                'date_naissance' => 'required|date',
                'lieu_naissance' => 'required|string|max:100',
                'adresse' => 'required|string',
                'telephone' => 'required|string|max:20',
                'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'documents' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->except(['photo', 'documents']);
            
            // Gérer la photo
            if ($request->hasFile('photo')) {
                $photo = $request->file('photo');
                $photoName = time() . '_' . uniqid() . '.' . $photo->getClientOriginalExtension();
                $photo->move(public_path('uploads/photos'), $photoName);
                $data['photo'] = 'uploads/photos/' . $photoName;
            }
            
            // Gérer les documents (JSON)
            if ($request->has('documents') && !empty($request->documents)) {
                $data['documents'] = json_decode($request->documents, true);
            }

            $citizen = Citizen::create($data);

            return response()->json([
                'success' => true,
                'data' => $citizen,
                'message' => 'تم إضافة المواطن بنجاح'
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
            $citizen = Citizen::with('demandes')->find($id);
            if (!$citizen) {
                return response()->json(['success' => false, 'message' => 'المواطن غير موجود'], 404);
            }
            return response()->json(['success' => true, 'data' => $citizen]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $citizen = Citizen::find($id);
            if (!$citizen) {
                return response()->json(['success' => false, 'message' => 'المواطن غير موجود'], 404);
            }

            $validator = Validator::make($request->all(), [
                'cin' => 'required|unique:citizens,cin,' . $id,
                'nom' => 'required|string|max:100',
                'prenom' => 'required|string|max:100',
                'date_naissance' => 'required|date',
                'lieu_naissance' => 'required|string|max:100',
                'adresse' => 'required|string',
                'telephone' => 'required|string|max:20',
                'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'documents' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            }

            $data = $request->except(['photo', 'documents']);
            
            // Gérer la photo
            if ($request->hasFile('photo')) {
                // Supprimer l'ancienne photo
                if ($citizen->photo && file_exists(public_path($citizen->photo))) {
                    unlink(public_path($citizen->photo));
                }
                $photo = $request->file('photo');
                $photoName = time() . '_' . uniqid() . '.' . $photo->getClientOriginalExtension();
                $photo->move(public_path('uploads/photos'), $photoName);
                $data['photo'] = 'uploads/photos/' . $photoName;
            }
            
            // Gérer les documents (JSON)
            if ($request->has('documents') && !empty($request->documents)) {
                $data['documents'] = json_decode($request->documents, true);
            }

            $citizen->update($data);
            return response()->json(['success' => true, 'data' => $citizen, 'message' => 'تم التعديل بنجاح']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $citizen = Citizen::find($id);
            if (!$citizen) {
                return response()->json(['success' => false, 'message' => 'المواطن غير موجود'], 404);
            }
            
            // Supprimer la photo
            if ($citizen->photo && file_exists(public_path($citizen->photo))) {
                unlink(public_path($citizen->photo));
            }
            
            $citizen->demandes()->delete();
            $citizen->delete();
            return response()->json(['success' => true, 'message' => 'تم الحذف بنجاح']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}