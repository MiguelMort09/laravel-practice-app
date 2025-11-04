<?php

namespace App\Http\Controllers;

use App\Http\Requests\Post\StorePostRequest;
use App\Http\Requests\Post\UpdatePostRequest;
use App\Services\JsonPlaceholderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function __construct(
        private JsonPlaceholderService $jsonPlaceholderService
    ) {}

    /**
     * Muestra el listado de publicaciones con paginación
     */
    public function index(Request $request): Response
    {
        $page = (int) $request->input('page', 1);

        // Toda la lógica va en el servicio
        $posts = $this->jsonPlaceholderService->getPostsWithPagination($page);

        return Inertia::render('services/index', [
            'posts' => $posts,
        ]);
    }

    /**
     * Almacena una nueva publicación
     */
    public function store(StorePostRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        // El servicio maneja la creación y sincronización
        $this->jsonPlaceholderService->storePost($validated);

        return redirect()->route('services.index')
            ->with('success', 'Publicación creada correctamente.');
    }

    /**
     * Actualiza una publicación existente
     */
    public function update(UpdatePostRequest $request, int $id): RedirectResponse
    {
        $validated = $request->validated();
        $currentPage = (int) $request->input('page', 1);

        // El servicio maneja la actualización y sincronización
        $this->jsonPlaceholderService->updatePostAndSync($id, $validated);

        return redirect()->route('services.index', ['page' => $currentPage])
            ->with('success', 'Publicación actualizada correctamente.');
    }

    /**
     * Elimina una publicación
     */
    public function destroy(Request $request, int $id): RedirectResponse
    {
        $currentPage = (int) $request->input('page', 1);

        // El servicio maneja la eliminación y sincronización
        $this->jsonPlaceholderService->deletePostAndSync($id);

        return redirect()->route('services.index', ['page' => $currentPage])
            ->with('success', 'Publicación eliminada correctamente.');
    }
}
