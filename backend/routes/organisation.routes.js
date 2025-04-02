const express = require('express');
const router = express.Router();
const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

/**
 * POST /organisation
 * Ajouter un événement
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
 * GET /organisation/events
 * Récupérer tous les événements
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
 * GET /organisation/stands
 * Récupérer toutes les réservations de services prestataires (propositions et réservations clients)
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
 * DELETE /organisation/stands/:id
 * Supprimer une réservation
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
 * PUT /organisation/events/:id
 * Mettre à jour un événement
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
 * DELETE /organisation/events/:id
 * Supprimer un événement
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
 * GET /organisation/statistics
 * Obtenir des statistiques sur les événements, participants, services prestataires et billets
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
 * GET /organisation/prestataires
 * Récupérer les prestataires
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
 * PATCH /organisation/prestataires/:id
 * Mettre à jour le type d'un prestataire
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
 * GET /organisation/stand-reservations
 * Récupérer toutes les réservations d'emplacements
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
 * PATCH /organisation/stand-reservations/:id
 * Changer le statut d'une réservation d'emplacement
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
 * DELETE /organisation/stand-reservations/:id
 * Supprimer une réservation d'emplacement (remise à LIBRE)
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
 * GET /organisation/all-stands
 * Récupérer tous les stands
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
            // Mettre à jour le statut de la demande (ou la supprimer, selon vos préférences)
            await pool.query(
                `UPDATE demandes_prestataires SET statut_demande = 'REFUSÉ' WHERE id_demande = $1`,
                [id]
            );
            // Optionnel : Supprimer la demande refusée
            // await pool.query(`DELETE FROM demandes_prestataires WHERE id_demande = $1`, [id]);

            res.status(200).json({ message: "Demande refusée." });
        } else {
            // Remettre en attente (peu probable, mais possible)
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
 * PATCH /organisation/service-reservations/:id
 * Changer le statut d'une réservation de service prestataire
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