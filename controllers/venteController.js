// const db = require('../config/db');
const db = require('../config/db');
const Vente = require('../models/Vente');

// Créer une vente
exports.createVente = async (req, res) => {
    try {
      const {
        lunetteId, typeVente, prixVente,
        clientNom, clientPrenom, clientTelephone,
        cabinetId, userId, dateLivraison, statut
      } = req.body;
  
      if (!lunetteId || !typeVente || !prixVente || !clientNom || !clientPrenom || !clientTelephone || !cabinetId || !userId) {
        return res.status(400).json({ message: 'Tous les champs requis sauf dateLivraison sont obligatoires' });
      }
  
      // Récupère la lunette pour vérifier le stock
      const lunette = db.prepare('SELECT * FROM Lunettes WHERE id = ?').get(lunetteId);
  
      if (!lunette) {
        return res.status(404).json({ message: 'Lunette non trouvée' });
      }
  
      if (lunette.quantite <= 0) {
        return res.status(400).json({ message: 'Stock insuffisant pour cette lunette' });
      }
  
      // Commencer une transaction pour garantir la cohérence
      const transaction = db.transaction(() => {
        // Crée la vente
        const vente = Vente.create({
          lunetteId,
          typeVente,
          prixVente,
          clientNom,
          clientPrenom,
          clientTelephone,
          cabinetId,
          userId,
          dateLivraison,
          statut
        });
  
        // Décrémente le stock
        db.prepare('UPDATE Lunettes SET quantite = quantite - 1 WHERE id = ?').run(lunetteId);
  
        return vente;
      });
  
      const venteFinale = transaction();
  
      res.status(201).json({ message: 'Vente enregistrée avec succès', vente: venteFinale });
    } catch (err) {
      console.error('Erreur dans createVente:', err);
      res.status(500).json({ message: 'Erreur lors de l\'enregistrement', error: err.message });
    }
  };

// Obtenir toutes les ventes
exports.getAllVentes = async (req, res) => {
  try {
    const ventes = Vente.findAll();
    res.json(ventes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir une vente
exports.getVente = async (req, res) => {
  try {
    const vente = Vente.findById(req.params.id);
    if (!vente) return res.status(404).json({ message: 'Vente non trouvée' });

    res.json(vente);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Modifier une vente
exports.updateVente = async (req, res) => {
  try {
    const vente = Vente.update(req.params.id, req.body);
    if (!vente) return res.status(404).json({ message: 'Vente non trouvée' });

    res.json({ message: 'Vente mise à jour avec succès', vente });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer une vente
exports.deleteVente = async (req, res) => {
  try {
    const success = Vente.delete(req.params.id);
    if (!success) return res.status(404).json({ message: 'Vente non trouvée ou déjà supprimée' });

    res.json({ message: 'Vente supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
