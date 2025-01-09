const express = require('express');
const mongoose = require('mongoose');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const WebSocket = require('ws');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Importer bcrypt

// Configurer l'application Express
const app = express();
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/sunupointage', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schéma de l'utilisateur
const UserSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  photo: String,
  adresse: String,
  telephone: String,
  dateNaissance: Date,
  email: { type: String, unique: true},
  password: { type: String},
  role: { type: String, enum: ['admin', 'vigile', 'etudiant', 'employe'], required: true },
  cardId: { type: String, unique: true },
});

const User = mongoose.model('users', UserSchema);

// Configurer le port série pour l'Arduino
const port = new SerialPort({ path: '/dev/ttyACM0', baudRate: 9600 });
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
 /* try {
    const user = await User.where({ cardId: uid });
    if (user) {
      console.log(`Utilisateur trouvé `);
    } else {
      console.log(`Carte non enregistrée. UID : ${user}`);
    }
  } catch (error) {
    console.error('Erreur lors de la gestion de l\'UID :', error);
  }*/
});



// Route pour vérifier un utilisateur avec l'UID
app.post('/api/check-uid', async (req, res) => {
  const { uid } = req.body;
  console.log(`UID à vérifier : ${uid}`);
  try {
    const user = await User.findOne({ cardId: uid });

    if (user) {
      console.log(user.role);
      if(user.role == 'admin'){
        return res.status(200).json({ success: true, role: 'admin' });
      } else {
        return res.status(403).json({ success: false, message: 'Non Authorisé' });
      }
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
    const user = await User.findOne({ email: email});

    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    }

    // Vérifier si le mot de passe correspond au mot de passe haché
    const isPasswordValid = await bcrypt.compare(password, user.password);
console.log("Mot de passe valide:", isPasswordValid);


    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Mot de passe incorrect.', pass1: password, pass2: user.password });
    }


    // Si tout est valide, retourner les informations de l'utilisateur
    return res.status(200).json({
      success: true,
      role: user.role,
    });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Route pour demander la réinitialisation
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    }

    // Générer un jeton de réinitialisation
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // Valide pour 1 heure
    await user.save();

    // Configurer l'envoi d'email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'oumoulkhairyndiaye1@gmail.com', // Remplacez par votre adresse email
        pass: 'nxib ploe oyqm ixpw',    // Mot de passe ou clé d'application
      },
    });

    const resetLink = `http://localhost:4200/reset-password/${token}`;
    const mailOptions = {
      from: 'oumoulkhairyndiaye1@gmail.com',
      to: email,
      subject: 'Réinitialisation du mot de passe',
      html: `<p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour le faire :</p>
             <a href="${resetLink}">Réinitialiser le mot de passe</a>
             <p>Ce lien expirera dans 1 heure.</p>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Un email de réinitialisation a été envoyé.',
    });
  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});
//rset password
app.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
  
    try {
      // Vérifier si le jeton est valide et n'a pas expiré
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ success: false, message: 'Jeton invalide ou expiré.' });
      }
  
      // Mettre à jour le mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      await user.save();
  
      return res.status(200).json({ success: true, message: 'Mot de passe mis à jour.' });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe :', error);
      return res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
  });

// Démarrer le serveur
app.listen(3000, () => {
  console.log('Serveur en cours d\'exécution sur le port 3000');
});
