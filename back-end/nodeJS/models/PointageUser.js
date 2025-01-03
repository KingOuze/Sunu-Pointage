const mongoose = require('mongoose');

const PointageUserSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true }, // Date du pointage (jour)
  checkin: { type: Date, default: null }, // Heure d'entrée
  checkout: { type: Date, default: null }, // Heure de sortie
});

module.exports = mongoose.model('PointageUser', PointageUserSchema);
