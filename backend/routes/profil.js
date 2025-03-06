const express = require('express');
const router = express.Router();
const pool = require('../database/db'); // Chemin vers votre configuration de la base de données

/**
 * @swagger
 * /profil/{userId}/billets:
 *   get:
 *     summary: Récupérer les billets d'un utilisateur
 *     description: Cette route permet de récupérer tous les billets d'un utilisateur en fonction de son ID.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: L'ID de l'utilisateur dont on souhaite récupérer les billets
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des billets trouvée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   course_nom:
 *                     type: string
 *                   course_date:
 *                     type: string
 *       400:
 *         description: ID utilisateur manquant.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/:userId/billets', async (req, res) => {
    const { userId } = req.params;

    // Vérifier que l'ID utilisateur est présent
    if (!userId) {
        return res.status(400).json({ error: 'ID utilisateur manquant.' });
    }

    try {
        // Requête pour récupérer toutes les informations des billets pour un utilisateur donné
        const queryBillets = `
            SELECT * 
            FROM billet
            WHERE utilisateur_id = $1;
        `;
        const values = [userId];

        const result = await pool.query(queryBillets, values);

        // Si aucun billet n'est trouvé, on renvoie une liste vide
        if (result.rows.length === 0) {
            return res.status(200).json([]); // Liste vide, pas de billets
        }

        // Si des billets sont trouvés, on les renvoie sous forme de JSON
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des billets :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

/**
 * @swagger
 * /profil/{userId}/activites:
 *   get:
 *     summary: Récupérer les activités de l'utilisateur
 *     description: Cette route permet de récupérer toutes les activités (événements) auxquelles un utilisateur est inscrit.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: L'ID de l'utilisateur dont on souhaite récupérer les activités
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des activités de l'utilisateur trouvée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   date:
 *                     type: string
 *                   heure_debut:
 *                     type: string
 *                   heure_fin:
 *                     type: string
 *                   prix:
 *                     type: number
 *                   description:
 *                     type: string
 *                   image:
 *                     type: string
 *       400:
 *         description: ID utilisateur manquant.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/:userId/activites', async (req, res) => {
    const { userId } = req.params;

    // Vérifier que l'ID utilisateur est présent
    if (!userId) {
        return res.status(400).json({ error: 'ID utilisateur manquant.' });
    }

    try {
        // Requête pour récupérer toutes les activités auxquelles l'utilisateur est inscrit
        const queryActivites = `
            SELECT e.id, e.name, e.date, e.heure_debut, e.heure_fin, e.prix, e.description, e.image
            FROM events e
            JOIN liste_activite_client lac ON lac.id_event = e.id
            WHERE lac.id_utilisateur = $1;
        `;
        const values = [userId];

        const result = await pool.query(queryActivites, values);

        // Si aucune activité n'est trouvée, on renvoie une liste vide
        if (result.rows.length === 0) {
            return res.status(200).json([]); // Liste vide, pas d'activités
        }

        // Si des activités sont trouvées, on les renvoie sous forme de JSON
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des activités :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

module.exports = router;
