const express = require('express');
const router = express.Router();
const pool = require('../database/db'); // Chemin vers votre configuration de la base de données

/**
 * GET /prestataire/services
 * Récupérer la liste de tous les services pour les clients
 */
router.get('/services', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id_service, nom_service, type_service, description_service, date_service, heure_service, id_stand
       FROM servicePrestataire`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des services pour client :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

/**
 * GET /prestataire/:id
 * Récupérer les informations du prestataire connecté
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT id_utilisateur, nom_utilisateur, prenom_utilisateur, mail_utilisateur, image_prestataire 
       FROM Utilisateurs 
       WHERE id_utilisateur = $1 AND type_utilisateur = 'prestataire'`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Prestataire non trouvé" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération du prestataire :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

/**
 * POST /prestataire/update
 * Mettre à jour les informations du prestataire
 */
router.post('/update', async (req, res) => {
  const { id_utilisateur, nom, prenom, mail, image } = req.body;
  if (!id_utilisateur) {
    return res.status(400).json({ error: "ID du prestataire manquant" });
  }
  try {
    const result = await pool.query(
      `UPDATE Utilisateurs
       SET nom_utilisateur = $1, prenom_utilisateur = $2, mail_utilisateur = $3, image_prestataire = $4
       WHERE id_utilisateur = $5 AND type_utilisateur = 'prestataire'
       RETURNING 
         id_utilisateur as id, 
         nom_utilisateur as nom, 
         prenom_utilisateur as prenom, 
         mail_utilisateur as mail, 
         image_prestataire as image,
         type_utilisateur as type`,
      [nom, prenom, mail, image, id_utilisateur]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Prestataire non trouvé ou aucune modification apportée" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du prestataire :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});




/**
 * GET /prestataire/:id/services
 * Récupérer la liste des services proposés par le prestataire connecté
 */
router.get('/:id/services', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT id_service, nom_service, type_service, description_service, date_service, heure_service, id_stand
       FROM servicePrestataire
       WHERE id_utilisateur = $1`,
      [id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des services du prestataire :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

module.exports = router;
