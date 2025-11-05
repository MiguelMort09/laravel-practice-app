# Laravel Practice App

Aplicación de práctica desarrollada con Laravel 12, React 19, Inertia.js y TypeScript. Este proyecto implementa funcionalidades básicas de gestión de clientes, algoritmos de palíndromos y consumo de APIs externas.

## 📋 Tabla de Contenidos

- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Características Principales](#características-principales)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Base de Datos](#base-de-datos)
- [Rutas Disponibles](#rutas-disponibles)
- [Comandos de Desarrollo](#comandos-de-desarrollo)
- [Testing](#testing)

## 🚀 Tecnologías Utilizadas

### Backend
- **Laravel 12** - Framework PHP
- **PHP 8.2+** - Lenguaje de programación
- **SQLite** - Base de datos (por defecto)
- **Inertia.js 2.0** - Adaptador para SPA
- **Laravel Fortify** - Autenticación
- **Laravel Scout** - Búsqueda full-text
- **Laravel Tinker** - REPL interactivo

### Frontend
- **React 19** - Librería de UI
- **TypeScript 5.7** - Tipado estático
- **Vite 7** - Build tool
- **TailwindCSS 4** - Framework CSS
- **Radix UI** - Componentes accesibles
- **Headless UI** - Componentes sin estilos
- **Lucide React** - Iconos

### Herramientas de Desarrollo
- **Laravel Pint** - Linter PHP
- **ESLint** - Linter JavaScript/TypeScript
- **Prettier** - Formateador de código
- **Pest** - Framework de testing PHP
- **Laravel Sail** - Entorno Docker

## 📦 Requisitos

- PHP >= 8.2
- Composer >= 2.0
- Node.js >= 20.x
- NPM >= 10.x
- SQLite (o cualquier base de datos compatible con Laravel)

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/MiguelMort09/laravel-practice-app.git
cd laravel-practice-app
```

### 2. Instalación rápida con Composer

```bash
composer setup
```

Este comando ejecutará automáticamente:
- Instalación de dependencias PHP
- Creación del archivo .env
- Generación de la clave de aplicación
- Migraciones de base de datos
- Instalación de dependencias NPM
- Compilación de assets

### 3. Instalación manual (alternativa)

```bash
# Instalar dependencias PHP
composer install

# Copiar archivo de configuración
cp .env.example .env

# Generar clave de aplicación
php artisan key:generate

# Crear base de datos SQLite
touch database/database.sqlite

# Ejecutar migraciones
php artisan migrate

# Instalar dependencias NPM
npm install

# Compilar assets
npm run build
```

## ⚙️ Configuración

### Variables de Entorno

El archivo `.env` contiene la configuración principal de la aplicación:

#### Configuración de la Aplicación
```env
APP_NAME=Laravel
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost
APP_LOCALE=en
```

#### Base de Datos
```env
DB_CONNECTION=sqlite
# Para MySQL/PostgreSQL, descomentar y configurar:
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=
```

#### Sesiones y Caché
```env
SESSION_DRIVER=database
SESSION_LIFETIME=120
CACHE_STORE=database
QUEUE_CONNECTION=database
```

#### Correo
```env
MAIL_MAILER=log
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

## ✨ Características Principales

### 1. Gestión de Clientes
- **CRUD Completo**: Crear, leer, actualizar y eliminar clientes
- **Encriptación de Datos**: Todos los campos sensibles están encriptados
- **Paginación**: Listado con paginación configurable (10, 15, 25, 50, 100 registros)
- **Autenticación Requerida**: Solo usuarios autenticados pueden gestionar clientes
- **Campos del Cliente**:
  - Nombre (encriptado)
  - RFC (encriptado)
  - Dirección (encriptada)
  - Teléfono (encriptado)
  - Sitio web (encriptado)

### 2. Detector de Palíndromos
- **Algoritmo de Detección**: Identifica palabras palíndromas en un array
- **Limpieza de Texto**: Normaliza texto eliminando caracteres especiales
- **Interfaz Interactiva**: Permite ingresar múltiples palabras y obtener resultados
- **Validación**: Requiere mínimo 2 palabras para el análisis

### 3. Gestión de Publicaciones (JSON Placeholder API)
- **Consumo de API Externa**: Integración con JSONPlaceholder API
- **CRUD Completo**: Operaciones sobre publicaciones
- **Persistencia en Sesión**: Mantiene estado de posts editados, creados y eliminados
- **Paginación**: 10 registros por página
- **Sincronización**: Mezcla datos de API con datos locales

### 4. Sistema de Autenticación
- **Registro de Usuarios**: Con Laravel Fortify
- **Login/Logout**: Gestión de sesiones
- **Verificación de Email**: Verificación de correo electrónico
- **Recuperación de Contraseña**: Sistema de reset de contraseña por RFC
- **Autenticación de Dos Factores (2FA)**: Configuración opcional
- **Gestión de Perfil**: Actualización de datos personales

## 📁 Estructura del Proyecto

```
laravel-practice-app/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   │   └── AuthController.php          # Autenticación
│   │   │   ├── Settings/
│   │   │   │   ├── PasswordController.php      # Cambio de contraseña
│   │   │   │   ├── ProfileController.php       # Perfil de usuario
│   │   │   │   └── TwoFactorAuthenticationController.php
│   │   │   ├── AlgorithmController.php         # Detector de palíndromos
│   │   │   ├── CustomerController.php          # Gestión de clientes
│   │   │   └── ServiceController.php           # API JSONPlaceholder
│   │   └── Requests/                           # Form requests
│   ├── Models/
│   │   ├── Customer.php                        # Modelo de cliente
│   │   └── User.php                            # Modelo de usuario
│   └── Services/
│       ├── AuthService.php                     # Lógica de autenticación
│       ├── CustomerService.php                 # Lógica de clientes
│       ├── JsonPlaceholderService.php          # Consumo de API
│       └── PalindromeService.php               # Algoritmo de palíndromos
├── database/
│   ├── migrations/                             # Migraciones de BD
│   └── database.sqlite                         # Base de datos SQLite
├── resources/
│   ├── js/                                     # Código React/TypeScript
│   │   ├── components/                         # Componentes React
│   │   ├── pages/                              # Páginas Inertia
│   │   └── app.tsx                             # Punto de entrada
│   └── css/
│       └── app.css                             # Estilos globales
├── routes/
│   ├── web.php                                 # Rutas web
│   ├── settings.php                            # Rutas de configuración
│   └── console.php                             # Comandos de consola
├── tests/                                      # Tests con Pest
├── .env.example                                # Ejemplo de configuración
├── composer.json                               # Dependencias PHP
├── package.json                                # Dependencias NPM
├── phpunit.xml                                 # Configuración PHPUnit
└── vite.config.ts                              # Configuración Vite
```

## 🗄️ Base de Datos

### Tablas Principales

#### `users` - Usuarios del sistema
```
- id: bigint (PK)
- name: string
- email: string (unique)
- email_verified_at: timestamp
- password: string
- rfc: string (nullable)
- two_factor_secret: text (encrypted)
- two_factor_recovery_codes: text (encrypted)
- two_factor_confirmed_at: timestamp
- remember_token: string
- timestamps
```

#### `customers` - Clientes
```
- id: bigint (PK)
- user_id: bigint (FK -> users.id)
- name: string (encrypted)
- rfc: string (encrypted)
- address: string (encrypted)
- phone: string (encrypted)
- website: string (encrypted)
- timestamps
```

#### Otras Tablas
- `cache` - Almacenamiento de caché
- `jobs` - Cola de trabajos
- `password_reset_tokens` - Tokens de reset de contraseña
- `sessions` - Sesiones de usuario

## 🛣️ Rutas Disponibles

### Rutas Públicas
```
GET  /                              # Página de bienvenida
GET  /login                         # Formulario de login
POST /login                         # Procesar login
GET  /register                      # Formulario de registro
POST /register                      # Procesar registro
GET  /forgot-password               # Recuperación de contraseña
POST /forgot-password               # Enviar email de recuperación
GET  /reset-password/{token}        # Formulario de reset
POST /reset-password                # Procesar reset
GET  /reset-password-email-rfc      # Reset por RFC
POST /reset-password-email-rfc      # Procesar reset por RFC
```

### Rutas Autenticadas
```
GET  /dashboard                     # Panel principal
POST /logout                        # Cerrar sesión

# Clientes
GET  /customers                     # Listar clientes
POST /customers                     # Crear cliente
PUT  /customers/{id}                # Actualizar cliente
DELETE /customers/{id}              # Eliminar cliente

# Algoritmos
GET  /algorithms                    # Página de algoritmos
POST /algorithms/detect             # Detectar palíndromos

# Servicios (JSONPlaceholder)
GET  /services                      # Listar publicaciones
POST /services                      # Crear publicación
PUT  /services/{id}                 # Actualizar publicación
DELETE /services/{id}               # Eliminar publicación

# Configuración
GET  /settings/profile              # Perfil de usuario
PUT  /settings/profile              # Actualizar perfil
GET  /settings/password             # Cambiar contraseña
PUT  /settings/password             # Actualizar contraseña
GET  /settings/two-factor           # Autenticación 2FA
POST /settings/two-factor           # Habilitar 2FA
DELETE /settings/two-factor         # Deshabilitar 2FA
```

## 💻 Comandos de Desarrollo

### Desarrollo
```bash
# Modo desarrollo (ejecuta servidor, queue y vite)
composer dev

# Modo desarrollo con SSR
composer dev:ssr

# Solo servidor Laravel
php artisan serve

# Solo compilación de assets
npm run dev

# Compilar assets para producción
npm run build

# Compilar con SSR
npm run build:ssr
```

### Base de Datos
```bash
# Ejecutar migraciones
php artisan migrate

# Revertir última migración
php artisan migrate:rollback

# Revertir todas las migraciones
php artisan migrate:reset

# Revertir y ejecutar todas las migraciones
php artisan migrate:refresh

# Ejecutar seeders
php artisan db:seed
```

### Caché y Optimización
```bash
# Limpiar caché de configuración
php artisan config:clear

# Cachear configuración
php artisan config:cache

# Limpiar caché de rutas
php artisan route:clear

# Cachear rutas
php artisan route:cache

# Limpiar caché de vistas
php artisan view:clear

# Optimizar aplicación
php artisan optimize
```

### Queue y Trabajos
```bash
# Procesar trabajos en cola
php artisan queue:work

# Escuchar cola con reinicio automático
php artisan queue:listen

# Ver trabajos fallidos
php artisan queue:failed

# Reintentar trabajos fallidos
php artisan queue:retry all
```

### Linting y Formateo
```bash
# Formatear código PHP
./vendor/bin/pint

# Formatear código JavaScript/TypeScript
npm run format

# Verificar formato
npm run format:check

# Ejecutar ESLint
npm run lint

# Verificar tipos TypeScript
npm run types
```

## 🧪 Testing

### Ejecutar Tests
```bash
# Todos los tests
php artisan test

# O usando Composer
composer test

# Tests con cobertura
php artisan test --coverage

# Tests específicos
php artisan test --filter=NombreDelTest

# Tests con Pest directamente
./vendor/bin/pest
```

### Estructura de Tests
```
tests/
├── Feature/          # Tests de características completas
├── Unit/             # Tests unitarios
└── Pest.php          # Configuración de Pest
```

## 📝 Notas Adicionales

### Encriptación de Datos
Los datos sensibles de los clientes están encriptados usando el sistema de encriptación de Laravel. Asegúrate de tener configurada correctamente la clave de aplicación (`APP_KEY`).

### API Externa
La funcionalidad de servicios consume la API pública de JSONPlaceholder (https://jsonplaceholder.typicode.com). Las operaciones se sincronizan con la sesión del usuario para mantener consistencia.

### React Compiler
Este proyecto utiliza el React Compiler experimental para optimizaciones automáticas. Está configurado en el plugin de Vite.

### SSR (Server-Side Rendering)
El proyecto está configurado para soportar SSR con Inertia.js. Usa `composer dev:ssr` para desarrollo con SSR habilitado.

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 👥 Autor

Desarrollado por MiguelMort09 como proyecto de práctica de Laravel.
