const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Pour gérer les requêtes cross-origin
const pool = require('./database/db.js');

const app = express();
const port = 3001;

// Configuration de CORS pour permettre les requêtes provenant d'un autre port (port 8080)
app.use(cors({
    origin: 'http://localhost:8080'
}));

// Middleware pour analyser les données JSON dans les requêtes
app.use(bodyParser.json());

// Route POST pour ajouter un événement
app.post('/organisation', async (req, res) => {
    const { courseName, eventDate, eventDescription, eventImage } = req.body;

    // Vérifier que toutes les données nécessaires sont présentes
    if (!courseName || !eventDate || !eventDescription || !eventImage) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    try {
        const query = `
            INSERT INTO events (name, date, description, image)
            VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [courseName, eventDate, eventDescription, eventImage];

        const result = await pool.query(query, values);

        res.status(201).json({ message: "Événement ajouté avec succès", event: result.rows[0] });
    } catch (error) {
        console.error("Erreur lors de l'insertion dans la base de données:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Route Get pour afficher les événements
app.get('/organisation', async (req, res) => {
    try {
        const query = 'SELECT * FROM events ORDER BY date DESC';
        const result = await pool.query(query);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des événements:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});


// Démarrer le serveur Express
app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});
