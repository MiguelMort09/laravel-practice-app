<?php

use App\Models\User;
use App\Services\JsonPlaceholderService;
use Illuminate\Support\Facades\Http;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->user = User::factory()->create();

    // Mock de JSONPlaceholder API
    Http::fake([
        'jsonplaceholder.typicode.com/posts' => Http::response([
            ['id' => 1, 'title' => 'Post 1', 'body' => 'Body 1', 'userId' => 1],
            ['id' => 2, 'title' => 'Post 2', 'body' => 'Body 2', 'userId' => 1],
        ], 200),
    ]);
});

it('muestra el índice de posts correctamente', function () {
    actingAs($this->user);

    $response = $this->get(route('services.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn($page) => $page
        ->component('services/index')
        ->has('posts.data')
    );
});

it('crea un nuevo post con ID temporal negativo', function () {
    actingAs($this->user);

    $response = $this->post(route('services.store'), [
        'title' => 'Nuevo Post',
        'body' => 'Contenido del post',
        'userId' => 1,
    ]);

    $response->assertRedirect(route('services.index'));
    $response->assertSessionHas('success', 'Publicación creada correctamente.');

    // Verificar que el post se guardó en sesión con ID negativo
    $localPosts = session('local_posts');
    expect($localPosts)->toHaveCount(1);
    expect($localPosts[0]['id'])->toBeLessThan(0);
    expect($localPosts[0]['title'])->toBe('Nuevo Post');
});

it('actualiza un post local (ID negativo)', function () {
    actingAs($this->user);

    // Crear un post local primero
    session(['local_posts' => [
        ['id' => -1, 'title' => 'Post Local', 'body' => 'Contenido', 'userId' => 1],
    ]]);

    $response = $this->put(route('services.update', -1), [
        'title' => 'Post Local Actualizado',
        'body' => 'Contenido actualizado',
        'userId' => 1,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Publicación actualizada correctamente.');

    // Verificar que el post se actualizó en sesión
    $localPosts = session('local_posts');
    expect($localPosts[0]['title'])->toBe('Post Local Actualizado');
    expect($localPosts[0]['body'])->toBe('Contenido actualizado');
});

it('actualiza un post de API sin duplicarlo', function () {
    actingAs($this->user);

    $response = $this->put(route('services.update', 1), [
        'title' => 'Post API Actualizado',
        'body' => 'Contenido actualizado de API',
        'userId' => 1,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Publicación actualizada correctamente.');

    // Verificar que se guardó en posts editados, no en posts locales
    $editedPosts = session('edited_posts');
    expect($editedPosts)->toHaveKey(1);
    expect($editedPosts[1]['title'])->toBe('Post API Actualizado');

    // Verificar que NO se agregó a posts locales
    $localPosts = session('local_posts', []);
    expect($localPosts)->toBeEmpty();
});

it('elimina un post local (ID negativo)', function () {
    actingAs($this->user);

    // Crear posts locales
    session(['local_posts' => [
        ['id' => -1, 'title' => 'Post 1', 'body' => 'Body 1', 'userId' => 1],
        ['id' => -2, 'title' => 'Post 2', 'body' => 'Body 2', 'userId' => 1],
    ]]);

    $response = $this->delete(route('services.destroy', -1));

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Publicación eliminada correctamente.');

    // Verificar que solo queda un post
    $localPosts = session('local_posts');
    expect($localPosts)->toHaveCount(1);
    expect($localPosts[0]['id'])->toBe(-2);
});

it('elimina un post de API agregándolo a la lista de eliminados', function () {
    actingAs($this->user);

    $response = $this->delete(route('services.destroy', 1));

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Publicación eliminada correctamente.');

    // Verificar que se agregó a la lista de eliminados
    $deletedPosts = session('deleted_posts');
    expect($deletedPosts)->toContain(1);
});

it('no muestra posts eliminados en el índice', function () {
    actingAs($this->user);

    // Marcar post como eliminado
    session(['deleted_posts' => [1]]);

    $response = $this->get(route('services.index'));

    $response->assertSuccessful();

    // Verificar que solo hay 1 post (el post 1 fue eliminado)
    $response->assertInertia(fn($page) => $page
        ->where('posts.total', 1)
    );
});

it('muestra posts editados con los cambios aplicados', function () {
    actingAs($this->user);

    // Editar un post de API
    session(['edited_posts' => [
        1 => ['id' => 1, 'title' => 'Post Editado', 'body' => 'Contenido editado', 'userId' => 1],
    ]]);

    $response = $this->get(route('services.index'));

    $response->assertSuccessful();

    // Verificar que el post editado se muestra con el título actualizado
    $response->assertInertia(fn($page) => $page
        ->where('posts.data.0.title', 'Post Editado')
    );
});
