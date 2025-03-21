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
 *     summary: Récupérer toutes les réservations de services prestataires
 *     description: Récupère une liste de toutes les réservations avec détails complets basés sur la table servicePrestataire.
 *     responses:
 *       200:
 *         description: Liste des réservations récupérée avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/stands', async (req, res) => {
    try {
        const query = `
            SELECT
                sp.id_service AS id_reservation,
                sp.id_utilisateur,
                u.nom_utilisateur,
                u.prenom_utilisateur,
                u.mail_utilisateur,  -- Ajout de l'email
                sp.id_emplacement AS id_stand,
                sp.date_service AS date_reservation,
                sp.heure_service AS heure_debut,
                sp.statut,
                sp.nom_service,
                sp.type_service,
                sp.presentation_service,
                sp.description_service,
                sp.image_prestataire,
                sp.prix_moyen,
                sp.carte_banquaire,
                sp.visibilite,
                sp.statut_service_prestataire
            FROM
                servicePrestataire sp
                    JOIN
                Utilisateurs u ON sp.id_utilisateur = u.id_utilisateur
            ORDER BY
                sp.date_service DESC;
        `;
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
 *   patch:
 *     summary: Changer le statut d'une réservation
 *     description: Met à jour le statut d'une réservation dans servicePrestataire.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du service à mettre à jour
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
 *                 enum: ['EN ATTENTE', 'ACCEPTÉ']
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
        const query = 'UPDATE servicePrestataire SET statut = $1 WHERE id_service = $2';
        await pool.query(query, [statut, id]);
        res.status(200).json({ message: 'Statut mis à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

/**
 * @swagger
 * /organisation/stands/{id}:
 *   delete:
 *     summary: Supprimer une réservation
 *     description: Supprime une réservation dans servicePrestataire en fonction de son ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du service à supprimer
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
        const query = 'DELETE FROM servicePrestataire WHERE id_service = $1';
        await pool.query(query, [id]);
        res.status(200).json({ message: 'Réservation supprimée avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression :', error);
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
 *     summary: Obtenir des statistiques sur les événements, les participants, les services prestataires et les billets
 *     description: Récupère des statistiques sur les événements, les participants inscrits, les services prestataires et les billets vendus.
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
            `SELECT COUNT(DISTINCT id_utilisateur) AS total_participants FROM liste_activite_client`
        );
        const totalServicesResult = await pool.query('SELECT COUNT(*) AS total FROM servicePrestataire');
        const totalTicketsResult = await pool.query('SELECT COUNT(*) AS total FROM billet');
        const participantsByEventResult = await pool.query(
            `SELECT e.id AS event_id, e.name AS event_name, COUNT(lac.id_utilisateur) AS participants_count
             FROM events e LEFT JOIN liste_activite_client lac ON e.id = lac.id_event
             GROUP BY e.id, e.name ORDER BY e.id`
        );
        const servicesByTypeResult = await pool.query(
            `SELECT type_service, COUNT(*) AS service_count FROM servicePrestataire GROUP BY type_service`
        );

        res.json({
            totalEvents: totalEventsResult.rows[0].total,
            totalParticipants: totalParticipantsResult.rows[0].total_participants,
            totalServices: totalServicesResult.rows[0].total,
            totalTickets: totalTicketsResult.rows[0].total,
            participantsByEvent: participantsByEventResult.rows,
            servicesByType: servicesByTypeResult.rows
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error.stack);
        res.status(500).json({ error: 'Erreur serveur', details: error.message });
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
            `SELECT id_utilisateur, nom_utilisateur, prenom_utilisateur, mail_utilisateur, type_utilisateur
             FROM utilisateurs`;
        const { rows: prestataires } = await pool.query(query);

        res.status(200).json(prestataires);
    } catch (error) {
        console.error("Erreur lors de la récupération des prestataires :", error);
        res.status(500).json({ error: "Erreur serveur. Impossible de récupérer les prestataires." });
    }
});

router.patch('/prestataires/:id', async (req, res) => {
    const { id } = req.params;
    const { type_utilisateur } = req.body;

    console.log("ID reçu:", id); // Ajout de logs pour debug
    console.log("type_utilisateur reçu:", type_utilisateur);

    // Validation des entrées
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: "ID invalide ou manquant." });
    }
    if (!type_utilisateur) {
        return res.status(400).json({ error: "type_utilisateur est requis." });
    }

    try {
        const query = 'UPDATE utilisateurs SET type_utilisateur = $1 WHERE id_utilisateur = $2';
        await pool.query(query, [type_utilisateur, id]);
        res.status(200).json({ message: "Type utilisateur mis à jour avec succès." });
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        res.status(500).send({ message: "Erreur serveur lors de la mise à jour du type utilisateur." });
    }
});

/**
 * @swagger
 * /organisation/stand-reservations:
 *   get:
 *     summary: Récupérer toutes les réservations d'emplacements
 *     description: Récupère une liste de toutes les demandes de réservation d'emplacements depuis la table emplacements_prestataires.
 *     responses:
 *       200:
 *         description: Liste des réservations d'emplacements récupérée avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/stand-reservations', async (req, res) => {
    try {
        const query = `
      SELECT 
        ep.id_emplacement,
        ep.nom_emplacement,
        ep.utilisateur_id,
        u.nom_utilisateur,
        u.prenom_utilisateur,
        u.mail_utilisateur,
        ep.date_reservation,
        ep.statut
      FROM 
        emplacements_prestataires ep
      LEFT JOIN 
        Utilisateurs u ON ep.utilisateur_id = u.id_utilisateur
      WHERE 
        ep.statut IN ('EN ATTENTE', 'RÉSERVÉ')
      ORDER BY 
        ep.date_reservation DESC;
    `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des réservations d'emplacements :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

/**
 * @swagger
 * /organisation/stand-reservations/{id}:
 *   patch:
 *     summary: Changer le statut d'une réservation d'emplacement
 *     description: Met à jour le statut d'une réservation d'emplacement dans emplacements_prestataires.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de l'emplacement à mettre à jour
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
 *                 enum: ['EN ATTENTE', 'RÉSERVÉ', 'LIBRE']
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.patch('/stand-reservations/:id', async (req, res) => {
    const { id } = req.params;
    const { statut } = req.body;

    try {
        const query = 'UPDATE emplacements_prestataires SET statut = $1 WHERE id_emplacement = $2';
        await pool.query(query, [statut, id]);
        res.status(200).json({ message: 'Statut mis à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

/**
 * @swagger
 * /organisation/stand-reservations/{id}:
 *   delete:
 *     summary: Supprimer une réservation d'emplacement
 *     description: Réinitialise une réservation d'emplacement en mettant son statut à LIBRE et supprimant l'utilisateur associé.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de l'emplacement à rejeter
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Réservation d'emplacement rejetée avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete('/stand-reservations/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
      UPDATE emplacements_prestataires 
      SET statut = 'LIBRE', utilisateur_id = NULL, date_reservation = NULL 
      WHERE id_emplacement = $1
    `;
        await pool.query(query, [id]);
        res.status(200).json({ message: 'Réservation d’emplacement rejetée avec succès.' });
    } catch (error) {
        console.error('Erreur lors du rejet de la réservation :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

/**
 * @swagger
 * /organisation/all-stands:
 *   get:
 *     summary: Récupérer tous les stands
 *     description: Récupère une liste de tous les stands, réservés ou non, avec les informations des utilisateurs associés si applicable.
 *     responses:
 *       200:
 *         description: Liste des stands récupérée avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/all-stands', async (req, res) => {
    try {
        const query = `
            SELECT
                ep.id_emplacement,
                ep.nom_emplacement,
                ep.utilisateur_id,
                u.nom_utilisateur,
                u.prenom_utilisateur,
                u.mail_utilisateur,
                ep.date_reservation,
                ep.statut
            FROM
                emplacements_prestataires ep
                    LEFT JOIN
                Utilisateurs u ON ep.utilisateur_id = u.id_utilisateur
            ORDER BY
                ep.id_emplacement ASC;
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des stands :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

module.exports = router;
