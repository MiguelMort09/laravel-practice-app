<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Services\AuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {
    }

    /**
     * Muestra el formulario de restablecimiento de contraseña con email y RFC
     */
    public function showResetPasswordForm(): Response
    {
        return Inertia::render('auth/reset-password-email-rfc');
    }

    /**
     * Restablece la contraseña usando email y RFC
     */
    public function resetPassword(ResetPasswordRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $success = $this->authService->resetPasswordByEmailAndRfc(
            $validated['email'],
            $validated['rfc'],
            $validated['password']
        );

        if (! $success) {
            return back()->withErrors([
                'email' => 'El correo electrónico y RFC no coinciden con ningún usuario.',
            ]);
        }

        return redirect()->route('login')->with('status', 'Contraseña actualizada correctamente.');
    }
}
