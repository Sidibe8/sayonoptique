const db = require('../config/db');

class User {
  static findByEmail(email) {
    return db.prepare('SELECT * FROM Users WHERE email = ?').get(email);
  }

  static findById(id) {
    return db.prepare('SELECT * FROM Users WHERE id = ?').get(id);
  }

  static create({ nom, prenom, email, password, role, cabinetId = null }) {
    const { lastInsertRowid } = db.prepare(
      'INSERT INTO Users (nom, prenom, email, password, role, cabinetId) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(nom, prenom, email, password, role, cabinetId);
    return this.findById(lastInsertRowid);
  }

  static findAll() {
    return db.prepare('SELECT * FROM Users ORDER BY nom').all();
  }

  static update(id, updates) {
    // Ne pas permettre de changer le rôle en admin si cabinetId est défini
    if (updates.role === 'admin') {
      updates.cabinetId = null;
    }

    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) { // Ne mettre à jour que les champs fournis
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (fields.length === 0) {
      return this.findById(id); // Aucune mise à jour demandée
    }
    
    values.push(id);
    
    const stmt = db.prepare(
      `UPDATE Users SET ${fields.join(', ')} WHERE id = ?`
    );
    stmt.run(...values);
    
    return this.findById(id);
  }

  static delete(id) {
    const { changes } = db.prepare('DELETE FROM Users WHERE id = ?').run(id);
    return changes > 0;
  }
}

module.exports = User;