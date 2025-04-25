const express = require('express');
const router = express.Router();
const cabinetController = require('../controllers/cabinetController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes publiques
router.get('/', cabinetController.getAllCabinets);
router.get('/:id', cabinetController.getCabinet);

// Routes protégées (Admin seulement)
router.post('/',  cabinetController.createCabinet);
router.put('/:id', authMiddleware.isAuthenticated, authMiddleware.isAdmin, cabinetController.updateCabinet);
router.delete('/:id', authMiddleware.isAuthenticated, authMiddleware.isAdmin, cabinetController.deleteCabinet);

module.exports = router;

// Création (POST /api/cabinets)

// Lecture (GET /api/cabinets et GET /api/cabinets/:id)

// Mise à jour (PUT /api/cabinets/:id)

// Suppression (DELETE /api/cabinets/:id)