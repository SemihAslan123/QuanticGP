const express = require('express');
const router = express.Router();
const db = require('../db'); // On importe la connexion à la BDD

/**
 * GET /api/emplacements
 * Retourne la liste des emplacements avec les informations issues des tables emplacements_prestataires et servicePrestataire.
 * Le champ "display_status" est calculé de la manière suivante :
 *   - Si un service est associé :
 *        - Si son statut est "ACCEPTÉ", display_status = "ACCEPTÉ"
 *        - Sinon, display_status = "RÉSERVÉ"
 *   - Sinon, si l'emplacement est réservé (e.statut différent de "LIBRE"), display_status = "RÉSERVÉ"
 *   - Sinon, display_status = "LIBRE"
 */
router.get('/emplacements', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        e.id_emplacement,
        e.nom_emplacement,
        e.coordonnees_svg,
        CASE 
          WHEN s.id_emplacement IS NOT NULL THEN 
            CASE WHEN s.statut = 'ACCEPTÉ' THEN 'ACCEPTÉ'
                 ELSE 'RÉSERVÉ'
            END
          ELSE
            CASE WHEN e.statut <> 'LIBRE' THEN 'RÉSERVÉ' ELSE 'LIBRE' END
        END AS display_status,
        e.description,
        s.nom_service AS nom_prestataire,
        s.type_service AS type_service,
        s.description_service AS description_service,
        s.prix_moyen AS prix_moyen,
        s.carte_banquaire AS carte_banquaire
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
