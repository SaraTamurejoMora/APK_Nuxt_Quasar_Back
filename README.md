# 📱 PopMart Store Backend - Nuxt API

Backend API para la tienda online de **PopMart** desarrollada con **Nuxt 3**, **Drizzle ORM** y **SQLite**. Incluye autenticación con JWT, gestión de collectibles y peluches, y middleware de seguridad.

##  Descripción del Proyecto

API REST completa para la venta de figuras coleccionables y peluches PopMart que proporciona:
-  Autenticación de usuarios con JWT
-  Autenticación OAuth con GitHub
-  Gestión de productos PopMart (CRUD)
-  Control CORS configurado
-  Middleware de protección de rutas
-  Base de datos SQLite con Drizzle ORM

---

## 🛠️ Tecnologías

- **Nuxt 3** - Framework full-stack Vue
- **Drizzle ORM** - ORM type-safe para SQLite
- **SQLite** - Base de datos
- **TypeScript** - Tipado estático
- **nuxt-auth-utils** - Gestión de sesiones y autenticación
- **Zod** - Validación de esquemas

---

##  Instalación

Asegúrate de tener Node.js instalado. Luego ejecuta:

### npm
```bash
npm install
```

### pnpm
```bash
pnpm install
```

### yarn
```bash
yarn install
```

### bun
```bash
bun install
```

---

##  Desarrollo

Inicia el servidor de desarrollo en `http://localhost:3000`:

### npm
```bash
npm run dev
```

### pnpm
```bash
pnpm dev
```

### yarn
```bash
yarn dev
```

### bun
```bash
bun run dev
```

---

##  Endpoints API

###  Autenticación

#### **POST** `/auth/login`
Inicia sesión con email y contraseña.

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

**Respuesta (200):**
```json
{
  "id": 1,
  "name": "Juan",
  "email": "usuario@example.com",
  "login": "usuario@example.com"
}
```

---

#### **POST** `/auth/register`
Registra un nuevo usuario.

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "contraseña123"
}
```

---

#### **POST** `/auth/logout`
Cierra la sesión del usuario actual.

---

#### **GET** `/auth/github`
Inicia el flujo de autenticación con GitHub OAuth.

---

###  Productos PopMart

#### **GET** `/api/products`
Obtiene la lista de figuras coleccionables y peluches PopMart con filtros opcionales.

**Query Parameters:**
- `q` (string) - Búsqueda por título, descripción o colección
- `type` (string) - Filtrar por tipo: `peluche`, `figura`, `serie-limitada`
- `sort` (string) - Ordenamiento: `newest` (default), `priceAsc`, `priceDesc`

**Ejemplo:**
```
GET /api/products?q=blind-box&type=figura&sort=priceAsc
```

**Respuesta (200):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "imageUrl": "https://...",
    "title": "Molly Blind Box Series 1",
    "price": 12.99,
    "description": "Figura coleccionable PopMart Molly - Sorpresa ciega incluida",
    "collection": "Molly Garden Series",
    "type": "figura",
    "createdAt": 1704067200000
  },
  {
    "id": 2,
    "userId": 1,
    "imageUrl": "https://...",
    "title": "Peluche Molly Rosa",
    "price": 24.99,
    "description": "Suave peluche de la mascota Molly en color rosa pastel",
    "collection": "Molly Friends",
    "type": "peluche",
    "createdAt": 1704153600000
  }
]
```

---

#### **POST** `/api/products`
Crea un nuevo producto PopMart (requiere autenticación).

**Body:**
```json
{
  "title": "Crybaby Mermaid Blind Box",
  "price": 15.99,
  "description": "Figura coleccionable PopMart Crybaby serie Mermaid con packaging oficial",
  "collection": "Crybaby Mermaid Series",
  "type": "figura",
  "imageUrl": "https://..."
}
```

---

#### **PUT** `/api/products/[id]`
Actualiza un producto existente (requiere autenticación y pertenencia del usuario).

**Body:**
```json
{
  "title": "Crybaby Mermaid Blind Box - Premium",
  "price": 17.99,
  "description": "Figura coleccionable PopMart Crybaby serie Mermaid con packaging especial",
  "collection": "Crybaby Mermaid Series",
  "type": "figura"
}
```

---

#### **DELETE** `/api/products/[id]`
Elimina un producto (requiere autenticación y pertenencia del usuario).

---

###  Usuarios

#### **GET** `/api/users`
Obtiene la lista de usuarios (requiere autenticación).

---

#### **GET** `/api/session`
Obtiene la sesión actual del usuario autenticado.

**Respuesta (200):**
```json
{
  "id": 1,
  "name": "Juan",
  "email": "usuario@example.com",
  "login": "usuario@example.com"
}
```

---

#### **GET** `/api/admin`
Endpoint administrativo (requiere autenticación y permisos).

---

## Middleware

### 1. **Middleware de Autenticación** (`app/middleware/auth.ts`)

Protege las rutas que requieren autenticación. Redirige a `/login` si el usuario no está autenticado.

```typescript
export default defineNuxtRouteMiddleware(() => {
    const { loggedIn } = useUserSession();
    if (!loggedIn.value) {
        return navigateTo("/login")
    }
})
```

**Uso en rutas:**
```typescript
definePageMeta({
  middleware: 'auth'
})
```

---

### 2. **Middleware CORS** (`app/middleware/cors.ts`)

Gestiona las peticiones CORS. Permite solicitudes desde los siguientes orígenes:
- `http://localhost:9000`
- `http://127.0.0.1:9000`
- `http://0.0.0.0:9000`
- `http://10.0.2.2:9000`

**Métodos permitidos:** GET, POST, PUT, DELETE, OPTIONS

**Headers permitidos:** Content-Type, Authorization

**Características:**
- Valida el origen de la solicitud
- Permite credenciales en peticiones CORS
- Maneja peticiones preflight (OPTIONS)

---

## Autenticación JWT

### Implementación

El sistema de autenticación utiliza **JWT (JSON Web Tokens)** a través del módulo `nuxt-auth-utils`.

### Flujo de Autenticación

1. **Login:**
   - El usuario envía email y contraseña al endpoint `POST /auth/login`
   - Las credenciales se validan contra la base de datos
   - Se crea una sesión con JWT automáticamente
   - El token se almacena en una cookie segura (httpOnly)

2. **Verificación:**
   - Cada petición autenticada incluye el token JWT en los headers
   - El middleware valida el token automáticamente
   - Si el token es inválido, se rechaza la petición

3. **Logout:**
   - Al hacer logout, se destruye la sesión y el token


### Seguridad

- Las contraseñas se hashean antes de guardarse
- Los tokens se almacenan en cookies httpOnly (no accesibles desde JavaScript)
- CORS está configurado para permitir solo orígenes autorizados
- Las rutas protegidas redirigen a login si no hay sesión

---

## Base de Datos

### Esquema

**Tabla: users**
- `id` - Identificador único (PK)
- `name` - Nombre del usuario
- `email` - Email único
- `login` - Usuario para login
- `password` - Contraseña hasheada (nullable para OAuth)

**Tabla: products**
- `id` - Identificador único (PK)
- `userId` - ID del usuario propietario (FK)
- `imageUrl` - URL de la imagen del producto
- `title` - Título del coleccionable/peluche
- `price` - Precio en euros
- `description` - Descripción del producto
- `collection` - Colección PopMart a la que pertenece (ej: Molly, Crybaby, etc)
- `type` - Tipo de producto: `peluche`, `figura`, `serie-limitada`
- `createdAt` - Fecha de creación (timestamp)

---

## 🏗️ Producción

### Build

Compila la aplicación para producción:

```bash
npm run build
```

### Preview

Vista previa local de la compilación de producción:

```bash
npm run preview
```

---

## 📂 Estructura del Proyecto

```
├── app/
│   ├── middleware/          # Middlewares de la aplicación
│   │   ├── auth.ts         # Protección de rutas
│   │   └── cors.ts         # Control de CORS
│   ├── pages/              # Páginas de la aplicación
│   └── components/         # Componentes Vue
├── server/
│   ├── api/                # Endpoints API
│   │   ├── products/       # Endpoints de productos PopMart
│   │   ├── users.ts
│   │   ├── admin.ts
│   │   └── session.get.ts
│   ├── routes/             # Rutas del servidor
│   │   └── auth/           # Rutas de autenticación
│   ├── db/
│   │   ├── schema.ts       # Esquema de base de datos
│   │   └── index.ts        # Configuración de BD
│   └── utils/              # Utilidades del servidor
│       └── registerUtils.ts
├── nuxt.config.ts          # Configuración de Nuxt
├── drizzle.config.ts       # Configuración de Drizzle ORM
└── package.json
```

---

## 🧸 Colecciones PopMart Soportadas

- **Molly** - Mascota icónica con múltiples series y variantes
- **Crybaby** - Serie emotiva con diferentes temas (Mermaid, Space, etc)
- **Dimoo** - Personajes adorables y expresivos
- **Labubu** - Figuras con características únicas y limitadas
- **Corgi** - Serie de adorables corgis coleccionables
- Y muchas más colecciones exclusivas...

---

## 📚 Documentación Adicional

- [Nuxt Docs](https://nuxt.com/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [nuxt-auth-utils](https://github.com/atinc/nuxt-auth-utils)
- [PopMart Official](https://www.popmart.com/)

---

## 📝 Licencia

Proyecto desarrollado por Sara Tamurejo Mora

---

¡Tienda PopMart lista para producción! 🧸🚀
