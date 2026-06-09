<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        User::updateOrCreate(
            ['email' => 'admin@commune.ma'],
            [
                'name' => 'Administrateur',
                'email' => 'admin@commune.ma',
                'password' => Hash::make('admin123'),
            ]
        );
        
        $this->command->info('✅ تم إنشاء حساب المشرف');
        $this->command->info('📧 admin@commune.ma');
        $this->command->info('🔑 admin123');
    }
}