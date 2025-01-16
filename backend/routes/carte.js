const express = require('express');
const router = express.Router();
const pool = require('../database/db'); // Connexion à ta base de données

// Route GET pour récupérer les emplacements
router.get('/emplacements', async (req, res) => {
    try {

        console.log('Requête pour récupérer les emplacements reçue');

        const query = `
            SELECT *
            FROM emplacements_prestataires
        `;

        console.log('Exécution de la requête SQL :', query);

        const result = await pool.query(query);

        console.log('Résultat de la requête SQL :', result.rows);
        
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des emplacements :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

module.exports = router;
