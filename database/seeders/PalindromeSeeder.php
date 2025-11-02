<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * DEPRECADO: Este seeder no tiene sentido.
 * Las verificaciones de funcionalidad deben hacerse con tests (Pest/PHPUnit).
 * Ver: tests/Unit/PalindromeServiceTest.php
 */
class PalindromeSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->warn('⚠️  Este seeder está deprecado.');
        $this->command->info('Las pruebas de funcionalidad deben ejecutarse con: php artisan test');
    }
}
