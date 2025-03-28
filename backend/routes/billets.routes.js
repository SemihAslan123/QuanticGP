const express = require('express');
const router = express.Router();
const pool = require('../db'); // Chemin vers votre configuration de la base de données

/**
 * @swagger
 * /billets:
 *   post:
 *     summary: Ajouter un billet
 *     description: Cette route permet de créer un billet pour un utilisateur ou un acheteur non inscrit.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prenom:
 *                 type: string
 *                 description: Prénom de l'acheteur.
 *               nom:
 *                 type: string
 *                 description: Nom de l'acheteur.
 *               email:
 *                 type: string
 *                 description: Email de l'acheteur.
 *               selectedCourses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nom:
 *                       type: string
 *                       description: Nom du cours sélectionné.
 *                     date:
 *                       type: string
 *                       description: Date du cours (format YYYY-MM-DD).
 *               selectedHotel:
 *                 type: object
 *                 properties:
 *                   nom:
 *                     type: string
 *                     description: Nom de l'hôtel sélectionné.
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Date de début du parking.
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Date de fin du parking.
 *               hotelStartDate:
 *                 type: string
 *                 format: date
 *                 description: Date de début de l'hôtel.
 *               hotelEndDate:
 *                 type: string
 *                 format: date
 *                 description: Date de fin de l'hôtel.
 *               isVIP:
 *                 type: boolean
 *                 description: Indicateur si le billet est VIP.
 *               totalPrice:
 *                 type: number
 *                 format: float
 *                 description: Prix total du billet.
 *               userId:
 *                 type: integer
 *                 description: ID de l'utilisateur connecté (optionnel).
 *     responses:
 *       201:
 *         description: Billet enregistré avec succès.
 *       400:
 *         description: Champs obligatoires manquants ou invalides.
 *       500:
 *         description: Erreur interne du serveur.
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
            // Insère l'acheteur non inscrit et récupère son ID
            const queryAcheteur = `
        INSERT INTO acheteurnoninscrit (prenom, nom, email)
        VALUES ($1, $2, $3) RETURNING id;
      `;
            const valuesAcheteur = [prenom, nom, email];
            const acheteurResult = await pool.query(queryAcheteur, valuesAcheteur);
            acheteurId = acheteurResult.rows[0].id;
        }

        // Récupération des informations des courses
        const courseNom = selectedCourses.map(course => course.nom).join(', ');
        const courseDate = selectedCourses.length ? selectedCourses[0].date : null;

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
