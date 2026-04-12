# AGENTS.md - IronMan Soldadura Platform

## Project Structure
```
soldadura-backend/    # NestJS v11 (API on port 3000)
soldadura-frontend/    # Angular 21 (UI on port 4200)
```

## Developer Commands
```bash
# Start both servers (Windows)
.\start-dev.ps1

# Manual start
cd soldadura-backend && npm run start:dev   # Terminal 1
cd soldadura-frontend && ng serve            # Terminal 2
```

## Key Commands
- **Backend**: `npm run start:dev` (watch mode), `npm run lint`, `npm run test`
- **Frontend**: `ng serve`, `ng build`, `npm run test` (Vitest)

## Environment Setup
1. Configure SMTP in `soldadura-backend/.env`:
   - `MAIL_USER` / `MAIL_PASS` (Gmail requires App Password)
2. Default admin: `admin@soldadurallastunas.cu` / `Admin1234!`

## Important Quirks
- **CORS**: Only `http://localhost:4200` allowed
- **Auth**: 2-step login with OTP (6 digits, 10 min expiry)
- **JWT**: 8 hour expiration
- **Rate limiting**: 30 req/60s global, 10/60s on auth endpoints
- **Database**: SQLite auto-created at `soldadura.sqlite`
- **Landing page**: Data comes from `/settings/public` (public endpoint)

## Architecture Notes
- **Backend modules**: auth, jobs, settings, users, mail, entities
- **Frontend features**: landing (public), auth, dashboard (user/owner/admin)
- Landing page is dynamic - settings are editable via owner/admin dashboard
- Map uses Leaflet with OpenStreetMap (no API key required)
- Canvas-based spark animations on landing page hero

## Reference
- Full docs: `README.md`
- SMTP config: `CONFIGURACION.md`
- Internal errors: `ERRORES_INTERNOS.md`