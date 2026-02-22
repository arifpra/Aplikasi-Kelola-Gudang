# Gudang ERP API

## Menjalankan API
1. Salin `.env.example` menjadi `.env`.
2. Isi kredensial PostgreSQL dan JWT.
3. Jalankan:
   - `npm install`
   - `npm run db:migrate`
   - `npm run db:seed`
   - `npm run start`

## Endpoint Utama
- `GET /health`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/iam/roles`
- `GET /api/v1/iam/permissions`
- `GET /api/v1/audit/logs?limit=50&offset=0&action=` (butuh `COMPLIANCE_READ`)
