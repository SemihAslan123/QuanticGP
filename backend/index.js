const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const organisationRoutes = require('./routes/organisation');
const billetsRoutes = require('./routes/billets');
const prestataireRoutes = require('./routes/prestataire');
const loginRoutes = require('./routes/login');
const profilRoutes = require('./routes/profil');
const inscriptionRoutes = require('./routes/inscription');
const livreDorRoutes = require('./routes/livreDor');
const clientActiviteRoutes = require('./routes/clientActivite');
const clientPaiementActiviteRoutes = require('./routes/clientPaiementActivite');
const carteRoutes = require('./routes/carte');

// Ajout de Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3001;

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestion des Utilisateurs',
      version: '1.0.0',
      description: 'Cette API permet de gérer les utilisateurs, l\'inscription, et plus encore.',
    },
  },
  apis: ['./routes/*.js'], // Cible tous les fichiers dans le dossier routes pour générer la documentation
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use(cors({ origin: 'http://localhost:8080' })); // Permet l'accès depuis votre frontend Vue.js
app.use(bodyParser.json({ limit: '50mb' })); // Pour parser les requêtes JSON
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/organisation', organisationRoutes);
app.use('/billets', billetsRoutes);
app.use('/prestataire', prestataireRoutes);
app.use('/login', loginRoutes);
app.use('/profil', profilRoutes);
app.use('/inscription', inscriptionRoutes);
app.use('/livreDor',livreDorRoutes);
app.use('/clientActivite',clientActiviteRoutes);
app.use('/clientPaiementActivite', clientPaiementActiviteRoutes);
app.use('/carte', carteRoutes);

// Exposer Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});
