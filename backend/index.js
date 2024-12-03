const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const organisationRoutes = require('./routes/organisation');
const billetsRoutes = require('./routes/billets');
const prestataireRoutes = require('./routes/prestataire');
const loginRoutes = require('./routes/login');
const ProfilRoutes = require('./routes/profil');

const app = express();
const port = 3001;

// Configuration de middlewares
app.use(cors({ origin: 'http://localhost:8080' })); // Permet l'accès depuis votre frontend Vue.js
app.use(bodyParser.json({ limit: '50mb' })); // Pour parser les requêtes JSON
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/organisation', organisationRoutes);
app.use('/billets', billetsRoutes); // Assure-toi que cette ligne est présente
app.use('/prestataire', prestataireRoutes);
app.use('/login', loginRoutes);
app.use('/profil', ProfilRoutes);

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});
