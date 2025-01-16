const express = require('express');
const router = express.Router();
const pool = require('../database/db'); // Assurez-vous que ce chemin est correct

// Route pour récupérer tous les avis
/**
 * @swagger
 * /livredor:
 *   get:
 *     summary: Récupérer tous les avis
 *     description: Cette route permet de récupérer tous les avis existants dans la base de données, y compris les informations des utilisateurs qui ont laissé ces avis.
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
 *                     description: L'ID de l'avis.
 *                   commentaire:
 *                     type: string
 *                     description: Le contenu de l'avis.
 *                   note:
 *                     type: integer
 *                     description: La note de l'avis (entre 1 et 5).
 *                   date_avis:
 *                     type: string
 *                     format: date-time
 *                     description: La date de création de l'avis.
 *                   nom_utilisateur:
 *                     type: string
 *                     description: Le nom de l'utilisateur ayant laissé l'avis.
 *                   prenom_utilisateur:
 *                     type: string
 *                     description: Le prénom de l'utilisateur ayant laissé l'avis.
 *       500:
 *         description: Erreur interne du serveur.
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

    console.log(result.rows); // Affiche les avis dans la console pour le débogage

    res.status(200).json(result.rows); // Renvoie les avis avec les informations de l'utilisateur
  } catch (error) {
    console.error('Erreur lors de la récupération des avis :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Route pour ajouter un nouvel avis
/**
 * @swagger
 * /livredor:
 *   post:
 *     summary: Ajouter un nouvel avis
 *     description: Cette route permet d'ajouter un nouvel avis avec une note et un commentaire à la base de données.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: L'ID de l'utilisateur qui laisse l'avis.
 *               commentaire:
 *                 type: string
 *                 description: Le commentaire de l'avis.
 *               note:
 *                 type: integer
 *                 description: La note de l'avis (entre 1 et 5).
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
 *                   description: Indique si l'ajout de l'avis a réussi.
 *                 id:
 *                   type: integer
 *                   description: L'ID de l'avis ajouté.
 *                 id_utilisateur:
 *                   type: integer
 *                   description: L'ID de l'utilisateur ayant laissé l'avis.
 *                 commentaire:
 *                   type: string
 *                   description: Le commentaire de l'avis.
 *                 note:
 *                   type: integer
 *                   description: La note de l'avis.
 *                 date_avis:
 *                   type: string
 *                   format: date-time
 *                   description: La date de l'avis.
 *       400:
 *         description: Paramètres manquants ou invalides.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.post('/', async (req, res) => {
  const { userId, commentaire, note } = req.body;

  // Vérifier que l'utilisateur est connecté et que le commentaire et la note sont fournis
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

    // Renvoie l'avis ajouté
    res.status(201).json({
      success: true,
      id: result.rows[0].id_avis,
      id_utilisateur: result.rows[0].id_utilisateur,
      commentaire: result.rows[0].commentaire,
      note: result.rows[0].note,
      date_avis: result.rows[0].date_avis,
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'avis :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
