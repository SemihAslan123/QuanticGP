const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const cors = require("cors");
const {join} = require("path"); // Chemin vers db.js

// Configuration de CORS pour permettre les requêtes provenant de votre frontend (port 8080)
router.use(cors({
    origin: 'http://localhost:8080'  // Frontend autorisé à interagir avec l'API
}));

//router.use('/assets/prestataire', express.static(join(__dirname, '../frontend/src/assets/prestataires/image')));

// Exemple de route pour récupérer des données depuis PostgreSQL
router.get('/', async (req, res) => {
    try {
        // Effectuer une requête SQL
        const result = await pool.query("SELECT * FROM Utilisateurs JOIN servicePrestataire ON Utilisateurs.id_utilisateur = servicePrestataire.id_utilisateur WHERE Utilisateurs.type_utilisateur='prestataire'"); // Remplacez 'votre_table' par le nom de votre table
        res.json(result.rows); // Envoyer les données sous forme de JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
});

router.get('/service/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Effectuer une requête SQL
        const result = await pool.query("SELECT * FROM servicePrestataire WHERE id_service = $1", [id]);
        console.log("Résultat de la requête SQL:", result.rows);
        res.json(result.rows); // Envoyer les données sous forme de JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
});

router.post('/inscription', async (req, res) => {
    const { nom_utilisateur, prenom_utilisateur, mail_utilisateur, mot_de_passe, type_utilisateur, image_prestataire } = req.body;

    if (!nom_utilisateur || !prenom_utilisateur || !mail_utilisateur || !mot_de_passe || !type_utilisateur) {
        return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis.' });
    }


    try {
        // Effectuer une requête SQL
        const result = await pool.query(
            `INSERT INTO Utilisateurs (nom_utilisateur, prenom_utilisateur, mail_utilisateur, mot_de_passe, type_utilisateur, image_prestataire) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`, // RETURNING * permet de renvoyer les données insérées
            [nom_utilisateur, prenom_utilisateur, mail_utilisateur, mot_de_passe, type_utilisateur, image_prestataire]
        );
        res.status(201).json({
            message: 'Utilisateur inscrit avec succès.',
            utilisateur: result.rows[0], // Retourne la première (et seule) ligne insérée
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
});

module.exports = router; // Exporter le router pour pouvoir l'utiliser dans index.js
