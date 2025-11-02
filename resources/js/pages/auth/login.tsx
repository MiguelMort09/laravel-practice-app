import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { Form, Head, Link } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { KeyRound, LogIn } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);

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

        const handleBlur = (e: FocusEvent) => {
            const input = e.target as HTMLInputElement;
            validateField(input);
        };

        const handleSubmit = (e: SubmitEvent) => {
            let isValid = true;

            if (emailInputRef.current && !validateField(emailInputRef.current)) {
                isValid = false;
            }
            if (passwordInputRef.current && !validateField(passwordInputRef.current)) {
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
            }
        };

        const inputs = form.querySelectorAll('input[required]');
        inputs.forEach((input) => {
            input.addEventListener('blur', handleBlur);
        });

        form.addEventListener('submit', handleSubmit);

        return () => {
            inputs.forEach((input) => {
                input.removeEventListener('blur', handleBlur);
            });
            form.removeEventListener('submit', handleSubmit);
        };
    }, []);

    return (
        <AuthLayout
            title="Iniciar sesión"
            description="Ingresa tu correo y contraseña"
        >
            <Head title="Iniciar sesión" />

            <div ref={formRef}>
                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-5"
                >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-4">
                            <div className="grid gap-1.5">
                                <Label htmlFor="email" className="text-sm">Correo electrónico</Label>
                                <Input
                                    ref={emailInputRef}
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="correo@ejemplo.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="password" className="text-sm">Contraseña</Label>
                                <Input
                                    ref={passwordInputRef}
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Contraseña"
                                />
                                <InputError message={errors.password} />
                                {errors.email && errors.email.includes('coinciden') && (
                                    <p className="text-xs text-red-500 mt-0.5">
                                        Los valores no coinciden con los registros del sistema.
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember" className="text-sm font-normal">Recordarme</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                <LogIn className="h-4 w-4 mr-1" />
                                Iniciar sesión
                            </Button>

                            {/* Link de recuperación con icono */}
                            <div className="text-center border-t pt-3">
                                <Link
                                    href="/reset-password-email-rfc"
                                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                                    tabIndex={5}
                                >
                                    <KeyRound className="h-3.5 w-3.5" />
                                    ¿Olvidaste tu contraseña? Restablécela con Email y RFC
                                </Link>
                            </div>
                        </div>

                        {canRegister && (
                            <div className="text-center text-sm text-muted-foreground">
                                ¿No tienes cuenta?{' '}
                                <TextLink href={register()} tabIndex={6}>
                                    Registrarse
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>
            </div>

            {status && (
                <div className="mb-3 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
