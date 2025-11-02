<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function register(array $data): User
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'rfc' => $data['rfc'],
            'password' => Hash::make($data['password']),
        ]);
    }

    public function resetPasswordByEmailAndRfc(string $email, string $rfc, string $newPassword): bool
    {
        $user = User::where('email', $email)
            ->where('rfc', $rfc)
            ->first();

        if (! $user) {
            return false;
        }

        $user->password = Hash::make($newPassword);
        $user->save();

        return true;
    }
}

