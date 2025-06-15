# Sistem Login & Registrasi Modern (Node.js)

![Tampilan Aplikasi](*https://i.imgur.com/G3i5FmN.pn*)

Sebuah sistem autentikasi pengguna lengkap yang dibangun dengan Node.js, Express, dan SQLite3. Proyek ini mencakup fitur-fitur esensial seperti registrasi, login, verifikasi email yang aman, dan hashing kata sandi. Tampilannya dirancang dengan gaya modern "Aurora Glassmorphism" yang populer pada tahun 2025.

---

## Fitur Utama

-   ✅ **Registrasi Pengguna:** Pengguna dapat membuat akun baru.
-   🔐 **Login Pengguna:** Sistem login yang aman untuk pengguna terdaftar.
-   📧 **Verifikasi Email:** Mengirimkan email verifikasi ke pengguna baru untuk mengaktifkan akun. Menggunakan **Nodemailer** dan **Gmail**.
-   🛡️ **Keamanan Password:** Kata sandi pengguna di-hash menggunakan **bcrypt** sebelum disimpan ke database.
-   🔑 **Token Verifikasi Aman:** Token untuk verifikasi email dibuat menggunakan **JSON Web Tokens (JWT)** dengan masa berlaku.
-   💬 **Sesi & Pesan Flash:** Menggunakan sesi untuk mengelola status login dan pesan flash untuk memberikan notifikasi kepada pengguna (misalnya, "Login berhasil").
-   🎨 **Tampilan Modern:** UI dirancang dengan efek "Glassmorphism" dan latar belakang gradien aurora yang dinamis.
-   🗄️ **Database Lokal:** Menggunakan **SQLite3** yang ringan dan tidak memerlukan instalasi server database terpisah. Dikelola dengan **Sequelize ORM**.

---

## Tumpukan Teknologi (Tech Stack)

-   **Backend:** Node.js, Express.js
-   **Database:** SQLite3
-   **ORM:** Sequelize
-   **Tampilan:** EJS (Embedded JavaScript)
-   **Autentikasi & Keamanan:**
    -   `bcryptjs` untuk hashing password.
    -   `jsonwebtoken` untuk token verifikasi.
    -   `express-session` untuk manajemen sesi.
-   **Pengiriman Email:** `nodemailer`
-   **Lainnya:** `dotenv`, `connect-flash`

---

## Instalasi & Konfigurasi

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

#### 1. Dapatkan Kode Proyek
Salin semua file proyek (`app.js`, `database.js`, folder `views`, dll.) ke dalam sebuah folder baru di komputer Anda.

#### 2. Navigasi ke Folder Proyek
Buka terminal atau command prompt Anda dan arahkan ke direktori proyek.
```bash
cd nama-folder-proyek
