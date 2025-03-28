const express = require('express');
const router = express.Router();
const pool = require('../db'); // Chemin vers votre configuration de la base de données

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

    if (!userId) {
        return res.status(400).json({ error: 'ID utilisateur manquant.' });
    }

    try {
        const queryBillets = `
      SELECT * 
      FROM billet
      WHERE utilisateur_id = $1;
    `;
        const values = [userId];

        const result = await pool.query(queryBillets, values);

        // Renvoie une liste vide si aucun billet n'est trouvé
        res.status(200).json(result.rows || []);
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
 *     description: Cette route permet de récupérer toutes les activités auxquelles un utilisateur est inscrit.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: L'ID de l'utilisateur dont on souhaite récupérer les activités
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des activités trouvée avec succès.
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

    if (!userId) {
        return res.status(400).json({ error: 'ID utilisateur manquant.' });
    }

    try {
        const queryActivites = `
      SELECT e.id, e.name, e.date, e.heure_debut, e.heure_fin, e.prix, e.description, e.image
      FROM events e
      JOIN liste_activite_client lac ON lac.id_event = e.id
      WHERE lac.id_utilisateur = $1;
    `;
        const values = [userId];

        const result = await pool.query(queryActivites, values);
        res.status(200).json(result.rows || []);
    } catch (error) {
        console.error('Erreur lors de la récupération des activités :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

module.exports = router;
