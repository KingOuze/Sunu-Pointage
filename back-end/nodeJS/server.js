const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { SerialPort, ReadlineParser } = require('serialport');
const WebSocket = require('ws'); // Importer WebSocket
const routes = require('./routes/routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import des modèles
const UserModel = require('./models/User');
const Pointage = require('./models/Pointage');

// Middleware
app.use(express.json());
app.use(cors());
app.use('/api', routes);

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pointage-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connecté à MongoDB');
    afficherUtilisateurs(); // Affiche les utilisateurs une fois connecté à MongoDB
  })
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Fonction pour afficher les utilisateurs dans la console
const afficherUtilisateurs = async () => {
  try {
    const users = await UserModel.find({}, { nom: 1, prenom: 1, cardId: 1, _id: 0 });
    console.log('Liste des utilisateurs :');
    console.log(users); // Affiche tous les utilisateurs dans la console
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs :', err.message);
  }
};

// Communication avec Arduino
const port = new SerialPort({
  path: '/dev/ttyUSB0', // Remplacez par le port série de votre Arduino
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// WebSocket Server
const wss = new WebSocket.Server({ noServer: true });

// Fonction pour envoyer les données via WebSocket
const broadcastUserData = (user) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ user, status: 'Carte détectée' }));
    }
  });
};

// Écouteur d'événements WebSocket
wss.on('connection', (ws) => {
  console.log('Un client est connecté');

  // Gestion des messages reçus par WebSocket
  ws.on('message', (message) => {
    try {
      const { action, user } = JSON.parse(message); // Parse le message reçu

      // Gestion des commandes OPEN et CLOSE
      if (action === 'OPEN') {
        console.log('Commande reçue : OUVERTURE');
        port.write('OPEN\n'); // Envoi au port série pour ouvrir la porte
      } else if (action === 'CLOSE') {
        console.log('Commande reçue : FERMETURE');
        port.write('CLOSE\n'); // Envoi au port série pour fermer la porte
      }
      // Validation du pointage
      else if (action === 'VALIDATE' && user) {
        console.log('Validation du pointage pour', user.nom);
        enregistrerPointage(user); // Enregistrer le pointage après validation
      }
      // Rejet du pointage
      else if (action === 'REJECT' && user) {
        console.log('Pointage rejeté pour', user.nom);
        broadcastUserData(user); // Vous pouvez décider de la gestion du rejet ici
      }
      else {
        console.log('Commande inconnue :', action);
      }
    } catch (err) {
      console.error('Erreur lors de la gestion de la commande :', err.message);
    }
  });

  ws.on('close', () => {
    console.log('Un client est déconnecté');
  });
});

// Fonction pour enregistrer un pointage
const enregistrerPointage = async (user) => {
  try {
    // Déterminer le statut (entrée ou sortie)
    const lastPointage = await Pointage.findOne({ user_id: user._id }).sort({ date: -1 });
    const status = lastPointage && lastPointage.status === 'entrée' ? 'sortie' : 'entrée';

    // Création d'un nouvel enregistrement de pointage avec la date
    const pointage = new Pointage({
      user_id: user._id,
      status,
      date: new Date(), // Ajouter la date actuelle
    });

    // Sauvegarder le pointage dans la base de données
    await pointage.save();

    console.log(`Pointage enregistré : ${status} pour ${user.nom} ${user.prenom}`);
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement du pointage:', err.message);
  }
};

// Ajouter WebSocket au serveur existant
app.server = app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

parser.on('data', async (data) => {
  // Nettoyage strict de l'UID (suppression des espaces et des caractères non voulus)
  const cardId = data.replace(/[\r\n]/g, '').trim().replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  console.log('Carte détectée (nettoyée) :', cardId);

  try {
    // Recherche d'un utilisateur avec le cardId nettoyé
    const user = await UserModel.findOne({ cardId: cardId });

    if (!user) {
      console.log('Utilisateur introuvable pour la carte :', cardId);
      return;
    }

    // Déterminer le statut (entrée ou sortie)
    const lastPointage = await Pointage.findOne({ user_id: user._id }).sort({ date: -1 });
    const status = lastPointage && lastPointage.status === 'entrée' ? 'sortie' : 'entrée';

    // Création d'un nouvel enregistrement de pointage avec la date
    const pointage = new Pointage({
      user_id: user._id,
      status,
      date: new Date(), // Ajout de la date actuelle
    });
    await pointage.save();

    console.log(`Pointage enregistré : ${status} pour ${user.nom} ${user.prenom}`);

    // Envoyer les informations de l'utilisateur au frontend via WebSocket
    broadcastUserData(user);
  } catch (err) {
    console.error('Erreur lors du traitement de la carte:', err.message);
  }
});

// Route pour afficher tous les utilisateurs
app.get('/users', async (req, res) => {
  try {
    const users = await UserModel.find({}, { nom: 1, prenom: 1, cardId: 1, _id: 0 });
    console.log('Liste des utilisateurs:', users); // Affichage dans la console
    res.json({ success: true, users }); // Retour des utilisateurs en JSON
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs:', err.message);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
});
