<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'rfc' => 'XAXX010101000',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        // Ejecutar seeder de clientes para generar datos de prueba
        $this->call([
            CustomerSeeder::class,
        ]);
    }
}
