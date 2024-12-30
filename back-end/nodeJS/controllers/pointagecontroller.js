const Pointage = require('../models/Pointage');
const User = require('../models/User');
exports.addPointage = async (req, res) => {
  const { cardId, action } = req.body; // action: 'valider' ou 'rejeter'

  try {
    // Trouver l'utilisateur
    const user = await User.findOne({ cardId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable pour cette carte",
      });
    }

    if (action === 'rejeter') {
      return res.status(200).json({
        success: true,
        message: `Pointage rejeté pour ${user.nom} ${user.prenom}`,
      });
    }

    // Déterminer l'état (entrée ou sortie)
    const lastPointage = await Pointage.findOne({ user_id: user._id }).sort({
      date: -1,
    });
    const status = lastPointage && lastPointage.status === 'entrée' ? 'sortie' : 'entrée';

    // Ajouter un pointage
    const pointage = new Pointage({
      user_id: user._id,
      date: new Date(),
      status,
    });
    await pointage.save();

    res.status(201).json({
      success: true,
      message: `Pointage ${status} enregistré pour ${user.nom} ${user.prenom}`,
      user: {
        nom: user.nom,
        prenom: user.prenom,
        matricule: user.matricule,
        photo: user.photo,
      },
      pointage,
    });
  } catch (err) {
    console.error(err); // Ajout pour débogage
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: err.message,
    });
  }
};

// Récupérer tous les pointages
exports.getAllPointages = async (req, res) => {
  try {
    const pointages = await Pointage.find().populate('user_id', 'nom prenom matricule');
    res.status(200).json({ 
      success: true, 
      pointages 
    });
  } catch (err) {
    console.error(err); // Ajout pour débogage
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: err.message,
    });
  }
};
