<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Demande extends Model
{
    protected $table = 'demandes';
    
    protected $fillable = [
        'citoyen_id', 'type_demande', 'date_demande', 'statut'
    ];

    protected $casts = [
        'date_demande' => 'date',
    ];

    public function citoyen()
    {
        return $this->belongsTo(Citizen::class, 'citoyen_id');
    }
}