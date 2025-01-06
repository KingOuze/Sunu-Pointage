const mongoose = require('mongoose');

const PointageUserSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true }, // Date du pointage (jour)
  checkin: { type: Date, default: null }, // Heure d'entrée
  checkout: { type: Date, default: null }, // Heure de sortie
  etat: { type: String, enum: ['en retard', 'à l\'heure', 'en congé','maladie'], default: 'à l\'heure' },// État du pointage
  TempNormalDePointe: { type: Date, default: null } // TempNormalDePointe, initialisé à null par défaut
});


module.exports = mongoose.model('PointageUser', PointageUserSchema);
