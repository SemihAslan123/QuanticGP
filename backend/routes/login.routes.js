const express = require('express');
const router = express.Router();
const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Authentification de l'utilisateur
 *     description: >
 *       Permet de connecter un utilisateur en vérifiant son email et son mot de passe.
 *       Si les informations sont correctes, un identifiant de session unique est généré.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'email de l'utilisateur.
 *                 example: "jean.dupont@example.com"
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur.
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Connexion réussie. Retourne les informations de l'utilisateur et l'ID de session.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indique si la connexion a réussi.
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: L'ID de l'utilisateur.
 *                       example: 2
 *                     nom:
 *                       type: string
 *                       description: Le nom de l'utilisateur.
 *                       example: "Dupont"
 *                     prenom:
 *                       type: string
 *                       description: Le prénom de l'utilisateur.
 *                       example: "Jean"
 *                     mail:
 *                       type: string
 *                       description: L'email de l'utilisateur.
 *                       example: "utilisateur@example.com"
 *                     type:
 *                       type: string
 *                       description: >
 *                       Le type d'utilisateur (ex : admin, client, partenaire)
 *                       example: "client"
 *                     sessionId:
 *                       type: string
 *                       description: L'ID de session généré après une connexion réussie.
 *                       example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *       400:
 *         description: Email et mot de passe sont requis.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email et mot de passe sont obligatoires."
 *       401:
 *         description: L'email ou le mot de passe est incorrect.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Utilisateur non trouvé ou mot de passe incorrect."
 *       500:
 *         description: Erreur du serveur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur du serveur"
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
                sessionId,
            },
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ error: 'Erreur du serveur' });
    }
});

module.exports = router;
