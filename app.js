// app.js
require('dotenv').config(); // Memuat variabel dari .env
const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const session = require('express-session');
const flash = require('connect-flash');
const { sequelize, User } = require('./database');

// app.js

// ... (kode require lainnya)
const app = express();

// Konfigurasi EJS
app.set('view engine', 'ejs');

// --> TAMBAHKAN BARIS INI UNTUK MENYAJIKAN FILE DARI FOLDER 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.urlencoded({ extended: true })); // Untuk parsing data form
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

// Middleware untuk membuat flash messages tersedia di semua view
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// Konfigurasi Nodemailer untuk pengiriman email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- HALAMAN-HALAMAN (ROUTES) ---

// Halaman utama -> redirect ke login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Halaman Registrasi
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      req.flash('error_msg', 'Email sudah terdaftar. Silakan login.');
      return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    // Buat token verifikasi (berlaku 1 jam)
    const verificationToken = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const verificationUrl = `http://localhost:3000/verify?token=${verificationToken}`;

    // Kirim email
    await transporter.sendMail({
      to: email,
      subject: 'Verifikasi Email Anda',
      html: `
        <p>Terima kasih telah mendaftar!</p>
        <p>Silakan klik link di bawah ini untuk memverifikasi alamat email Anda:</p>
        <a href="${verificationUrl}">Verifikasi Email</a>
        <p>Link ini akan kedaluwarsa dalam 1 jam.</p>
      `,
    });

    req.flash('success_msg', 'Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.');
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Terjadi kesalahan. Silakan coba lagi.');
    res.redirect('/register');
  }
});

// Halaman Verifikasi
app.get('/verify', async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.render('message', { title: 'Error', message: 'Token tidak ditemukan.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.render('message', { title: 'Error', message: 'User tidak valid.' });
    }
    
    if (user.isVerified) {
       return res.render('message', { title: 'Informasi', message: 'Akun Anda sudah terverifikasi. Silakan login.' });
    }

    user.isVerified = true;
    await user.save();
    
    req.flash('success_msg', 'Verifikasi email berhasil! Sekarang Anda bisa login.');
    res.redirect('/login');

  } catch (error) {
    res.render('message', { title: 'Error', message: 'Token tidak valid atau sudah kedaluwarsa.' });
  }
});


// Halaman Login
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            req.flash('error_msg', 'Email tidak ditemukan.');
            return res.redirect('/login');
        }

        if (!user.isVerified) {
            req.flash('error_msg', 'Akun belum diverifikasi. Silakan cek email Anda.');
            return res.redirect('/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error_msg', 'Password salah.');
            return res.redirect('/login');
        }
        
        // Simpan ID user di sesi untuk menandakan login
        req.session.userId = user.id;
        res.redirect('/sukses');

    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Terjadi kesalahan.');
        res.redirect('/login');
    }
});

// Halaman Sukses (hanya bisa diakses jika sudah login)
app.get('/sukses', (req, res) => {
    if (!req.session.userId) {
        req.flash('error_msg', 'Silakan login terlebih dahulu.');
        return res.redirect('/login');
    }
    res.render('success');
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/sukses');
        }
        res.redirect('/login');
    });
});

// app.js

// ... (kode lainnya)

// Tambahkan dua baris ini untuk tes
console.log("Mencoba menggunakan Email User:", process.env.EMAIL_USER);
console.log("Mencoba menggunakan Email Pass:", process.env.EMAIL_PASS ? "Password Ada" : "Password KOSONG/TIDAK DITEMUKAN");


// Konfigurasi Nodemailer untuk pengiriman email
const transporterr = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ... (sisa kode)

// Sinkronisasi database dan jalankan server
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
});
