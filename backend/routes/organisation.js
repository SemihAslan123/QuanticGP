const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const { v4: uuidv4 } = require('uuid');

/**
 * @swagger
 * /organisation:
 *   post:
 *     summary: Ajouter un événement
 *     description: Ajoute un événement avec les informations données dans le corps de la requête.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseName:
 *                 type: string
 *               eventDate:
 *                 type: string
 *               horaireDebut:
 *                 type: string
 *               horaireFin:
 *                 type: string
 *               eventPrice:
 *                 type: number
 *               eventDescription:
 *                 type: string
 *               eventImage:
 *                 type: string
 *     responses:
 *       201:
 *         description: Événement ajouté avec succès
 *       400:
 *         description: Tous les champs sont requis
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/', async (req, res) => {
    const { courseName, eventDate, horaireDebut, horaireFin, eventPrice, eventDescription, eventImage } = req.body;

    if (!courseName || !eventDate || !horaireDebut || !horaireFin || !eventPrice || !eventDescription || !eventImage) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    try {
        const query =
            `INSERT INTO events (name, date, heure_debut, heure_fin, prix, description, image)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`;
        const values = [courseName, eventDate, horaireDebut, horaireFin, eventPrice, eventDescription, eventImage];
        const result = await pool.query(query, values);

        res.status(201).json({ message: "Événement ajouté avec succès", event: result.rows[0] });
    } catch (error) {
        console.error("Erreur lors de l'insertion dans la base de données:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

/**
 * @swagger
 * /organisation/events:
 *   get:
 *     summary: Récupérer tous les événements
 *     description: Récupère une liste d'événements triés par date.
 *     responses:
 *       200:
 *         description: Liste des événements récupérée avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/events', async (req, res) => {
    try {
        const query = 'SELECT * FROM events ORDER BY date DESC';
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

/**
 * @swagger
 * /organisation/stands:
 *   get:
 *     summary: Récupérer toutes les réservations de stands
 *     description: Récupère une liste de toutes les réservations de stands.
 *     responses:
 *       200:
 *         description: Liste des réservations récupérée avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/stands', async (req, res) => {
    try {
        const query =
            `SELECT
                rs.id_reservation,
                rs.id_utilisateur,
                u.nom_utilisateur,
                u.prenom_utilisateur,
                rs.id_stand,
                rs.date_reservation,
                rs.heure_debut,
                rs.heure_fin,
                rs.statut
            FROM
                reservation_stand rs
                    JOIN
                Utilisateurs u ON rs.id_utilisateur = u.id_utilisateur
            ORDER BY
                rs.date_reservation DESC;`;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des réservations :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

/**
 * @swagger
 * /organisation/stands/{id}:
 *   delete:
 *     summary: Supprimer une réservation
 *     description: Supprime une réservation en fonction de son ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la réservation à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Réservation supprimée avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete('/stands/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM reservation_stand WHERE id_reservation = $1';
        await pool.query(query, [id]);
        res.status(200).json({ message: 'Réservation supprimée avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

/**
 * @swagger
 * /organisation/stands/{id}:
 *   patch:
 *     summary: Changer le statut d'une réservation
 *     description: Met à jour le statut d'une réservation de stand.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la réservation à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statut:
 *                 type: string
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.patch('/stands/:id', async (req, res) => {
    const { id } = req.params;
    const { statut } = req.body;

    try {
        const query = 'UPDATE reservation_stand SET statut = $1 WHERE id_reservation = $2';
        await pool.query(query, [statut, id]);
        res.status(200).json({ message: 'Statut mis à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

/**
 * @swagger
 *   /organisation/events/{id}:
 *     put:
 *       summary: Mettre à jour un événement
 *       description: Cette route permet de modifier les informations d'un événement en spécifiant son ID.
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: L'ID de l'événement à mettre à jour
 *           schema:
 *             type: integer
 *       requestBody:
 *         description: Les nouvelles informations de l'événement à mettre à jour.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courseName:
 *                   type: string
 *                   description: Le nom du cours de l'événement
 *                 eventDate:
 *                   type: string
 *                   format: date
 *                   description: La date de l'événement
 *                 horaireDebut:
 *                   type: string
 *                   format: time
 *                   description: L'heure de début de l'événement
 *                 horaireFin:
 *                   type: string
 *                   format: time
 *                   description: L'heure de fin de l'événement
 *                 eventPrice:
 *                   type: number
 *                   format: float
 *                   description: Le prix de l'événement
 *                 eventDescription:
 *                   type: string
 *                   description: La description de l'événement
 *                 eventImage:
 *                   type: string
 *                   description: L'URL de l'image de l'événement
 *               required:
 *                 - courseName
 *                 - eventDate
 *                 - horaireDebut
 *                 - horaireFin
 *                 - eventPrice
 *                 - eventDescription
 *                 - eventImage
 *       responses:
 *         200:
 *           description: Événement mis à jour avec succès
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Événement mis à jour avec succès."
 *         400:
 *           description: Mauvaise demande. L'un des paramètres nécessaires est manquant ou invalide.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: "Tous les champs sont requis"
 *         500:
 *           description: Erreur interne du serveur
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: "Erreur interne du serveur"
 */
router.put('/events/:id', async (req, res) => {
    const { id } = req.params;
    const { courseName, eventDate, horaireDebut, horaireFin, eventPrice, eventDescription, eventImage } = req.body;

    try {
        const query =
            `UPDATE events
            SET name = $1, date = $2, heure_debut = $3, heure_fin = $4, prix = $5, description = $6, image = $7
            WHERE id = $8`;
        const values = [courseName, eventDate, horaireDebut, horaireFin, eventPrice, eventDescription, eventImage, id];
        await pool.query(query, values);

        res.status(200).json({ message: 'Événement mis à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

/**
 * @swagger
 * /organisation/events/{id}:
 *   delete:
 *     summary: Supprimer un événement
 *     description: Supprime un événement en fonction de son ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de l'événement à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Événement supprimé avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete('/events/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM events WHERE id = $1';
        await pool.query(query, [id]);
        res.status(200).json({ message: 'Événement supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

/**
 * @swagger
 * /organisation/statistics:
 *   get:
 *     summary: Obtenir des statistiques sur les événements, les participants et les réservations
 *     description: Récupère des statistiques sur les événements, les participants et les réservations de stands.
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/statistics', async (req, res) => {
    try {
        const totalEventsResult = await pool.query('SELECT COUNT(*) AS total FROM events');
        const totalParticipantsResult = await pool.query(
            `SELECT
                 COUNT(DISTINCT id_utilisateur) AS total_participants
             FROM
                 liste_activite_client`
        );
        const totalTicketPrestataireResult = await pool.query(
            `SELECT COUNT(*) AS total
             FROM reservation_stand`
        );

        const participantsByEventResult = await pool.query(
            `SELECT
                 e.id AS event_id,
                 e.name AS event_name,
                 COUNT(lac.id_utilisateur) AS participants_count
             FROM
                 events e
                     LEFT JOIN
                 liste_activite_client lac ON e.id = lac.id_event
             GROUP BY
                 e.id, e.name
             ORDER BY
                 e.id;`
        );

        res.json({
            totalEvents: totalEventsResult.rows[0].total,
            totalParticipants: totalParticipantsResult.rows[0].total_participants,
            totalTicketPrestataire: totalTicketPrestataireResult.rows[0].total,
            participantsByEvent: participantsByEventResult.rows,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});


/**
 * @swagger
 * /organisation/prestataires:
 *   get:
 *     summary: Récupérer les prestataires
 *     description: Récupère la liste des prestataires.
 *     responses:
 *       200:
 *         description: Liste des prestataires récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/prestataires', async (req, res) => {
    try {
        const query =
        `SELECT id_utilisateur, nom_utilisateur, prenom_utilisateur, mail_utilisateur, image_prestataire, type_utilisateur
        FROM Utilisateurs`;
        const { rows: prestataires } = await pool.query(query);

        res.status(200).json(prestataires);
    } catch (error) {
        console.error("Erreur lors de la récupération des prestataires :", error);
        res.status(500).json({ error: "Erreur serveur. Impossible de récupérer les prestataires." });
    }
});

module.exports = router;
