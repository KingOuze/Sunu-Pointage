const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nom: { type: String },
  prenom: { type: String },
  photo: { type: String, required:true },
  email: { type: String, unique: true },
  adresse: { type: String },
  telephone: { type: String },
  role: { type: String }, // Par exemple: "employé", "admin"
  matricule: { type: String, unique: true },
  status: { type: String, default: 'actif' }, // Par exemple: "actif", "inactif"
  cardId: { type: String, unique: true }, // UID RFID
  password: { type: String }, // Mot de passe hashé
  fonction: { type: String }, // Par exemple: "Technicien"
  departement: { type: String }, // Par exemple: "IT"
  cohorte: { type: String }, // Par exemple: "2024"
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);