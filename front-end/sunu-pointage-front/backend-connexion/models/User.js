const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'vigile'], required: true },
    rfidUid: { type: String, unique: true }, // UID de la carte RFID
    isLoggedIn: { type: Boolean, default: false }, // Champ pour savoir si l'utilisateur est connecté

});

module.exports = mongoose.model('User', UserSchema);