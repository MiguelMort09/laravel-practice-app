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

        // Obtener posts creados localmente
        $localPosts = session('local_posts', []);

        // Obtener posts editados localmente (ID => post)
        $editedPosts = session('edited_posts', []);

        // Obtener IDs de posts eliminados
        $deletedPostIds = session('deleted_posts', []);

        // Obtener posts de JSONPlaceholder
        $apiPosts = $this->jsonPlaceholderService->getPosts();

        // Filtrar posts eliminados
        $apiPosts = array_filter($apiPosts, function ($post) use ($deletedPostIds) {
            // Si fue eliminado, no mostrarlo
            return !in_array($post['id'], $deletedPostIds);
        });

        // Reemplazar posts editados
        $apiPosts = array_map(function ($post) use ($editedPosts) {
            return $editedPosts[$post['id']] ?? $post;
        }, $apiPosts);

        // Combinar: primero posts locales (nuevos), luego posts de API (editados o no)
        $allPosts = array_merge($localPosts, array_values($apiPosts));

        // Implementar paginación manual
        $total = count($allPosts);
        $offset = ($page - 1) * $perPage;
        $paginatedPosts = array_slice($allPosts, $offset, $perPage);

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

        // JSONPlaceholder siempre devuelve id: 101 para posts nuevos
        // Usamos un ID temporal negativo para evitar conflictos
        $localPosts = session('local_posts', []);
        $tempId = empty($localPosts) ? -1 : min(array_column($localPosts, 'id')) - 1;

        $newPost = [
            'id' => $tempId,
            'title' => $request->input('title'),
            'body' => $request->input('body'),
            'userId' => $request->input('userId'),
        ];

        // Guardar en sesión para persistencia local
        array_unshift($localPosts, $newPost);
        session(['local_posts' => $localPosts]);

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

        $updatedPost = [
            'id' => $id,
            'title' => $request->input('title'),
            'body' => $request->input('body'),
            'userId' => $request->input('userId'),
        ];

        // Si el ID es negativo, es un post local creado por nosotros
        if ($id < 0) {
            $localPosts = session('local_posts', []);
            foreach ($localPosts as $key => $post) {
                if ($post['id'] === $id) {
                    $localPosts[$key] = $updatedPost;
                    break;
                }
            }
            session(['local_posts' => $localPosts]);
        } else {
            // Si es un post de JSONPlaceholder, guardarlo en posts editados
            $editedPosts = session('edited_posts', []);
            $editedPosts[$id] = $updatedPost;
            session(['edited_posts' => $editedPosts]);
        }

        return redirect()->route('services.index', ['page' => $request->input('page', 1)])
            ->with('success', 'Publicación actualizada correctamente.');
    }

    /**
     * Elimina una publicación
     */
    public function destroy(Request $request, int $id)
    {
        // Si el ID es negativo, es un post local
        if ($id < 0) {
            $localPosts = session('local_posts', []);
            $localPosts = array_filter($localPosts, fn ($post) => $post['id'] !== $id);
            session(['local_posts' => array_values($localPosts)]);
        } else {
            // Si es un post de JSONPlaceholder, agregarlo a la lista de eliminados
            $deletedPosts = session('deleted_posts', []);
            if (! in_array($id, $deletedPosts)) {
                $deletedPosts[] = $id;
            }
            session(['deleted_posts' => $deletedPosts]);

            // También eliminar de posts editados si existe
            $editedPosts = session('edited_posts', []);
            unset($editedPosts[$id]);
            session(['edited_posts' => $editedPosts]);
        }

        return redirect()->route('services.index', ['page' => $request->input('page', 1)])
            ->with('success', 'Publicación eliminada correctamente.');
    }
}
