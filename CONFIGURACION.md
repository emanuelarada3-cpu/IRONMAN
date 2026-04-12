# ⚙️ CONFIGURACIÓN RÁPIDA

## 1️⃣ Backend - Configurar SMTP para OTP

### ✅ Usando Gmail (Recomendado)

1. **Abre tu cuenta Gmail:**
   - Ve a `myaccount.google.com`
   - Haz clic en "Seguridad" (izquierda)

2. **Activa verificación en 2 pasos:**
   - Si no lo hiciste: `myaccount.google.com/security`
   - Busca "Verificación de 2 pasos"
   - Sigue los pasos

3. **Genera App Password:**
   - Ve a `myaccount.google.com/apppasswords`
   - Selecciona: **Correo (Gmail)** y **Windows/Linux**
   - Google generará: `xxxx xxxx xxxx xxxx`
   - **Copia sin espacios**

4. **Edita `soldadura-backend/.env`:**

   ```env
   MAIL_USER=tu_email@gmail.com
   MAIL_PASS=xxxxxxxxxxxxxx      # La contraseña de app sin espacios
   ```

5. **Guarda y listo** ✅

---

### Alternativas: Outlook / Hotmail

```env
MAIL_HOST=smtp-mail.outlook.com
MAIL_PORT=587
MAIL_USER=tu_email@outlook.com
MAIL_PASS=tu_password_normal
```

---

## 2️⃣ Backend - Información del Negocio (Opcional)

En `soldadura-backend/.env`:

```env
# Información que aparece en correos y se puede editar desde el dashboard
BUSINESS_NAME=IronMan
```

---

## 3️⃣ Frontend - Sin configuración adicional

Angular 21 está preconfigurado para:

- Conectar a `http://localhost:3000/api` automáticamente
- Cargar settings del negocio al iniciar
- Detectar ubicación con navegador nativo

---

## 4️⃣ Admin - Cambiar contraseña

**Primero iniciar de sesión:**

1. Ejecuta ambos servidores
2. Ve a `http://localhost:4200/login`
3. Email: `admin@soldadurallastunas.cu`
4. Password: `Admin1234!` (o la que pusiste en `.env`)
5. Recibe OTP en tu correo → Ingresa para entrar

---

## 5️⃣ Usuario Normal - Flujo de Registro

1. Haz clic en "Registrarse"
2. Completa: Nombre, Email, Teléfono (opcional), Contraseña
3. Se crea cuenta
4. Inicia sesión
5. Recibirás OTP en 30 segundos → Ingresa código
6. ¡Listo! En tu dashboard

---

## 🐛 Si el correo no llega

**Checklist:**

- ✓ `MAIL_USER` y `MAIL_PASS` son correctos en `.env`
- ✓ Si es Gmail: usaste **App Password**, no contraseña normal
- ✓ Backend se reinició después de editar `.env`
- ✓ El correo está en spam o promotions (búscalo)
- ✓ Puerto 587 no está bloqueado por firewall

**Debug:**

```bash
# En terminal del backend, verás log:
# "OTP sent to correo@email.com"
# Si no aparece, hay error en config SMTP
```

---

## 🎯 Primeros Pasos Usuario Admin

1. **Entra al Dashboard Admin** → `/dashboard/admin`
2. **Pestaña: Configuración** (última tab)
3. Edita campos:
   - `business_name`
   - `business_slogan`
   - `business_address`
   - `whatsapp` (formato: `53534123456`, código de país + número)
   - `facebook`, `instagram`, `tiktok`
   - Ubicación: `business_lat` y `business_lng`
4. **Haz clic en "Guardar"**
5. La landing se actualiza automáticamente en 2 minutos

---

## 🗺️ Cambiar Ubicación del Mapa

**Opción 1: Dashboard Owner/Admin**

- Edita `business_lat` y `business_lng`
- Encuentra coordenadas en `google.com/maps`

**Opción 2: Automáticamente**

- Los propietarios pueden actualizar desde panel

**Ejemplo de coordenadas (Las Tunas):**

- Lat: `20.9666`
- Lng: `-76.9511`

---

## 📱 WhatsApp - Formato Correcto

En settings, campo `whatsapp`, usa:

- **Con código de país Cuba:** `5353512345` (sin + ni espacios)
- **Internacional:** `34654123456` (España, ejemplo)

En landing automáticamente genera link:

- `https://wa.me/5353512345`

---

## 🚀 Próximas Ejecuciones

Simplemente:

```bash
# Opción 1: Scripts de inicio (Windows)
.\start-dev.bat          # O
.\start-dev.ps1

# Opción 2: Manual
cd soldadura-backend && npm run start:dev     # Terminal 1
cd soldadura-frontend && ng serve             # Terminal 2
```

**¡Listo! La plataforma está 100% operativa.** 🔥
