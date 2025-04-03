const express = require('express');
const router = express.Router();
const db = require('../db'); // On importe la connexion à la BDD

/**
 * @swagger
 * /api/emplacements:
 *   get:
 *     summary: Récupérer la liste des emplacements
 *     description: >
 *       Retourne la liste des emplacements avec les informations issues des tables
 *       `emplacements_prestataires` et `servicePrestataire`. Le champ `display_status` est calculé de la manière suivante :
 *         - Si un service est associé :
 *             - Si son statut est `ACCEPTÉ`, alors `display_status` = `ACCEPTÉ`
 *             - Sinon, `display_status` = `RÉSERVÉ`
 *         - Sinon, si l'emplacement est réservé (e.statut différent de `LIBRE`), alors `display_status` = `RÉSERVÉ`
 *         - Sinon, `display_status` = `LIBRE`
 *     responses:
 *       200:
 *         description: Liste des emplacements récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_emplacement:
 *                     type: integer
 *                     example: 1
 *                   nom_emplacement:
 *                     type: string
 *                     example: "Zone A - Emplacement n°1"
 *                   coordonnees_svg:
 *                     type: string
 *                     example: "m 478.86837,453.3347 -6.49541,84.88826 26.20561,3.13572 6.49541,-84.66429 z"
 *                   display_status:
 *                     type: string
 *                     description: "Statut affiché calculé: 'ACCEPTÉ', 'RÉSERVÉ' ou 'LIBRE'"
 *                     example: "RÉSERVÉ"
 *                   description:
 *                     type: string
 *                     example: "Emplacement réservé aux prestataires et soumis à réservation."
 *                   nom_prestataire:
 *                     type: string
 *                     description: "Nom du service prestataire associé, s'il existe."
 *                     example: "🥩 Grill’n’Go"
 *                   type_service:
 *                     type: string
 *                     example: "continu"
 *                   description_service:
 *                     type: string
 *                     example: "Barbecue gourmet avec burgers et hot-dogs maison."
 *                   prix_moyen:
 *                     type: string
 *                     example: "0-10€"
 *                   carte_banquaire:
 *                     type: string
 *                     example: "Acceptée"
 *       500:
 *         description: Erreur interne du serveur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur interne du serveur"
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
