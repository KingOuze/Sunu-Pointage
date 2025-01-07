const PointageUser = require('../models/PointageUser'); // Modèle de pointage utilisateur
const UserModel = require('../models/User'); // Modèle utilisateur (si nécessaire pour valider l'utilisateur)

// Gestion du check-in
const checkin = async (req, res) => {
  try {
    const { userId } = req.body;

    // Vérification de l'existence de l'utilisateur
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    }

    // Vérification s'il y a déjà un check-in aujourd'hui
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingCheckin = await PointageUser.findOne({
      userId: userId,
      checkin: { $gte: today },
    });

    if (existingCheckin) {
      return res.status(400).json({ success: false, message: 'Check-in déjà effectué aujourd\'hui.' });
    }

    // Enregistrement du check-in
    const newCheckin = new PointageUser({
      userId: userId,
      checkin: new Date(),
    });

    await newCheckin.save();

    return res.status(200).json({ success: true, message: 'Check-in enregistré avec succès.' });
  } catch (err) {
    console.error('Erreur lors du check-in :', err.message);
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

// Gestion du check-out
const checkout = async (req, res) => {
  try {
    const { userId } = req.body;

    // Vérification de l'existence de l'utilisateur
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    }

    // Recherche du dernier check-in sans check-out
    const lastPointage = await PointageUser.findOne({
      userId: userId,
      checkout: null, // Pas encore de check-out
    }).sort({ checkin: -1 }); // Trier par le plus récent

    if (!lastPointage) {
      return res.status(400).json({ success: false, message: 'Aucun check-in actif trouvé.' });
    }

    // Mise à jour avec la date et l'heure de check-out
    lastPointage.checkout = new Date();
    await lastPointage.save();

    return res.status(200).json({ success: true, message: 'Check-out enregistré avec succès.' });
  } catch (err) {
    console.error('Erreur lors du check-out :', err.message);
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { checkin, checkout };
