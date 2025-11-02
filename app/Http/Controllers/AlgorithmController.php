<?php

namespace App\Http\Controllers;

use App\Services\PalindromeService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AlgorithmController extends Controller
{
    public function __construct(
        private PalindromeService $palindromeService
    ) {
    }

    /**
     * Muestra la página de algoritmos de palíndromos
     */
    public function index(): Response
    {
        return Inertia::render('algorithms/index');
    }

    /**
     * Detecta palíndromos en un array de palabras
     */
    public function detectPalindromes(Request $request): Response
    {
        $request->validate([
            'words' => ['required', 'array', 'min:2'],
            'words.*' => ['required', 'string'],
        ]);

        $words = $request->input('words');
        $results = $this->palindromeService->detectPalindromes($words);

        return Inertia::render('algorithms/index', [
            'results' => $results,
            'words' => $words,
        ]);
    }
}
