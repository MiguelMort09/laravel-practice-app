<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer>
 */
class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Generar RFC válido (formato: 4 letras + 6 dígitos + 3 caracteres alfanuméricos)
        $rfc = strtoupper(fake()->lexify('????')) . 
               fake()->numerify('######') . 
               strtoupper(fake()->bothify('?##'));

        return [
            'user_id' => User::factory(),
            'name' => fake()->company(),
            'rfc' => $rfc,
            'address' => fake()->address(),
            'phone' => fake()->phoneNumber(),
            'website' => fake()->url(),
        ];
    }

    /**
     * Indicate that the customer belongs to a specific user.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }

    /**
     * Customer without optional fields.
     */
    public function minimal(): static
    {
        return $this->state(fn (array $attributes) => [
            'address' => null,
            'phone' => null,
            'website' => null,
        ]);
    }
}
