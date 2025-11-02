<?php

namespace App\Actions\Fortify;

use App\Models\User;
use App\Services\AuthService;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    public function __construct(
        private AuthService $authService
    ) {
    }

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'rfc' => [
                'required',
                'string',
                'regex:/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/',
                'between:12,13',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
        ])->validate();

        return $this->authService->register($input);
    }
}
