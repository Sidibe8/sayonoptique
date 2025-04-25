const express = require('express');
const db = require('./config/db'); // Modification ici pour SQLite
const cors = require('cors');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/authRoutes');
const cabinetRoutes = require('./routes/cabinetRoutes');
const lunetteRoutes = require('./routes/lunetteRoutes');
const venteRoutes = require('./routes/venteRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Vérification de la connexion à la base de données
db.prepare("SELECT 1").get(); // Test simple de connexion à SQLite
console.log('Connexion à SQLite établie avec succès');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cabinets', cabinetRoutes);
app.use('/api/lunettes', lunetteRoutes);
app.use('/api/ventes', venteRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
app.use((req, res) => {
    res.status(200).send('Youpii!');
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Base de données SQLite: ${process.env.SQLITE_PATH || 'database.db'}`);
});