# Panduan Deployment ke Netlify (dengan CI/CD GitHub)

Dokumen ini menjelaskan langkah-langkah untuk men-deploy aplikasi **ZAG POS** ke Netlify menggunakan integrasi GitHub untuk Continuous Integration/Continuous Deployment (CI/CD).

## Prasyarat

1.  Akun **GitHub** (https://github.com)
2.  Akun **Netlify** (https://netlify.com)
3.  Project Supabase sudah siap (URL dan Anon Key tersedia).

## Langkah 1: Push Kode ke GitHub

Pertama, Anda perlu mengunggah kode sumber proyek ini ke repositori GitHub baru.

1.  Buka GitHub dan buat **New Repository** (jangan centang "Initialize with README").
2.  Buka terminal di folder proyek ini (`C:\Users\advan\Documents\work\posspa`).
3.  Jalankan perintah berikut (ganti `USERNAME` dan `REPO_NAME` sesuai repositori Anda):

```bash
# Inisialisasi git (jika belum) - sepertinya sudah ada, tapi untuk memastikan:
git init

# Tambahkan semua file ke staging area
git add .

# Buat commit pertama
git commit -m "Initial commit - ZAG POS Complete Features"

# Ubah nama branch utama ke 'main'
git branch -M main

# Tambahkan remote repository (GANTI URL INI)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Push kode ke GitHub
git push -u origin main
```

## Langkah 2: Setup Proyek di Netlify

Setelah kode ada di GitHub, hubungkan ke Netlify:

1.  Login ke dashboard **Netlify**.
2.  Klik tombol **"Add new site"** -> **"Import from an existing project"**.
3.  Pilih **GitHub**.
4.  Otorisasi Netlify untuk mengakses akun GitHub Anda jika diminta.
5.  Pilih repositori **posspa** (atau nama yang Anda buat) dari daftar.

## Langkah 3: Konfigurasi Build

Netlify akan otomatis mendeteksi konfigurasi dari file `netlify.toml` yang sudah ada di proyek ini. Pastikan setting berikut terlihat (biasanya otomatis terisi):

*   **Build command**: `npm run build`
*   **Publish directory**: `.next` (atau biarkan default, plugin akan menanganinya)
*   **Netlify Plugins**: Pastikan plugin `@netlify/plugin-nextjs` terdeteksi (karena sudah ada di `netlify.toml`).

## Langkah 4: Environment Variables (PENTING)

Aplikasi ini membutuhkan koneksi ke Supabase agar bisa berjalan. Anda **WAJIB** menambahkan Environment Variables di Netlify.

1.  Di halaman konfigurasi deploy (atau setelah site terbuat, masuk ke **Site configuration** > **Environment variables**).
2.  Tambahkan variable berikut (nilai bisa diambil dari file `.env.local` Anda):

| Key | Value |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[PROJECT_REF].supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `[YOUR_ANON_KEY]` |

3.  Klik **Deploy site**.

## Langkah 5: CI/CD Otomatis

Sekarang setup sudah selesai!

*   **Continuous Deployment**: Setiap kali Anda melakukan perubahan kode di komputer lokal, lalu melakukan:
    ```bash
    git add .
    git commit -m "Deskripsi perubahan"
    git push origin main
    ```
    Netlify akan otomatis mendeteksi perubahan tersebut, menjalankan build ulang, dan men-deploy versi terbaru dalam beberapa menit.

## Troubleshooting

*   **Build Gagal**: Cek "Deploy Log" di Netlify. Biasanya karena dependensi atau Environment Variable yang kurang.
*   **Halaman Kosong/Error**: Cek browser console atau function logs di Netlify. Pastikan URL Supabase benar.
