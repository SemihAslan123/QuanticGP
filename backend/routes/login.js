const express = require('express');
const router = express.Router();
const pool = require('../database/db'); // Assurez-vous que le chemin vers votre fichier de configuration de la base de données est correct

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connexion de l'utilisateur
 *     description: Cette route permet de connecter un utilisateur en vérifiant son email et son mot de passe.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'email de l'utilisateur pour la connexion.
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur.
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne les informations de l'utilisateur.
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
 *                       description: Le type de l'utilisateur (par exemple "admin", "user").
 *       400:
 *         description: Email et mot de passe sont obligatoires.
 *       401:
 *         description: L'email ou le mot de passe est incorrect.
 *       500:
 *         description: Erreur interne du serveur.
 */
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
