const express = require('express');
const router = express.Router();
const pool = require('../database/db');

/**
 * @swagger
 * /clientPaiementActivite:
 *   post:
 *     summary: Inscrire un utilisateur connecté à des activités lors du paiement.
 *     description: Cette route permet d'inscrire un utilisateur connecté à des activités spécifiques après le paiement.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID de l'utilisateur connecté.
 *               activities:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_event:
 *                       type: integer
 *                       description: ID de l'événement auquel l'utilisateur s'inscrit.
 *     responses:
 *       201:
 *         description: Inscriptions enregistrées avec succès.
 *       400:
 *         description: Champs obligatoires manquants ou invalides.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.post('/', async (req, res) => {
  const { userId, activities } = req.body;

  // Vérification des données reçues
  if (!userId || !Array.isArray(activities) || activities.length === 0) {
    return res.status(400).json({ error: 'Champs obligatoires manquants ou invalides.' });
  }

  const client = await pool.connect();

try {
  await client.query('BEGIN'); // Commence une transaction

  for (const activity of activities) {
    const { id_event } = activity;

    // Vérification si l'événement existe
    const eventQuery = 'SELECT 1 FROM events WHERE id = $1';
    const eventResult = await client.query(eventQuery, [id_event]);

    if (eventResult.rowCount === 0) {
      return res.status(400).json({ error: `L'événement avec l'ID ${id_event} n'existe pas.` });
    }

    // Insertion de l'inscription
    const queryInscription = `
      INSERT INTO liste_activite_client (id_utilisateur, id_event)
      VALUES ($1, $2);
    `;
    const valuesInscription = [userId, id_event];
    await client.query(queryInscription, valuesInscription);
  }

  await client.query('COMMIT'); // Valide la transaction
  res.status(201).json({ message: 'Inscriptions enregistrées avec succès.' });
} catch (error) {
  await client.query('ROLLBACK'); // Annule la transaction en cas d'erreur
  console.error('Erreur lors de l’insertion dans la base de données:', error.message);
  res.status(500).json({ error: 'Erreur interne du serveur.', details: error.message });
} finally {
  client.release(); // Libère la connexion
}

});

module.exports = router;
