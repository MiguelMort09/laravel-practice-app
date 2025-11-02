<?php

namespace App\Http\Controllers;

use App\Http\Requests\Customer\StoreCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use App\Services\CustomerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function __construct(
        private CustomerService $customerService
    ) {
    }

    /**
     * Muestra el listado de clientes del usuario autenticado con paginación
     */
    public function index(Request $request): Response
    {
        // Obtener el número de elementos por página desde la petición (default: 15)
        $perPage = $request->input('per_page', 15);
        
        // Validar que per_page sea un número válido
        $perPage = in_array($perPage, [10, 15, 25, 50, 100]) ? $perPage : 15;

        $customers = $this->customerService->getByUserId(
            $request->user()->id,
            $perPage
        );

        return Inertia::render('customers/index', [
            'customers' => $customers,
            'filters' => [
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Almacena un nuevo cliente
     */
    public function store(StoreCustomerRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['user_id'] = $request->user()->id;

        $this->customerService->create($validated);

        return redirect()->route('customers.index')
            ->with('success', 'Cliente creado correctamente.');
    }

    /**
     * Actualiza un cliente existente
     */
    public function update(UpdateCustomerRequest $request, int $id): RedirectResponse
    {
        $customer = $this->customerService->findById($id);

        if (! $customer || $customer->user_id !== $request->user()->id) {
            abort(404);
        }

        $this->customerService->update($customer, $request->validated());

        return redirect()->route('customers.index')
            ->with('success', 'Cliente actualizado correctamente.');
    }

    /**
     * Elimina un cliente
     */
    public function destroy(Request $request, int $id): RedirectResponse
    {
        $customer = $this->customerService->findById($id);

        if (! $customer || $customer->user_id !== $request->user()->id) {
            abort(404);
        }

        $this->customerService->delete($customer);

        return redirect()->route('customers.index')
            ->with('success', 'Cliente eliminado correctamente.');
    }
}
