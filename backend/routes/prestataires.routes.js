const express = require('express');
const router = express.Router();
const pool = require('../db');
const sanitizeHtml = require('sanitize-html');

/**
 * GET /prestataire/services
 * Récupérer la liste des services validés pour les clients (statut = 'ACCEPTÉ')
 */
router.get('/services', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id_service, nom_service, type_service, description_service, presentation_service, date_service, heure_service, id_emplacement, visibilite, statut
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
 * GET /prestataire/:id
 * Récupérer les informations du prestataire connecté
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
 * POST /prestataire/update
 * Mettre à jour les informations du prestataire
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
 * GET /prestataire/:id/services
 * Récupérer la liste des services proposés par le prestataire connecté
 */
router.get('/:id/services', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT id_service, nom_service, type_service, description_service,
                    presentation_service, image_prestataire, date_service, heure_service,
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
 * POST /prestataire/service/request
 * Créer une demande de service prestataire avec un emplacement validé.
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
        heure_service
    } = req.body;
    if (!id_utilisateur || !nom_service || !type_service || !presentation_service || !date_service || !heure_service) {
        return res.status(400).json({ error: "Paramètres manquants pour la demande de service" });
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
       (id_utilisateur, id_emplacement, nom_service, type_service, presentation_service, description_service, date_service, heure_service, visibilite, statut)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, 'EN ATTENTE')
       RETURNING *`,
            [id_utilisateur, id_emplacement, nom_service, type_service, presentation_service, description_service || '', date_service, heure_service]
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
 * DELETE /prestataire/service/request/:id
 * Annuler une demande de service (uniquement si son statut est 'EN ATTENTE').
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
 * DELETE /prestataire/service/:id
 * Supprimer un service (cas non 'EN ATTENTE')
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
 * GET /prestataire/emplacements/available
 * Récupérer la liste des emplacements disponibles (statut = 'LIBRE')
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
 * POST /prestataire/emplacements/reservation
 * Créer une demande de réservation d'un emplacement
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
 * GET /prestataire/emplacements/myrequests/:id
 * Récupérer les demandes de réservation d'emplacements en attente pour un prestataire
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
 * DELETE /prestataire/emplacements/reservation/:id
 * Annuler une demande de réservation d'emplacement (remettre l'emplacement en 'LIBRE')
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
 * GET /prestataire/emplacements/validated/:id
 * Récupérer les emplacements validés pour un prestataire (statut = 'RÉSERVÉ')
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
 * POST /prestataire/service/update
 * Mettre à jour la présentation et l'image d'un service pour un prestataire.
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
