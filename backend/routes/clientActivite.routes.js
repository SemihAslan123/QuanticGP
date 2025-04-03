const express = require("express");
const router = express.Router();
const pool = require("../db");

/**
 * @swagger
 * /api/clientActivite:
 *   get:
 *     summary: Récupérer tous les événements disponibles
 *     description: Retourne la liste de tous les événements disponibles, triés par date décroissante.
 *     responses:
 *       200:
 *         description: Liste des événements récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Karting enfant"
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2025-07-15"
 *                   heure_debut:
 *                     type: string
 *                     example: "10:00"
 *                   heure_fin:
 *                     type: string
 *                     example: "11:00"
 *                   prix:
 *                     type: number
 *                     format: float
 *                     example: 40.00
 *                   description:
 *                     type: string
 *                     example: "Course de karting pour enfants"
 *                   image:
 *                     type: string
 *                     example: "/assets/events/karting_enfant.jpg"
 *       500:
 *         description: Erreur interne du serveur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur interne du serveur"
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
 * @swagger
 * /api/clientActivite/payment:
 *   post:
 *     summary: Inscrire un utilisateur connecté à des activités lors du paiement
 *     description: Permet d'inscrire un utilisateur connecté à une ou plusieurs activités. Chaque inscription vérifie que l'événement existe avant de procéder à l'inscription.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - activities
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID de l'utilisateur connecté.
 *                 example: 7
 *               activities:
 *                 type: array
 *                 description: Liste des activités auxquelles l'utilisateur souhaite s'inscrire.
 *                 items:
 *                   type: object
 *                   required:
 *                     - id_event
 *                   properties:
 *                     id_event:
 *                       type: integer
 *                       description: ID de l'événement.
 *                       example: 1
 *     responses:
 *       201:
 *         description: Inscriptions enregistrées avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Inscriptions enregistrées avec succès."
 *       400:
 *         description: Champs obligatoires manquants ou invalides, ou l'événement spécifié n'existe pas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Champs obligatoires manquants ou invalides."
 *       500:
 *         description: Erreur interne du serveur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur interne du serveur."
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
