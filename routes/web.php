<?php

use App\Http\Controllers\AlgorithmController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ServiceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('algorithms', [AlgorithmController::class, 'index'])->name('algorithms.index');
    Route::post('algorithms/detect', [AlgorithmController::class, 'detectPalindromes'])->name('algorithms.detect');

    Route::resource('customers', CustomerController::class)->except(['show', 'create', 'edit']);

    Route::get('services', [ServiceController::class, 'index'])->name('services.index');
    Route::post('services', [ServiceController::class, 'store'])->name('services.store');
    Route::put('services/{id}', [ServiceController::class, 'update'])->name('services.update');
    Route::delete('services/{id}', [ServiceController::class, 'destroy'])->name('services.destroy');
});

Route::get('reset-password-email-rfc', [AuthController::class, 'showResetPasswordForm'])->name('reset-password-email-rfc');
Route::post('reset-password-email-rfc', [AuthController::class, 'resetPassword'])->name('reset-password-email-rfc.post');

require __DIR__.'/settings.php';
