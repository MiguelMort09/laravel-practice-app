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

it('crea un nuevo post usando la API y lo guarda en sesión', function () {
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

    // Verificar que se llamó a la API
    Http::assertSent(function ($request) {
        return $request->url() === 'https://jsonplaceholder.typicode.com/posts' &&
               $request->method() === 'POST';
    });

    // Verificar que se guardó en sesión
    $localPosts = session('local_posts');
    expect($localPosts)->toHaveCount(1);
    expect($localPosts[0]['title'])->toBe('Nuevo Post');
});

it('actualiza un post de API usando el servicio y guarda en sesión', function () {
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

    // Verificar que se llamó a la API
    Http::assertSent(function ($request) {
        return $request->url() === 'https://jsonplaceholder.typicode.com/posts/1' &&
               $request->method() === 'PUT';
    });

    // Verificar que se guardó en sesión
    $editedPosts = session('edited_posts');
    expect($editedPosts)->toHaveKey(1);
    expect($editedPosts[1]['title'])->toBe('Post Actualizado');
});

it('elimina un post de API usando el servicio y guarda en sesión', function () {
    actingAs($this->user);

    Http::fake([
        'jsonplaceholder.typicode.com/posts/1' => Http::response([], 204),
    ]);

    $response = $this->delete(route('services.destroy', 1));

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Publicación eliminada correctamente.');

    // Verificar que se llamó a la API
    Http::assertSent(function ($request) {
        return $request->url() === 'https://jsonplaceholder.typicode.com/posts/1' &&
               $request->method() === 'DELETE';
    });

    // Verificar que se guardó en sesión
    $deletedPosts = session('deleted_posts');
    expect($deletedPosts)->toContain(1);
});

it('muestra posts editados reflejados en el listado', function () {
    actingAs($this->user);

    // Primero, editamos un post
    Http::fake([
        'jsonplaceholder.typicode.com/posts/1' => Http::response([
            'id' => 1,
            'title' => 'Post Editado',
            'body' => 'Contenido editado',
            'userId' => 1,
        ], 200),
    ]);

    $this->put(route('services.update', 1), [
        'title' => 'Post Editado',
        'body' => 'Contenido editado',
        'userId' => 1,
    ]);

    // Luego obtenemos el listado
    Http::fake([
        'jsonplaceholder.typicode.com/posts' => Http::response([
            ['id' => 1, 'title' => 'Post Original', 'body' => 'Body 1', 'userId' => 1],
            ['id' => 2, 'title' => 'Post 2', 'body' => 'Body 2', 'userId' => 1],
        ], 200),
    ]);

    $response = $this->get(route('services.index'));

    // El post debe mostrar la versión editada, no la original
    $response->assertInertia(fn ($page) => $page
        ->where('posts.data.0.title', 'Post Editado')
    );
});

it('nueva publicación aparece al inicio del listado', function () {
    actingAs($this->user);

    // Crear un nuevo post
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

    // Seguir el redirect
    $response = $this->followRedirects($response);

    // Mockear la API nuevamente para el GET
    Http::fake([
        'jsonplaceholder.typicode.com/posts' => Http::response([
            ['id' => 1, 'title' => 'Post 1', 'body' => 'Body 1', 'userId' => 1],
            ['id' => 2, 'title' => 'Post 2', 'body' => 'Body 2', 'userId' => 1],
        ], 200),
    ]);

    // Hacer GET al índice
    $response = $this->get(route('services.index'));

    // La nueva publicación debe estar al inicio
    $response->assertInertia(fn ($page) => $page
        ->where('posts.data.0.title', 'Nuevo Post')
        ->where('posts.total', 3) // 1 nuevo + 2 de API
    );
});

it('combina posts de API con posts creados localmente', function () {
    actingAs($this->user);

    // Crear un post local
    Http::fake([
        'jsonplaceholder.typicode.com/posts' => Http::response([
            'id' => 101,
            'title' => 'Nuevo Post Local',
            'body' => 'Contenido local',
            'userId' => 1,
        ], 201),
    ]);

    $this->post(route('services.store'), [
        'title' => 'Nuevo Post Local',
        'body' => 'Contenido local',
        'userId' => 1,
    ]);

    // Obtener listado que combina API + local
    Http::fake([
        'jsonplaceholder.typicode.com/posts' => Http::response([
            ['id' => 1, 'title' => 'Post API 1', 'body' => 'Body 1', 'userId' => 1],
            ['id' => 2, 'title' => 'Post API 2', 'body' => 'Body 2', 'userId' => 1],
        ], 200),
    ]);

    $response = $this->get(route('services.index'));

    // Debe haber 3 posts: 1 local + 2 de API
    $response->assertInertia(fn ($page) => $page
        ->where('posts.total', 3)
        ->where('posts.data.0.title', 'Nuevo Post Local') // Local al inicio
        ->where('posts.data.1.title', 'Post API 1')
        ->where('posts.data.2.title', 'Post API 2')
    );
});
