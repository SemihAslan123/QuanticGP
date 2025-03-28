const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * GET /livredor
 * Récupérer tous les avis avec les informations des utilisateurs
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
 * POST /livredor
 * Ajouter un nouvel avis
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
