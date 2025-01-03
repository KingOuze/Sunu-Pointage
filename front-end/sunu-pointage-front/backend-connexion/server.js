const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { SerialPort, ReadlineParser } = require('serialport');
const User = require('./models/User');
const jwt = require('jsonwebtoken'); // Pour générer un token JWT
const app = express();
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
require('dotenv').config();
const bcrypt = require('bcrypt');


// Middleware
app.use(cors());
app.use(express.json()); // Pour analyser le corps JSON des requêtes

connectDB();

// Communication série avec Arduino
const port = new SerialPort({
    path: '/dev/ttyUSB0', // Remplacez 'COM3' par le port série de votre Arduino
    baudRate: 9600
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', (data) => {
    console.log(`Données reçues de l'Arduino : ${data}`);
    // Vous pouvez ici traiter les données reçues et effectuer d'autres actions
});

// Routes d'authentification
app.use('/api/auth', authRoutes);

// Route pour la connexion via carte RFID (UID)
app.post('/api/auth/login-with-uid', async (req, res) => {
    const { uid } = req.body; // UID reçu de la carte RFID
    
    // Vérifier si l'UID est fourni
    if (!uid) {
        console.log("Erreur: UID requis.");
        return res.status(400).json({ message: 'UID requis' });
    }

    console.log(`UID reçu: ${uid}`);

    try {
        // Recherche de l'utilisateur avec l'UID
        const user = await User.findOne({ rfidUid: uid }); // Remplace `rfidUid` par le champ qui contient l'UID dans ta base de données

        // Si l'utilisateur n'est pas trouvé
        if (!user) {
            console.log(`Utilisateur non trouvé pour l'UID: ${uid}`);
            return res.status(400).json({ message: 'Utilisateur non trouvé' });
        }

        console.log(`Utilisateur trouvé: ${user.username}`);

        // Générer un token JWT
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Retourner le token et le rôle de l'utilisateur
        console.log(`Utilisateur connecté: ${user.username}, rôle: ${user.role}`);

        return res.status(200).json({
            token: token,
            role: user.role // Le rôle de l'utilisateur (admin, vigile, etc.)
        });
    } catch (error) {
        console.error("Erreur lors de la connexion avec UID:", error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
});


// Endpoint pour mot de passe oublié
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (email) {
        const resetToken = 'unique-token'; // Générez un vrai token
        const resetLink = `http://localhost:${process.env.PORT}/reset-password/${resetToken}`;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Réinitialisation de votre mot de passe',
            text: `Cliquez sur ce lien pour réinitialiser votre mot de passe: ${resetLink}`
        };

        try {
            await transporter.sendMail(mailOptions);
            return res.status(200).send('Email de réinitialisation envoyé');
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email', error);
            return res.status(500).send('Erreur lors de l\'envoi de l\'email');
        }
    } else {
        return res.status(404).send('Email non trouvé');
    }
});

// Endpoint pour réinitialiser le mot de passe
app.post('/api/auth/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    console.log(`Token: ${token}, Nouveau mot de passe: ${newPassword}`);
    return res.status(200).send('Mot de passe réinitialisé avec succès');
});
app.post('/api/auth/check-password', async (req, res) => {
    const { email, password } = req.body;
  
    // Vérifiez si l'email existe et récupérez l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ valid: false });
    }
  
    // Vérifiez si le mot de passe correspond
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ valid: false });
    }
  
    return res.status(200).json({ valid: true });
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
