<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class JsonPlaceholderService
{
    private string $baseUrl = 'https://jsonplaceholder.typicode.com';

    /**
     * Obtiene todas las publicaciones
     *
     * @return array<int, array<string, mixed>>
     */
    public function getPosts(): array
    {
        $response = Http::get("{$this->baseUrl}/posts");

        return $response->json() ?? [];
    }

    /**
     * Crea una nueva publicación
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function createPost(array $data): array
    {
        $response = Http::post("{$this->baseUrl}/posts", [
            'title' => $data['title'],
            'body' => $data['body'],
            'userId' => $data['userId'] ?? 1,
        ]);

        return $response->json();
    }

    /**
     * Actualiza una publicación
     *
     * @param  int  $id
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function updatePost(int $id, array $data): array
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
     * Elimina una publicación
     */
    public function deletePost(int $id): bool
    {
        $response = Http::delete("{$this->baseUrl}/posts/{$id}");

        return $response->successful();
    }
}

