const Cabinet = require('../models/Cabinet');

// Créer un nouveau cabinet (Admin seulement)
exports.createCabinet = async (req, res) => {
    try {
        const { nom, adresse, ville, telephone, email } = req.body;

        // Validation simple
        if (!nom || !ville) {
            return res.status(400).json({ message: 'Le nom et la ville sont obligatoires' });
        }

        const cabinet = await Cabinet.create({ nom, adresse, ville, telephone, email });

        res.status(201).json({
            message: 'Cabinet créé avec succès',
            cabinet
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lister tous les cabinets
exports.getAllCabinets = async (req, res) => {
    try {
        const cabinets = await Cabinet.findAll();
        res.json(cabinets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Obtenir un cabinet spécifique
exports.getCabinet = async (req, res) => {
    try {
        const cabinet = await Cabinet.findById(req.params.id);
        if (!cabinet) {
            return res.status(404).json({ message: 'Cabinet non trouvé' });
        }
        
        // Ajouter le nombre de lunettes disponibles
        const lunettesCount = await Cabinet.countLunettes(cabinet.id);
        res.json({ ...cabinet, lunettesCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Mettre à jour un cabinet (Admin seulement)
exports.updateCabinet = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedCabinet = await Cabinet.update(id, updates);
        if (!updatedCabinet) {
            return res.status(404).json({ message: 'Cabinet non trouvé' });
        }

        res.json({
            message: 'Cabinet mis à jour avec succès',
            cabinet: updatedCabinet
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Supprimer un cabinet (Admin seulement)
exports.deleteCabinet = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await Cabinet.delete(id);
        
        if (!success) {
            return res.status(404).json({ message: 'Cabinet non trouvé' });
        }

        res.json({ message: 'Cabinet supprimé avec succès' });
    } catch (err) {
        if (err.message.includes('Impossible de supprimer')) {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: err.message });
    }
};