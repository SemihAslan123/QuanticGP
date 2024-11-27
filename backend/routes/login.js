const express = require('express');
const router = express.Router();
const pool = require('../database/db'); // Assurez-vous que le chemin vers votre fichier de configuration de la base de données est correct

// Route POST pour la connexion des utilisateurs
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe sont obligatoires.' });
    }

    try {
        console.log('Requête reçue:', email, password); // Log de la requête pour debug

        // Rechercher l'utilisateur dans la base de données
        const query = 'SELECT * FROM Utilisateurs WHERE mail_utilisateur = $1';
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Utilisateur non trouvé.' });
        }

        const utilisateur = result.rows[0];

        // Vérification du mot de passe
        if (utilisateur.mot_de_passe !== password) {
            return res.status(401).json({ error: 'Mot de passe incorrect.' });
        }

        // Log de l'utilisateur récupéré pour debug
        console.log('Utilisateur trouvé:', utilisateur);

        // Retourner la réponse avec les informations de l'utilisateur
        res.status(200).json({
            success: true,
            user: {
                id: utilisateur.id_utilisateur,
                nom: utilisateur.nom_utilisateur,
                prenom: utilisateur.prenom_utilisateur,
                mail: utilisateur.mail_utilisateur,
                type: utilisateur.type_utilisateur,
            }
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ error: 'Erreur du serveur' });
    }
});

module.exports = router;
