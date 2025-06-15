// test_email.js
require('dotenv').config();
const nodemailer = require('nodemailer');

// Script ini hanya untuk menguji koneksi dan otentikasi ke SMTP server.

// Ambil kredensial dari file .env
const userEmail = process.env.EMAIL_USER;
const userPass = process.env.EMAIL_PASS;

console.log('Membaca file .env...');
console.log(`Email User: ${userEmail}`);
console.log(`Email Pass: ${userPass ? 'Ada (tidak ditampilkan)' : 'KOSONG!'}`);

// Pastikan kredensial ada sebelum melanjutkan
if (!userEmail || !userPass) {
  console.error('❌ GAGAL: Pastikan EMAIL_USER dan EMAIL_PASS sudah diatur di file .env');
  process.exit(1); // Hentikan skrip
}

// Buat transporter Nodemailer persis seperti di app.js
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: userEmail,
    pass: userPass,
  },
});

// Fungsi async untuk menjalankan verifikasi
async function verifyConnection() {
  console.log('\nMencoba menghubungkan ke server Gmail...');
  try {
    // Metode .verify() akan mencoba login ke server SMTP
    await transporter.verify();
    console.log('\n✅ SUKSES! Koneksi dan otentikasi ke server email berhasil.');
    console.log('Ini berarti kredensial di file .env Anda sudah BENAR.');
    console.log('Sekarang Anda bisa mencoba menjalankan aplikasi utama lagi (node app.js).');
  } catch (error) {
    console.error('\n❌ GAGAL! Terjadi error saat mencoba login ke server email.');
    console.error('Ini berarti masalahnya ada pada kredensial Anda atau pengaturan akun Google.');
    console.error('\nDetail Error:');
    console.error(error); // Tampilkan error lengkap
  }
}

// Jalankan fungsi verifikasi
verifyConnection();