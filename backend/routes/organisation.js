const express = require('express');
const router = express.Router();
const pool = require('../database/db'); // Chemin vers db.js

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
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM events ORDER BY date DESC';
        const result = await pool.query(query);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des événements:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

module.exports = router;
