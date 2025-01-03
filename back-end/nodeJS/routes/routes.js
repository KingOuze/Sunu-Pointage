const express = require('express');
const usercontroller = require('../controllers/usercontroller');
const { checkin, checkout } = require('../controllers/PointageUserController');

const router = express.Router();

// Routes pour les utilisateurs
router.get('/users', usercontroller.getAllUsers);
router.get('/users/:cardId', usercontroller.getUserByCardId);
router.post('/users', usercontroller.createUser);
router.delete('/users/:id', usercontroller.deleteUser);

// Route pour le check-in
router.post('/checkin', checkin);

// Route pour le check-out
router.post('/checkout', checkout);
module.exports = router;
