<?php

namespace App\Services;

use App\Models\Customer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CustomerService
{
    /**
     * Obtiene los clientes de un usuario con paginación
     */
    public function getByUserId(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return Customer::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Obtiene todos los clientes de un usuario sin paginación (para exportación, etc.)
     */
    public function getAllByUserId(int $userId): Collection
    {
        return Customer::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function create(array $data): Customer
    {
        return Customer::create($data);
    }

    public function update(Customer $customer, array $data): Customer
    {
        $customer->update($data);

        return $customer->fresh();
    }

    public function delete(Customer $customer): bool
    {
        return $customer->delete();
    }

    public function findById(int $id): ?Customer
    {
        return Customer::find($id);
    }
}

