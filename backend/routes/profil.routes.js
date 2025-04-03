const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * /api/profil/{userId}/billets:
 *   get:
 *     summary: Récupérer les billets d'un utilisateur
 *     description: Retourne la liste des billets appartenant à l'utilisateur identifié par userId.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID de l'utilisateur pour lequel récupérer les billets.
 *         schema:
 *           type: integer
 *           example: 7
 *     responses:
 *       200:
 *         description: Liste des billets récupérée avec succès.
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
 *                   acheteur_id:
 *                     type: integer
 *                     example: 4
 *                   utilisateur_id:
 *                     type: integer
 *                     example: 4
 *                   course_nom:
 *                     type: string
 *                     example: "Course 1"
 *                   course_date:
 *                     type: string
 *                     format: date
 *                     example: "2025-07-15"
 *                   hotel_nom:
 *                     type: string
 *                     example: "Hotel F1"
 *                   date_debut_parking:
 *                     type: string
 *                     format: date
 *                     example: "2025-07-15"
 *                   date_fin_parking:
 *                     type: string
 *                     format: date
 *                     example: "2025-07-15"
 *                   date_debut_hotel:
 *                     type: string
 *                     format: date
 *                     example: "2025-07-15"
 *                   date_fin_hotel:
 *                     type: string
 *                     format: date
 *                     example: "2025-07-15"
 *                   is_vip:
 *                     type: boolean
 *                     example: false
 *                   prix_total:
 *                     type: number
 *                     format: float
 *                     example: 150.75
 *                   date_paiement:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-07-15T12:00:00Z"
 *       400:
 *         description: ID utilisateur manquant.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID utilisateur manquant."
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
        res.status(200).json(result.rows || []);
    } catch (error) {
        console.error('Erreur lors de la récupération des billets :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

/**
 * @swagger
 * /api/profil/{userId}/activites:
 *   get:
 *     summary: Récupérer les activités auxquelles l'utilisateur est inscrit
 *     description: Retourne la liste des événements auxquels l'utilisateur identifié par userId est inscrit.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID de l'utilisateur pour lequel récupérer les activités.
 *         schema:
 *           type: integer
 *           example: 7
 *     responses:
 *       200:
 *         description: Liste des activités récupérée avec succès.
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
 *       400:
 *         description: ID utilisateur manquant.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID utilisateur manquant."
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

/**
 * @swagger
 * /api/profil/{userId}/reservations:
 *   get:
 *     summary: Récupérer les réservations de service d'un utilisateur
 *     description: Retourne la liste des réservations de services effectuées par l'utilisateur identifié par userId.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID de l'utilisateur pour lequel récupérer les réservations de service.
 *         schema:
 *           type: integer
 *           example: 7
 *     responses:
 *       200:
 *         description: Liste des réservations récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 10
 *                   date_reservation:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-07-18T15:30:00Z"
 *                   heure_commande:
 *                     type: string
 *                     example: "09:30"
 *                   id_service:
 *                     type: integer
 *                     example: 1
 *                   nom_service:
 *                     type: string
 *                     example: "Service X"
 *                   type_service:
 *                     type: string
 *                     example: "continu"
 *                   date_service:
 *                     type: string
 *                     format: date
 *                     example: "2025-07-15"
 *                   heure_ouverture:
 *                     type: string
 *                     example: "08:00"
 *                   heure_fermeture:
 *                     type: string
 *                     example: "17:00"
 *                   heure_commencement:
 *                     type: string
 *                     example: "10:00"
 *       400:
 *         description: ID utilisateur manquant.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID utilisateur manquant."
 *       500:
 *         description: Erreur interne du serveur.
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
