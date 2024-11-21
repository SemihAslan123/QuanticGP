const express = require('express');
const router = express.Router();
const pool = require('../database/db'); // Chemin vers votre configuration de la base de données

// Route POST pour ajouter un billet
router.post('/', async (req, res) => {
    const {
        prenom,
        nom,
        email,
        selectedCourses,
        selectedHotel,
        startDate,
        endDate,
        isVIP,
        totalPrice,
    } = req.body;

    if (!prenom || !nom || !email || !totalPrice) {
        return res.status(400).json({ error: 'Les champs obligatoires sont manquants' });
    }

    try {
        // Insérer dans la table acheteurnoninscrit
        const queryAcheteur = `
            INSERT INTO acheteurnoninscrit (prenom, nom, email)
            VALUES ($1, $2, $3) RETURNING id;
        `;
        const valuesAcheteur = [prenom, nom, email];
        const acheteurResult = await pool.query(queryAcheteur, valuesAcheteur);

        const acheteurId = acheteurResult.rows[0].id;

        // Insérer dans la table billet
        const queryBillet = `
            INSERT INTO billet (
                acheteur_id, course_nom, hotel_nom, date_debut_parking,
                date_fin_parking, is_vip, prix_total
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7);
        `;
        const valuesBillet = [
            acheteurId,
            selectedCourses.map(course => course.nom).join(', '),
            selectedHotel ? selectedHotel.nom : null,
            startDate,
            endDate,
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
