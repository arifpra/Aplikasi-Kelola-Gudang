# Frontend Gudang

## Menjalankan Aplikasi
1. Salin `.env.example` menjadi `.env`.
2. Pastikan backend aktif di URL yang sesuai `VITE_API_URL`.
3. Jalankan:
   - `npm install`
   - `npm run dev`

## Struktur Utama
- `src/features/*`: domain logic per fitur (API + hooks).
- `src/lib/api/*`: API client terpusat.
- `src/pages/*`: view layer.
- `src/components/*`: UI reusable.
