const mongoose = require('mongoose');

const PointageSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  checkin: { type: Date, default: null }, // Heure de check-in
  checkout: { type: Date, default: null }, // Heure de check-out
});

module.exports = mongoose.model('Pointage', PointageSchema);
