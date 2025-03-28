const express = require('express');
const cors = require('cors');
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

// Middleware pour gérer les requêtes JSON
app.use(express.json());

// Middleware CORS pour autoriser les requêtes depuis un autre domaine (ex: frontend)
app.use(cors());

// Enregistrement des routes API
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
  console.log(`Serveur démarré sur le port ${PORT}`);
});
