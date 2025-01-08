const express = require('express');
const router = express.Router();
const pool = require('../database/db'); // Chemin vers la configuration de la DB
const { v4: uuidv4 } = require('uuid'); // Génère un identifiant unique pour la session

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connexion de l'utilisateur
 *     description: Cette route connecte un utilisateur en vérifiant son email et son mot de passe.
 *     responses:
 *       200:
 *         description: Connexion réussie.
 *       400:
 *         description: Paramètres manquants.
 *       401:
 *         description: Échec de l'authentification.
 *       500:
 *         description: Erreur interne.
 */
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe sont obligatoires.' });
    }

    try {
        const query = 'SELECT * FROM Utilisateurs WHERE mail_utilisateur = $1';
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Utilisateur non trouvé.' });
        }

        const utilisateur = result.rows[0];

        if (utilisateur.mot_de_passe !== password) {
            return res.status(401).json({ error: 'Mot de passe incorrect.' });
        }

        // Générer un sessionId unique
        const sessionId = uuidv4();

        // Vous pouvez stocker le sessionId en base de données ici si nécessaire

        res.status(200).json({
            success: true,
            user: {
                id: utilisateur.id_utilisateur,
                nom: utilisateur.nom_utilisateur,
                prenom: utilisateur.prenom_utilisateur,
                mail: utilisateur.mail_utilisateur,
                type: utilisateur.type_utilisateur,
                sessionId, // Retourner le sessionId
            },
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ error: 'Erreur du serveur' });
    }
});

module.exports = router;
