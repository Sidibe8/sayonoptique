const db = require('../config/db');

class Lunette {
 // Créer une nouvelle paire de lunettes
 static create({ reference, marque, couleur, quantite = 0 }) {
    try {
      if (!reference || !marque || !couleur) {
        throw new Error('Référence, marque et couleur sont obligatoires');
      }
    
      const result = db.prepare(
        'INSERT INTO Lunettes (reference, marque, couleur, quantite) VALUES (?, ?, ?, ?)'
      ).run(reference, marque, couleur, quantite);
    
      if (!result || !result.lastInsertRowid) {
        throw new Error('Échec de la création de la lunette');
      }
      
      return this.findById(result.lastInsertRowid);
    } catch (err) {
      console.error('Erreur dans Lunette.create:', err);
      throw err; // Propager l'erreur pour la gestion dans le contrôleur
    }
  }
  

  // Trouver une lunette par ID
  static findById(id) {
    return db.prepare(`
      SELECT * FROM Lunettes
      WHERE id = ?
    `).get(id);
  }

  // Trouver par référence
  static findByReference(ref) {
    return db.prepare('SELECT * FROM Lunettes WHERE reference = ?').get(ref);
  }

  // Lister toutes les lunettes
  static findAll() {
    return db.prepare('SELECT * FROM Lunettes ORDER BY reference').all();
  }

  // Mettre à jour une lunette
  static update(id, { reference, marque, couleur, quantite }) {
    const { changes } = db.prepare(
      'UPDATE Lunettes SET reference = ?, marque = ?, couleur = ?, quantite = ? WHERE id = ?'
    ).run(reference, marque, couleur, quantite, id);

    return changes > 0 ? this.findById(id) : null;
  }

  // Supprimer une lunette
  static delete(id) {
    const { changes } = db.prepare('DELETE FROM Lunettes WHERE id = ?').run(id);
    return changes > 0;
  }
}

module.exports = Lunette;
