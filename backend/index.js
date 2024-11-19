const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const organisationRoutes = require('./routes/organisation'); // Importer les routes

const app = express();
const port = 3001;

// Configuration de middlewares
app.use(cors({ origin: 'http://localhost:8080' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Utiliser les routes de l'organisation
app.use('/organisation', organisationRoutes);

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});
