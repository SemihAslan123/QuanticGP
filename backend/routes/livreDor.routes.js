const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * /api/livreDor:
 *   get:
 *     summary: Récupérer tous les avis
 *     description: Cette route permet de récupérer tous les avis du livre d'or avec les informations associées des utilisateurs qui ont laissé ces avis.
 *     responses:
 *       200:
 *         description: Liste des avis récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_avis:
 *                     type: integer
 *                     example: 1
 *                   commentaire:
 *                     type: string
 *                     example: "Excellent service, je recommande!"
 *                   date_avis:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-07-15T12:00:00Z"
 *                   note:
 *                     type: integer
 *                     example: 5
 *                   nom_utilisateur:
 *                     type: string
 *                     example: "Dupont"
 *                   prenom_utilisateur:
 *                     type: string
 *                     example: "Jean"
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
        const query = `
      SELECT 
        LivreOr.id_avis, 
        LivreOr.commentaire, 
        LivreOr.date_avis, 
        LivreOr.note, 
        Utilisateurs.nom_utilisateur,
        Utilisateurs.prenom_utilisateur 
      FROM LivreOr
      JOIN Utilisateurs ON LivreOr.id_utilisateur = Utilisateurs.id_utilisateur
      ORDER BY LivreOr.date_avis DESC;
    `;
        const result = await pool.query(query);
        console.log(result.rows);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des avis :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

/**
 * @swagger
 * /api/livreDor:
 *   post:
 *     summary: Ajouter un nouvel avis
 *     description: Cette route permet d'ajouter un nouvel avis dans le livre d'or. La note doit être comprise entre 1 et 5.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - commentaire
 *               - note
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: Identifiant de l'utilisateur qui laisse l'avis.
 *                 example: 2
 *               commentaire:
 *                 type: string
 *                 description: Contenu de l'avis.
 *                 example: "Excellent service, je recommande vivement."
 *               note:
 *                 type: integer
 *                 description: Note attribuée (entre 1 et 5).
 *                 example: 5
 *     responses:
 *       201:
 *         description: Avis ajouté avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 id:
 *                   type: integer
 *                   description: Identifiant de l'avis créé.
 *                   example: 1
 *                 id_utilisateur:
 *                   type: integer
 *                   description: Identifiant de l'utilisateur qui a laissé l'avis.
 *                   example: 2
 *                 commentaire:
 *                   type: string
 *                   description: Contenu de l'avis.
 *                   example: "Excellent service, je recommande vivement."
 *                 note:
 *                   type: integer
 *                   description: Note attribuée.
 *                   example: 5
 *                 date_avis:
 *                   type: string
 *                   format: date-time
 *                   description: Date à laquelle l'avis a été laissé.
 *                   example: "2025-07-15T12:00:00Z"
 *       400:
 *         description: Paramètres manquants ou invalides.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Paramètres manquants ou invalides"
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
router.post('/', async (req, res) => {
    const { userId, commentaire, note } = req.body;
    if (!userId || !commentaire || !note || note < 1 || note > 5) {
        return res.status(400).json({ error: 'Paramètres manquants ou invalides' });
    }
    try {
        const query = `
      INSERT INTO LivreOr (id_utilisateur, commentaire, note)
      VALUES ($1, $2, $3)
      RETURNING id_avis, id_utilisateur, commentaire, note, date_avis;
    `;
        const values = [userId, commentaire, note];
        const result = await pool.query(query, values);
        res.status(201).json({
            success: true,
            id: result.rows[0].id_avis,
            id_utilisateur: result.rows[0].id_utilisateur,
            commentaire: result.rows[0].commentaire,
            note: result.rows[0].note,
            date_avis: result.rows[0].date_avis,
        });
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'avis :", error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

module.exports = router;
