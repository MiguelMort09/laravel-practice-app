import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    const formRef = useRef<HTMLFormElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);
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

            if (nameInputRef.current && !validateField(nameInputRef.current)) {
                isValid = false;
            }
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
            title="Crear una cuenta"
            description="Ingresa tus datos para crear tu cuenta"
        >
            <Head title="Registro" />
            <div ref={formRef}>
                <Form
                    {...store.form()}
                    resetOnSuccess={['password', 'password_confirmation']}
                    disableWhileProcessing
                    className="flex flex-col gap-6"
                >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    ref={nameInputRef}
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Nombre completo"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input
                                    ref={emailInputRef}
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="correo@ejemplo.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="rfc">RFC</Label>
                                <Input
                                    ref={rfcInputRef}
                                    id="rfc"
                                    type="text"
                                    required
                                    tabIndex={3}
                                    name="rfc"
                                    placeholder="ABCD123456EF7"
                                    maxLength={13}
                                    className="uppercase"
                                    onInput={(e) => {
                                        const target = e.target as HTMLInputElement;
                                        target.value = target.value.toUpperCase();
                                    }}
                                />
                                <InputError message={errors.rfc} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    ref={passwordInputRef}
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Contraseña"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirmar contraseña
                                </Label>
                                <Input
                                    ref={passwordConfirmationInputRef}
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirmar contraseña"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={6}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Crear cuenta
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            ¿Ya tienes una cuenta?{' '}
                            <TextLink href={login()} tabIndex={7}>
                                Iniciar sesión
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
            </div>
        </AuthLayout>
    );
}
