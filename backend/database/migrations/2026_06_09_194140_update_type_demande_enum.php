<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // تغيير نوع العمود إلى string مؤقتاً
        DB::statement("ALTER TABLE demandes MODIFY type_demande VARCHAR(50)");
        
        // تحديث القيم الموجودة من الفرنسية إلى العربية
        DB::statement("UPDATE demandes SET type_demande = 'شهادة الميلاد' WHERE type_demande = 'Acte de naissance'");
        DB::statement("UPDATE demandes SET type_demande = 'نسخة كاملة' WHERE type_demande = 'Copie intégrale'");
        DB::statement("UPDATE demandes SET type_demande = 'شهادة الإقامة' WHERE type_demande = 'Certificat de résidence'");
    }

    public function down()
    {
        DB::statement("UPDATE demandes SET type_demande = 'Acte de naissance' WHERE type_demande = 'شهادة الميلاد'");
        DB::statement("UPDATE demandes SET type_demande = 'Copie intégrale' WHERE type_demande = 'نسخة كاملة'");
        DB::statement("UPDATE demandes SET type_demande = 'Certificat de résidence' WHERE type_demande = 'شهادة الإقامة'");
    }
};