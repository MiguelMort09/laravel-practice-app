<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Seeder;
use Random\RandomException;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * @throws RandomException
     */
    public function run(): void
    {
        // Obtener todos los usuarios existentes
        $users = User::all();

        if ($users->isEmpty()) {
            // Si no hay usuarios, crear uno de prueba
            $user = User::factory()->create([
                'email' => 'customer-test@example.com',
                'name' => 'Customer Test User',
                'rfc' => 'CUTU800101ABC',
            ]);
            $users = collect([$user]);
        }

        // Crear clientes para cada usuario
        foreach ($users as $user) {
            // Crear entre 5 y 15 clientes por usuario para probar la paginación
            Customer::factory()
                ->count(random_int(10, 25))
                ->forUser($user)
                ->create();

            // Crear algunos clientes mínimos (sin datos opcionales)
            Customer::factory()
                ->count(random_int(2, 5))
                ->forUser($user)
                ->minimal()
                ->create();
        }

        $this->command->info('✅ Customers creados exitosamente para ' . $users->count() . ' usuarios.');
    }
}
