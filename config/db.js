const Database = require('better-sqlite3');
const path = require('path');

// Chemin vers le fichier de base de données
const dbPath = path.resolve(__dirname, '../database.db');

// Créer une connexion à la base de données
const db = new Database(dbPath, { verbose: console.log });

// Activer les clés étrangères
db.pragma('foreign_keys = ON');

// Créer les tables si elles n'existent pas
db.exec(`
  CREATE TABLE IF NOT EXISTS Cabinets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    adresse TEXT NOT NULL,
    ville TEXT NOT NULL,
    telephone TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'gestionnaire')) DEFAULT 'gestionnaire',
    cabinetId INTEGER,
    isActive BOOLEAN DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cabinetId) REFERENCES Cabinets(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS Lunettes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference TEXT NOT NULL UNIQUE,
    marque TEXT NOT NULL,
    couleur TEXT NOT NULL,
    quantite INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Ventes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lunetteId INTEGER NOT NULL,
    typeVente TEXT CHECK(typeVente IN ('monture', 'verres', 'complet')) NOT NULL,
    prixVente REAL NOT NULL,
    clientNom TEXT NOT NULL,
    clientPrenom TEXT NOT NULL,
    clientTelephone TEXT NOT NULL,
    cabinetId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    dateEnregistrement DATETIME DEFAULT CURRENT_TIMESTAMP,
    dateLivraison DATETIME,
    statut TEXT CHECK(statut IN ('enregistree', 'en_preparation', 'livree')) DEFAULT 'enregistree',
    FOREIGN KEY (lunetteId) REFERENCES Lunettes(id),
    FOREIGN KEY (cabinetId) REFERENCES Cabinets(id),
    FOREIGN KEY (userId) REFERENCES Users(id)
  );
`);

module.exports = db;