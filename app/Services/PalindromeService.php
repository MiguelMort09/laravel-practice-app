<?php

namespace App\Services;

class PalindromeService
{
    /**
     * Detecta si una palabra es palíndroma
     */
    public function isPalindrome(string $word): bool
    {
        // Limpiar la palabra: convertir a minúsculas y remover espacios y caracteres especiales
        $cleaned = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $word));

        // Comparar con su reverso
        return $cleaned === strrev($cleaned);
    }

    /**
     * Detecta cuáles palabras de un array son palíndromas
     *
     * @param  array<string>  $words
     * @return array<string, bool>
     */
    public function detectPalindromes(array $words): array
    {
        $results = [];

        foreach ($words as $word) {
            $results[$word] = $this->isPalindrome($word);
        }

        return $results;
    }
}

