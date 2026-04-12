# Render deployment configuration

## Backend Deployment (Render)

1. **Crear cuenta en** https://render.com
2. **New Web Service** → Conectar tu repo de GitHub
3. Configurar:

```
Name: ironman-backend
Root Directory: soldadura-backend
Build Command: npm run build
Start Command: npm run start:prod
Instance Type: Free
```

4. **Environment Variables** (en Render dashboard):

```
MAIL_USER=tu_email@gmail.com
MAIL_PASS=tu_app_password
DATABASE_URL=postgres://... (Render te da una al crear PostgreSQL)
JWT_SECRET=una_clave_secreta_larga
PORT=10000
```

5. **Crear PostgreSQL** en Render (Free):
   - New → PostgreSQL
   - Copiar la DATABASE_URL

---

## Frontend Deployment (Vercel)

1. **Importar repo en** https://vercel.com
2. **Importar** → soldadura-frontend
3. Configurar:

```
Framework Preset: Angular
Build Command: npm run build
Output Directory: dist/soldadura-frontend/browser
```

4. **Environment Variables**:

```
NG_APP_API_URL=https://ironman-backend.onrender.com/api
```

---

## URLs

- Backend: `https://ironman-backend.onrender.com/api`
- Frontend: `https://ironman-soldadura.vercel.app`
