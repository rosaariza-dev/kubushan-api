# ✨Kubushan API ☕💜

API REST de Kubushan, una cafetería con propósito que combina tradición y tecnología.
Desarrollada con Node.js, Express y MongoDB, esta API facilita la gestión de tipos y productos, tanto para la parte administrativa como para la página principal del cliente.
Incluye autenticación JWT, control de peticiones con rate limiting, manejo global de errores, logs con correlation ID y almacenamiento de imágenes en Cloudinary para un acceso rápido y seguro.

## 📚 Índice

[🧩 Tecnologías utilizadas](#-tecnologías-utilizadas)

[⚙️ Características principales](#-características-principales)

[📁 Arquitectura del proyecto](#-arquitectura-del-proyecto)

[🔧 Instalación local](#-instalación-local)

[🧾 Configurar variables de entorno](#-configurar-variables-de-entorno)

[🔐 Seguridad](#-seguridad)

[🧱 Manejo de errores](#-manejo-de-errores)

[🪵 Logging](#-logging)

[🧭 Rutas principales](#-rutas-principales)

- [🔑 Autenticación](#-autenticación)

  [🔹 POST /api/v1/auth/login](#-post-/api/v1/auth/login)

  [🔹 POST /api/v1/auth/register](#-post-/api/v1/auth/register)

- [💠 Tipos](#-tipos)

  [🔹 GET /api/v1/types](#-get-/api/v1/types)

  [🔹 GET /api/v1/types/:id](#-get-/api/v1/types/:id)

  [🔹 GET /api/v1/types/:id/products](#-get-/api/v1/types/:id/products)

  [🔹 POST /api/v1/types](#-post-/api/v1/types)

  [🔹 PUT /api/v1/types/:id](#-put-/api/v1/types/:id)

  [🔹 DELETE /api/v1/types/:id](#-delete-/api/v1/types/:id)

  [🔹 POST /api/v1/types/:id/images](#-post-/api/v1/types/:id/images)

  [🔹GET /api/v1/types/:id/images](#-get-/api/v1/types/:id/images)

  [🔹 DELETE /api/v1/types/:id/images](#-delete-/api/v1/types/:id/images)

- [📦 Productos](#-productos)

  [🔹 GET /api/v1/products](#-get-/api/v1/products)

  [🔹 GET /api/v1/products/:id](#-get-/api/v1/products/:id)

  [🔹 POST /api/v1/products](#-post-/api/v1/products)

  [🔹 PUT /api/v1/products/:id](#-put-/api/v1/products/:id)

  [🔹 DELETE /api/v1/products/:id](#-delete-/api/v1/products/:id)

  [🔹 POST /api/v1/products/:id/images](#-post-/api/v1/products/:id/images)

  [🔹GET /api/v1/products/:id/images](#-get-/api/v1/products/:id/images)

  [🔹 DELETE /api/v1/products/:id/images](#-delete-/api/v1/products/:id/images)

- [🖼️ Imágenes](#-imágenes)

  [🔹 GET /api/v1/images](#-get-/api/v1/images)

  [🔹 GET /api/v1/images/:publicId](#-get-/api/v1/images/:publicId)

- [✉️ Suscripción](#-suscripción)

  [🔹 POST /api/v1/email](#-post-/api/v1/email)

[🚦 Rate Limiting](#-rate-limiting)

[Créditos y recursos](#créditos-y-recursos)

[Licencia](#-licencia)

## 🧩 Tecnologías utilizadas

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Winston](https://img.shields.io/badge/Winston-6C757D?style=for-the-badge)
![Express-rate-limit](https://img.shields.io/badge/Express--rate--limit-0066FF?style=for-the-badge)
![Zod](https://img.shields.io/badge/Zod/v4-3178C6?style=for-the-badge&logo=zod&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-4285F4?style=for-the-badge&logo=cloudinary&logoColor=white)

## ⚙️ Características principales

🧱 **Arquitectura limpia y modular** → Separación clara por controladores, servicios, modelos y validaciones.

🔐 **Autenticación segura con JWT** → Protección de rutas administrativas.

🚦 **Rate Limiting** → Previene el abuso de peticiones y mejora la seguridad.

🪵 **Logs estructurados con correlation ID** → Trazabilidad completa de cada solicitud.

☁️ **Gestión de imágenes en [Cloudinary](https://cloudinary.com)** → Almacenamiento en la nube con acceso rápido y seguro.

## 📁 Arquitectura del proyecto

La API sigue una arquitectura limpia y modular, separando responsabilidades en distintas capas para facilitar la mantenibilidad, escalabilidad y pruebas.

```bash
📁 src/
├── 📁 config/          # Configuraciones globales (entorno, cloudinary, nodemailer, winston.)
├── 📁 controllers/     # Controladores que gestionan la lógica de las peticiones HTTP
├── 📁 database/        # Conexión y configuración de MongoDB
├── 📁 exceptions/      # Excepciones personalizadas (errores de negocio)
├── 📁 logger/          # Implementación del sistema de logs
├── 📁 middlewares/     # Middlewares globales (autenticación, manejo de errores, rate limiting, etc.)
├── 📁 models/          # Modelos Mongoose (entidades de base de datos)
├── 📁 routes/          # Definición de rutas por módulo
├── 📁 services/        # Lógica de negocio y comunicación con los modelos
├── 📁 utils/           # Utilidades comunes (helpers, formateadores, etc.)
├── 📁 validations/     # Validaciones de entrada con Zod (v4)
└── 📄 app.js           #  Configuración principal de Express y carga de middlewares
```

## 🔧 Instalación local

a. Clona el repositorio.

```bash
  npm install https://github.com/rosaariza-dev/kubushan-api.git
  cd kubushan-api
```

b. Instala las dependencias

```bash
  npm install
```

c. Inicia el servidor de desarrollo

```bash
  npm run dev
```

## 🧾 Configurar variables de entorno

Crea un archivo .env en la raíz del proyecto con las siguientes variables:

```bash
PORT=
NODE_ENV=
DB_URI=
CLOUDINARY_URL=
EMAIL_PASSWORD=
ACCOUNT_EMAIL=
CLIENT_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
```

| Variable         | Descripción                                                                                                                |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `PORT`           | Puerto en el que se ejecutará el servidor (por ejemplo: `3000`).                                                           |
| `NODE_ENV`       | Entorno de ejecución de la aplicación: `development` o `production`.                                                       |
| `DB_URI`         | Cadena de conexión a la base de datos **MongoDB** (por ejemplo: `mongodb+srv://user:password@cluster.mongodb.net/dbname`). |
| `CLOUDINARY_URL` | URL de conexión al servicio de **Cloudinary** para la gestión de archivos e imágenes.                                      |
| `EMAIL_PASSWORD` | Contraseña de aplicación del correo remitente (por ejemplo, para **Gmail App Passwords**).                                 |
| `ACCOUNT_EMAIL`  | Dirección de correo electrónico desde la cual se enviarán notificaciones.                                                  |
| `CLIENT_URL`     | URL del cliente (frontend) autorizado para interactuar con la API (por ejemplo: `https://miapp.com`).                      |
| `JWT_SECRET`     | Clave secreta utilizada para firmar y verificar los **tokens JWT**. ⚠️ **Debe mantenerse privada.**                        |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token JWT (por ejemplo: `1h`, `7d`, etc.).                                                        |

## 🔐 Seguridad

- **JWT Authentication**: Las rutas administrativas y protegidas requieren un token JWT válido.

- **Rate Limiting**: Previene ataques de fuerza bruta y abuso del servicio.

- **Validation Layer**: Toda la entrada se valida antes de llegar a la lógica de negocio.

- **Error Handling**: Los errores se gestionan globalmente mediante un middleware, con excepciones personalizadas para los errores de negocio.

## 🧱 Manejo de errores

- **Errores personalizados** definidos en `/exceptions` para representar reglas de negocio.

- **Middleware global de errores** que captura cualquier excepción no manejada y responde con un formato unificado.

- **Logs detallados** con nivel de severidad y correlationId para rastrear cada petición.

## 🪵 Logging

El sistema de logs registra toda la vida del request:

- Fecha y hora

- Nivel (`INFO`,`DEBUG`, `WARN`, `ERROR` )

- Correlation ID

- Endpoint y método

- Estado final (éxito o error)

- Tiempo de respuesta

Esto facilita el debugging y el seguimiento de trazas en entornos productivos.

Ejemplo de logs:

```bash
[2025-10-06 09:51:14] [INFO] [a32b379e] 🚀 Request started | {"method":"GET","url":"/api/v1/types","ip":"<IP>","userAgent":"<USER_AGENT>"}
[2025-10-06 09:51:15] [INFO] [a32b379e] ✅ Request completed | {"method":"GET","url":"/api/v1/types","statusCode":200,"responseTime":"117ms"}
[2025-10-06 09:56:23] [WARN] [a6b8c004] ❌ Request completed | {"method":"GET","url":"/api/v1/types","statusCode":500,"responseTime":"102ms"}

```

## 🧭 Rutas principales

## 🔑 Autenticación

### 🔹 POST `/api/v1/auth/login`

Inicia sesión y genera un token JWT.

**Auth:** ❌ No requiere autenticación

**Body:**

```json
{
  "username": "user",
  "password": "123456"
}
```

**Respuesta exitosa (200)**

```json
{
  "success": true,
  "message": "User authenticated successfully",
  "data": "<TOKEN>"
}
```

**Errores comunes**

- `400 Bad Request` → Campos inválidos

- `401 Unauthorized` → Credenciales inválidas

- `500 Internal Server Error` → Error del servidor

### 🔹 POST `/api/v1/auth/register`

Registra un nuevo usuario.

**Auth:** ✅ Requiere autenticación (solo los administradores pueden registrar usuarios)

**Body:**

```json
{
  "username": "user",
  "password": "123456",
  "admin": false
}
```

**Respuesta exitosa (200)**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "newUser": {
      "_id": "68e4f4b26b1234304017329d",
      "username": "user",
      "isAdmin": true,
      "createdAt": "2025-10-06T15:48:02.891Z",
      "updatedAt": "2025-10-06T15:48:02.891Z",
      "__v": 0
    },
    "token": "<TOKEN>"
  }
}
```

**Errores comunes**

- `400 Bad Request` → Campos inválidos

- `401 Unauthorized` → Token inválido, expirado o no proporcionado

- `409 Conflict` → El registro ya existe

- `403 Forbidden` → Acceso denegado

- `500 Internal Server Error` → Error del servidor

## 💠 Tipos

### 🔹 GET `/api/v1/types`

Consulta los tipos de productos.

**Auth:** ❌ No requiere autenticación

**Respuesta exitosa (200)**

```json
{
  "success": true,
  "message": "Types successfully consulted",
  "data": [
    {
      "_id": "6834da4e5c0b8a0f29b343ef",
      "name": "café caliente",
      "image": "https://res.cloudinary.com/dr7jjllpd/image/upload/v1759165213/6834da4e5c0b8a0f29b343ef.webp",
      "createdAt": "2025-05-26T21:17:02.556Z",
      "updatedAt": "2025-09-29T17:00:14.022Z",
      "__v": 0
    },
    {
      "_id": "68361a51190d3598686f88d7",
      "name": "bebidas heladas",
      "image": "https://res.cloudinary.com/dr7jjllpd/image/upload/v1759165311/68361a51190d3598686f88d7.webp",
      "createdAt": "2025-05-27T20:02:25.375Z",
      "updatedAt": "2025-09-29T17:01:52.117Z",
      "__v": 0
    }
  ]
}
```

**Errores comunes**

- `500 Internal Server Error` → Error del servidor

### 🔹 GET `/api/v1/types/:id`

Consulta un tipo de producto.

**Auth:** ❌ No requiere autenticación

**Parámetro de ruta**

- id → Identificador único del tipo de producto.

**Respuesta exitosa (200)**

```json
{
  "success": true,
  "message": "Types successfully consulted",
  "data": {
    "_id": "6834da4e5c0b8a0f29b343ef",
    "name": "café caliente",
    "image": "https://res.cloudinary.com/dr7jjllpd/image/upload/v1759165213/6834da4e5c0b8a0f29b343ef.webp",
    "createdAt": "2025-05-26T21:17:02.556Z",
    "updatedAt": "2025-09-29T17:00:14.022Z",
    "__v": 0
  }
}
```

**Errores comunes**

- `400 Bad Request` → Parámetro de ruta inválido

- `404 Not Found` → El tipo de producto no fue encontrado

- `500 Internal Server Error` → Error del servidor

### 🔹 GET `/api/v1/types/:id/products`

Consulta todos los productos relacionados a un tipo.

**Auth:** ❌ No requiere autenticación

**Parámetro de ruta**

- id → Identificador único del tipo de producto.

**Respuesta exitosa (200)**

```json
{
  "success": true,
  "message": "Products of type: <NAME_TYPE> successfully consulted",
  "data": [
    {
      "_id": "68350e08c57f0f70ebfd93d0",
      "title": "latte",
      "description": "café con leche vaporizada, suave y cremoso.",
      "price": 3000,
      "type": "6834da4e5c0b8a0f29b343ef",
      "image": "https://res.cloudinary.com/dr7jjllpd/image/upload/v1759252617/68350e08c57f0f70ebfd93d0.webp",
      "createdAt": "2025-05-27T00:57:44.630Z",
      "updatedAt": "2025-09-30T17:16:59.222Z",
      "__v": 0
    },
    {
      "_id": "68361b2c190d3598686f88e6",
      "title": "capuchino",
      "description": "espresso fuerte con leche y espuma cremosa en equilibrio perfecto.",
      "price": 3500,
      "type": "6834da4e5c0b8a0f29b343ef",
      "image": "https://res.cloudinary.com/dr7jjllpd/image/upload/v1759252821/68361b2c190d3598686f88e6.webp",
      "createdAt": "2025-05-27T20:06:04.711Z",
      "updatedAt": "2025-09-30T17:20:22.321Z",
      "__v": 0
    }
  ]
}
```

**Errores comunes**

- `400 Bad Request` → Parámetro de ruta inválido

- `404 Not Found` → El tipo de producto no fue encontrado

- `500 Internal Server Error` → Error del servidor

### 🔹 POST `/api/v1/types`

Crear un nuevo tipo de producto.

**Auth:** ✅ Requiere autenticación

**Body:**

```json
{
  "name": "Type1",
  "image": null
}
```

**Descripción de campos:**

- `name` (String) → Nombre del tipo de producto.

- `image` (String) → URL de Cloudinary de la imagen (puede ser `null` al crear).

**Respuesta exitosa (200)**

```json
{
  "success": true,
  "message": "Type create successfully",
  "data": {
    "_id": "68e3f2ca6b611730401741a8",
    "name": "Type1",
    "image": null,
    "createdAt": "2025-10-06T16:48:10.105Z",
    "updatedAt": "2025-10-06T16:48:10.105Z",
    "__v": 0
  }
}
```

**Errores comunes**

- `400 Bad Request` → Campos inválidos

- `401 Unauthorized` → Token inválido, expirado o no proporcionado

- `409 Conflict` → El tipo ya existe

- `403 Forbidden` → Acceso denegado

- `500 Internal Server Error` → Error del servidor

### 🔹 PUT `/api/v1/types/:id`

Actualizar un tipo de producto.

**Auth:** ✅ Requiere autenticación

**Parámetro de ruta**

- id → Identificador único del tipo de producto.

**Body:**

```json
{
  "name": "NewNameType",
  "image": null
}
```

**Descripción de campos:**

- `name` (String) → Nombre del tipo de producto.

- `image` (String) → URL de Cloudinary de la imagen (puede ser `null` al actualizar).

**Respuesta exitosa (200)**

```json
{
  "success": true,
  "message": "Type update successfully",
  "data": {
    "_id": "68e3f2ca6b611730401741a8",
    "name": "NewNameType",
    "image": null,
    "createdAt": "2025-10-06T16:48:10.105Z",
    "updatedAt": "2025-10-06T16:48:10.105Z",
    "__v": 0
  }
}
```

**Errores comunes**

- `400 Bad Request` → Campos inválidos

- `401 Unauthorized` → Token inválido, expirado o no proporcionado

- `404 Not Found` → El tipo de producto no fue encontrado

- `403 Forbidden` → Acceso denegado

- `500 Internal Server Error` → Error del servidor

### 🔹 DELETE `/api/v1/types/:id`

Eliminar un tipo de producto.

**Auth:** ✅ Requiere autenticación

**Parámetro de ruta**

- id → Identificador único del tipo de producto.

**Respuesta exitosa (200)**

```json
{
  "success": true,
  "message": "Type delete successfully",
  "data": {
    "_id": "68e3f2ca6b611730401741a8",
    "name": "NewNameType",
    "image": null,
    "createdAt": "2025-10-06T16:48:10.105Z",
    "updatedAt": "2025-10-06T16:57:56.755Z",
    "__v": 0
  }
}
```

**Errores comunes**

- `400 Bad Request` → Parámetro de ruta inválido

- `401 Unauthorized` → Token inválido, expirado o no proporcionado

- `404 Not Found` → El tipo de producto no fue encontrado

- `403 Forbidden` → Acceso denegado

- `500 Internal Server Error` → Error del servidor

### 🔹 POST `/api/v1/types/:id/images`

Permite subir una imagen vinculada a un tipo de producto. La imagen se guarda en Cloudinary y se asocia al registro correspondiente.

**Auth:** ✅ Requiere autenticación

**Parámetro de ruta**

- id → Identificador único del tipo de producto.

**Content-Type:** image/\* o application/octet-stream (por ejemplo: images/png, images/jpg)

**Body type:** file (contenido binario crudo).

> 💡 **Nota:** al usar Postman, selecciona la opción **“binary”** en la pestaña _Body_ y elige el archivo desde tu explorador.  
> No utilices `form-data` ni JSON — el cuerpo debe contener únicamente los bytes del archivo.

**Respuesta exitosa (200)**

```json
{
  "success": true,
  "message": "Image upload successfully",
  "data": {
    "updateType": {
      "_id": "68e3fc666b611730401741b5",
      "name": "Type1",
      "image": "https://res.cloudinary.com/dr7jjllpd/image/upload/v1759771841/68e3fc666b611730401741b5.png",
      "createdAt": "2025-10-06T17:29:10.470Z",
      "updatedAt": "2025-10-06T17:30:41.841Z",
      "__v": 0
    },
    "cloudinaryResult": {
      "public_id": "68e3fc666b611730401741b5",
      "display_name": "type_68e3fc666b611730401741b5",
      "secure_url": "https://res.cloudinary.com/dr7jjllpd/image/upload/v1759771841/68e3fc666b611730401741b5.png",
      "url": "http://res.cloudinary.com/dr7jjllpd/image/upload/v1759771841/68e3fc666b611730401741b5.png",
      "format": "png",
      "width": 800,
      "height": 800,
      "resource_type": "image",
      "asset_folder": ""
    }
  }
}
```

**Errores comunes**

- `400 Bad Request` → La imagen no tiene un formato válido, el `Content-Type` es incorrecto o no se proporcionó, o el archivo excede el tamaño permitido

- `401 Unauthorized` → Token inválido, expirado o no proporcionado

- `404 Not Found` → El tipo de producto no existe o el archivo está vacío/no se encontró

- `413 Payload Too Large` → La imagen excede el tamaño permitido

- `409 Conflict` → El tipo de producto ya tiene una imagen asociada

- `403 Forbidden` → Acceso denegado

- `500 Internal Server Error` → Error del servidor

### 🔹 GET `/api/v1/types/:id/images`

Obtiene la URL pública de la imagen vinculada a un tipo de producto. La imagen se encuentra alojada en Cloudinary.

**Auth:** ❌ No requiere autenticación

**Parámetro de ruta**

- id → Identificador único del tipo de producto.

**Respuesta exitosa (200)**

```json
{
  "success": true,
  "message": "Image successfully consulted",
  "data": {
    "public_id": "68e3fc666b611730401741b5",
    "display_name": "type_68e3fc666b611730401741b5",
    "secure_url": "https://res.cloudinary.com/dr7jjllpd/image/upload/v1759771841/68e3fc666b611730401741b5.png",
    "url": "http://res.cloudinary.com/dr7jjllpd/image/upload/v1759771841/68e3fc666b611730401741b5.png",
    "format": "png",
    "width": 800,
    "height": 800,
    "resource_type": "image",
    "asset_folder": ""
  }
}
```

**Errores comunes**

- `400 Bad Request` → Parámetro de ruta inválido, la imagen no existe en Cloudinary (se encuentra en respaldo).

- `404 Not Found` → El tipo de producto no existe o la imagen no fue encontrada en Cloudinary,

- `500 Internal Server Error` → Error del servidor

### 🔹 DELETE `/api/v1/types/:id/images`

Elimina la imagen asociada al tipo de producto en Cloudinary y actualiza el registro en la base de datos para mantener la consistencia.

**Auth:** ✅ Requiere autenticación

**Parámetro de ruta**

- id → Identificador único del tipo de producto.

**Respuesta exitosa (200)**

```json
{
  "success": true,
  "message": "Image successfully deleted",
  "data": {
    "updateType": {
      "_id": "68e3fc666b611730401741b5",
      "name": "Type1",
      "image": null,
      "createdAt": "2025-10-06T17:29:10.470Z",
      "updatedAt": "2025-10-06T18:32:17.599Z",
      "__v": 0
    },
    "cloudinaryResult": {
      "68e3fc666b611730401741b5": "deleted"
    }
  }
}
```

**Errores comunes**

- `400 Bad Request` → El tipo de producto no tiene una imagen asociada, la imagen pudo haber sido eliminada previamente de Cloudinary o no se logró borrar correctamente

- `401 Unauthorized` → Token inválido, expirado o no proporcionado

- `404 Not Found` → El tipo de producto no existe o la imagen no fue encontrada en Cloudinary.

- `403 Forbidden` → Acceso denegado

- `500 Internal Server Error` → Error del servidor

## 📦 Productos

### 🔹 GET `/api/v1/products`

Consulta los productos de kubushan.

**Auth:** ❌ No requiere autenticación

**Respuesta exitosa (200)**

```json
{
  "success": true,
  "message": "Products successfully consulted",
  "data": [
    {
      "_id": "68350e08c57f0f70ebfd93d0",
      "title": "latte",
      "description": "café con leche vaporizada, suave y cremoso.",
      "price": 3000,
      "type": "6834da4e5c0b8a0f29b343ef",
      "image": "https://res.cloudinary.com/dr7jjllpd/image/upload/v1759252617/68350e08c57f0f70ebfd93d0.webp",
      "createdAt": "2025-05-27T00:57:44.630Z",
      "updatedAt": "2025-09-30T17:16:59.222Z",
      "__v": 0
    },
    {
      "_id": "68361b2c190d3598686f88e6",
      "title": "capuchino",
      "description": "espresso fuerte con leche y espuma cremosa en equilibrio perfecto.",
      "price": 3500,
      "type": "6834da4e5c0b8a0f29b343ef",
      "image": "https://res.cloudinary.com/dr7jjllpd/image/upload/v1759252821/68361b2c190d3598686f88e6.webp",
      "createdAt": "2025-05-27T20:06:04.711Z",
      "updatedAt": "2025-09-30T17:20:22.321Z",
      "__v": 0
    }
  ]
}
```

**Errores comunes**

- `500 Internal Server Error` → Error del servidor

### 🔹 GET `/api/v1/products/:id`

Consulta un producto específico.

**Auth:** ❌ No requiere autenticación

**Parámetro de ruta**

- id → Identificador único del producto.

**Respuesta exitosa (200)**

```json
{
  "success": true,
  "message": "Product successfully consulted",
  "data": {
    "_id": "68350e08c57f0f70ebfd93d0",
    "title": "latte",
    "description": "café con leche vaporizada, suave y cremoso.",
    "price": 3000,
    "type": "6834da4e5c0b8a0f29b343ef",
    "image": "https://res.cloudinary.com/dr7jjllpd/image/upload/v1759252617/68350e08c57f0f70ebfd93d0.webp",
    "createdAt": "2025-05-27T00:57:44.630Z",
    "updatedAt": "2025-09-30T17:16:59.222Z",
    "__v": 0
  }
}
```

**Errores comunes**

- `400 Bad Request` → Parámetro de ruta inválido

- `404 Not Found` → El tipo de producto no fue encontrado

- `500 Internal Server Error` → Error del servidor

### 🔹 POST `/api/v1/products`

Crear un nuevo producto.

**Auth:** ✅ Requiere autenticación

**Body:**

```json
{
  "title": "Product1",
  "description": "DescriptionOfProduct1",
  "price": 3000,
  "type": "6834da4e5c0b8a0f29b343ef",
  "image": null
}
```

**Descripción de campos:**

- `title` (String) → Nombre del producto.

- `description` (String)→ Descripción breve del producto.

- `price` (Number) → Precio del producto en pesos (valor numérico).

- `type` (ObjectId) → Identificador del tipo de producto asociado.

- `image` (String) → URL de Cloudinary de la imagen (puede ser `null` al crear).

**Respuesta exitosa (200)**

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "68e4106538f6afffcea2e6f7",
    "title": "Product1",
    "description": "DescriptionOfProduct1",
    "price": 3000,
    "image": null,
    "type": "6834da4e5c0b8a0f29b343ef",
    "createdAt": "2025-10-06T18:54:29.705Z",
    "updatedAt": "2025-10-06T18:54:29.705Z",
    "__v": 0
  }
}
```

**Errores comunes**

- `400 Bad Request` → Campos inválidos

- `401 Unauthorized` → Token inválido, expirado o no proporcionado

- `409 Conflict` → El producto ya existe

- `403 Forbidden` → Acceso denegado

- `500 Internal Server Error` → Error del servidor

### 🔹 PUT `/api/v1/products/:id`

Actualiza un producto específico.

**Auth:** ✅ Requiere autenticación

**Parámetro de ruta**

- id → Identificador único del tipo de producto.

**Body:**

```json
{
  "title": "NewTitleOfProduct",
  "description": "NewDescriptionOfProduct",
  "price": 3000,
  "type": "6834da4e5c0b8a0f29b343ef",
  "image": null
}
```

**Descripción de campos:**

- `title` (String) → Nombre del producto.

- `description` (String)→ Descripción breve del producto.

- `price` (Number) → Precio del producto en pesos (valor numérico).

- `type` (ObjectId) → Identificador del tipo de producto asociado.

- `image` (String) → URL de Cloudinary de la imagen (puede ser `null` al actualizar).

**Respuesta exitosa (200)**

```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "68e4106538f6afffcea2e6f7",
    "title": "NewTitleProduct",
    "description": "NewDescriptionProduct",
    "price": 3000,
    "image": null,
    "type": "6834da4e5c0b8a0f29b343ef",
    "createdAt": "2025-10-06T18:54:29.705Z",
    "updatedAt": "2025-10-06T19:11:15.912Z",
    "__v": 0
  }
}
```

**Errores comunes**

- `400 Bad Request` → Campos inválidos

- `401 Unauthorized` → Token inválido, expirado o no proporcionado

- `404 Not Found` → El producto no fue encontrado

- `403 Forbidden` → Acceso denegado

- `500 Internal Server Error` → Error del servidor

### 🔹 DELETE `/api/v1/products/:id`

Elimina un producto específico.

**Auth:** ✅ Requiere autenticación

**Parámetro de ruta**

- id → Identificador único del tipo de producto.

**Respuesta exitosa (200)**

```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "_id": "68e4106538f6afffcea2e6f7",
    "title": "Product1",
    "description": "DescriptionOfProduct1",
    "price": 3000,
    "image": null,
    "type": "6834da4e5c0b8a0f29b343ef",
    "createdAt": "2025-10-06T18:54:29.705Z",
    "updatedAt": "2025-10-06T19:11:15.912Z",
    "__v": 0
  }
}
```

**Errores comunes**

- `400 Bad Request` → Parámetro de ruta inválido

- `401 Unauthorized` → Token inválido, expirado o no proporcionado

- `404 Not Found` → El producto no fue encontrado

- `403 Forbidden` → Acceso denegado

- `500 Internal Server Error` → Error del servidor

### 🔹 POST `/api/v1/products/:id/images`

Permite subir una imagen vinculada a un producto específico. La imagen se guarda en Cloudinary y se asocia al registro correspondiente.

**Auth:** ✅ Requiere autenticación

**Parámetro de ruta**

- id → Identificador único del tipo de producto.

**Content-Type:** image/\* o application/octet-stream (por ejemplo: images/png, images/jpg)

**Body type:** file (contenido binario crudo).

> 💡 **Nota:** al usar Postman, selecciona la opción **“binary”** en la pestaña _Body_ y elige el archivo desde tu explorador.  
> No utilices `form-data` ni JSON — el cuerpo debe contener únicamente los bytes del archivo.

**Respuesta exitosa (200)**

```json
{
  "success": true,
  "message": "Image upload successfully",
  "data": {
    "updateProduct": {
      "_id": "68e4153038f6afffcea2e704",
      "title": "product1",
      "description": "descriptionofproduct1",
      "price": 3000,
      "image": "https://res.cloudinary.com/dr7jjllpd/image/upload/v1759778128/68e4153038f6afffcea2e704.png",
      "type": "6834da4e5c0b8a0f29b343ef",
      "createdAt": "2025-10-06T19:14:56.659Z",
      "updatedAt": "2025-10-06T19:15:28.572Z",
      "__v": 0
    },
    "cloudinaryResult": {
      "public_id": "68e4153038f6afffcea2e704",
      "display_name": "prod_68e4153038f6afffcea2e704",
      "secure_url": "https://res.cloudinary.com/dr7jjllpd/image/upload/v1759778128/68e4153038f6afffcea2e704.png",
      "url": "http://res.cloudinary.com/dr7jjllpd/image/upload/v1759778128/68e4153038f6afffcea2e704.png",
      "format": "png",
      "width": 800,
      "height": 800,
      "resource_type": "image",
      "asset_folder": ""
    }
  }
}
```

**Errores comunes**

- `400 Bad Request` → La imagen no tiene un formato válido, el `Content-Type` es incorrecto o no se proporcionó, o el archivo excede el tamaño permitido

- `401 Unauthorized` → Token inválido, expirado o no proporcionado

- `404 Not Found` → El producto no existe o el archivo está vacío/no se encontró

- `413 Payload Too Large` → La imagen excede el tamaño permitido

- `409 Conflict` → El producto ya tiene una imagen asociada

- `403 Forbidden` → Acceso denegado

- `500 Internal Server Error` → Error del servidor

### 🔹 GET `/api/v1/products/:id/images`

Obtiene la URL pública de la imagen vinculada a un producto específico. La imagen se encuentra alojada en Cloudinary.

**Auth:** ❌ No requiere autenticación

**Parámetro de ruta**

- id → Identificador único del tipo de producto.

**Respuesta exitosa (200)**

```json
{
  "success": true,
  "message": "Image successfully consulted",
  "data": {
    "public_id": "68e4153038f6afffcea2e704",
    "display_name": "prod_68e4153038f6afffcea2e704",
    "secure_url": "https://res.cloudinary.com/dr7jjllpd/image/upload/v1759778128/68e4153038f6afffcea2e704.png",
    "url": "http://res.cloudinary.com/dr7jjllpd/image/upload/v1759778128/68e4153038f6afffcea2e704.png",
    "format": "png",
    "width": 800,
    "height": 800,
    "resource_type": "image",
    "asset_folder": ""
  }
}
```

**Errores comunes**

- `400 Bad Request` → Parámetro de ruta inválido, la imagen no existe en Cloudinary (se encuentra en respaldo).

- `404 Not Found` → El producto no existe o la imagen no fue encontrada en Cloudinary,

- `500 Internal Server Error` → Error del servidor

### 🔹 DELETE `/api/v1/products/:id/images`

Elimina la imagen asociada al producto en Cloudinary y actualiza el registro en la base de datos para mantener la consistencia.

**Auth:** ✅ Requiere autenticación

**Parámetro de ruta**

- id → Identificador único del tipo de producto.

**Respuesta exitosa (200)**

```json
{
  "success": true,
  "message": "Image successfully deleted",
  "data": {
    "updateProduct": {
      "_id": "68e4153038f6afffcea2e704",
      "title": "product1",
      "description": "descriptionofproduct1",
      "price": 3000,
      "image": null,
      "type": "6834da4e5c0b8a0f29b343ef",
      "createdAt": "2025-10-06T19:14:56.659Z",
      "updatedAt": "2025-10-06T19:24:32.877Z",
      "__v": 0
    },
    "cloudinaryResult": {
      "68e4153038f6afffcea2e704": "deleted"
    }
  }
}
```

**Errores comunes**

- `400 Bad Request` → El producto no tiene una imagen asociada, la imagen pudo haber sido eliminada previamente de Cloudinary o no se logró borrar correctamente

- `401 Unauthorized` → Token inválido, expirado o no proporcionado

- `404 Not Found` → El producto no existe o la imagen no fue encontrada en Cloudinary.

- `403 Forbidden` → Acceso denegado

- `500 Internal Server Error` → Error del servidor

## 🖼️ Imágenes

### 🔹 GET `/api/v1/images`

Consulta las imagenes almacenadas en Cloudinary.

**Auth:** ✅ Requiere autenticación

**Respuesta exitosa (200)**

```json
{
  "success": true,
  "message": "Images successfully consulted",
  "data": [
    {
      "public_id": "68dc96a9361fe275817c0166",
      "display_name": "prod_68dc96a9361fe275817c0166",
      "secure_url": "https://res.cloudinary.com/dr7jjllpd/image/upload/v1759287100/68dc96a9361fe275817c0166.webp",
      "url": "http://res.cloudinary.com/dr7jjllpd/image/upload/v1759287100/68dc96a9361fe275817c0166.webp",
      "format": "webp",
      "width": 500,
      "height": 879,
      "resource_type": "image",
      "asset_folder": ""
    },
    {
      "public_id": "68dc9668361fe275817c0162",
      "display_name": "prod_68dc9668361fe275817c0162",
      "secure_url": "https://res.cloudinary.com/dr7jjllpd/image/upload/v1759287077/68dc9668361fe275817c0162.webp",
      "url": "http://res.cloudinary.com/dr7jjllpd/image/upload/v1759287077/68dc9668361fe275817c0162.webp",
      "format": "webp",
      "width": 500,
      "height": 884,
      "resource_type": "image",
      "asset_folder": ""
    }
  ]
}
```

**Errores comunes**

- `401 Unauthorized` → Token inválido, expirado o no proporcionado

- `403 Forbidden` → Acceso denegado

- `500 Internal Server Error` → Error del servidor

### 🔹 GET `/api/v1/images/:publicId`

Consulta una imagen almacenada en Cloudinary.

**Auth:** ✅ Requiere autenticación

**Parámetro de ruta**

- publicId → Identificador único de la imagen en Cloudinary.

**Respuesta exitosa (200)**

```json
{
  "success": true,
  "message": "Image successfully consulted",
  "data": {
    "public_id": "68dc96a9361fe275817c0166",
    "display_name": "prod_68dc96a9361fe275817c0166",
    "secure_url": "https://res.cloudinary.com/dr7jjllpd/image/upload/v1759287100/68dc96a9361fe275817c0166.webp",
    "url": "http://res.cloudinary.com/dr7jjllpd/image/upload/v1759287100/68dc96a9361fe275817c0166.webp",
    "format": "webp",
    "width": 500,
    "height": 879,
    "resource_type": "image",
    "asset_folder": ""
  }
}
```

**Errores comunes**

- `400 Bad Request` → Parámetro de ruta inválido o la imagen pudo haber sido eliminada previamente de Cloudinary

- `404 Not Found` → La imagen no fue encontrada

- `401 Unauthorized` → Token inválido, expirado o no proporcionado

- `403 Forbidden` → Acceso denegado

- `500 Internal Server Error` → Error del servidor

## ✉️ Suscripción

### 🔹 POST `/api/v1/email`

Envia un correo de Suscripción o bienvenida.

**Auth:** ❌ No requiere autenticación

**Body:**

```json
{
  "toEmail": "tucorreo@dominio.com"
}
```

**Descripción de campos:**

- `toEmail` (String) → Correo del destinatario.

**Respuesta exitosa (200)**

```json
{
  "success": true,
  "message": "Subscription confirmed! Check your email.",
  "data": null
}
```

**Errores comunes**

- `400 Bad Request` → Campo de entrada inválido

- `409 Conflict` → El correo electrónico ya está suscrito

- `403 Forbidden` → El dominio del correo electrónico es desechable o temporal

- `500 Internal Server Error` → Error del servidor

## 🚦 Rate Limiting

La API implementa tres niveles de limitación de peticiones utilizando express-rate-limit, con el fin de evitar el abuso y proteger los recursos del servidor.

| Tipo de limitador    | Descripción                                                                         | Límite          | Intervalo  |
| -------------------- | ----------------------------------------------------------------------------------- | --------------- | ---------- |
| 🌍 **Global**        | Se aplica a todas las rutas públicas de la API.                                     | 200 solicitudes | 15 minutos |
| 🔐 **Autenticación** | Protege rutas sensibles como `/login` y `/register` contra ataques de fuerza bruta. | 5 solicitudes   | 15 minutos |
| ✉️ **Suscripción**   | Limita los intentos de suscripción a correos.                                       | 3 solicitudes   | 15 minutos |

**Errores comunes:**

- `429 Too Many Requests` → Se ha superado el número máximo de peticiones permitidas en el intervalo establecido.

## Créditos y recursos

👩‍💻 Desarrollado por: _Rosa Ariza - Desarrolladora Full-stack_.

⚙️ Proyecto estructurado desde cero con enfoque en escalabilidad y buenas prácticas

## Licencia

Este proyecto está licenciado bajo la BY-NC-ND 4.0 License.
Consulta el archivo LICENSE para más información.
