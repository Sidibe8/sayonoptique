const db = require('../config/db');

class Cabinet {
    // Créer un nouveau cabinet
    static create({ nom, adresse, ville, telephone }) {
        const { lastInsertRowid } = db.prepare(
            'INSERT INTO Cabinets (nom, adresse, ville, telephone) VALUES (?, ?, ?, ?)'
        ).run(nom, adresse, ville, telephone);
        return this.findById(lastInsertRowid);
    }

    // Trouver un cabinet par son ID
    static findById(id) {
        return db.prepare('SELECT * FROM Cabinets WHERE id = ?').get(id);
    }

    // Lister tous les cabinets
    static findAll() {
        return db.prepare('SELECT * FROM Cabinets ORDER BY nom').all();
    }

    // Mettre à jour un cabinet
    static update(id, { nom, adresse, ville, telephone }) {
        const { changes } = db.prepare(
            'UPDATE Cabinets SET nom = ?, adresse = ?, ville = ?, telephone = ?, WHERE id = ?'
        ).run(nom, adresse, ville, telephone, id);
        
        return changes > 0 ? this.findById(id) : null;
    }

    // Supprimer un cabinet
    static delete(id) {
        // Vérifier d'abord si le cabinet a des utilisateurs associés
        const users = db.prepare('SELECT id FROM Users WHERE cabinetId = ?').all(id);
        if (users.length > 0) {
            throw new Error('Impossible de supprimer: le cabinet a des utilisateurs associés');
        }

        const { changes } = db.prepare('DELETE FROM Cabinets WHERE id = ?').run(id);
        return changes > 0;
    }

    // Compter le nombre de lunettes par cabinet
    static countLunettes(cabinetId) {
        return db.prepare(
            'SELECT COUNT(*) as count FROM Lunettes WHERE cabinetId = ?'
        ).get(cabinetId).count;
    }
}

module.exports = Cabinet;