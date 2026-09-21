# VamxBotz Docs &mdash; Website Dokumentasi Bot WhatsApp

Website dokumentasi resmi untuk **VamxBotz** (by Vamz Spectre / vamzahai). Dibangun menggunakan **Next.js (App Router)**, **Tailwind CSS**, **TypeScript**, dan terintegrasi langsung dengan **Supabase Database** serta siap di-deploy 100% ke **Vercel**.

---

## 🚀 Fitur Utama

- **Katalog Perintah Lengkap**: Dokumentasi seluruh menu bot (Grup, JPM, Push Kontak, Downloader, Converter, Stiker, Pengingat Kelas, AI & Fun, Owner).
- **Pencarian Cepat & Filter**: Filter per kategori dan pencarian instan berdasarkan nama perintah atau fungsi.
- **Copy Sintaks Sekali Klik**: Memudahkan pengguna menyalin format perintah bot.
- **Status Bot Realtime (Supabase)**: Menampilkan status online bot, jumlah pengguna, grup aktif, dan total eksekusi perintah secara dinamis dari database.
- **Formulir Feedback / Request Fitur**: Pengunjung dapat mengirim request fitur atau laporan langsung tersimpan ke tabel `bot_feedback` di Supabase.
- **API Status Endpoint**: Route `/api/status` untuk integrasi bot atau status monitoring pihak ketiga.
- **Mobile Responsive & Dark Mode**: Desain modern bernuansa dark cyberpunk / tech WhatsApp bot.

---

## 📦 Struktur Folder

```
/root/vamxbotz-docs/
├── src/
│   ├── app/
│   │   ├── api/status/route.ts  # Endpoint API status bot
│   │   ├── globals.css          # Styling Tailwind CSS
│   │   ├── layout.tsx           # SEO & Root Layout
│   │   └── page.tsx             # Halaman utama docs & katalog perintah
│   ├── components/
│   │   ├── BotStatusWidget.tsx  # Widget statistik & status bot via Supabase
│   │   ├── CommandCard.tsx      # Komponen kartu perintah & copy syntax
│   │   ├── FeedbackModal.tsx    # Modal form request fitur / pesan
│   │   ├── Footer.tsx           # Footer halaman
│   │   ├── Navbar.tsx           # Navigasi & link sosmed bot
│   │   ├── QuickStart.tsx       # Panduan awal pemakaian bot
│   │   └── SupabaseGuide.tsx    # Panduan konfigurasi Supabase
│   ├── data/
│   │   ├── bot-info.ts          # Metadata bot (creator, no WA, channel)
│   │   └── commands.ts          # Basis data seluruh perintah bot
│   └── lib/
│       └── supabase/
│           ├── client.ts        # Client Supabase (Browser)
│           └── server.ts        # Client Supabase (Server Component / API)
├── supabase/
│   └── schema.sql               # Migrasi tabel database Supabase
├── .env.example                 # Contoh konfigurasi environment
├── vercel.json                  # Konfigurasi deployment Vercel
└── package.json
```

---

## 🛠️ Cara Menghubungkan Supabase Database

1. Buka [Supabase Dashboard](https://supabase.com/dashboard).
2. Buat project baru.
3. Masuk ke tab **SQL Editor**, buka file [`supabase/schema.sql`](file:///root/vamxbotz-docs/supabase/schema.sql), lalu salin dan jalankan seluruh query SQL di dalamnya.
4. Pergi ke **Project Settings &rarr; API**, lalu salin:
   - **Project URL**
   - **anon / public key**
5. Masukkan ke file `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1Ni...
   ```

---

## ⚡ Cara Deploy ke Vercel

### Opsi 1: Lewat Dashboard Vercel (Paling Mudah)
1. Push folder ini ke GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial vamxbotz docs"
   git remote add origin <URL_REPO_GITHUB_ANDA>
   git branch -M main
   git push -u origin main
   ```
2. Buka [Vercel Dashboard](https://vercel.com/new).
3. Import repository GitHub tersebut.
4. Pada bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Klik **Deploy**! Website akan otomatis aktif dalam 1-2 menit.

### Opsi 2: Menggunakan Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 💻 Menjalankan di Lokal (Development)

```bash
# Jalankan server development
npm run dev

# Buka http://localhost:3000 di browser
```
