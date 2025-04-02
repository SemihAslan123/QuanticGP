const express = require("express");
const router = express.Router();
const pool = require("../db"); // Chemin vers votre configuration de la BDD

/**
 * @swagger
 * /inscription:
 *   post:
 *     summary: Inscription d'un utilisateur
 *     description: Cette route permet d'ajouter un nouvel utilisateur dans la base de données.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prenomUtilisateur:
 *                 type: string
 *               nomUtilisateur:
 *                 type: string
 *               emailUtilisateur:
 *                 type: string
 *               motDePasse:
 *                 type: string
 *               typeUtilisateur:
 *                 type: string
 *                 enum: ['organisateur', 'prestataire', 'client']
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès.
 *       400:
 *         description: Les champs obligatoires sont manquants ou invalides.
 *       500:
 *         description: Erreur interne du serveur.
 */

router.post('/', async (req, res) => {
    const {
        prenomUtilisateur,
        nomUtilisateur,
        emailUtilisateur,
        motDePasse,
        typeUtilisateur,
        presentation, // Nouveau champ
    } = req.body;

    if (!prenomUtilisateur || !nomUtilisateur || !emailUtilisateur || !motDePasse || !typeUtilisateur) {
        return res.status(400).json({ error: 'Tous les champs de base sont requis.' });
    }

    try {
        const checkEmailQuery = `SELECT * FROM Utilisateurs WHERE mail_utilisateur = $1`;
        const checkEmailResult = await pool.query(checkEmailQuery, [emailUtilisateur]);
        if (checkEmailResult.rows.length > 0) {
            return res.status(400).json({ error: 'L\'email est déjà utilisé.' });
        }

        if (typeUtilisateur === 'prestataire' || typeUtilisateur === 'organisateur') {
            const checkPendingQuery = `SELECT * FROM demandes_prestataires WHERE mail_utilisateur = $1 AND statut_demande = 'EN ATTENTE'`;
            const checkPendingResult = await pool.query(checkPendingQuery, [emailUtilisateur]);
            if (checkPendingResult.rows.length > 0) {
                return res.status(400).json({ error: 'Une demande est déjà en attente pour cet email.' });
            }

            const insertDemandeQuery = `
        INSERT INTO demandes_prestataires (prenom_utilisateur, nom_utilisateur, mail_utilisateur, mot_de_passe, type_demande, presentation)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_demande;
      `;
            const values = [prenomUtilisateur, nomUtilisateur, emailUtilisateur, motDePasse, typeUtilisateur, presentation || null];
            const result = await pool.query(insertDemandeQuery, values);

            const insertUserQuery = `
        INSERT INTO Utilisateurs (prenom_utilisateur, nom_utilisateur, mail_utilisateur, mot_de_passe, type_utilisateur)
        VALUES ($1, $2, $3, $4, 'client') RETURNING id_utilisateur;
      `;
            const userValues = [prenomUtilisateur, nomUtilisateur, emailUtilisateur, motDePasse];
            const userResult = await pool.query(insertUserQuery, userValues);

            return res.status(201).json({
                message: `Demande de ${typeUtilisateur} enregistrée avec succès. Votre compte a été créé en tant que client en attendant la validation.`,
                demandeId: result.rows[0].id_demande,
                userId: userResult.rows[0].id_utilisateur,
            });
        }

        const insertQuery = `
      INSERT INTO Utilisateurs (prenom_utilisateur, nom_utilisateur, mail_utilisateur, mot_de_passe, type_utilisateur)
      VALUES ($1, $2, $3, $4, $5) RETURNING id_utilisateur;
    `;
        const values = [prenomUtilisateur, nomUtilisateur, emailUtilisateur, motDePasse, 'client'];
        const result = await pool.query(insertQuery, values);

        res.status(201).json({
            message: 'Inscription réussie en tant que client.',
            userId: result.rows[0].id_utilisateur,
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription : ', error);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});

module.exports = router;
