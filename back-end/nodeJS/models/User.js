const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  photo: { type: String, required:true },
  email: { type: String, required: true, unique: true },
  adresse: { type: String, required: true },
  telephone: { type: String, required: true },
  role: { type: String, required: true }, // Par exemple: "employé", "admin"
  matricule: { type: String, required: true, unique: true },
  status: { type: String, default: 'actif' }, // Par exemple: "actif", "inactif"
  cardId: { type: String, required: true, unique: true }, // UID RFID
  password: { type: String, required: true }, // Mot de passe hashé
  fonction: { type: String, required: true }, // Par exemple: "Technicien"
  departement: { type: String, required: true }, // Par exemple: "IT"
  cohorte: { type: String, required: true }, // Par exemple: "2024"
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);