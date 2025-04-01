const express = require("express");
const router = express.Router();
const pool = require("../db");

/**
 * GET /clientActivite
 * Récupérer tous les événements disponibles.
 */
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM events ORDER BY date DESC';
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des événements:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

/**
 * POST /clientActivite/payment
 * Inscrire un utilisateur connecté à des activités lors du paiement.
 */
router.post('/payment', async (req, res) => {
    const { userId, activities } = req.body;

    // Vérification des données reçues
    if (!userId || !Array.isArray(activities) || activities.length === 0) {
        return res.status(400).json({ error: 'Champs obligatoires manquants ou invalides.' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Démarrer la transaction

        for (const activity of activities) {
            const { id_event } = activity;
            // Vérifier que l'événement existe
            const eventQuery = 'SELECT 1 FROM events WHERE id = $1';
            const eventResult = await client.query(eventQuery, [id_event]);

            if (eventResult.rowCount === 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({ error: `L'événement avec l'ID ${id_event} n'existe pas.` });
            }

            // Insertion de l'inscription
            const queryInscription = `
        INSERT INTO liste_activite_client (id_utilisateur, id_event)
        VALUES ($1, $2);
      `;
            const valuesInscription = [userId, id_event];
            await client.query(queryInscription, valuesInscription);
        }

        await client.query('COMMIT'); // Valider la transaction
        res.status(201).json({ message: 'Inscriptions enregistrées avec succès.' });
    } catch (error) {
        await client.query('ROLLBACK'); // Annuler la transaction en cas d'erreur
        console.error('Erreur lors de l’insertion dans la base de données:', error.message);
        res.status(500).json({ error: 'Erreur interne du serveur.', details: error.message });
    } finally {
        client.release(); // Libérer la connexion
    }
});

module.exports = router;
