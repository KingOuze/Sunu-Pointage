const express = require('express');
const usercontroller = require('../controllers/usercontroller');
const pointagecontroller = require('../controllers/pointagecontroller');

const router = express.Router();

// Routes pour les utilisateurs
router.get('/users', usercontroller.getAllUsers);
router.get('/users/:cardId', usercontroller.getUserByCardId);
router.post('/users', usercontroller.createUser);
router.delete('/users/:id', usercontroller.deleteUser);

// Routes pour les pointages
router.post('/pointages', pointagecontroller.addPointage);
router.get('/pointages', pointagecontroller.getAllPointages);

module.exports = router;