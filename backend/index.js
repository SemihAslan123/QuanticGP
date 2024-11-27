const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const organisationRoutes = require('./routes/organisation'); // Importer les routes de l'organisation
const billetsRoutes = require('./routes/billets'); // Importer les routes des billets
const prestataireRoutes = require('./routes/prestataire'); // Importer les routes des prestataires
const loginRoutes = require('./routes/login'); // Importer la route de connexion

const app = express();
const port = 3001;

// Configuration de middlewares
app.use(cors({ origin: 'http://localhost:8080' })); // Permet l'accès depuis votre frontend Vue.js
app.use(bodyParser.json({ limit: '50mb' })); // Pour parser les requêtes JSON
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Utiliser les routes de l'organisation
app.use('/organisation', organisationRoutes);
app.use('/billets', billetsRoutes);
app.use('/prestataire', prestataireRoutes);

// Ajouter la route de connexion
app.use('/login', loginRoutes);

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});
