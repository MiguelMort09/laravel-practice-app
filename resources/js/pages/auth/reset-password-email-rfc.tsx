import { login } from '@/routes';
import { Form, Head, Link } from '@inertiajs/react';
import { useRef, useEffect } from 'react';
import { KeyRound, Mail, FileText, Lock, AlertCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AuthLayout from '@/layouts/auth-layout';

export default function ResetPasswordEmailRfc() {
    const formRef = useRef<HTMLFormElement>(null);
    const emailInputRef = useRef<HTMLInputElement>(null);
    const rfcInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const passwordConfirmationInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const form = formRef.current;
        if (!form) {
            return;
        }

        const validateField = (input: HTMLInputElement): boolean => {
            const isEmpty = !input.value.trim();
            if (isEmpty) {
                input.classList.add('border-red-500');
                input.classList.remove('border-gray-300', 'dark:border-gray-700');
                return false;
            }
            input.classList.remove('border-red-500');
            input.classList.add('border-gray-300', 'dark:border-gray-700');
            return true;
        };

        const validateRFC = (rfc: string): boolean => {
            const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
            return rfcRegex.test(rfc) && (rfc.length === 12 || rfc.length === 13);
        };

        const validatePasswordsMatch = (): boolean => {
            const password = passwordInputRef.current?.value || '';
            const passwordConfirmation = passwordConfirmationInputRef.current?.value || '';
            const passwordsMatch = password === passwordConfirmation;

            if (passwordConfirmationInputRef.current) {
                if (!passwordsMatch && passwordConfirmation) {
                    passwordConfirmationInputRef.current.classList.add('border-red-500');
                    passwordConfirmationInputRef.current.classList.remove('border-gray-300', 'dark:border-gray-700');
                } else {
                    passwordConfirmationInputRef.current.classList.remove('border-red-500');
                    passwordConfirmationInputRef.current.classList.add('border-gray-300', 'dark:border-gray-700');
                }
            }

            return passwordsMatch;
        };

        const validateRFCField = (): boolean => {
            const rfc = rfcInputRef.current?.value || '';
            const isValid = validateRFC(rfc);

            if (rfcInputRef.current) {
                if (!isValid && rfc) {
                    rfcInputRef.current.classList.add('border-red-500');
                    rfcInputRef.current.classList.remove('border-gray-300', 'dark:border-gray-700');
                } else if (!rfc) {
                    rfcInputRef.current.classList.add('border-red-500');
                    rfcInputRef.current.classList.remove('border-gray-300', 'dark:border-gray-700');
                } else {
                    rfcInputRef.current.classList.remove('border-red-500');
                    rfcInputRef.current.classList.add('border-gray-300', 'dark:border-gray-700');
                }
            }

            return isValid;
        };

        const handleBlur = (e: FocusEvent) => {
            const input = e.target as HTMLInputElement;
            validateField(input);

            if (input.name === 'rfc') {
                validateRFCField();
            }

            if (input.name === 'password_confirmation') {
                validatePasswordsMatch();
            }
        };

        const handleInput = (e: Event) => {
            const input = e.target as HTMLInputElement;
            if (input.name === 'password' || input.name === 'password_confirmation') {
                validatePasswordsMatch();
            }
            if (input.name === 'rfc') {
                validateRFCField();
            }
        };

        const handleSubmit = (e: SubmitEvent) => {
            let isValid = true;

            if (emailInputRef.current && !validateField(emailInputRef.current)) {
                isValid = false;
            }
            if (rfcInputRef.current && !validateRFCField()) {
                isValid = false;
            }
            if (passwordInputRef.current && !validateField(passwordInputRef.current)) {
                isValid = false;
            }
            if (passwordConfirmationInputRef.current && !validateField(passwordConfirmationInputRef.current)) {
                isValid = false;
            }
            if (!validatePasswordsMatch()) {
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
            }
        };

        const inputs = form.querySelectorAll('input');
        inputs.forEach((input) => {
            input.addEventListener('blur', handleBlur);
            input.addEventListener('input', handleInput);
        });

        form.addEventListener('submit', handleSubmit);

        return () => {
            inputs.forEach((input) => {
                input.removeEventListener('blur', handleBlur);
                input.removeEventListener('input', handleInput);
            });
            form.removeEventListener('submit', handleSubmit);
        };
    }, []);

    return (
        <AuthLayout
            title="Restablecer contraseña"
            description="Verifica tu identidad con Email y RFC"
        >
            <Head title="Restablecer contraseña" />
            
            <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                    Ingresa tu correo y RFC registrados para crear una nueva contraseña
                </AlertDescription>
            </Alert>

            <div ref={formRef}>
                <Form
                    action="/reset-password-email-rfc"
                    method="post"
                    resetOnSuccess={['password', 'password_confirmation']}
                    disableWhileProcessing
                    className="flex flex-col gap-4"
                >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-3">
                            <div className="grid gap-1.5">
                                <Label htmlFor="email" className="text-sm flex items-center gap-1.5">
                                    <Mail className="h-3.5 w-3.5" />
                                    Correo electrónico
                                </Label>
                                <Input
                                    ref={emailInputRef}
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="correo@ejemplo.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="rfc" className="text-sm flex items-center gap-1.5">
                                    <FileText className="h-3.5 w-3.5" />
                                    RFC (12 o 13 caracteres)
                                </Label>
                                <Input
                                    ref={rfcInputRef}
                                    id="rfc"
                                    type="text"
                                    required
                                    tabIndex={2}
                                    name="rfc"
                                    placeholder="ABCD123456EF7"
                                    maxLength={13}
                                    className="uppercase font-mono"
                                    onInput={(e) => {
                                        const target = e.target as HTMLInputElement;
                                        target.value = target.value.toUpperCase();
                                    }}
                                />
                                <InputError message={errors.rfc} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="password" className="text-sm flex items-center gap-1.5">
                                    <Lock className="h-3.5 w-3.5" />
                                    Nueva contraseña
                                </Label>
                                <Input
                                    ref={passwordInputRef}
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Mínimo 8 caracteres"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="password_confirmation" className="text-sm flex items-center gap-1.5">
                                    <Lock className="h-3.5 w-3.5" />
                                    Confirmar contraseña
                                </Label>
                                <Input
                                    ref={passwordConfirmationInputRef}
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Repite la contraseña"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={5}
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                <KeyRound className="h-4 w-4 mr-1" />
                                Restablecer contraseña
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground border-t pt-3">
                            <Link
                                href={login().url}
                                className="text-primary hover:underline text-xs"
                                tabIndex={6}
                            >
                                ← Volver al inicio de sesión
                            </Link>
                        </div>
                    </>
                )}
            </Form>
            </div>
        </AuthLayout>
    );
}
