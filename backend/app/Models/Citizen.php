<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Citizen extends Model
{
    protected $table = 'citizens';
    
    protected $fillable = [
        'cin',
        'nom',
        'prenom',
        'date_naissance',
        'lieu_naissance',
        'adresse',
        'telephone',
        'photo',
        'documents'
    ];

    protected $casts = [
        'date_naissance' => 'date',
        'documents' => 'array'
    ];

    public function demandes()
    {
        return $this->hasMany(Demande::class, 'citoyen_id');
    }
}