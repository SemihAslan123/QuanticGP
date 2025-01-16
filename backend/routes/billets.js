const express = require('express');
const router = express.Router();
const pool = require('../database/db'); // Chemin vers votre configuration de la base de données

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
        hotelStartDate, // Nouvelle donnée ajoutée
        hotelEndDate,   // Nouvelle donnée ajoutée
        isVIP,
        totalPrice,
        userId,  // Ajout de userId dans le corps de la requête
    } = req.body;

    if (!prenom || !nom || !email || !totalPrice) {
        return res.status(400).json({ error: 'Les champs obligatoires sont manquants' });
    }

    try {
        let acheteurId = null;
        let utilisateurId = null;

        // Vérification si l'utilisateur est connecté
        if (userId) {
            // Si l'utilisateur est inscrit, on utilise son ID et acheteurId reste nul
            utilisateurId = userId;
        } else {
            // Sinon, on insère l'acheteur non inscrit et on récupère son ID
            const queryAcheteur = `
                INSERT INTO acheteurnoninscrit (prenom, nom, email)
                VALUES ($1, $2, $3) RETURNING id;
            `;
            const valuesAcheteur = [prenom, nom, email];
            const acheteurResult = await pool.query(queryAcheteur, valuesAcheteur);
            acheteurId = acheteurResult.rows[0].id; // L'ID de l'acheteur non inscrit
        }

        // Insertion dans la table billet
        const queryBillet = `
            INSERT INTO billet (
                acheteur_id, utilisateur_id, course_nom, hotel_nom, date_debut_parking,
                date_fin_parking, date_debut_hotel, date_fin_hotel, is_vip, prix_total
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
        `;
        const valuesBillet = [
            acheteurId || null,   // Si l'utilisateur est connecté, acheteurId est null
            utilisateurId || null,  // Si l'acheteur est non inscrit, utilisateurId est null
            selectedCourses.map(course => course.nom).join(', '),
            selectedHotel ? selectedHotel.nom : null,
            startDate,
            endDate,
            hotelStartDate,   // Ajout des dates d'hôtel
            hotelEndDate,     // Ajout des dates d'hôtel
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
