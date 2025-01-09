const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { SerialPort, ReadlineParser } = require('serialport');
const WebSocket = require('ws'); // Importer WebSocket
const routes = require('./routes/routes');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import des modèles
const UserModel = require('./models/User');
const PointageUser = require('./models/PointageUser');
const User = require('./models/User');

// Middleware
app.use(express.json());
app.use(cors());
app.use('/api', routes);
app.use('/uploads', express.static('uploads'));

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sunupointage', {
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
  path: '/dev/ttyACM1', // Remplacez par le port série de votre Arduino
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));
// Fonction pour vérifier l'utilisateur dans la base de données
const verifyUser = async (cardId) => {
  try {
    const user = await UserModel.findOne({ cardId: cardId });

    if (!user) {
      console.log('Utilisateur introuvable');
      return 'CARD_NOT_FOUND'; // Carte non trouvée
    }

    if (user.status === 'bloque') {
      console.log('Utilisateur bloqué');
      return 'USER_BLOCKED'; // Utilisateur bloqué
    }

    console.log('Utilisateur trouvé', user.nom);
    return 'USER_VALID'; // Utilisateur valide
  } catch (err) {
    console.error('Erreur lors de la recherche de l\'utilisateur:', err.message);
    return 'ERROR';
  }
};

// WebSocket Server
const wss = new WebSocket.Server({ noServer: true });

// Fonction pour envoyer les données utilisateur avec l'URL de la photo via WebSocket
const broadcastUserData = (user) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        user,
        photo: user.photo,  // Ajout de l'URL de la photo
        status: 'Carte détectée',
      }));
    }
  });
};

const enregistrerPointage = async (user) => {
  try {
    const dateDebut = new Date();
    dateDebut.setHours(0, 0, 0, 0); // Début de la journée
    const dateFin = new Date();
    dateFin.setHours(23, 59, 59, 999); // Fin de la journée

    // Vérifie s'il y a déjà un pointage pour aujourd'hui
    let pointage = await PointageUser.findOne({
      user_id: user._id,
      date: { $gte: dateDebut, $lte: dateFin },
    });

    if (!pointage) {
      // Si pas de pointage, crée un nouveau avec un check-in
      pointage = new PointageUser({
        user_id: user._id,
        date: new Date(),
        checkin: new Date(),
      });
      await pointage.save();
      console.log(`Check-in enregistré pour ${user.nom} ${user.prenom}`);
      return { success: true, message: 'Check-in enregistré', pointage };
    } else {
      // Si pointage existe, met à jour le check-out
      pointage.checkout = new Date();
      await pointage.save();
      console.log(`Check-out enregistré pour ${user.nom} ${user.prenom}`);
      return { success: true, message: 'Check-out enregistré', pointage };
    }
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement du pointage :', err.message);
    return { success: false, message: 'Erreur lors de l\'enregistrement du pointage', error: err.message };
  }
};

// Spécifier le chemin du dossier où vous souhaitez stocker les photos
const uploadDir = path.join(__dirname, 'uploads');

// Vérifier si le dossier 'uploads' existe, sinon le créer
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // 'recursive' crée aussi des sous-dossiers si nécessaire
  console.log('Le dossier "uploads" a été créé');
} else {
  console.log('Le dossier "uploads" existe déjà');
}

// Gestion des données reçues via WebSocket
wss.on('connection', (ws) => {
  console.log('Un client est connecté');

  ws.on('message', async (message) => {
    try {
      const { action, status, user } = JSON.parse(message); // Parse le message reçu
      // Gestion des commandes OPEN et CLOSE
      if (action === 'OPEN') {
        console.log('Commande reçue : OUVERTURE');
        port.write('OPEN\n'); // Envoi au port série pour ouvrir la porte
      } else if (action === 'CLOSE') {
        console.log('Commande reçue : FERMETURE');
        port.write('CLOSE\n'); // Envoi au port série pour fermer la porte
      }

      // Validation du pointage
      if (status === 'VALIDATE' && user) {
        const result = await enregistrerPointage(user);
        ws.send(JSON.stringify(result));
      } else if (status === 'REJECT' && user) {
        console.log('Pointage rejeté pour', user.nom);

        // Diffuser un message au frontend pour indiquer le rejet
        ws.send(JSON.stringify({
          success: true,
          message: `Pointage rejeté pour ${user.nom} action
          action ${user.prenom}`,
        }));
      } else {
        console.log('Commande inconnue ou utilisateur non spécifié :', action, );
      }
    } catch (err) {
      console.error('Erreur lors de la gestion du message WebSocket :', err.message);
    }
  });

  ws.on('close', () => {
    console.log('Un client est déconnecté');
  });
});

// Suppression de l'enregistrement automatique dans parser.on('data')
parser.on('data', async (data) => {
  const cardId = data.replace(/[\r\n]/g, '').trim().replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  console.log('Carte détectée (nettoyée) :', cardId);

  try {
    // Chercher l'utilisateur dans la base de données à partir de l'ID de la carte
    const user = await UserModel.findOne({ cardId: cardId });

    if (!user) {
      console.log('Utilisateur introuvable pour la carte :', cardId);
      // Répondre à l'Arduino avec "NOT_FOUND"
      port.write('NOT_FOUND\n');
      return;
    }

    if (user.status === 'bloque') {
      console.log('Accès refusé, utilisateur bloqué :', user.nom);
      // Répondre à l'Arduino avec "BLOCKED"
      port.write('BLOCKED\n');
    } else {
      console.log('Accès autorisé pour :', user.nom);
      // Répondre à l'Arduino avec "AUTHORIZED"
      port.write('AUTHORIZED\n');
    }

    // Diffuser les données de l'utilisateur détecté au frontend via WebSocket
    broadcastUserData(user);
  } catch (err) {
    console.error('Erreur lors du traitement de la carte :', err.message);
    // Répondre à l'Arduino avec une erreur
    port.write('ERROR\n');
  }
});

// Ajouter WebSocket au serveur existant
app.server = app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// Configuration de multer pour stocker l'image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Dossier où les images seront stockées
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Nom unique pour chaque fichier
  }
});

const upload = multer({ storage });

// Route pour télécharger l'image de l'utilisateur
app.post('/upload-photo', upload.single('photo'), async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userId);
    if (user) {
      user.photo = `/uploads/${req.file.filename}`;  // Stocker l'URL de l'image
      await user.save();
      res.json({ success: true, message: 'Photo téléchargée avec succès', photoUrl: user.photo });
    } else {
      res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
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

// Route pour récupérer l'historique de tous les pointages
app.get('/historique-pointage', async (req, res) => {
  try {
    const historique = await PointageUser.find().sort({ date: -1 }).populate('user_id', 'nom prenom matricule'); // Populate pour inclure nom et prénom

    if (!historique.length) {
      return res.status(404).json({ success: false, message: 'Aucun historique de pointage trouvé.' });
    }

    res.json({ success: true, historique });
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'historique des pointages:', err.message);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
});


app.get('/id', async(req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.find({ _Id: userId });

    if(!user){
      return res.status(404).json({ success: false, message: 'Aucun historique de pointage trouvé' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Erreur lors de la récupération du user:', err.message);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
})  
app.put('/update-pointage/:id', async (req, res) => {
  const { etat } = req.body;  // Récupérer l'état envoyé par l'utilisateur
  const pointageId = req.params.id;  // ID du document à mettre à jour
  
  try {
    // Vérifier si l'état est fourni
    if (!etat) {
      return res.status(400).json({ success: false, message: 'L\'état est requis pour la mise à jour' });
    }

    // Mettre à jour uniquement le champ `etat`
    const result = await PointageUser.updateOne(
      { _id: pointageId },  // Recherche du pointage par ID
      { $set: { etat: etat } }  // Mise à jour du champ `etat`
    );

    // Vérifier si la mise à jour a été effectuée
    if (result.nModified === 0) {
      return res.status(404).json({ success: false, message: 'Aucun pointage mis à jour' });
    }

    // Récupérer le pointage mis à jour
    const updatedPointage = await PointageUser.findById(pointageId);

    // Réponse succès avec le pointage mis à jour
    res.json({ success: true, message: 'État mis à jour avec succès', pointage: updatedPointage });
  } catch (err) {
    console.error('Erreur lors de la mise à jour de l\'état', err);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
});






