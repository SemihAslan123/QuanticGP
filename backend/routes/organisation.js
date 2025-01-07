const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// Route POST pour ajouter un événement
router.post('/', async (req, res) => {
    const { courseName, eventDate, eventDescription, eventImage } = req.body;

    if (!courseName || !eventDate || !eventDescription || !eventImage) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    try {
        const query = `
            INSERT INTO events (name, date, description, image)
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const values = [courseName, eventDate, eventDescription, eventImage];
        const result = await pool.query(query, values);

        res.status(201).json({ message: "Événement ajouté avec succès", event: result.rows[0] });
    } catch (error) {
        console.error("Erreur lors de l'insertion dans la base de données:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Route GET pour récupérer les événements
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

// Route GET pour récupérer les réservations
router.get('/stands', async (req, res) => {
    try {
        const query = `
            SELECT
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
                rs.date_reservation DESC;
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des réservations :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Route DELETE pour supprimer une réservation
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

// Route PATCH pour changer le statut d'une réservation
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
        const query = 'UPDATE Utilisateurs SET type_utilisateur = $1 WHERE id_utilisateur = $2';
        await pool.query(query, [type_utilisateur, id]);
        res.status(200).json({ message: "Type utilisateur mis à jour avec succès." });
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        res.status(500).send({ message: "Erreur serveur lors de la mise à jour du type utilisateur." });
    }
});


// Route PUT pour mettre à jour un événement
router.put('/events/:id', async (req, res) => {
    const { id } = req.params;
    const { courseName, eventDate, eventDescription, eventImage } = req.body;

    try {
        const query = `
            UPDATE events
            SET name = $1, date = $2, description = $3, image = $4
            WHERE id = $5
        `;
        const values = [courseName, eventDate, eventDescription, eventImage, id];
        await pool.query(query, values);

        res.status(200).json({ message: 'Événement mis à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// Route DELETE pour supprimer un événement
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

// Route GET pour les statistiques
router.get('/statistics', async (req, res) => {
    try {
        const totalEventsResult = await pool.query('SELECT COUNT(*) AS total FROM events');
        const totalParticipantsResult = await pool.query(
            `SELECT COUNT(DISTINCT utilisateur_id) AS total 
             FROM billet 
             WHERE utilisateur_id IS NOT NULL`
        );
        const totalTicketPrestataireResult = await pool.query(
            `SELECT COUNT(*) AS total 
             FROM reservation_stand`
        );

        res.json({
            totalEvents: totalEventsResult.rows[0].total,
            totalParticipants: totalParticipantsResult.rows[0].total,
            totalTicketPrestataire: totalTicketPrestataireResult.rows[0].total,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});


router.get('/prestataires', async (req, res) => {
    try {
        const query = `
      SELECT id_utilisateur, nom_utilisateur, prenom_utilisateur, mail_utilisateur, image_prestataire, type_utilisateur
      FROM Utilisateurs
    `;

        const { rows: prestataires } = await pool.query(query);

        res.status(200).json(prestataires);
    } catch (error) {
        console.error("Erreur lors de la récupération des prestataires :", error);
        res.status(500).json({ error: "Erreur serveur. Impossible de récupérer les prestataires." });
    }
});


module.exports = router;
