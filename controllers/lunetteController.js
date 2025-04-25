const Lunette = require('../models/Lunette');

// Créer une nouvelle lunette
exports.createLunette = async (req, res) => {
    try {
        const { reference, marque, couleur, quantite } = req.body;

        // Validation améliorée
        if (!reference?.trim() || !marque?.trim() || !couleur?.trim()) {
            return res.status(400).json({ 
                message: 'Les champs référence, marque et couleur sont obligatoires',
                received: req.body
            });
        }

        // Convertir la quantité en nombre (si fournie)
        const qte = quantite ? parseInt(quantite) : 0;

        const lunette = await Lunette.create({ 
            reference: reference.trim(),
            marque: marque.trim(),
            couleur: couleur.trim(),
            quantite: qte
        });

        res.status(201).json({
            message: 'Lunette créée avec succès',
            lunette: {
                id: lunette.id,
                reference: lunette.reference,
                marque: lunette.marque,
                couleur: lunette.couleur,
                quantite: lunette.quantite
            }
        });
    } catch (err) {
        console.error('Erreur dans createLunette:', err);
        res.status(500).json({ 
            message: 'Erreur lors de la création de la lunette',
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};

// Lister toutes les lunettes
exports.getAllLunettes = async (req, res) => {
    try {
        const lunettes = await Lunette.findAll();
        res.json(lunettes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Obtenir une lunette spécifique
exports.getLunette = async (req, res) => {
    try {
        const lunette = await Lunette.findById(req.params.id);
        if (!lunette) {
            return res.status(404).json({ message: 'Lunette non trouvée' });
        }

        res.json(lunette);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Mettre à jour une lunette
exports.updateLunette = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const existing = await Lunette.findById(id);
        if (!existing) {
            return res.status(404).json({ message: 'Lunette non trouvée' });
        }

        const updatedLunette = await Lunette.update(id, updates);

        res.json({
            message: 'Lunette mise à jour avec succès',
            lunette: updatedLunette
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Supprimer une lunette
exports.deleteLunette = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await Lunette.findById(id);
        if (!existing) {
            return res.status(404).json({ message: 'Lunette non trouvée' });
        }

        const success = await Lunette.delete(id);
        if (!success) {
            return res.status(404).json({ message: 'Suppression échouée' });
        }

        res.json({ message: 'Lunette supprimée avec succès' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
