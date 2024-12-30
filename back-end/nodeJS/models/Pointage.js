const mongoose = require('mongoose');

// Définition du schéma de Pointage
const PointageSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // Utilisation de ObjectId pour lier à un utilisateur
    ref: 'User', // Référence au modèle User
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now, // Défaut pour la date à la création
  },
  heure_entree: {
    type: String, // Vous pouvez changer en 'Date' si vous préférez une heure complète avec le format de date
  },
  heure_sortie: {
    type: String, // Idem pour heure_sortie
  },
  status: {
    type: String,
    required: true,
    enum: ['entrée', 'sortie'], // Validation des valeurs possibles pour le status
  },
});

// Index sur user_id pour améliorer la recherche
PointageSchema.index({ user_id: 1 });

// Export du modèle
module.exports = mongoose.model('Pointage', PointageSchema);
