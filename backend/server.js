const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Routes
const emplacementsRoutes = require('./routes/emplacements.routes');
const billetsRoutes = require('./routes/billets.routes');
const loginRoutes = require('./routes/login.routes');
const profilRoutes = require('./routes/profil.routes');
const prestatairesRoutes = require('./routes/prestataires.routes');
const organisationRoutes = require('./routes/organisation.routes');
const livreDorRoutes = require('./routes/livreDor.routes');
const inscriptionRoutes = require('./routes/inscription.routes');
const clientActiviteRoutes = require('./routes/clientActivite.routes');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation Swagger pour tester les routes de l’API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'], // <-- Assure-toi d’avoir des JSDoc dans tes fichiers de routes
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes API
app.use('/api', emplacementsRoutes);
app.use('/api/billets', billetsRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/profil', profilRoutes);
app.use('/api/prestataire', prestatairesRoutes);
app.use('/api/organisation', organisationRoutes);
app.use('/api/livreDor', livreDorRoutes);
app.use('/api/inscription', inscriptionRoutes);
app.use('/api/clientActivite', clientActiviteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Swagger disponible sur http://localhost:${PORT}/api-docs`);
});
