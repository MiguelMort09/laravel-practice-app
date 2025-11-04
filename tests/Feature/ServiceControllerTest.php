<?php

use App\Models\User;
use Illuminate\Support\Facades\Http;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('muestra el índice de posts correctamente', function () {
    actingAs($this->user);

    Http::fake([
        'jsonplaceholder.typicode.com/posts' => Http::response([
            ['id' => 1, 'title' => 'Post 1', 'body' => 'Body 1', 'userId' => 1],
            ['id' => 2, 'title' => 'Post 2', 'body' => 'Body 2', 'userId' => 1],
        ], 200),
    ]);

    $response = $this->get(route('services.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('services/index')
        ->has('posts.data')
        ->where('posts.total', 2)
    );
});

it('crea un nuevo post usando la API', function () {
    actingAs($this->user);

    Http::fake([
        'jsonplaceholder.typicode.com/posts' => Http::response([
            'id' => 101,
            'title' => 'Nuevo Post',
            'body' => 'Contenido del post',
            'userId' => 1,
        ], 201),
    ]);

    $response = $this->post(route('services.store'), [
        'title' => 'Nuevo Post',
        'body' => 'Contenido del post',
        'userId' => 1,
    ]);

    $response->assertRedirect(route('services.index'));
    $response->assertSessionHas('success', 'Publicación creada correctamente.');

    Http::assertSent(function ($request) {
        return $request->url() === 'https://jsonplaceholder.typicode.com/posts' &&
               $request->method() === 'POST';
    });
});

it('actualiza un post usando la API', function () {
    actingAs($this->user);

    Http::fake([
        'jsonplaceholder.typicode.com/posts/1' => Http::response([
            'id' => 1,
            'title' => 'Post Actualizado',
            'body' => 'Contenido actualizado',
            'userId' => 1,
        ], 200),
    ]);

    $response = $this->put(route('services.update', 1), [
        'title' => 'Post Actualizado',
        'body' => 'Contenido actualizado',
        'userId' => 1,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Publicación actualizada correctamente.');

    Http::assertSent(function ($request) {
        return $request->url() === 'https://jsonplaceholder.typicode.com/posts/1' &&
               $request->method() === 'PUT';
    });
});

it('elimina un post usando la API', function () {
    actingAs($this->user);

    Http::fake([
        'jsonplaceholder.typicode.com/posts/1' => Http::response([], 204),
    ]);

    $response = $this->delete(route('services.destroy', 1));

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Publicación eliminada correctamente.');

    Http::assertSent(function ($request) {
        return $request->url() === 'https://jsonplaceholder.typicode.com/posts/1' &&
               $request->method() === 'DELETE';
    });
});
