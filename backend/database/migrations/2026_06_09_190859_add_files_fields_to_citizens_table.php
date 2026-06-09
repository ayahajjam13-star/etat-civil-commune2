<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('citizens', function (Blueprint $table) {
            $table->string('photo')->nullable()->after('telephone');
            $table->json('documents')->nullable()->after('photo');
        });
    }

    public function down()
    {
        Schema::table('citizens', function (Blueprint $table) {
            $table->dropColumn(['photo', 'documents']);
        });
    }
};