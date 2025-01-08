const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const { v4: uuidv4 } = require('uuid');

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authentification de l'utilisateur
 *     description: Cette route permet de connecter un utilisateur en vérifiant son email et mot de passe.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'email de l'utilisateur.
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur.
 *     responses:
 *       200:
 *         description: Connexion réussie. Retourne les informations de l'utilisateur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indique si la connexion a réussi.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: L'ID de l'utilisateur.
 *                     nom:
 *                       type: string
 *                       description: Le nom de l'utilisateur.
 *                     prenom:
 *                       type: string
 *                       description: Le prénom de l'utilisateur.
 *                     mail:
 *                       type: string
 *                       description: L'email de l'utilisateur.
 *                     type:
 *                       type: string
 *                       description: Le type d'utilisateur (admin, user).
 *                     sessionId:
 *                       type: string
 *                       description: L'ID de la session de l'utilisateur généré après une connexion réussie.
 *       400:
 *         description: Email et mot de passe sont requis.
 *       401:
 *         description: L'email ou mot de passe est incorrect.
 *       500:
 *         description: Erreur du serveur.
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
