import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Plus, Trash2, Play, CheckCircle2, XCircle, Hash, Sparkles, Code2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { type BreadcrumbItem } from '@/types';

interface AlgorithmProps {
    results?: Record<string, boolean>;
    words?: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Algoritmos',
        href: '/algorithms',
    },
];

export default function Algorithms({ results, words }: AlgorithmProps) {
    const [wordInputs, setWordInputs] = useState<string[]>(['', '']);
    const [wordCount, setWordCount] = useState(2);

    const handleWordCountChange = (count: number) => {
        if (count < 2) return;
        if (count > 20) return;

        setWordCount(count);
        const newInputs = Array(count).fill('').map((_, index) => wordInputs[index] || '');
        setWordInputs(newInputs);
    };

    const handleWordChange = (index: number, value: string) => {
        const newInputs = [...wordInputs];
        newInputs[index] = value;
        setWordInputs(newInputs);
    };

    const handleAddWord = () => {
        if (wordCount < 20) {
            handleWordCountChange(wordCount + 1);
        }
    };

    const handleRemoveWord = (index: number) => {
        if (wordCount > 2) {
            const newInputs = wordInputs.filter((_, i) => i !== index);
            setWordInputs(newInputs);
            setWordCount(wordCount - 1);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validWords = wordInputs.filter(word => word.trim() !== '');
        if (validWords.length < 2) {
            alert('Debes ingresar al menos 2 palabras');
            return;
        }
        router.post('/algorithms/detect', { words: validWords });
    };

    const palindromeCount = results ? Object.values(results).filter(Boolean).length : 0;
    const totalWords = words?.length || 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Algoritmos - Palíndromos" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-row items-start justify-between">
                            <div className="flex items-center gap-2">
                                <Code2 className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <CardTitle className="text-xl">Detección de Palíndromos</CardTitle>
                                    <CardDescription className="mt-1">
                                        Analiza múltiples palabras para identificar palíndromos
                                    </CardDescription>
                                </div>
                            </div>
                            {results && (
                                <Badge variant={palindromeCount > 0 ? "default" : "secondary"} className="text-sm px-3 py-1">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    {palindromeCount} / {totalWords}
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <Alert className="mb-4">
                            <Hash className="h-4 w-4" />
                            <AlertTitle className="text-sm">¿Qué es un palíndromo?</AlertTitle>
                            <AlertDescription className="text-xs">
                                <p>
                                Palabra que se lee igual al derecho y al revés. Ej: <strong>oso</strong>, <strong>anilina</strong>
                                </p>
                            </AlertDescription>
                        </Alert>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex flex-row items-end gap-2">
                                    <div className="flex-1">
                                        <Label htmlFor="wordCount" className="text-sm">Cantidad de palabras (N)</Label>
                                        <Input
                                            id="wordCount"
                                            type="number"
                                            min="2"
                                            max="20"
                                            value={wordCount}
                                            onChange={(e) => handleWordCountChange(parseInt(e.target.value) || 2)}
                                            className="mt-1"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleAddWord}
                                        disabled={wordCount >= 20}
                                    >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Agregar
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm">Palabras a analizar</Label>
                                    <div className="grid gap-2 md:grid-cols-2">
                                        {wordInputs.map((word, index) => (
                                            <div key={index} className="flex flex-row gap-1">
                                                <div className="flex-1 relative">
                                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                                                        #{index + 1}
                                                    </span>
                                                    <Input
                                                        id={`word-${index}`}
                                                        type="text"
                                                        value={word}
                                                        onChange={(e) => handleWordChange(index, e.target.value)}
                                                        placeholder={`Palabra ${index + 1}`}
                                                        className="pl-10 text-sm"
                                                    />
                                                </div>
                                                {wordCount > 2 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveWord(index)}
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" size="sm" className="w-full md:w-auto">
                                <Play className="h-4 w-4 mr-1" />
                                Ejecutar Algoritmo
                            </Button>
                        </form>

                        {results && words && (
                            <div className="mt-6">
                                <div className="flex flex-row items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold flex items-center gap-1.5">
                                        <Sparkles className="h-4 w-4" />
                                        Resultados
                                    </h3>
                                    <Badge variant="outline" className="text-xs">
                                        {totalWords} palabra{totalWords !== 1 ? 's' : ''}
                                    </Badge>
                                </div>

                                <div className="grid gap-2 md:grid-cols-2">
                                    {words.map((word, index) => {
                                        const isPalindrome = results[word];
                                        return (
                                            <Card
                                                key={index}
                                                className={isPalindrome
                                                    ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                                                    : 'border-border'
                                                }
                                            >
                                                <CardContent>
                                                    <div className="flex flex-row items-center justify-between">
                                                        <div className="flex flex-row items-center gap-2">
                                                            <div className={`p-1.5 rounded-full ${
                                                                isPalindrome
                                                                    ? 'bg-green-100 dark:bg-green-900'
                                                                    : 'bg-gray-100 dark:bg-gray-800'
                                                            }`}>
                                                                {isPalindrome ? (
                                                                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                                ) : (
                                                                    <XCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-sm">{word}</p>
                                                                <p className={`text-xs ${
                                                                    isPalindrome
                                                                        ? 'text-green-600 dark:text-green-400'
                                                                        : 'text-muted-foreground'
                                                                }`}>
                                                                    {isPalindrome ? 'Es palíndromo' : 'No es palíndromo'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {isPalindrome && (
                                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>

                                {palindromeCount > 0 && (
                                    <Alert className="mt-4 border-green-500 bg-green-50 dark:bg-green-950/20">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <AlertTitle className="text-green-800 dark:text-green-400 text-sm">
                                            ¡Análisis Completado!
                                        </AlertTitle>
                                        <AlertDescription className="text-green-700 dark:text-green-300 text-xs">
                                            <p>
                                            Se encontraron <strong>{palindromeCount}</strong> palíndromo{palindromeCount !== 1 ? 's' : ''} de <strong>{totalWords}</strong> palabra{totalWords !== 1 ? 's' : ''}.
                                            </p>
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
