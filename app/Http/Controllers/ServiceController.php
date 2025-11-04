<?php

namespace App\Http\Controllers;

use App\Services\JsonPlaceholderService;
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
        $perPage = $request->input('per_page', 10);
        $page = $request->input('page', 1);

        // Obtener posts de JSONPlaceholder
        $posts = $this->jsonPlaceholderService->getPosts();

        // Implementar paginación manual
        $total = count($posts);
        $offset = ($page - 1) * $perPage;
        $paginatedPosts = array_slice($posts, $offset, $perPage);

        return Inertia::render('services/index', [
            'posts' => [
                'data' => $paginatedPosts,
                'current_page' => (int) $page,
                'per_page' => (int) $perPage,
                'total' => $total,
                'last_page' => (int) ceil($total / $perPage),
            ],
        ]);
    }

    /**
     * Almacena una nueva publicación
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'userId' => ['required', 'integer'],
        ]);

        $this->jsonPlaceholderService->createPost([
            'title' => $request->input('title'),
            'body' => $request->input('body'),
            'userId' => $request->input('userId'),
        ]);

        return redirect()->route('services.index')
            ->with('success', 'Publicación creada correctamente.');
    }

    /**
     * Actualiza una publicación existente
     */
    public function update(Request $request, int $id)
    {
        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'userId' => ['required', 'integer'],
        ]);

        $this->jsonPlaceholderService->updatePost($id, [
            'title' => $request->input('title'),
            'body' => $request->input('body'),
            'userId' => $request->input('userId'),
        ]);

        return redirect()->route('services.index', ['page' => $request->input('page', 1)])
            ->with('success', 'Publicación actualizada correctamente.');
    }

    /**
     * Elimina una publicación
     */
    public function destroy(Request $request, int $id)
    {
        $this->jsonPlaceholderService->deletePost($id);

        return redirect()->route('services.index', ['page' => $request->input('page', 1)])
            ->with('success', 'Publicación eliminada correctamente.');
    }
}
