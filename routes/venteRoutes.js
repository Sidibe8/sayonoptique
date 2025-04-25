const express = require('express');
const router = express.Router();
const venteController = require('../controllers/venteController');

// Créer une nouvelle vente
router.post('/', venteController.createVente);

// Obtenir toutes les ventes
router.get('/', venteController.getAllVentes);

// Obtenir une vente spécifique
router.get('/:id', venteController.getVente);

// Mettre à jour une vente
router.put('/:id', venteController.updateVente);

// Supprimer une vente
router.delete('/:id', venteController.deleteVente);

module.exports = router;
