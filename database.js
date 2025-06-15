// database.js
const { Sequelize, DataTypes } = require('sequelize');

// Inisialisasi koneksi ke database SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.db', // Nama file database
  logging: false, // Matikan logging SQL di konsol
});

// Definisikan model (tabel) User
const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = { sequelize, User };