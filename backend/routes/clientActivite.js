const express = require('express');
const router = express.Router();
const pool = require('../database/db');

/**
 * @swagger
 * /clientActivite:
 *   get:
 *     summary: Récupérer les événements
 *     description: Cette route permet de récupérer tous les événements disponibles.
 *     responses:
 *       200:
 *         description: Liste des événements trouvée avec succès.
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
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/', async (req, res) => {
  try {
    const query = 'SELECT * FROM events ORDER BY date DESC';
    const result = await pool.query(query); // Exécution de la requête
    res.status(200).json(result.rows); // Réponse en JSON avec la liste des événements
  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

module.exports = router;
