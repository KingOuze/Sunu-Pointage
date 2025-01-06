const express = require('express');
const mongoose = require('mongoose');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const WebSocket = require('ws');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Importer bcrypt

// Configurer l'application Express
const app = express();
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/pointage', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schéma de l'utilisateur
const UserSchema = new mongoose.Schema({
  uid: { type: String, unique: true, required: true },
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'vigile'], required: true },
});

const User = mongoose.model('User', UserSchema);

// Configurer le port série pour l'Arduino
const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Serveur WebSocket
const wss = new WebSocket.Server({ port: 3001 });

// Diffuser l'UID scanné à tous les clients connectés via WebSocket
parser.on('data', async (data) => {
  const uid = data.replace('UID de la carte : ', '').trim();
  console.log(`UID nettoyé : ${uid}`);
  
  // Diffuser l'UID scanné aux clients WebSocket
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(uid);
    }
  });

  // Vérifier si l'utilisateur existe avec cet UID
  try {
    const user = await User.findOne({ uid });
    if (user) {
      console.log(`Utilisateur trouvé : ${user.name}`);
    } else {
      console.log(`Carte non enregistrée. UID : ${uid}`);
    }
  } catch (error) {
    console.error('Erreur lors de la gestion de l\'UID :', error);
  }
});

// Route pour ajouter un utilisateur
app.post('/users', async (req, res) => {
  const { uid, name, email, password,role } = req.body;
  try {
    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const user = new User({ uid, name, email, password: hashedPassword,role});
    await user.save();
    res.status(201).json({ message: 'Utilisateur enregistré', user });
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de l\'enregistrement', details: error });
  }
});

// Route pour vérifier un utilisateur avec l'UID
app.post('/api/check-uid', async (req, res) => {
  const { uid } = req.body;
  try {
    const user = await User.findOne({ uid });
    if (user) {
      return res.status(200).json({ success: true, user });
    } else {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    }
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'UID :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Route pour la connexion par email et mot de passe
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Rechercher l'utilisateur dans la base de données par email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    }

    // Vérifier si le mot de passe correspond au mot de passe haché
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Mot de passe incorrect.' });
    }

    // Si tout est valide, retourner les informations de l'utilisateur
    return res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Démarrer le serveur
app.listen(3000, () => {
  console.log('Serveur en cours d\'exécution sur le port 3000');
});
