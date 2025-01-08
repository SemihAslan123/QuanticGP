-- Suppression des tables dans l'ordre pour respecter les dépendances
DROP TABLE IF EXISTS LivreOr CASCADE;
DROP TABLE IF EXISTS billet CASCADE;
DROP TABLE IF EXISTS acheteurnoninscrit CASCADE;
DROP TABLE IF EXISTS servicePrestataire CASCADE;
DROP TABLE IF EXISTS reservation_stand CASCADE;
DROP TABLE IF EXISTS Stands CASCADE;
DROP TABLE IF EXISTS Utilisateurs CASCADE;
DROP TABLE IF EXISTS events CASCADE;


-- Création de la table event
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
-- Création de la table acheteurnoninscrit
CREATE TABLE acheteurnoninscrit (
                                    id SERIAL PRIMARY KEY,
                                    prenom VARCHAR(50) NOT NULL,
                                    nom VARCHAR(50) NOT NULL,
                                    email VARCHAR(100) NOT NULL
);

-- Création de la table Utilisateurs
CREATE TABLE Utilisateurs (
                              id_utilisateur SERIAL PRIMARY KEY,
                              nom_utilisateur VARCHAR(50),
                              prenom_utilisateur VARCHAR(50),
                              mail_utilisateur VARCHAR(50),
                              mot_de_passe VARCHAR(50),
                              type_utilisateur VARCHAR(50) CHECK (type_utilisateur IN ('admin', 'prestataire', 'client')),
                              image_prestataire TEXT
);

-- Création de la table Stands
CREATE TABLE Stands (
                        id_stand SERIAL PRIMARY KEY,
                        type_stand VARCHAR(50),
                        statut_stand VARCHAR(50),
                        numero_emplacement_stand INT,
                        prix_stand INT
);

-- Création de la table reservation_stand
CREATE TABLE reservation_stand (
                                   id_reservation SERIAL PRIMARY KEY,  -- Identifiant unique de la réservation
                                   id_utilisateur INT,                -- Le prestataire qui fait la demande de réservation
                                   id_stand INT,                      -- Le stand réservé
                                   date_reservation DATE NOT NULL,    -- La date de la réservation du stand
                                   heure_debut TIME NOT NULL,         -- L'heure de début de la réservation
                                   heure_fin TIME NOT NULL,           -- L'heure de fin de la réservation
                                   statut VARCHAR(20) DEFAULT 'en attente' CHECK (statut IN ('en attente', 'acceptée', 'refusée')),  -- Statut de la demande
                                   FOREIGN KEY (id_utilisateur) REFERENCES Utilisateurs(id_utilisateur),  -- Lien vers le prestataire
                                   FOREIGN KEY (id_stand) REFERENCES Stands(id_stand),                    -- Lien vers le stand
                                   CONSTRAINT check_dates CHECK (heure_debut < heure_fin)  -- Vérification que l'heure de début est avant l'heure de fin
);


-- Création de la table servicePrestataire
CREATE TABLE servicePrestataire (
                                    id_service SERIAL PRIMARY KEY,
                                    id_utilisateur INT,
                                    nom_service VARCHAR(50),
                                    type_service VARCHAR(50),
                                    description_service VARCHAR(100),
                                    date_service DATE,
                                    heure_service TIME,
                                    id_stand INT,
                                    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateurs(id_utilisateur),
                                    FOREIGN KEY (id_stand) REFERENCES Stands(id_stand)
);

-- Création de la table billet avec ajout des dates début et fin pour l'hôtel
CREATE TABLE billet (
                        id SERIAL PRIMARY KEY,
                        acheteur_id INT REFERENCES acheteurnoninscrit(id) ON DELETE CASCADE,
                        utilisateur_id INT REFERENCES Utilisateurs(id_utilisateur) ON DELETE CASCADE,
                        course_nom VARCHAR(100),
                        hotel_nom VARCHAR(100),
                        date_debut_parking DATE,
                        date_fin_parking DATE,
                        date_debut_hotel DATE,  -- Ajout de la date début pour l'hôtel
                        date_fin_hotel DATE,    -- Ajout de la date fin pour l'hôtel
                        is_vip BOOLEAN DEFAULT FALSE,
                        prix_total DECIMAL(10, 2) NOT NULL,
                        date_paiement TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table LivreOr
CREATE TABLE LivreOr (
                         id_avis SERIAL PRIMARY KEY,
                         id_utilisateur INT REFERENCES Utilisateurs(id_utilisateur) ON DELETE CASCADE,
                         commentaire TEXT NOT NULL,
                         date_avis TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         note INT CHECK (note BETWEEN 1 AND 5) -- Note sur 5
);


-- Insertion dans la table Utilisateurs
INSERT INTO Utilisateurs (id_utilisateur, nom_utilisateur, prenom_utilisateur, mail_utilisateur, mot_de_passe, type_utilisateur, image_prestataire)
VALUES
    (1, 'Dupont', 'Jean', 'jean.dupont@example.com', 'password123', 'admin', NULL),
    (2, 'Martin', 'Claire', 'claire.martin@example.com', 'password123', 'prestataire', '/assets/prestataire/prestataire1.jpg'),
    (3, 'Durand', 'Pierre', 'pierre.durand@example.com', 'password123', 'prestataire', '/assets/prestataire/prestataire2.jpg'),
    (4, 'Leclerc', 'Anne', 'anne.leclerc@example.com', 'password123', 'prestataire', '/assets/prestataire/prestataire3.jpg'),
    (5, 'Bernard', 'Sophie', 'sophie.bernard@example.com', 'password123', 'prestataire', '/assets/prestataire/prestataire4.jpg'),
    (6, 'Morel', 'Julien', 'julien.morel@example.com', 'password123', 'prestataire', '/assets/prestataire/prestataire5.jpg'),
    (7, 'Fabre', 'Lucie', 'lucie.fabre@example.com', 'password123', 'client', NULL),
    (8, 'Simon', 'Thomas', 'thomas.simon@example.com', 'password123', 'client', NULL),
    (9, 'Petit', 'Alice', 'alice.petit@example.com', 'password123', 'client', NULL);

-- Insertion dans la table Stands
INSERT INTO Stands (type_stand, statut_stand, numero_emplacement_stand, prix_stand)
VALUES
    ('Restauration', 'Disponible', 1, 100), -- Ajout du stand ID 1
    ('Sécurité', 'Disponible', 2, 150), -- Ajout du stand ID 2
    ('Nettoyage', 'Disponible', 3, 120), -- Ajout du stand ID 3
    ('Vente souvenirs', 'Disponible', 202, 150); -- Stand déjà existant dans votre script

-- Insertion dans la table servicePrestataire
INSERT INTO servicePrestataire (id_utilisateur, nom_service, type_service, description_service, date_service, heure_service, id_stand)
VALUES
    (2, 'Restauration', 'Food', 'Service de restauration rapide', '2024-11-20', '12:00', 1),
    (3, 'Sécurité', 'Service', 'Surveillance du site', '2024-11-21', '09:00', 2),
    (4, 'Nettoyage', 'Maintenance', 'Nettoyage des stands', '2024-11-20', '14:00', 3),
    (5, 'Vente de produits', 'Merchandising', 'Vente de produits dérivés', '2024-11-21', '10:00', 2),
    (6, 'Assistance client', 'Service', 'Aide et informations aux visiteurs', '2024-11-22', '11:00', 1);

-- Insertion dans la table billet (Exemple)
-- Un billet acheté par un utilisateur inscrit, avec réservation de l'hôtel
INSERT INTO billet (utilisateur_id, course_nom, hotel_nom, date_debut_parking, date_fin_parking, date_debut_hotel, date_fin_hotel, prix_total)
VALUES
    (7, 'Course A', 'Hotel ABC', '2024-12-01', '2024-12-05', '2024-12-01', '2024-12-05', 120.50);

-- Exemple d'insertion avec un autre utilisateur et un billet sans réservation d'hôtel
INSERT INTO billet (utilisateur_id, course_nom, prix_total)
VALUES (8, 'Course B', 150.00);


INSERT INTO reservation_stand (id_utilisateur, id_stand, date_reservation, heure_debut, heure_fin, statut)
VALUES
    (2, 1, '2024-12-05', '08:00', '12:00', 'en attente'), -- Réservation d'un stand de restauration par Jean Dupont
    (3, 2, '2024-12-06', '09:00', '13:00', 'acceptée'), -- Réservation d'un stand de sécurité par Claire Martin
    (4, 3, '2024-12-07', '10:00', '14:00', 'en attente'), -- Réservation d'un stand de nettoyage par Pierre Durand
    (5, 4, '2024-12-05', '11:00', '15:00', 'acceptée'), -- Réservation d'un stand de vente de produits par Anne Leclerc
    (6, 1, '2024-12-08', '12:00', '16:00', 'refusée');

-- Insertion d'avis dans la table LivreOr
INSERT INTO LivreOr (id_utilisateur, commentaire, note)
VALUES
    (1, 'Très bon événement, bien organisé !', 5),
    (2, 'Bonne ambiance, mais l’organisation pourrait être améliorée.', 3),
    (3, 'Excellente expérience, je reviendrai l’année prochaine.', 4);
