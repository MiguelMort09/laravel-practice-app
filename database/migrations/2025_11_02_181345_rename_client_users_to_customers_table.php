<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::rename('client_users', 'customers');
    }

    public function down(): void
    {
        Schema::rename('customers', 'client_users');
    }
};
