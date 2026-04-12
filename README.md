# 🔥 Plataforma IronMan

Sistema web moderno para gestión de solicitudes de servicios de soldadura en Las Tunas, Cuba.

## 📋 Requisitos

- **Node.js**: v22.x o superior
- **npm**: v11.x o superior
- **Cuenta SMTP**: Para envio de códigos OTP (Gmail recomendado)

## 🚀 Instalación y Ejecución

### 1. Configurar el Backend

```bash
cd "d:\Programacion\Nuevo Proyecto\soldadura-backend"

# Crear/actualizar archivo .env con tus datos SMTP
# Editar .env:
# MAIL_USER=tu_gmail@gmail.com
# MAIL_PASS=tu_app_password_gmail
# ADMIN_PASSWORD=tu_password_fuerte

# Instalar si no lo hiciste:
# npm install

# Iniciar servidor
npm run start:dev
```

**El backend estará en:** `http://localhost:3000/api`

La BD SQLite se crea automáticamente en `soldadura.sqlite`.

**Usuario admin predeterminado:**

- Email: `admin@ironman.cu`
- Contraseña: `Admin1234!` (cambiar en .env `ADMIN_PASSWORD`)

### 2. Configurar el Frontend

```bash
cd "d:\Programacion\Nuevo Proyecto\soldadura-frontend"

# Instalar si no lo hiciste:
# npm install

# Iniciar servidor
ng serve
```

**La app estará en:** `http://localhost:4200`

---

## 🌐 Flujos de Uso

### 📱 Usuario Normal

1. Accede a `http://localhost:4200`
2. Haz clic en "Registrarse"
3. Completa el formulario
4. Ve a "Iniciar sesión"
5. Entra email + contraseña
6. Recibirás un código OTP en tu correo → Ingresa para completar login
7. **Dashboard User**: Solicita trabajos de soldadura con ubicación (opcional)
8. Sigue el estado de tus solicitudes

### 👔 Dueño del Negocio

1. Crea cuenta como usuario normal
2. Admin le asigna rol **"owner"**
3. Accede a `/dashboard/owner`
4. **Gestión de trabajos**: Ver todas las solicitudes, cambiar estados (pendiente → en progreso → completado/cancelado)
5. **Configuración**: Edita dirección, WhatsApp, redes sociales, ubicación GPS, datos del negocio
6. Los cambios se reflejan inmediatamente en la landing page

### ⚙️ Administrador

1. Usuario predeterminado: `admin@soldadurallastunas.cu` / `Admin1234!`
2. Accede a `/dashboard/admin`
3. **Tres pestañas:**
   - **Trabajos**: Gestión completa (igual que owner)
   - **Usuarios**: Ver, cambiar roles (user ↔ owner ↔ admin), activar/desactivar
   - **Configuración**: Editar settings del negocio (igual que owner)

---

## ⚙️ Configuración del Correo (SMTP)

**Para Gmail con App Password:**

1. Activa verificación de 2 factores en tu cuenta Google
2. Ve a [`myaccount.google.com/apppasswords`](https://myaccount.google.com/apppasswords)
3. Selecciona "Mail" y "Windows/Linux"
4. Copia la contraseña generada (sin espacios)
5. En `soldadura-backend/.env`:
   ```env
   MAIL_USER=tu_email@gmail.com
   MAIL_PASS=xxxxx xxxx xxxx xxxx
   ```

**Para otros proveedores (Outlook, Hotmail, etc.):**

- Configura en `soldadura-backend/src/mail/mail.service.ts`
- O en `soldadura-backend/.env` según tu proveedor

---

## 📊 Estructura de Datos

### Usuarios

- **id**, name, email, password (bcrypt), phone, role (`admin|owner|user`), otp, otpExpiry, isActive
- OTP expira en 10 minutos

### Trabajos

- **id**, userId, description, latitude, longitude, address
- status: `pending|in_progress|completed|cancelled`
- notes, createdAt, updatedAt

### Configuración (editable)

- **business_name**, business_slogan, business_address, business_lat, business_lng
- **whatsapp**, facebook, instagram, tiktok, youtube, business_phone_display
- years_experience, jobs_done, clients

---

## 🎨 Landing Page Características

- ✨ **Animaciones profesionales**: Canvas con efectos de chisps, contador de números
- 🗺️ **Mapa Leaflet**: Ubicación del negocio (OpenStreetMap, sin API key)
- 📱 **Responsive**: Diseño mobile-first
- 🎯 **Dinámico**: Todos los datos vienen de `/settings/public` (sin código cambio necesario)
- ⚡ **Rápido**: Standalone components + signals + code splitting

### URL `/settings/public`

Devuelve JSON con toda la info del negocio (acceso público, sin autenticación).

---

## 🔐 Seguridad

- ✅ **Contraseñas**: Hash bcrypt con salt 12
- ✅ **JWT**: Expiración 8 horas (configurable)
- ✅ **CORS**: Solo `http://localhost:4200`
- ✅ **Rate Limiting**: 30 solicitudes / 60 seg (global), 10 / 60 seg en auth
- ✅ **Roles**: Guards en frontend y backend
- ✅ **OTP**: 6 dígitos, válido 10 minutos

---

## 📁 Estructura del Proyecto

```
Nuevo Proyecto/
├── soldadura-backend/          (NestJS v11)
│   ├── src/
│   │   ├── auth/              (login 2-pasos + JWT)
│   │   ├── jobs/              (CRUD trabajos)
│   │   ├── settings/          (configuración del negocio)
│   │   ├── users/             (gestión de usuarios - admin)
│   │   ├── mail/              (envío OTP por correo)
│   │   ├── entities/          (User, Job, Setting - TypeORM)
│   │   ├── common/            (guards, decoradores)
│   │   ├── app.module.ts      (módulo principal)
│   │   └── seed.service.ts    (crea admin inicial)
│   ├── .env                   (variables de entorno)
│   ├── soldadura.sqlite       (BD creada automáticamente)
│   └── package.json
│
└── soldadura-frontend/         (Angular 21)
    ├── src/
    │   ├── app/
    │   │   ├── core/
    │   │   │   ├── services/  (auth, jobs, settings, users)
    │   │   │   ├── guards/    (auth guard, role guard)
    │   │   │   ├── interceptors/ (JWT interceptor)
    │   │   │   └── models/    (types TypeScript)
    │   │   ├── features/
    │   │   │   ├── landing/   (landing page animada)
    │   │   │   ├── auth/      (login 2-pasos + register)
    │   │   │   └── dashboard/ (user, owner, admin)
    │   │   ├── app.routes.ts  (ruteo lazy-loading)
    │   │   └── app.config.ts  (providers + interceptores)
    │   └── styles.scss        (global + variables SCSS)
    └── package.json
```

---

## 🐛 Troubleshooting

**Error: "ng: El término no se reconoce"**
→ Instala CLI: `npm install -g @angular/cli@21`

**Error: "No se puede obtener la ubicación"**
→ El navegador debe estar en HTTPS o localhost
→ El usuario debe dar permiso de geolocalización

**Error: "Correo SMTP no funciona"**
→ Verifica que MAIL_USER y MAIL_PASS sean correctos
→ Gmail: usa app password, no tu contraseña normal

**Error: "Puerto 3000/4200 en uso"**
→ Backend: cambiar PORT en .env
→ Frontend: `ng serve --port 4201`

---

## 🚀 Despliegue (Futuro)

- **Backend**: Vercel, Railway, Heroku con SQLite o PostgreSQL
- **Frontend**: Vercel, Netlify
- **BD**: Migrar a PostgreSQL para producción
- **Dominio**: Configurar DNS y certificado SSL

---

## 📝 Notas

- Los trabajos incluyen ubicación del cliente (opcional)
- El mapa muestra la ubicación del negocio (configurable desde owner dashboard)
- Las animaciones de landing se cargan con AOS (Animate On Scroll)
- Las chispas del hero son Canvas nativo (sin librerías externas)
- El tema es oscuro profesional (`--fire-orange` #e67e22)

---

## 📞 Soporte

Para cambios en:

- **Dirección/ubicación del negocio**: Login como owner → Dashboard → Configuración
- **WhatsApp/redes sociales**: Mismo lugar
- **Gestión de usuarios/roles**: Admin dashboard → Usuarios
- **Códigos OTP no llegan**: Verificar config SMTP en `.env`

---

**¡Listo para usar! 🔥**
