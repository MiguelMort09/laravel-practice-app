<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class JsonPlaceholderService
{
    private string $baseUrl = 'https://jsonplaceholder.typicode.com';

    private const PER_PAGE = 10;

    /**
     * Obtiene todas las publicaciones con paginación, aplicando filtros de sesión
     *
     * @return array<string, mixed>
     */
    public function getPostsWithPagination(int $page = 1): array
    {
        // Obtener posts desde API
        $apiPosts = $this->getPosts();

        // Aplicar filtros de sesión
        $apiPosts = $this->applySessionFilters($apiPosts);

        // Combinar con posts locales
        $allPosts = $this->mergeLocalPosts($apiPosts);

        // Aplicar paginación
        return $this->paginatePosts($allPosts, $page);
    }

    /**
     * Obtiene todas las publicaciones desde la API
     *
     * @return array<int, array<string, mixed>>
     */
    public function getPosts(): array
    {
        $response = Http::get("{$this->baseUrl}/posts");

        return $response->json() ?? [];
    }

    /**
     * Crea una nueva publicación en la API y la guarda en sesión
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function storePost(array $data): array
    {
        // Crear en la API
        $newPost = $this->createPost($data);

        // Guardar en sesión para que aparezca al inicio
        $this->addToLocalPosts($newPost);

        return $newPost;
    }

    /**
     * Actualiza una publicación en la API y en sesión
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function updatePostAndSync(int $id, array $data): array
    {
        // Actualizar en la API
        $updatedPost = $this->updatePost($id, $data);

        // Guardar en sesión
        $this->saveToEditedPosts($id, $updatedPost);

        return $updatedPost;
    }

    /**
     * Elimina una publicación de la API y de sesión
     */
    public function deletePostAndSync(int $id): bool
    {
        // Eliminar de la API
        $deleted = $this->deletePost($id);

        if ($deleted) {
            $this->markAsDeleted($id);
        }

        return $deleted;
    }

    /**
     * Aplica filtros de sesión a los posts de la API
     *
     * @param  array<int, array<string, mixed>>  $apiPosts
     * @return array<int, array<string, mixed>>
     */
    private function applySessionFilters(array $apiPosts): array
    {
        // Obtener IDs de posts eliminados
        $deletedPostIds = session('deleted_posts', []);

        // Filtrar posts eliminados
        $apiPosts = array_filter($apiPosts, fn ($post) => ! in_array($post['id'], $deletedPostIds));

        // Obtener posts editados
        $editedPosts = session('edited_posts', []);

        // Reemplazar posts editados
        return array_map(fn ($post) => $editedPosts[$post['id']] ?? $post, $apiPosts);
    }

    /**
     * Combina posts locales (nuevos) con posts de la API
     *
     * @param  array<int, array<string, mixed>>  $apiPosts
     * @return array<int, array<string, mixed>>
     */
    private function mergeLocalPosts(array $apiPosts): array
    {
        $localPosts = session('local_posts', []);

        return array_merge($localPosts, array_values($apiPosts));
    }

    /**
     * Aplica paginación a un array de posts
     *
     * @param  array<int, array<string, mixed>>  $posts
     * @return array<string, mixed>
     */
    private function paginatePosts(array $posts, int $page = 1): array
    {
        $total = count($posts);
        $offset = ($page - 1) * self::PER_PAGE;
        $paginatedPosts = array_slice($posts, $offset, self::PER_PAGE);

        return [
            'data' => $paginatedPosts,
            'current_page' => (int) $page,
            'per_page' => self::PER_PAGE,
            'total' => $total,
            'last_page' => (int) ceil($total / self::PER_PAGE),
        ];
    }

    /**
     * Agrega un post a la lista de posts locales
     *
     * @param  array<string, mixed>  $post
     */
    private function addToLocalPosts(array $post): void
    {
        $localPosts = session('local_posts', []);
        array_unshift($localPosts, $post);
        session(['local_posts' => $localPosts]);
    }

    /**
     * Guarda un post editado en sesión
     *
     * @param  array<string, mixed>  $post
     */
    private function saveToEditedPosts(int $id, array $post): void
    {
        $editedPosts = session('edited_posts', []);
        $editedPosts[$id] = $post;
        session(['edited_posts' => $editedPosts]);
    }

    /**
     * Marca un post como eliminado en sesión
     */
    private function markAsDeleted(int $id): void
    {
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

    /**
     * Crea una nueva publicación en la API
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function createPost(array $data): array
    {
        $response = Http::post("{$this->baseUrl}/posts", [
            'title' => $data['title'],
            'body' => $data['body'],
            'userId' => $data['userId'] ?? 1,
        ]);

        return $response->json();
    }

    /**
     * Actualiza una publicación en la API
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function updatePost(int $id, array $data): array
    {
        $response = Http::put("{$this->baseUrl}/posts/{$id}", [
            'id' => $id,
            'title' => $data['title'],
            'body' => $data['body'],
            'userId' => $data['userId'] ?? 1,
        ]);

        return $response->json();
    }

    /**
     * Elimina una publicación en la API
     */
    private function deletePost(int $id): bool
    {
        $response = Http::delete("{$this->baseUrl}/posts/{$id}");

        return $response->successful();
    }
}
