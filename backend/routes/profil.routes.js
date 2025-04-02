const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * GET /profil/:userId/billets
 * Récupérer les billets d'un utilisateur
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
        res.status(200).json(result.rows || []);
    } catch (error) {
        console.error('Erreur lors de la récupération des billets :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

/**
 * GET /profil/:userId/activites
 * Récupérer les activités auxquelles l'utilisateur est inscrit
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

/**
 * GET /profil/:userId/reservations
 * Récupérer les réservations de service d'un utilisateur
 */
router.get('/:userId/reservations', async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ error: 'ID utilisateur manquant.' });
    }
    try {
        const queryReservations = `
      SELECT rs.id, rs.date_reservation, rs.heure_commande,
             sp.id_service, sp.nom_service, sp.type_service, sp.date_service, 
             sp.heure_ouverture, sp.heure_fermeture, sp.heure_commencement
      FROM reservation_service rs
      JOIN servicePrestataire sp ON rs.id_service = sp.id_service
      WHERE rs.id_utilisateur = $1;
    `;
        const values = [userId];
        const result = await pool.query(queryReservations, values);
        res.status(200).json(result.rows || []);
    } catch (error) {
        console.error('Erreur lors de la récupération des réservations de service :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

module.exports = router;
