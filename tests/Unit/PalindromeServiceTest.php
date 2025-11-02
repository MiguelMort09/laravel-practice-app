<?php

use App\Services\PalindromeService;

beforeEach(function () {
    $this->service = new PalindromeService();
});

describe('isPalindrome', function () {
    it('detecta palíndromos de una palabra correctamente', function () {
        expect($this->service->isPalindrome('oso'))->toBeTrue();
        expect($this->service->isPalindrome('radar'))->toBeTrue();
        expect($this->service->isPalindrome('reconocer'))->toBeTrue();
        expect($this->service->isPalindrome('anilina'))->toBeTrue();
    });

    it('detecta palíndromos cortos', function () {
        expect($this->service->isPalindrome('oro'))->toBeTrue();
        expect($this->service->isPalindrome('oso'))->toBeTrue();
        expect($this->service->isPalindrome('php'))->toBeTrue();
    });

    it('detecta palabras que NO son palíndromos', function () {
        expect($this->service->isPalindrome('hello'))->toBeFalse();
        expect($this->service->isPalindrome('world'))->toBeFalse();
        expect($this->service->isPalindrome('laravel'))->toBeFalse();
        expect($this->service->isPalindrome('nivel'))->toBeFalse(); // n-i-v-e-l ≠ l-e-v-i-n
    });

    it('ignora mayúsculas y minúsculas', function () {
        expect($this->service->isPalindrome('Radar'))->toBeTrue();
        expect($this->service->isPalindrome('RECONOCER'))->toBeTrue();
        expect($this->service->isPalindrome('AnIlInA'))->toBeTrue();
    });

    it('maneja palabras vacías', function () {
        expect($this->service->isPalindrome(''))->toBeTrue();
    });

    it('maneja espacios y caracteres especiales', function () {
        expect($this->service->isPalindrome('a b a'))->toBeTrue();
        expect($this->service->isPalindrome('a-b-a'))->toBeTrue();
    });
});

describe('detectPalindromes', function () {
    it('detecta múltiples palíndromos en un array', function () {
        $words = ['oso', 'hello', 'radar', 'world'];
        $results = $this->service->detectPalindromes($words);

        expect($results)->toHaveCount(4)
            ->and($results['oso'])->toBeTrue()
            ->and($results['hello'])->toBeFalse()
            ->and($results['radar'])->toBeTrue()
            ->and($results['world'])->toBeFalse();
    });

    it('maneja array vacío', function () {
        $results = $this->service->detectPalindromes([]);
        expect($results)->toBeEmpty();
    });

    it('procesa todas las palabras del array', function () {
        $words = ['reconocer', 'anilina', 'solos', 'kayak', 'salas'];
        $results = $this->service->detectPalindromes($words);

        expect($results)->toHaveCount(5);
        expect(array_filter($results))->toHaveCount(5); // Todos son palíndromos
    });
});
