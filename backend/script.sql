-- 1. Trigger sur INSERT : Marquer l'emplacement comme "RÉSERVÉ"
CREATE OR REPLACE FUNCTION set_emplacement_reserve()
    RETURNS trigger AS $$
BEGIN
    IF NEW.id_emplacement IS NOT NULL THEN
        UPDATE emplacements_prestataires
        SET statut = 'RÉSERVÉ'
        WHERE id_emplacement = NEW.id_emplacement;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_emplacement_reserve
    AFTER INSERT ON servicePrestataire
    FOR EACH ROW
    WHEN (NEW.id_emplacement IS NOT NULL)
EXECUTE FUNCTION set_emplacement_reserve();


-- 2. Trigger sur DELETE : Remettre l'emplacement à "LIBRE" s'il n'est plus occupé
CREATE OR REPLACE FUNCTION reset_emplacement_status()
    RETURNS trigger AS $$
BEGIN
    IF OLD.id_emplacement IS NOT NULL THEN
        -- Si aucun autre service n'occupe cet emplacement
        IF NOT EXISTS (
            SELECT 1 FROM servicePrestataire WHERE id_emplacement = OLD.id_emplacement
        ) THEN
            UPDATE emplacements_prestataires
            SET statut = 'LIBRE'
            WHERE id_emplacement = OLD.id_emplacement;
        END IF;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reset_emplacement_status
    AFTER DELETE ON servicePrestataire
    FOR EACH ROW
    WHEN (OLD.id_emplacement IS NOT NULL)
EXECUTE FUNCTION reset_emplacement_status();


-- 3. Trigger sur UPDATE de id_emplacement : gérer le changement d'affectation
CREATE OR REPLACE FUNCTION update_emplacement_status_on_service_update()
    RETURNS trigger AS $$
BEGIN
    -- Si l'emplacement a changé
    IF NEW.id_emplacement <> OLD.id_emplacement THEN
        -- Ancien emplacement : le remettre à LIBRE s'il n'est plus occupé
        IF OLD.id_emplacement IS NOT NULL THEN
            IF NOT EXISTS (
                SELECT 1 FROM servicePrestataire
                WHERE id_emplacement = OLD.id_emplacement
                  AND id_service <> OLD.id_service
            ) THEN
                UPDATE emplacements_prestataires
                SET statut = 'LIBRE'
                WHERE id_emplacement = OLD.id_emplacement;
            END IF;
        END IF;

        -- Nouvel emplacement : le marquer comme RÉSERVÉ
        IF NEW.id_emplacement IS NOT NULL THEN
            UPDATE emplacements_prestataires
            SET statut = 'RÉSERVÉ'
            WHERE id_emplacement = NEW.id_emplacement;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_emplacement_status
    AFTER UPDATE OF id_emplacement ON servicePrestataire
    FOR EACH ROW
EXECUTE FUNCTION update_emplacement_status_on_service_update();

-- ===================================================================================
-- ==================================== DROP TABLE ===================================
-- ===================================================================================


DROP TABLE IF EXISTS emplacements_prestataires CASCADE;
DROP TABLE IF EXISTS liste_activite_client CASCADE;
DROP TABLE IF EXISTS LivreOr CASCADE;
DROP TABLE IF EXISTS billet CASCADE;
DROP TABLE IF EXISTS servicePrestataire CASCADE;
DROP TABLE IF EXISTS Utilisateurs CASCADE;
DROP TABLE IF EXISTS acheteurnoninscrit CASCADE;
DROP TABLE IF EXISTS events CASCADE;


-- ===============================================================================================
-- ==================================== REALISATION DES TABLES ===================================
-- ===============================================================================================


CREATE TABLE events (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        date DATE NOT NULL,
                        heure_debut TIME NOT NULL,
                        heure_fin TIME NOT NULL,
                        prix DECIMAL(10, 2) NOT NULL,
                        description TEXT NOT NULL,
                        image TEXT NOT NULL
);


CREATE TABLE acheteurnoninscrit (
                                    id SERIAL PRIMARY KEY,
                                    prenom VARCHAR(50) NOT NULL,
                                    nom VARCHAR(50) NOT NULL,
                                    email VARCHAR(100) NOT NULL
);


CREATE TABLE Utilisateurs (
                              id_utilisateur SERIAL PRIMARY KEY,
                              nom_utilisateur VARCHAR(50),
                              prenom_utilisateur VARCHAR(50),
                              mail_utilisateur VARCHAR(50),
                              mot_de_passe VARCHAR(50),
                              type_utilisateur VARCHAR(50) CHECK (type_utilisateur IN ('organisateur', 'prestataire', 'client'))
);


CREATE TABLE emplacements_prestataires (
                                           id_emplacement SERIAL PRIMARY KEY,
                                           nom_emplacement VARCHAR(255) NOT NULL,
                                           coordonnees_svg VARCHAR(255) NOT NULL,
                                           utilisateur_id INT DEFAULT NULL,
                                           statut VARCHAR(10) DEFAULT 'libre' CHECK (statut IN ('LIBRE','EN ATTENTE', 'RÉSERVÉ')),
                                           date_reservation TIMESTAMP DEFAULT NULL,
                                           description TEXT DEFAULT NULL,
                                           FOREIGN KEY (utilisateur_id) REFERENCES Utilisateurs(id_utilisateur)
);


CREATE TABLE servicePrestataire (
                                    id_service SERIAL PRIMARY KEY,
                                    id_utilisateur INT NOT NULL,
                                    id_emplacement INT,  -- lien optionnel vers un emplacement
                                    nom_service VARCHAR(50),
                                    type_service VARCHAR(50),
                                    presentation_service VARCHAR(255),
                                    description_service VARCHAR(255),
                                    image_prestataire TEXT,
                                    date_service DATE,
                                    heure_service TIME,
                                    visibilite BOOLEAN,
                                    statut_service_prestataire VARCHAR(50),
                                    prix_moyen VARCHAR(15) CHECK (prix_moyen IN ('0-10€', '10-20€', '20€-30€', '30€+', 'Non spécifié')),
                                    carte_banquaire VARCHAR(20) CHECK (carte_banquaire IN ('Acceptée', 'Refusée', 'Non spécifié')),
                                    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateurs(id_utilisateur) ON DELETE CASCADE,
                                    FOREIGN KEY (id_emplacement) REFERENCES emplacements_prestataires(id_emplacement) ON DELETE SET NULL
);


CREATE TABLE billet (
                        id SERIAL PRIMARY KEY,
                        acheteur_id INT REFERENCES acheteurnoninscrit(id) ON DELETE CASCADE,
                        utilisateur_id INT REFERENCES Utilisateurs(id_utilisateur) ON DELETE CASCADE,
                        course_nom VARCHAR(100),
                        course_date DATE,
                        hotel_nom VARCHAR(100),
                        date_debut_parking DATE,
                        date_fin_parking DATE,
                        date_debut_hotel DATE,
                        date_fin_hotel DATE,
                        is_vip BOOLEAN DEFAULT FALSE,
                        prix_total DECIMAL(10, 2) NOT NULL,
                        date_paiement TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE LivreOr (
                         id_avis SERIAL PRIMARY KEY,
                         id_utilisateur INT REFERENCES Utilisateurs(id_utilisateur) ON DELETE CASCADE,
                         commentaire TEXT NOT NULL,
                         date_avis TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         note INT CHECK (note BETWEEN 1 AND 5)
);


CREATE TABLE liste_activite_client (
                                       id SERIAL PRIMARY KEY,
                                       id_utilisateur INT,
                                       id_event INT,
                                       date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       FOREIGN KEY (id_utilisateur) REFERENCES Utilisateurs(id_utilisateur) ON DELETE CASCADE,
                                       FOREIGN KEY (id_event) REFERENCES events(id) ON DELETE CASCADE
);


-- ==============================================================================================
-- ==================================== INSERTION DES DONNEES ===================================
-- ==============================================================================================


INSERT INTO events (name, date, heure_debut, heure_fin, prix, description, image)
VALUES
    ('Karting enfant', '2025-01-10', '10:00', '11:00', 40.00, 'Course de karting pour enfants', '/assets/events/karting_enfant.jpg'),
    ('Simulateur F1', '2025-01-10', '11:30', '12:30', 25.00, 'Expérience immersive dans un simulateur F1', '/assets/events/simulateur_f1.jpg'),
    ('Rencontre avec Charles Leclerc', '2025-01-10', '09:00', '10:00', 15.00, 'Rencontre exclusive avec Charles Leclerc', '/assets/events/rencontre_leclerc.jpg'),
    ('Rencontre avec Max Verstappen', '2025-01-10', '10:00', '11:00', 15.00, 'Rencontre exclusive avec Max Verstappen', '/assets/events/rencontre_verstappen.jpg'),
    ('Exposition F1', '2025-01-10', '13:00', '18:00', 10.00, 'Exposition des voitures de F1', '/assets/events/exposition_f1.jpg');



INSERT INTO Utilisateurs (nom_utilisateur, prenom_utilisateur, mail_utilisateur, mot_de_passe, type_utilisateur)
VALUES
    ('Dupont', 'Jean', 'jean.dupont@example.com', 'password123', 'organisateur'),
    ('Martin', 'Claire', 'claire.martin@example.com', 'password123', 'prestataire'),
    ('Durand', 'Pierre', 'pierre.durand@example.com', 'password123', 'prestataire'),
    ('Leclerc', 'Anne', 'anne.leclerc@example.com', 'password123', 'prestataire'),
    ('Bernard', 'Sophie', 'sophie.bernard@example.com', 'password123', 'prestataire'),
    ('Morel', 'Julien', 'julien.morel@example.com', 'password123', 'prestataire'),
    ('Fabre', 'Lucie', 'lucie.fabre@example.com', 'password123', 'client'),
    ('Simon', 'Thomas', 'thomas.simon@example.com', 'password123', 'client'),
    ('Petit', 'Alice', 'alice.petit@example.com', 'password123', 'client');

INSERT INTO emplacements_prestataires (nom_emplacement, coordonnees_svg, description, statut)
VALUES
    ('Zone A - Emplacement n°1', 'm 478.86837,453.3347 -6.49541,84.88826 26.20561,3.13572 6.49541,-84.66429 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone A - Emplacement n°2', 'm 470.58112,552.33368 -6.71938,84.4403 25.98163,3.13572 6.49541,-84.44031 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone A - Emplacement n°3', 'm 462.51786,648.19694 -6.27143,84.44031 25.75765,3.80765 6.49541,-84.21633 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone A - Emplacement n°4', 'm 453.55868,749.6597 1.11989,86.00816 25.53368,1.1199 1.34387,-84.66429 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone A - Emplacement n°5', 'm 452.2148,848.21072 10.975,86.00816 23.29388,-2.91173 -8.95919,-82.87245 -23.51786,0.67194 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone B - Emplacement n°1', 'm 425.33725,1003.6526 19.26224,-17.24647 60.69847,59.35457 -18.36633,17.6944 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone B - Emplacement n°2', 'm 501.26633,1075.774 c 0,-1.7919 10.975,-23.0699 10.975,-23.0699 l 77.9449,36.2847 -11.87092,21.502 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone B - Emplacement n°3', 'm 597.80153,1091.2286 0.89592,25.5337 85.78419,-3.5837 -0.22398,-23.9658 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone B - Emplacement n°4', 'm 661.41174,1145.4316 28.89337,28.6694 41.43622,-42.7801 -27.77347,-28.8933 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone B - Emplacement n°5', 'm 594.8898,1157.9745 6.27143,40.0923 59.13061,-8.5112 -5.15153,-38.3005 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone B - Emplacement n°6', 'm 524.56021,1150.5832 -4.4796,38.0765 58.90664,6.4954 4.47959,-38.7485 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone C - Emplacement n°1', 'm 778.58374,842.56824 29.14145,25.97391 38.32736,-46.87974 -29.45822,-24.07338 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone C - Emplacement n°2', 'm 818.17811,783.65182 38.32735,12.03668 19.0053,-58.28291 -38.64411,-9.81941 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone C - Emplacement n°3', 'm 833.6991,676.58863 4.43457,40.86139 59.23318,-8.86913 -4.11781,-36.74358 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone C - Emplacement n°4', 'm 908.13652,672.47082 1.58378,38.64411 57.6494,-2.8508 -1.26702,-38.64411 z', 'Emplacement réservé aux prestataires et soumis à réservation', 'LIBRE'),
    ('Zone C - Emplacement n°5', 'm 984.15772,671.83731 -4.43457,39.91113 58.91645,7.60211 4.7513,-38.6441 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone C - Emplacement n°6', 'm 1058.5951,685.77453 -8.8691,38.32735 58.5997,13.62046 9.1859,-39.91112 -61.1337,-12.35345 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone C - Emplacement n°7', 'm 1128.2812,711.74844 22.1729,26.29066 -28.1912,119.09987 -25.3404,-27.55768 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone D - Emplacement n°1', 'm 1162.4908,857.13897 25.6571,5.06808 15.2043,-91.54219 -23.7567,-2.53404 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone D - Emplacement n°2', 'm 1176.7447,751.50119 60.817,5.85996 3.1675,-39.43599 -58.5996,-4.9097 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone D - Emplacement n°3', 'm 1253.3994,719.82569 c 0,0 0.7919,40.22788 2.5341,40.22788 1.7421,0 61.1337,-3.80106 60.5002,-3.95944 -0.6335,-0.15837 -2.2173,-41.17814 -2.2173,-41.17814 l -59.7083,4.11781 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone D - Emplacement n°4', 'm 1326.4115,711.59006 c 0,0 16.6296,35.63493 17.4215,35.95169 0.7919,0.31675 54.4819,-25.18202 54.4819,-25.18202 l -17.4216,-35.79332 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone D - Emplacement n°5', 'm 1392.4549,680.23132 24.2317,31.99225 46.8798,-34.52629 -22.9648,-32.30901 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone D - Emplacement n°6', 'm 1442.3438,712.6987 -12.5118,95.02649 42.6035,-1.58377 11.8783,-93.91785 -40.703,0.63351 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone D - Emplacement n°7', 'm 1432.2076,823.24619 40.8614,-0.79189 -11.7199,94.07623 -44.1873,1.4254 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone D - Emplacement n°8', 'm 1388.9706,931.41801 0.6335,55.27375 69.8445,-2.69242 -1.2671,-55.27374 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone D - Emplacement n°9', 'm 1304.397,933.47692 1.267,56.69914 71.2699,-3.00917 -1.5838,-56.85752 -72.2201,2.53404 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone E - Emplacement n°1', 'm 1565.5615,914.31324 9.8194,48.78027 -70.7948,13.46209 -8.8691,-47.83 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone E - Emplacement n°2', 'm 1509.971,871.55132 42.2868,-8.394 -2.8508,-95.0265 -40.5447,7.12699 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone E - Emplacement n°3', 'm 1508.8623,763.06274 c 6.8103,-2.21728 43.3955,-8.55238 43.3955,-8.55238 l -1.9006,-94.23461 -42.1284,8.23563 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone E - Emplacement n°4', 'm 1499.6764,615.77168 c 0,0 23.5983,36.11006 24.2318,36.42682 0.6335,0.31675 86.6325,-36.42682 86.1574,-38.16898 -0.4752,-1.74215 -20.9059,-35.63493 -22.0145,-35.63493 -1.1087,0 -88.3747,37.37709 -88.3747,37.37709 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone E - Emplacement n°5', 'm 1602.4634,569.68383 c 0,0 23.5983,33.41765 24.2318,33.25927 0.6335,-0.15838 49.2554,-35.79331 49.2554,-35.79331 l -23.7566,-33.25927 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone E - Emplacement n°6', 'm 1643.8,607.37767 c 0.6335,-0.31675 38.8024,-14.0956 38.8024,-14.0956 l 21.381,57.80779 -38.8025,14.57073 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone E - Emplacement n°7', 'm 1666.7647,677.85565 15.6794,59.07481 40.0695,-10.6113 -15.6794,-58.44129 -38.8025,9.66103 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE'),
    ('Zone E - Emplacement n°8', 'm 1682.4441,750.7093 c 0,0 -2.8508,60.97533 -1.9006,60.97533 0.9503,0 41.0198,2.8508 41.0198,2.8508 l 2.3757,-62.08398 z', 'Emplacement réservé aux prestataires et soumis à réservation.', 'LIBRE');


INSERT INTO servicePrestataire (id_utilisateur, id_emplacement, nom_service, type_service, presentation_service, description_service, image_prestataire, date_service, heure_service, visibilite, statut_service_prestataire, prix_moyen, carte_banquaire)
VALUES
    (2, 1, '🥩 Grill’n’Go', 'Restauration', 'Barbecue gourmet avec burgers et hot-dogs maison. Produits frais et locaux. Options végétariennes et sans viande disponibles.', 'Service de restauration rapide', NULL, '2024-11-20', '12:00', true, 'CONFIRMÉ', '0-10€', 'Acceptée'),
    (3, 2, '🍕 PitStop Pizza', 'Restauration', '', 'Pizzas artisanales préparées sur place dans un four mobile. Choix varié de garnitures, avec options végétariennes. Idéal pour un repas rapide entre deux tours.', NULL, '2024-11-21', '09:00', false, 'CONFIRMÉ', '10-20€', 'Acceptée'),
    (4, 3, '🌮 TurboTacos', 'Restauration', '', 'Tacos frais et savoureux avec des ingrédients locaux. Recettes personnalisables selon vos goûts.',NULL, '2024-11-20', '14:00', true, 'CONFIRMÉ', '0-10€', 'Refusée'),
    (5, 4, '🛍️ Racing Memorabilia', 'Merchandising', '', 'Produits officiels des écuries de F1 : casquettes, posters et accessoires. Collection spéciale limitée.', NULL, '2024-11-21', '10:00', false, 'CONFIRMÉ', '10-20€', 'Acceptée'),
    (6, 5, '👕 F1 Style', 'Merchandising', '', 'Vêtements aux couleurs des équipes : t-shirts, vestes et casquettes. Gamme exclusive pour enfants et adultes. Qualité premium.', NULL, '2024-11-22', '11:00', true, 'CONFIRMÉ', '20€-30€', 'Acceptée');





INSERT INTO LivreOr (id_utilisateur, commentaire, note)
VALUES
    (7, 'Très bon service et expérience générale agréable. Je recommande!', 5),
    (8, 'Le service était correct, mais lattente était un peu longue.', 3),
    (9, 'Excellente organisation, je reviendrai à coup sûr pour dautres événements!', 4),
    (2, 'Le prestataire a été ponctuel et a fourni un service de qualité.', 5),
    (3, 'Très satisfait de la prestation, à recommander pour des événements similaires.', 4),
    (4, 'Le service était bon mais quelques améliorations sont possibles.', 3),
    (5, 'Un peu déçu par la qualité du service, je mattendais à mieux.', 2),
    (6, 'Bon service, mais il manque un peu dinteraction avec les visiteurs.', 3);


INSERT INTO liste_activite_client (id_utilisateur, id_event)
VALUES
    (7, 1),
    (7, 2),
    (7, 3),
    (8, 1),
    (8, 2),
    (8, 3),
    (8, 4),
    (9, 3),
    (9, 4),
    (9, 5),
    (7, 4),
    (9, 1);


select * from emplacements_prestataires;
UPDATE emplacements_prestataires
SET statut = 'RÉSERVÉ'
WHERE utilisateur_id = 2;

select * from servicePrestataire;