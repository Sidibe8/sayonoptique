const express = require('express');
const router = express.Router();
const lunetteController = require('../controllers/lunetteController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/',lunetteController.getAllLunettes);
router.get('/:id', authMiddleware.isAuthenticated, lunetteController.getLunette);

// Routes pour création/modification (gestionnaires et admin)
router.post('/', lunetteController.createLunette);
router.put('/:id', lunetteController.updateLunette);
router.delete('/:id', authMiddleware.isAuthenticated, lunetteController.deleteLunette);

// Route spéciale pour transfert de stock (admin seulement)
// router.post('/transferer', authMiddleware.isAuthenticated, authMiddleware.isAdmin, lunetteController.transfererStock);

module.exports = router;