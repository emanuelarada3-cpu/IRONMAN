# Reporte de Errores Internos - Servidor IronMan

## Error: SMTP Authentication Failed (Error 500)

### 📋 Descripción del Problema

Cuando el usuario intenta hacer login en el sistema, recibe un **error 500 (Internal Server Error)** después de ingresar email y contraseña.

### 🔍 Causa Raíz

**Error en Backend:**

```
[Nest] 22760  - 11/04/2026, 2:54:26 p.m.   ERROR [MailService]
Failed to send OTP to juan@test.com: Invalid login: 535-5.7.8 Username and
Password not accepted.
```

**Razón:**

- Las credenciales SMTP en el archivo `.env` son placeholders (valores ejemplo):
  ```env
  MAIL_USER=tucorreo@gmail.com
  MAIL_PASS=tu_app_password_de_gmail
  ```
- Cuando el usuario intenta loguearse, el sistema genera un OTP y lo intenta enviar por email
- Nodemailer (cliente SMTP) falla porque las credenciales no son válidas
- El error se propaga al cliente como `500 Internal Server Error`

### ✅ Solución

#### Opción 1: Configurar Gmail Real (Recomendado)

1. **Obtener App Password de Google:**
   - Ir a: https://myaccount.google.com/security
   - Activar "Verificación en dos pasos" si no está activa
   - Ir a "Contraseñas de aplicación"
   - Seleccionar: `Mail` + `Windows Computer`
   - Google genera una contraseña de 16 caracteres
   - Copiar la contraseña (sin espacios)

2. **Actualizar `.env`:**

   ```env
   MAIL_USER=tu_email@gmail.com
   MAIL_PASS=xxxxxxxxxxxx  # Paste app password here
   ```

3. **Reiniciar Backend:**

   ```bash
   cd d:\Programacion\Nuevo Proyecto\soldadura-backend
   npm run start:dev
   ```

4. **Probar Login:**
   - Ir a http://localhost:4200/login
   - Ingresar email + contraseña
   - Debería recibir email con OTP en tu bandeja de Gmail

#### Opción 2: Modo Test (Sin Enviar Emails)

Si aún no quieres configurar Gmail, el backend ahora devuelve un mensaje más claro:

**Mensaje de Error Mejorado:**

```json
{
  "statusCode": 500,
  "message": "Error al enviar el código OTP. Verifica que las credenciales SMTP estén configuradas en .env (MAIL_USER y MAIL_PASS)",
  "error": "Internal Server Error"
}
```

**Workaround temporal:**

- Usar el admin account directo (sin OTP):
  - Email: `admin@soldadurallastunas.cu`
  - Contraseña: `Admin1234!`
- Esto no requiere el servicio de mail

### 📊 Detalles Técnicos

**Stack de envío de emails:**

- Backend: NestJS + MailService
- Cliente SMTP: Nodemailer v6.x
- Servidor: Gmail SMTP (smtp.gmail.com:587)
- Protocolo: TLS/STARTTLS

**Flujo de Login (cuando está configurado):**

```
1. Usuario → POST /api/auth/login (email + password)
   ↓
2. Backend valida credenciales vs base de datos
   ↓
3. Backend genera OTP aleatorio de 6 dígitos
   ↓
4. Backend intenta enviar OTP por email
   ↓
5. Si SMTP falla → Devuelve error 500
   ↓
6. Si SMTP funciona → Devuelve éxito + email para paso 2 del login
   ↓
7. Usuario recibe email con OTP
   ↓
8. Usuario ingresa OTP → POST /api/auth/verify-otp
   ↓
9. Backend valida OTP y emite JWT
```

### 🛠️ Cambios Realizados para Mejorar Manejo de Errores

Se actualizó `src/auth/auth.service.ts`:

- ✅ Added Logger en AuthService
- ✅ Agregado try-catch específico para sendOtp()
- ✅ Mensaje de error descriptivo en lugar de error genérico
- ✅ Log del error en backend para debugging

### 📝 Checklist de Verificación

Después de configurar SMTP, verifica:

- [ ] Archivo `.env` tiene credentials validos de Gmail
- [ ] Backend reiniciado con `npm run start:dev`
- [ ] Terminal del backend muestra: `Soldadura API running on http://localhost:3000/api`
- [ ] No hay errores `[MailService]` en logs del backend
- [ ] Pruebas de login → recibe email con OTP
- [ ] OTP expira en 10 minutos (por diseño)
- [ ] Después de OTP válido, usuario obtiene JWT y acceso al dashboard

### 📞 Soporte

Si el error persiste después de configurar Gmail:

1. Verificar que usaste App Password, no contraseña regular
2. Verificar que no hay espacios en copy-paste de la contraseña
3. Verificar MAIL_HOST=smtp.gmail.com en .env
4. Verificar MAIL_PORT=587 en .env
5. Revisar los logs completos del backend: ver qué error específico devuelve Google
