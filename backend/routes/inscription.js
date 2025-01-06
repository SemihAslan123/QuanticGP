const express = require("express");
const router = express.Router();
const pool = require("../database/db"); // Chemin vers votre configuration de la base de données

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
 *                 enum: ['admin', 'prestataire', 'client']
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès.
 *       400:
 *         description: Les champs obligatoires sont manquants ou invalides.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.post("/", async (req, res) => {
  const {
    prenomUtilisateur,
    nomUtilisateur,
    emailUtilisateur,
    motDePasse,
    typeUtilisateur,
  } = req.body;

  // Vérification que les champs obligatoires sont présents
  if (!prenomUtilisateur || !nomUtilisateur || !emailUtilisateur || !motDePasse || !typeUtilisateur) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  try {
    // Vérification si l'email est déjà utilisé
    const checkEmailQuery = `SELECT * FROM Utilisateurs WHERE mail_utilisateur = $1`;
    const checkEmailResult = await pool.query(checkEmailQuery, [emailUtilisateur]);

    if (checkEmailResult.rows.length > 0) {
      return res.status(400).json({ error: "L'email est déjà utilisé." });
    }

    // Insertion dans la table Utilisateurs
    const insertQuery = `
      INSERT INTO Utilisateurs (prenom_utilisateur, nom_utilisateur, mail_utilisateur, mot_de_passe, type_utilisateur)
      VALUES ($1, $2, $3, $4, $5) RETURNING id_utilisateur;
    `;
    const values = [prenomUtilisateur, nomUtilisateur, emailUtilisateur, motDePasse, typeUtilisateur];
    const result = await pool.query(insertQuery, values);

    res.status(201).json({ message: "Utilisateur inscrit avec succès", userId: result.rows[0].id_utilisateur });
  } catch (error) {
    console.error("Erreur lors de l'inscription de l'utilisateur : ", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

module.exports = router;
