// routes/emplacements.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // On importe la connexion à la BDD

/**
 * GET /api/emplacements
 * Retourne la liste des emplacements avec les informations issues des tables emplacements_prestataires et servicePrestataire.
 */
router.get('/emplacements', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        e.id_emplacement,
        e.nom_emplacement,
        e.coordonnees_svg,
        e.statut,
        e.description,
        s.nom_service AS nom_prestataire,
        s.type_service as type_service,
        s.description_service as description_service,
        s.prix_moyen as prix_moyen,
        s.carte_banquaire as carte_banquaire
      FROM emplacements_prestataires e
      LEFT JOIN servicePrestataire s ON e.id_emplacement = s.id_emplacement
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des emplacements : ", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
