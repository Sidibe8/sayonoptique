const db = require('../config/db');

class Vente {
  static create({
    lunetteId,
    typeVente,
    prixVente,
    clientNom,
    clientPrenom,
    clientTelephone,
    cabinetId,
    userId,
    dateLivraison,
    statut = 'enregistree'
  }) {
    const result = db.prepare(`
      INSERT INTO Ventes (
        lunetteId, typeVente, prixVente,
        clientNom, clientPrenom, clientTelephone,
        cabinetId, userId, dateLivraison, statut
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      lunetteId, typeVente, prixVente,
      clientNom, clientPrenom, clientTelephone,
      cabinetId, userId, dateLivraison, statut
    );

    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    return db.prepare(`SELECT * FROM Ventes WHERE id = ?`).get(id);
  }

  static findAll() {
    return db.prepare(`SELECT * FROM Ventes ORDER BY dateEnregistrement DESC`).all();
  }

  static update(id, data) {
    const existing = this.findById(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...data
    };

    db.prepare(`
      UPDATE Ventes SET
        lunetteId = ?, typeVente = ?, prixVente = ?,
        clientNom = ?, clientPrenom = ?, clientTelephone = ?,
        cabinetId = ?, userId = ?, dateLivraison = ?, statut = ?
      WHERE id = ?
    `).run(
      updated.lunetteId, updated.typeVente, updated.prixVente,
      updated.clientNom, updated.clientPrenom, updated.clientTelephone,
      updated.cabinetId, updated.userId, updated.dateLivraison, updated.statut,
      id
    );

    return this.findById(id);
  }

  static delete(id) {
    const { changes } = db.prepare(`DELETE FROM Ventes WHERE id = ?`).run(id);
    return changes > 0;
  }
}

module.exports = Vente;
