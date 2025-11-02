<?php

use App\Models\Customer;
use App\Models\User;
use App\Services\CustomerService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->service = new CustomerService();
    $this->user = User::factory()->create();
});

describe('getByUserId', function () {
    it('retorna los clientes paginados de un usuario', function () {
        // Crear 20 clientes para el usuario
        Customer::factory()->count(20)->forUser($this->user)->create();

        $result = $this->service->getByUserId($this->user->id, 10);

        expect($result)->toBeInstanceOf(\Illuminate\Pagination\LengthAwarePaginator::class)
            ->and($result->total())->toBe(20)
            ->and($result->perPage())->toBe(10)
            ->and($result->count())->toBe(10); // Primera página tiene 10
    });

    it('ordena los clientes por fecha de creación descendente', function () {
        $old = Customer::factory()->forUser($this->user)->create(['created_at' => now()->subDays(2)]);
        $recent = Customer::factory()->forUser($this->user)->create(['created_at' => now()]);

        $result = $this->service->getByUserId($this->user->id);

        expect($result->first()->id)->toBe($recent->id);
    });

    it('no retorna clientes de otros usuarios', function () {
        $otherUser = User::factory()->create();
        Customer::factory()->count(5)->forUser($otherUser)->create();
        Customer::factory()->count(3)->forUser($this->user)->create();

        $result = $this->service->getByUserId($this->user->id);

        expect($result->total())->toBe(3);
    });

    it('respeta el parámetro perPage', function () {
        Customer::factory()->count(30)->forUser($this->user)->create();

        $result = $this->service->getByUserId($this->user->id, 25);

        expect($result->perPage())->toBe(25)
            ->and($result->count())->toBe(25);
    });
});

describe('getAllByUserId', function () {
    it('retorna todos los clientes sin paginación', function () {
        Customer::factory()->count(50)->forUser($this->user)->create();

        $result = $this->service->getAllByUserId($this->user->id);

        expect($result)->toBeInstanceOf(\Illuminate\Database\Eloquent\Collection::class)
            ->and($result->count())->toBe(50);
    });
});

describe('create', function () {
    it('crea un nuevo cliente', function () {
        $data = [
            'user_id' => $this->user->id,
            'name' => 'Test Company',
            'rfc' => 'TEST123456ABC',
            'address' => '123 Test St',
            'phone' => '1234567890',
            'website' => 'https://test.com',
        ];

        $customer = $this->service->create($data);

        expect($customer)->toBeInstanceOf(Customer::class)
            ->and($customer->user_id)->toBe($this->user->id)
            ->and($customer->name)->toBe('Test Company');
    });
});

describe('update', function () {
    it('actualiza un cliente existente', function () {
        $customer = Customer::factory()->forUser($this->user)->create([
            'name' => 'Old Name',
        ]);

        $updated = $this->service->update($customer, [
            'name' => 'New Name',
            'rfc' => 'NEW123456ABC',
        ]);

        expect($updated->name)->toBe('New Name')
            ->and($updated->rfc)->toBe('NEW123456ABC');
    });

    it('retorna el modelo actualizado', function () {
        $customer = Customer::factory()->forUser($this->user)->create();
        
        $updated = $this->service->update($customer, ['name' => 'Updated']);

        expect($updated->wasRecentlyCreated)->toBeFalse()
            ->and($updated->wasChanged())->toBeFalse(); // fresh() limpia los cambios
    });
});

describe('delete', function () {
    it('elimina un cliente', function () {
        $customer = Customer::factory()->forUser($this->user)->create();

        $result = $this->service->delete($customer);

        expect($result)->toBeTrue()
            ->and(Customer::find($customer->id))->toBeNull();
    });
});

describe('findById', function () {
    it('encuentra un cliente por ID', function () {
        $customer = Customer::factory()->forUser($this->user)->create();

        $found = $this->service->findById($customer->id);

        expect($found)->toBeInstanceOf(Customer::class)
            ->and($found->id)->toBe($customer->id);
    });

    it('retorna null si no existe', function () {
        $found = $this->service->findById(99999);

        expect($found)->toBeNull();
    });
});
