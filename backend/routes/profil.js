const express = require('express');
const router = express.Router();
const pool = require('../database/db'); // Chemin vers votre configuration de la base de données

// Route GET pour récupérer les billets d'un client connecté
router.get('/:userId/billets', async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: 'ID utilisateur manquant.' });
    }

    try {
        // Requête pour récupérer les billets du client connecté
        const queryBillets = `
            SELECT 
                id AS id_billet,
                course_nom,
                hotel_nom,
                date_debut_parking,
                date_fin_parking,
                is_vip,
                prix_total,
                date_paiement
            FROM 
                billet
            WHERE 
                utilisateur_id = $1;
        `;
        const values = [userId];

        const result = await pool.query(queryBillets, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Aucun billet trouvé pour cet utilisateur.' });
        }

        res.status(200).json(result.rows); // Renvoie les billets sous forme de tableau JSON
    } catch (error) {
        console.error('Erreur lors de la récupération des billets :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

module.exports = router;
