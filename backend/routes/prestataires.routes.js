const express = require('express');
const router = express.Router();
const pool = require('../db');
const sanitizeHtml = require('sanitize-html');

/**
 * @swagger
 * /api/prestataire/services:
 *   get:
 *     summary: Récupérer la liste des services validés pour les clients
 *     description: Retourne la liste des services dont le statut est "ACCEPTÉ" dans la table servicePrestataire.
 *     responses:
 *       200:
 *         description: Liste des services récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_service:
 *                     type: integer
 *                     example: 1
 *                   nom_service:
 *                     type: string
 *                     example: "Service X"
 *                   type_service:
 *                     type: string
 *                     example: "continu"
 *                   description_service:
 *                     type: string
 *                     example: "Description du service"
 *                   presentation_service:
 *                     type: string
 *                     example: "Présentation du service"
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
 *                     example: null
 *                   id_emplacement:
 *                     type: integer
 *                     example: 3
 *                   visibilite:
 *                     type: boolean
 *                     example: true
 *                   statut:
 *                     type: string
 *                     example: "ACCEPTÉ"
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/services', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id_service, nom_service, type_service, description_service, presentation_service, date_service, 
                    heure_ouverture, heure_fermeture, heure_commencement, id_emplacement, visibilite, statut
             FROM servicePrestataire
             WHERE statut = 'ACCEPTÉ'`
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des services pour client :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

/**
 * @swagger
 * /api/prestataire/{id}:
 *   get:
 *     summary: Récupérer les informations du prestataire connecté
 *     description: Retourne les informations de base du prestataire (id_utilisateur, nom, prénom, email) si trouvé et que l'utilisateur est de type "prestataire".
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du prestataire.
 *     responses:
 *       200:
 *         description: Informations du prestataire récupérées avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_utilisateur:
 *                   type: integer
 *                   example: 4
 *                 nom_utilisateur:
 *                   type: string
 *                   example: "Leclerc"
 *                 prenom_utilisateur:
 *                   type: string
 *                   example: "Anne"
 *                 mail_utilisateur:
 *                   type: string
 *                   example: "anne.leclerc@example.com"
 *       404:
 *         description: Prestataire non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT id_utilisateur, nom_utilisateur, prenom_utilisateur, mail_utilisateur
             FROM Utilisateurs 
             WHERE id_utilisateur = $1 AND type_utilisateur = 'prestataire'`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Prestataire non trouvé" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Erreur lors de la récupération du prestataire :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

/**
 * @swagger
 * /api/prestataire/update:
 *   post:
 *     summary: Mettre à jour les informations du prestataire
 *     description: Met à jour le nom, prénom et email du prestataire.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_utilisateur
 *               - nom
 *               - prenom
 *               - mail
 *             properties:
 *               id_utilisateur:
 *                 type: integer
 *                 example: 4
 *               nom:
 *                 type: string
 *                 example: "Leclerc"
 *               prenom:
 *                 type: string
 *                 example: "Anne"
 *               mail:
 *                 type: string
 *                 example: "anne.leclerc@example.com"
 *     responses:
 *       200:
 *         description: Prestataire mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 4
 *                 nom:
 *                   type: string
 *                   example: "Leclerc"
 *                 prenom:
 *                   type: string
 *                   example: "Anne"
 *                 mail:
 *                   type: string
 *                   example: "anne.leclerc@example.com"
 *                 type:
 *                   type: string
 *                   example: "prestataire"
 *       404:
 *         description: Prestataire non trouvé ou aucune modification apportée.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.post('/update', async (req, res) => {
    const { id_utilisateur, nom, prenom, mail } = req.body;
    if (!id_utilisateur) {
        return res.status(400).json({ error: "ID du prestataire manquant" });
    }
    try {
        const result = await pool.query(
            `UPDATE Utilisateurs
             SET nom_utilisateur = $1, prenom_utilisateur = $2, mail_utilisateur = $3
             WHERE id_utilisateur = $4 AND type_utilisateur = 'prestataire'
             RETURNING 
               id_utilisateur as id, 
               nom_utilisateur as nom, 
               prenom_utilisateur as prenom, 
               mail_utilisateur as mail,
               type_utilisateur as type`,
            [nom, prenom, mail, id_utilisateur]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Prestataire non trouvé ou aucune modification apportée" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du prestataire :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

/**
 * @swagger
 * /api/prestataire/{id}/services:
 *   get:
 *     summary: Récupérer la liste des services proposés par le prestataire
 *     description: Retourne tous les services créés par le prestataire dont l'ID est passé dans l'URL.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du prestataire.
 *     responses:
 *       200:
 *         description: Liste des services du prestataire récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_service:
 *                     type: integer
 *                     example: 1
 *                   nom_service:
 *                     type: string
 *                     example: "Service X"
 *                   type_service:
 *                     type: string
 *                     example: "ponctuel"
 *                   description_service:
 *                     type: string
 *                     example: "Description du service"
 *                   presentation_service:
 *                     type: string
 *                     example: "Présentation du service"
 *                   image_prestataire:
 *                     type: string
 *                     example: "/path/to/image.jpg"
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
 *                   id_emplacement:
 *                     type: integer
 *                     example: 3
 *                   visibilite:
 *                     type: boolean
 *                     example: true
 *                   statut:
 *                     type: string
 *                     example: "ACCEPTÉ"
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/:id/services', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT id_service, nom_service, type_service, description_service,
                    presentation_service, image_prestataire, date_service, 
                    heure_ouverture, heure_fermeture, heure_commencement,
                    id_emplacement, visibilite, statut
             FROM servicePrestataire
             WHERE id_utilisateur = $1`,
            [id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des services du prestataire :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

/**
 * @swagger
 * /api/prestataire/service/request:
 *   post:
 *     summary: Créer une demande de service prestataire
 *     description: Crée une demande de service prestataire avec un emplacement validé. Les champs requis varient selon le type de service.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_utilisateur
 *               - nom_service
 *               - type_service
 *               - presentation_service
 *               - date_service
 *             properties:
 *               id_utilisateur:
 *                 type: integer
 *                 example: 4
 *               id_emplacement:
 *                 type: integer
 *                 example: 5
 *               nom_service:
 *                 type: string
 *                 example: "Service X"
 *               type_service:
 *                 type: string
 *                 enum: ["continu", "ponctuel"]
 *                 example: "continu"
 *               presentation_service:
 *                 type: string
 *                 example: "Présentation du service"
 *               description_service:
 *                 type: string
 *                 example: "Description détaillée du service"
 *               date_service:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-15"
 *               heure_ouverture:
 *                 type: string
 *                 example: "08:00"
 *               heure_fermeture:
 *                 type: string
 *                 example: "17:00"
 *               heure_commencement:
 *                 type: string
 *                 example: "10:00"
 *     responses:
 *       201:
 *         description: Demande de service créée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_service:
 *                   type: integer
 *                   example: 1
 *                 id_utilisateur:
 *                   type: integer
 *                   example: 4
 *                 id_emplacement:
 *                   type: integer
 *                   example: 5
 *                 nom_service:
 *                   type: string
 *                   example: "Service X"
 *                 type_service:
 *                   type: string
 *                   example: "continu"
 *                 presentation_service:
 *                   type: string
 *                   example: "Présentation du service"
 *                 description_service:
 *                   type: string
 *                   example: "Description détaillée du service"
 *                 date_service:
 *                   type: string
 *                   format: date
 *                   example: "2025-07-15"
 *                 heure_ouverture:
 *                   type: string
 *                   example: "08:00"
 *                 heure_fermeture:
 *                   type: string
 *                   example: "17:00"
 *                 heure_commencement:
 *                   type: string
 *                   example: null
 *                 visibilite:
 *                   type: boolean
 *                   example: true
 *                 statut:
 *                   type: string
 *                   example: "EN ATTENTE"
 *       400:
 *         description: Paramètres manquants ou invalides.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.post('/service/request', async (req, res) => {
    const {
        id_utilisateur,
        id_emplacement,
        nom_service,
        type_service,
        presentation_service,
        description_service,
        date_service,
        heure_ouverture,
        heure_fermeture,
        heure_commencement
    } = req.body;
    if (!id_utilisateur || !nom_service || !type_service || !presentation_service || !date_service) {
        return res.status(400).json({ error: "Paramètres manquants pour la demande de service" });
    }
    if (type_service === 'continu') {
       if (!heure_ouverture || !heure_fermeture) {
           return res.status(400).json({ error: "Pour un service continu, l'heure d'ouverture et de fermeture sont requises" });
       }
    } else if (type_service === 'ponctuel') {
       if (!heure_commencement) {
           return res.status(400).json({ error: "Pour un service ponctuel, l'heure de commencement est requise" });
       }
    } else {
       return res.status(400).json({ error: "Type de service invalide" });
    }
    try {
        const empResult = await pool.query(
            `SELECT * FROM emplacements_prestataires WHERE id_emplacement = $1 AND statut = 'RÉSERVÉ'`,
            [id_emplacement]
        );
        if (empResult.rows.length === 0) {
            return res.status(400).json({ error: "Emplacement non validé ou indisponible" });
        }
        const result = await pool.query(
            `INSERT INTO servicePrestataire 
             (id_utilisateur, id_emplacement, nom_service, type_service, presentation_service, description_service, date_service, 
              heure_ouverture, heure_fermeture, heure_commencement, visibilite, statut)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, 'EN ATTENTE')
             RETURNING *`,
            [
              id_utilisateur,
              id_emplacement,
              nom_service,
              type_service,
              presentation_service,
              description_service || '',
              date_service,
              type_service === 'continu' ? heure_ouverture : null,
              type_service === 'continu' ? heure_fermeture : null,
              type_service === 'ponctuel' ? heure_commencement : null
            ]
        );
        await pool.query(
            `UPDATE emplacements_prestataires SET statut = 'UTILISÉ' WHERE id_emplacement = $1`,
            [id_emplacement]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Erreur lors de la demande de service :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

/**
 * @swagger
 * /api/prestataire/service/request/{id}:
 *   delete:
 *     summary: Annuler une demande de service
 *     description: Annule une demande de service si son statut est "EN ATTENTE". Si aucune autre réservation n'existe pour l'emplacement, son statut peut être mis à jour.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la demande de service.
 *     responses:
 *       200:
 *         description: Service annulé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Service annulé avec succès"
 *       404:
 *         description: Service non trouvé ou non annulable.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.delete('/service/request/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const serviceResult = await pool.query(
            `SELECT * FROM servicePrestataire WHERE id_service = $1 AND statut = 'EN ATTENTE'`,
            [id]
        );
        if (serviceResult.rows.length === 0) {
            return res.status(404).json({ error: "Service non trouvé ou non annulable" });
        }
        const service = serviceResult.rows[0];
        await pool.query(
            `DELETE FROM servicePrestataire WHERE id_service = $1`,
            [id]
        );
        if (service.id_emplacement) {
            const countResult = await pool.query(
                `SELECT COUNT(*) FROM servicePrestataire WHERE id_emplacement = $1`,
                [service.id_emplacement]
            );
            if (parseInt(countResult.rows[0].count, 10) === 0) {
                await pool.query(
                    `UPDATE emplacements_prestataires SET statut = 'RÉSERVÉ' WHERE id_emplacement = $1`,
                    [service.id_emplacement]
                );
            }
        }
        res.status(200).json({ message: "Service annulé avec succès" });
    } catch (error) {
        console.error("Erreur lors de l'annulation du service :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

/**
 * @swagger
 * /api/prestataire/service/{id}:
 *   delete:
 *     summary: Supprimer un service
 *     description: Supprime un service dont le statut n'est pas "EN ATTENTE".
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du service à supprimer.
 *     responses:
 *       200:
 *         description: Service supprimé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Service supprimé avec succès"
 *       404:
 *         description: Service non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.delete('/service/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `DELETE FROM servicePrestataire WHERE id_service = $1`,
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Service non trouvé" });
        }
        res.status(200).json({ message: "Service supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression du service :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

/**
 * @swagger
 * /api/prestataire/service/reservation:
 *   post:
 *     summary: Créer une réservation pour un service
 *     description: Crée une réservation pour un service par un client. Pour un service continu, l'heure de commande doit être fournie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_utilisateur
 *               - id_service
 *             properties:
 *               id_utilisateur:
 *                 type: integer
 *                 example: 7
 *               id_service:
 *                 type: integer
 *                 example: 1
 *               heure_commande:
 *                 type: string
 *                 description: Pour un service continu, l'heure de commande.
 *                 example: "09:30"
 *     responses:
 *       201:
 *         description: Réservation créée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 10
 *                 id_utilisateur:
 *                   type: integer
 *                   example: 7
 *                 id_service:
 *                   type: integer
 *                   example: 1
 *                 heure_commande:
 *                   type: string
 *                   example: "09:30"
 *       400:
 *         description: Paramètres manquants ou invalides.
 *       404:
 *         description: Service non trouvé ou non disponible.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.post('/service/reservation', async (req, res) => {
    const { id_utilisateur, id_service, heure_commande } = req.body;
    if (!id_utilisateur || !id_service) {
        return res.status(400).json({ error: "Paramètres manquants pour la réservation du service" });
    }
    try {
        const serviceResult = await pool.query(
            `SELECT * FROM servicePrestataire WHERE id_service = $1 AND statut = 'ACCEPTÉ'`,
            [id_service]
        );
        if (serviceResult.rows.length === 0) {
            return res.status(404).json({ error: "Service non trouvé ou non disponible" });
        }
        const service = serviceResult.rows[0];
        if (service.type_service === 'continu') {
            if (!heure_commande) {
                return res.status(400).json({ error: "Pour un service continu, l'heure de commande est requise" });
            }
            // Vérification supplémentaire de l'heure_commande peut être ajoutée ici.
        }
        const result = await pool.query(
            `INSERT INTO reservation_service (id_utilisateur, id_service, heure_commande)
             VALUES ($1, $2, $3) RETURNING *`,
            [
              id_utilisateur,
              id_service,
              service.type_service === 'continu' ? heure_commande : null
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Erreur lors de la réservation du service :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

/**
 * @swagger
 * /api/prestataire/emplacements/available:
 *   get:
 *     summary: Récupérer les emplacements disponibles
 *     description: Retourne la liste des emplacements dont le statut est "LIBRE". Un filtre par nom peut être appliqué via query parameter.
 *     parameters:
 *       - in: query
 *         name: nom_emplacement
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtrer les emplacements par nom.
 *     responses:
 *       200:
 *         description: Liste des emplacements disponibles récupérée avec succès.
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
 *                   statut:
 *                     type: string
 *                     example: "LIBRE"
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/emplacements/available', async (req, res) => {
    try {
        let query = `
      SELECT * FROM emplacements_prestataires
      WHERE statut = 'LIBRE'
    `;
        let values = [];
        let filters = [];
        if (req.query.nom_emplacement) {
            filters.push("nom_emplacement ILIKE $" + (values.length + 1));
            values.push(`%${req.query.nom_emplacement}%`);
        }
        if (filters.length > 0) {
            query += " AND " + filters.join(" AND ");
        }
        const result = await pool.query(query, values);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des emplacements disponibles :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

/**
 * @swagger
 * /api/prestataire/emplacements/reservation:
 *   post:
 *     summary: Créer une demande de réservation d'un emplacement
 *     description: Met à jour l'emplacement en "EN ATTENTE" en réservant l'emplacement pour le prestataire.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_utilisateur
 *               - id_emplacement
 *               - date_reservation
 *               - description
 *             properties:
 *               id_utilisateur:
 *                 type: integer
 *                 example: 7
 *               id_emplacement:
 *                 type: integer
 *                 example: 3
 *               date_reservation:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-07-18T15:30:00Z"
 *               description:
 *                 type: string
 *                 example: "Réservation pour le stand principal"
 *     responses:
 *       201:
 *         description: Demande de réservation créée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_emplacement:
 *                   type: integer
 *                   example: 3
 *                 utilisateur_id:
 *                   type: integer
 *                   example: 7
 *                 date_reservation:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-07-18T15:30:00Z"
 *                 description:
 *                   type: string
 *                   example: "Réservation pour le stand principal"
 *                 statut:
 *                   type: string
 *                   example: "EN ATTENTE"
 *       400:
 *         description: Paramètres manquants ou emplacement indisponible.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.post('/emplacements/reservation', async (req, res) => {
    const { id_utilisateur, id_emplacement, date_reservation, description } = req.body;
    if (!id_utilisateur || !id_emplacement || !date_reservation || !description) {
        return res.status(400).json({ error: "Paramètres manquants pour la réservation" });
    }
    try {
        const result = await pool.query(
            `UPDATE emplacements_prestataires
             SET utilisateur_id = $1, date_reservation = $2, description = $3, statut = 'EN ATTENTE'
             WHERE id_emplacement = $4 AND statut = 'LIBRE'
             RETURNING *`,
            [id_utilisateur, date_reservation, description, id_emplacement]
        );
        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Emplacement non disponible ou déjà réservé" });
        }
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Erreur lors de la demande de réservation d'emplacement :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

/**
 * @swagger
 * /api/prestataire/emplacements/myrequests/{id}:
 *   get:
 *     summary: Récupérer les demandes de réservation d'emplacements en attente pour un prestataire
 *     description: Retourne toutes les demandes de réservation d'emplacements ayant le statut "EN ATTENTE" pour un prestataire donné.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du prestataire.
 *     responses:
 *       200:
 *         description: Liste des demandes de réservation récupérée avec succès.
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
 *                   utilisateur_id:
 *                     type: integer
 *                     example: 7
 *                   statut:
 *                     type: string
 *                     example: "EN ATTENTE"
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/emplacements/myrequests/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT * FROM emplacements_prestataires
             WHERE utilisateur_id = $1 AND statut = 'EN ATTENTE'`,
            [id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des demandes de réservation :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

/**
 * @swagger
 * /api/prestataire/emplacements/reservation/{id}:
 *   delete:
 *     summary: Annuler une demande de réservation d'emplacement
 *     description: Annule la réservation d'un emplacement (remet l'emplacement en statut "LIBRE").
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'emplacement à annuler.
 *     responses:
 *       200:
 *         description: Réservation annulée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Réservation annulée avec succès"
 *                 emplacement:
 *                   type: object
 *                   description: Détails de l'emplacement annulé.
 *       404:
 *         description: Réservation non trouvée ou impossible à annuler.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.delete('/emplacements/reservation/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `UPDATE emplacements_prestataires
             SET utilisateur_id = NULL, date_reservation = NULL, description = NULL, statut = 'LIBRE'
             WHERE id_emplacement = $1 AND statut = 'EN ATTENTE'
             RETURNING *`,
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Réservation non trouvée ou impossible à annuler" });
        }
        res.status(200).json({ message: "Réservation annulée avec succès", emplacement: result.rows[0] });
    } catch (error) {
        console.error("Erreur lors de l'annulation de la réservation :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

/**
 * @swagger
 * /api/prestataire/emplacements/validated/{id}:
 *   get:
 *     summary: Récupérer les emplacements validés pour un prestataire
 *     description: Retourne les emplacements réservés (statut = "RÉSERVÉ") pour un prestataire donné.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du prestataire.
 *     responses:
 *       200:
 *         description: Liste des emplacements validés récupérée avec succès.
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
 *                   utilisateur_id:
 *                     type: integer
 *                     example: 7
 *                   statut:
 *                     type: string
 *                     example: "RÉSERVÉ"
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/emplacements/validated/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT * FROM emplacements_prestataires
             WHERE utilisateur_id = $1 AND statut = 'RÉSERVÉ'`,
            [id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des emplacements validés :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

/**
 * @swagger
 * /api/prestataire/service/update:
 *   post:
 *     summary: Mettre à jour la présentation et l'image d'un service
 *     description: Met à jour la présentation et l'image d'un service pour un prestataire en utilisant sanitizeHtml pour nettoyer la présentation.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_service
 *               - id_utilisateur
 *             properties:
 *               id_service:
 *                 type: integer
 *                 example: 1
 *               id_utilisateur:
 *                 type: integer
 *                 example: 4
 *               presentation_service:
 *                 type: string
 *                 example: "Nouvelle présentation du service."
 *               image_prestataire:
 *                 type: string
 *                 example: "/path/to/new_image.jpg"
 *     responses:
 *       200:
 *         description: Service mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_service:
 *                   type: integer
 *                   example: 1
 *                 id_utilisateur:
 *                   type: integer
 *                   example: 4
 *                 presentation_service:
 *                   type: string
 *                   example: "Nouvelle présentation du service."
 *                 image_prestataire:
 *                   type: string
 *                   example: "/path/to/new_image.jpg"
 *       400:
 *         description: Paramètres manquants.
 *       404:
 *         description: Service non trouvé ou non modifiable.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.post('/service/update', async (req, res) => {
    const { id_service, id_utilisateur, presentation_service, image_prestataire } = req.body;
    if (!id_service || !id_utilisateur) {
        return res.status(400).json({ error: "Paramètres manquants" });
    }
    const cleanPresentation = sanitizeHtml(presentation_service, {
        allowedTags: [],
        allowedAttributes: {}
    });
    try {
        const result = await pool.query(
            `UPDATE servicePrestataire
             SET presentation_service = $1, image_prestataire = $2
             WHERE id_service = $3 AND id_utilisateur = $4
             RETURNING *`,
            [cleanPresentation, image_prestataire, id_service, id_utilisateur]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Service non trouvé ou non modifiable" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du service :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

module.exports = router;
