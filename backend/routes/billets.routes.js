const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * /api/billets:
 *   post:
 *     summary: Ajouter un billet
 *     description: Crée un billet pour un utilisateur inscrit ou un acheteur non inscrit. Cette route permet de réserver des cours, un hôtel et des services associés tels que le parking.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prenom
 *               - nom
 *               - email
 *               - totalPrice
 *             properties:
 *               prenom:
 *                 type: string
 *                 description: Prénom de l'acheteur.
 *                 example: "Jean"
 *               nom:
 *                 type: string
 *                 description: Nom de l'acheteur.
 *                 example: "Dupont"
 *               email:
 *                 type: string
 *                 description: Adresse email de l'acheteur.
 *                 example: "jean.dupont@example.com"
 *               selectedCourses:
 *                 type: array
 *                 description: Liste des cours sélectionnés.
 *                 items:
 *                   type: object
 *                   required:
 *                     - nom
 *                     - date
 *                   properties:
 *                     nom:
 *                       type: string
 *                       description: Nom du cours sélectionné.
 *                       example: "Karting enfant"
 *                     date:
 *                       type: string
 *                       format: date
 *                       description: Date du cours (format YYYY-MM-DD).
 *                       example: "2025-07-15"
 *               selectedHotel:
 *                 type: object
 *                 description: Détails de l'hôtel sélectionné.
 *                 properties:
 *                   nom:
 *                     type: string
 *                     description: Nom de l'hôtel.
 *                     example: "Hotel F1"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Date de début du parking.
 *                 example: "2025-07-15"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Date de fin du parking.
 *                 example: "2025-07-15"
 *               hotelStartDate:
 *                 type: string
 *                 format: date
 *                 description: Date de début de l'hôtel.
 *                 example: "2025-07-15"
 *               hotelEndDate:
 *                 type: string
 *                 format: date
 *                 description: Date de fin de l'hôtel.
 *                 example: "2025-07-15"
 *               isVIP:
 *                 type: boolean
 *                 description: Indique si le billet est VIP.
 *                 example: true
 *               totalPrice:
 *                 type: number
 *                 format: float
 *                 description: Prix total du billet.
 *                 example: 150.75
 *               userId:
 *                 type: integer
 *                 description: ID de l'utilisateur connecté (facultatif, utilisé uniquement si l'utilisateur est connecté).
 *                 example: 7
 *     responses:
 *       201:
 *         description: Billet enregistré avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Billet enregistré avec succès"
 *       400:
 *         description: Champs obligatoires manquants ou invalides.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Les champs obligatoires sont manquants"
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
router.post('/', async (req, res) => {
  const {
    prenom,
    nom,
    email,
    selectedCourses,
    selectedHotel,
    startDate,
    endDate,
    hotelStartDate,
    hotelEndDate,
    isVIP,
    totalPrice,
    userId,
  } = req.body;

  if (!prenom || !nom || !email || !totalPrice) {
    return res.status(400).json({ error: 'Les champs obligatoires sont manquants' });
  }

  try {
    let acheteurId = null;
    let utilisateurId = null;

    // Vérification si l'utilisateur est connecté
    if (userId) {
      utilisateurId = userId;
    } else {
      // Insertion de l'acheteur non inscrit et récupération de son ID
      const queryAcheteur = `
        INSERT INTO acheteurnoninscrit (prenom, nom, email)
        VALUES ($1, $2, $3) RETURNING id;
      `;
      const valuesAcheteur = [prenom, nom, email];
      const acheteurResult = await pool.query(queryAcheteur, valuesAcheteur);
      acheteurId = acheteurResult.rows[0].id;
    }

    // Récupération des informations des courses
    const courseNom = selectedCourses && selectedCourses.length > 0
      ? selectedCourses.map(course => course.nom).join(', ')
      : null;
    const courseDate = selectedCourses && selectedCourses.length > 0
      ? selectedCourses[0].date
      : null;

    // Insertion dans la table billet
    const queryBillet = `
      INSERT INTO billet (
        acheteur_id, utilisateur_id, course_nom, course_date, hotel_nom, date_debut_parking,
        date_fin_parking, date_debut_hotel, date_fin_hotel, is_vip, prix_total
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
    `;
    const valuesBillet = [
      acheteurId || null,
      utilisateurId || null,
      courseNom,
      courseDate,
      selectedHotel ? selectedHotel.nom : null,
      startDate,
      endDate,
      hotelStartDate,
      hotelEndDate,
      isVIP,
      totalPrice,
    ];

    await pool.query(queryBillet, valuesBillet);
    res.status(201).json({ message: 'Billet enregistré avec succès' });
  } catch (error) {
    console.error('Erreur lors de l’insertion dans la base de données:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
