const express = require('express');
const router = express.Router();
const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

/**
 * @swagger
 * /api/organisation:
 *   post:
 *     summary: Ajouter un événement
 *     description: Ajoute un nouvel événement dans la base de données.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseName
 *               - eventDate
 *               - horaireDebut
 *               - horaireFin
 *               - eventPrice
 *               - eventDescription
 *               - eventImage
 *             properties:
 *               courseName:
 *                 type: string
 *                 description: Nom de l'événement.
 *                 example: "Concert de Jazz"
 *               eventDate:
 *                 type: string
 *                 format: date
 *                 description: Date de l'événement.
 *                 example: "2025-08-15"
 *               horaireDebut:
 *                 type: string
 *                 description: Heure de début de l'événement.
 *                 example: "18:00"
 *               horaireFin:
 *                 type: string
 *                 description: Heure de fin de l'événement.
 *                 example: "21:00"
 *               eventPrice:
 *                 type: number
 *                 description: Prix de l'événement.
 *                 example: 50.00
 *               eventDescription:
 *                 type: string
 *                 description: Description de l'événement.
 *                 example: "Un concert exceptionnel de Jazz."
 *               eventImage:
 *                 type: string
 *                 description: Chemin vers l'image de l'événement.
 *                 example: "/assets/events/jazz_concert.jpg"
 *     responses:
 *       201:
 *         description: Événement ajouté avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Événement ajouté avec succès"
 *                 event:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Concert de Jazz"
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2025-08-15"
 *                     heure_debut:
 *                       type: string
 *                       example: "18:00"
 *                     heure_fin:
 *                       type: string
 *                       example: "21:00"
 *                     prix:
 *                       type: number
 *                       example: 50.00
 *                     description:
 *                       type: string
 *                       example: "Un concert exceptionnel de Jazz."
 *                     image:
 *                       type: string
 *                       example: "/assets/events/jazz_concert.jpg"
 *       400:
 *         description: Tous les champs sont requis.
 *       500:
 *         description: Erreur interne du serveur.
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
 * /api/organisation/events:
 *   get:
 *     summary: Récupérer tous les événements
 *     description: Retourne tous les événements enregistrés, triés par date décroissante.
 *     responses:
 *       200:
 *         description: Liste des événements.
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
 *                     example: "Concert de Jazz"
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2025-08-15"
 *                   heure_debut:
 *                     type: string
 *                     example: "18:00"
 *                   heure_fin:
 *                     type: string
 *                     example: "21:00"
 *                   prix:
 *                     type: number
 *                     example: 50.00
 *                   description:
 *                     type: string
 *                     example: "Un concert exceptionnel de Jazz."
 *                   image:
 *                     type: string
 *                     example: "/assets/events/jazz_concert.jpg"
 *       500:
 *         description: Erreur interne du serveur.
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
 * /api/organisation/stands:
 *   get:
 *     summary: Récupérer toutes les réservations de services prestataires
 *     description: Retourne les réservations de services prestataires, incluant les informations des prestataires et des clients.
 *     responses:
 *       200:
 *         description: Liste des réservations de services.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_service:
 *                     type: integer
 *                     example: 10
 *                   prestataire_id:
 *                     type: integer
 *                     example: 2
 *                   prestataire_nom:
 *                     type: string
 *                     example: "Martin"
 *                   prestataire_prenom:
 *                     type: string
 *                     example: "Claire"
 *                   prestataire_mail:
 *                     type: string
 *                     example: "claire.martin@example.com"
 *                   id_stand:
 *                     type: integer
 *                     example: 5
 *                   nom_stand:
 *                     type: string
 *                     example: "Zone B - Emplacement n°3"
 *                   date_service:
 *                     type: string
 *                     format: date
 *                     example: "2025-07-18"
 *                   type_service:
 *                     type: string
 *                     example: "ponctuel"
 *                   heure_ouverture:
 *                     type: string
 *                     example: null
 *                   heure_fermeture:
 *                     type: string
 *                     example: null
 *                   heure_commencement:
 *                     type: string
 *                     example: "10:00"
 *                   statut_service:
 *                     type: string
 *                     example: "CONFIRMÉ"
 *                   nom_service:
 *                     type: string
 *                     example: "🛍️ Racing Memorabilia"
 *                   presentation_service:
 *                     type: string
 *                     example: "Collection exclusive d’articles officiels de F1."
 *                   description_service:
 *                     type: string
 *                     example: "Produits officiels des écuries de F1."
 *                   image_prestataire:
 *                     type: string
 *                     example: null
 *                   prix_moyen:
 *                     type: string
 *                     example: "10-20€"
 *                   carte_banquaire:
 *                     type: string
 *                     example: "Acceptée"
 *                   visibilite:
 *                     type: boolean
 *                     example: true
 *                   statut_service_prestataire:
 *                     type: string
 *                     example: "ACCEPTÉ"
 *                   id_reservation_client:
 *                     type: integer
 *                     example: 20
 *                   client_id:
 *                     type: integer
 *                     example: 7
 *                   client_nom:
 *                     type: string
 *                     example: "Petit"
 *                   client_prenom:
 *                     type: string
 *                     example: "Alice"
 *                   client_mail:
 *                     type: string
 *                     example: "alice.petit@example.com"
 *                   date_reservation:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-07-18T15:30:00Z"
 *                   heure_commande:
 *                     type: string
 *                     example: "15:00"
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/stands', async (req, res) => {
  try {
    const query = `
      SELECT
          sp.id_service AS id_service,
          sp.id_utilisateur AS prestataire_id,
          u.nom_utilisateur AS prestataire_nom,
          u.prenom_utilisateur AS prestataire_prenom,
          u.mail_utilisateur AS prestataire_mail,
          sp.id_emplacement AS id_stand,
          ep.nom_emplacement AS nom_stand,
          sp.date_service AS date_service,
          sp.type_service,
          CASE
              WHEN sp.type_service = 'continu' THEN sp.heure_ouverture
              ELSE NULL
          END AS heure_ouverture,
          CASE
              WHEN sp.type_service = 'continu' THEN sp.heure_fermeture
              ELSE NULL
          END AS heure_fermeture,
          CASE
              WHEN sp.type_service = 'ponctuel' THEN sp.heure_commencement
              ELSE NULL
          END AS heure_commencement,
          sp.statut AS statut_service,
          sp.nom_service,
          sp.presentation_service,
          sp.description_service,
          sp.image_prestataire,
          sp.prix_moyen,
          sp.carte_banquaire,
          sp.visibilite,
          sp.statut_service_prestataire,
          rs.id AS id_reservation_client,
          rs.id_utilisateur AS client_id,
          uc.nom_utilisateur AS client_nom,
          uc.prenom_utilisateur AS client_prenom,
          uc.mail_utilisateur AS client_mail,
          rs.date_reservation,
          rs.heure_commande
      FROM servicePrestataire sp
               JOIN Utilisateurs u ON sp.id_utilisateur = u.id_utilisateur
               LEFT JOIN emplacements_prestataires ep ON sp.id_emplacement = ep.id_emplacement
               LEFT JOIN reservation_service rs ON sp.id_service = rs.id_service
               LEFT JOIN Utilisateurs uc ON rs.id_utilisateur = uc.id_utilisateur
      ORDER BY sp.date_service DESC, rs.date_reservation DESC;
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
 * /api/organisation/stands/{id}:
 *   delete:
 *     summary: Supprimer une réservation de stand
 *     description: Supprime la réservation d'un stand en se basant sur l'ID du service prestataire.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du service prestataire à supprimer.
 *     responses:
 *       200:
 *         description: Réservation supprimée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Réservation supprimée avec succès."
 *       500:
 *         description: Erreur interne du serveur.
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
 * /api/organisation/events/{id}:
 *   put:
 *     summary: Mettre à jour un événement
 *     description: Met à jour les informations d'un événement existant.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'événement à mettre à jour.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseName:
 *                 type: string
 *                 example: "Concert de Jazz"
 *               eventDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-15"
 *               horaireDebut:
 *                 type: string
 *                 example: "18:00"
 *               horaireFin:
 *                 type: string
 *                 example: "21:00"
 *               eventPrice:
 *                 type: number
 *                 example: 50.00
 *               eventDescription:
 *                 type: string
 *                 example: "Un concert exceptionnel de Jazz."
 *               eventImage:
 *                 type: string
 *                 example: "/assets/events/jazz_concert.jpg"
 *     responses:
 *       200:
 *         description: Événement mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Événement mis à jour avec succès."
 *       500:
 *         description: Erreur interne du serveur.
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
 * /api/organisation/events/{id}:
 *   delete:
 *     summary: Supprimer un événement
 *     description: Supprime un événement en se basant sur son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'événement à supprimer.
 *     responses:
 *       200:
 *         description: Événement supprimé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Événement supprimé avec succès."
 *       500:
 *         description: Erreur interne du serveur.
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
 * /api/organisation/statistics:
 *   get:
 *     summary: Obtenir des statistiques
 *     description: Retourne diverses statistiques concernant les événements, participants, services prestataires et billets.
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalEvents:
 *                   type: integer
 *                   example: 10
 *                 totalParticipants:
 *                   type: integer
 *                   example: 150
 *                 totalServices:
 *                   type: integer
 *                   example: 25
 *                 totalTickets:
 *                   type: integer
 *                   example: 300
 *                 participantsByEvent:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       event_id:
 *                         type: integer
 *                         example: 1
 *                       event_name:
 *                         type: string
 *                         example: "Concert de Jazz"
 *                       participants_count:
 *                         type: integer
 *                         example: 50
 *                 servicesByType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type_service:
 *                         type: string
 *                         example: "ponctuel"
 *                       service_count:
 *                         type: integer
 *                         example: 10
 *       500:
 *         description: Erreur interne du serveur.
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
    console.error('Erreur lors de la récupération des statistiques:', error.message);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

/**
 * @swagger
 * /api/organisation/prestataires:
 *   get:
 *     summary: Récupérer les prestataires
 *     description: Retourne la liste des prestataires enregistrés dans la base de données.
 *     responses:
 *       200:
 *         description: Liste des prestataires récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_utilisateur:
 *                     type: integer
 *                     example: 2
 *                   nom_utilisateur:
 *                     type: string
 *                     example: "Martin"
 *                   prenom_utilisateur:
 *                     type: string
 *                     example: "Claire"
 *                   mail_utilisateur:
 *                     type: string
 *                     example: "claire.martin@example.com"
 *                   type_utilisateur:
 *                     type: string
 *                     example: "prestataire"
 *       500:
 *         description: Erreur lors de la récupération des prestataires.
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

/**
 * @swagger
 * /api/organisation/prestataires/{id}:
 *   patch:
 *     summary: Mettre à jour le type d'un prestataire
 *     description: Met à jour le champ `type_utilisateur` pour un prestataire.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du prestataire.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type_utilisateur
 *             properties:
 *               type_utilisateur:
 *                 type: string
 *                 description: Nouveau type d'utilisateur.
 *                 example: "client"
 *     responses:
 *       200:
 *         description: Type utilisateur mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Type utilisateur mis à jour avec succès."
 *       400:
 *         description: ID ou type_utilisateur invalide ou manquant.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.patch('/prestataires/:id', async (req, res) => {
  const { id } = req.params;
  const { type_utilisateur } = req.body;
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
 * /api/organisation/stand-reservations:
 *   get:
 *     summary: Récupérer toutes les réservations d'emplacements
 *     description: Retourne les réservations d'emplacements (stands) ayant le statut "EN ATTENTE" ou "RÉSERVÉ".
 *     responses:
 *       200:
 *         description: Liste des réservations d'emplacements.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_emplacement:
 *                     type: integer
 *                     example: 3
 *                   nom_emplacement:
 *                     type: string
 *                     example: "Zone B - Emplacement n°3"
 *                   utilisateur_id:
 *                     type: integer
 *                     example: 7
 *                   nom_utilisateur:
 *                     type: string
 *                     example: "Petit"
 *                   prenom_utilisateur:
 *                     type: string
 *                     example: "Alice"
 *                   mail_utilisateur:
 *                     type: string
 *                     example: "alice.petit@example.com"
 *                   date_reservation:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-07-18T15:30:00Z"
 *                   statut:
 *                     type: string
 *                     example: "EN ATTENTE"
 *       500:
 *         description: Erreur interne du serveur.
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
 * /api/organisation/stand-reservations/{id}:
 *   patch:
 *     summary: Changer le statut d'une réservation d'emplacement
 *     description: Met à jour le statut d'une réservation d'emplacement (stand) basé sur son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'emplacement.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statut:
 *                 type: string
 *                 description: Nouveau statut de l'emplacement.
 *                 example: "RÉSERVÉ"
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Statut mis à jour avec succès."
 *       500:
 *         description: Erreur interne du serveur.
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
 * /api/organisation/stand-reservations/{id}:
 *   delete:
 *     summary: Supprimer une réservation d'emplacement (remise à LIBRE)
 *     description: Met à jour l'emplacement pour le remettre en état LIBRE, en supprimant la réservation.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'emplacement à remettre à LIBRE.
 *     responses:
 *       200:
 *         description: Réservation d’emplacement rejetée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Réservation d’emplacement rejetée avec succès."
 *       500:
 *         description: Erreur interne du serveur.
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
 * /api/organisation/all-stands:
 *   get:
 *     summary: Récupérer tous les stands
 *     description: Retourne la liste complète des stands.
 *     responses:
 *       200:
 *         description: Liste des stands récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_emplacement:
 *                     type: integer
 *                     example: 3
 *                   nom_emplacement:
 *                     type: string
 *                     example: "Zone B - Emplacement n°3"
 *                   utilisateur_id:
 *                     type: integer
 *                     example: 7
 *                   nom_utilisateur:
 *                     type: string
 *                     example: "Petit"
 *                   prenom_utilisateur:
 *                     type: string
 *                     example: "Alice"
 *                   mail_utilisateur:
 *                     type: string
 *                     example: "alice.petit@example.com"
 *                   date_reservation:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-07-18T15:30:00Z"
 *                   statut:
 *                     type: string
 *                     example: "LIBRE"
 *       500:
 *         description: Erreur interne du serveur.
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

/**
 * @swagger
 * /api/organisation/demandes-prestataires:
 *   get:
 *     summary: Récupérer les demandes des prestataires
 *     description: Retourne toutes les demandes d'inscription des prestataires.
 *     responses:
 *       200:
 *         description: Liste des demandes récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_demande:
 *                     type: integer
 *                     example: 15
 *                   prenom_utilisateur:
 *                     type: string
 *                     example: "Anne"
 *                   nom_utilisateur:
 *                     type: string
 *                     example: "Leclerc"
 *                   mail_utilisateur:
 *                     type: string
 *                     example: "anne.leclerc@example.com"
 *                   mot_de_passe:
 *                     type: string
 *                     example: "password123"
 *                   type_demande:
 *                     type: string
 *                     example: "prestataire"
 *                   presentation:
 *                     type: string
 *                     example: "Présentation de l'utilisateur"
 *                   date_demande:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-07-12T10:00:00Z"
 *                   statut_demande:
 *                     type: string
 *                     example: "EN ATTENTE"
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get("/demandes-prestataires", async (req, res) => {
  try {
    const query = `SELECT * FROM demandes_prestataires`;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes : ", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

/**
 * @swagger
 * /api/organisation/demandes-prestataires/{id}:
 *   post:
 *     summary: Traiter une demande de prestataire
 *     description: Permet de traiter une demande de prestataire (ACCEPTÉ, REFUSÉ ou EN ATTENTE).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la demande à traiter.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 enum: ["ACCEPTÉ", "REFUSÉ", "EN ATTENTE"]
 *                 description: Action à appliquer sur la demande.
 *                 example: "ACCEPTÉ"
 *     responses:
 *       200:
 *         description: Demande traitée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Demande acceptée. Type d'utilisateur mis à jour en 'prestataire'."
 *                 userId:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: Action invalide ou demande non trouvée.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.post("/demandes-prestataires/:id", async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  if (!["ACCEPTÉ", "REFUSÉ", "EN ATTENTE"].includes(action)) {
    return res.status(400).json({ error: "Action invalide." });
  }

  try {
    // Récupérer la demande
    const demandeQuery = `SELECT * FROM demandes_prestataires WHERE id_demande = $1`;
    const demandeResult = await pool.query(demandeQuery, [id]);
    if (demandeResult.rows.length === 0) {
      return res.status(404).json({ error: "Demande non trouvée." });
    }

    const demande = demandeResult.rows[0];

    if (action === "ACCEPTÉ") {
      // Mettre à jour le type_utilisateur dans Utilisateurs
      const updateUserQuery = `
                UPDATE Utilisateurs
                SET type_utilisateur = $1
                WHERE mail_utilisateur = $2
                    RETURNING id_utilisateur;
            `;
      const updateResult = await pool.query(updateUserQuery, [demande.type_demande, demande.mail_utilisateur]);
      if (updateResult.rows.length === 0) {
        return res.status(404).json({ error: "Utilisateur non trouvé pour cet email." });
      }

      // Mettre à jour le statut de la demande
      await pool.query(
        `UPDATE demandes_prestataires SET statut_demande = 'ACCEPTÉ' WHERE id_demande = $1`,
        [id]
      );

      res.status(200).json({
        message: `Demande acceptée. Type d'utilisateur mis à jour en "${demande.type_demande}".`,
        userId: updateResult.rows[0].id_utilisateur
      });
    } else if (action === "REFUSÉ") {
      // Mettre à jour le statut de la demande
      await pool.query(
        `UPDATE demandes_prestataires SET statut_demande = 'REFUSÉ' WHERE id_demande = $1`,
        [id]
      );
      res.status(200).json({ message: "Demande refusée." });
    } else {
      // Remettre en attente
      await pool.query(
        `UPDATE demandes_prestataires SET statut_demande = 'EN ATTENTE' WHERE id_demande = $1`,
        [id]
      );
      res.status(200).json({ message: "Demande remise en attente." });
    }
  } catch (error) {
    console.error("Erreur lors du traitement de la demande : ", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

/**
 * @swagger
 * /api/organisation/service-reservations/{id}:
 *   patch:
 *     summary: Changer le statut d'une réservation de service prestataire
 *     description: Met à jour le statut d'une réservation de service prestataire en se basant sur son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la réservation de service prestataire.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statut:
 *                 type: string
 *                 description: Nouveau statut de la réservation de service.
 *                 example: "RÉSERVÉ"
 *     responses:
 *       200:
 *         description: Statut de la réservation de service mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Statut de la réservation de service mis à jour avec succès."
 *       500:
 *         description: Erreur interne du serveur.
 */
router.patch('/service-reservations/:id', async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;
  try {
    const query = 'UPDATE servicePrestataire SET statut = $1 WHERE id_service = $2';
    await pool.query(query, [statut, id]);
    res.status(200).json({ message: 'Statut de la réservation de service mis à jour avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de service :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
