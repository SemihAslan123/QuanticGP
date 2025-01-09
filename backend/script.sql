-- Suppression des tables dans l'ordre pour respecter les dépendances
DROP TABLE IF EXISTS liste_activite_client CASCADE;
DROP TABLE IF EXISTS LivreOr CASCADE;
DROP TABLE IF EXISTS billet CASCADE;
DROP TABLE IF EXISTS acheteurnoninscrit CASCADE;
DROP TABLE IF EXISTS servicePrestataire CASCADE;
DROP TABLE IF EXISTS reservation_stand CASCADE;
DROP TABLE IF EXISTS Stands CASCADE;
DROP TABLE IF EXISTS Utilisateurs CASCADE;
DROP TABLE IF EXISTS events CASCADE;

-- Création de la table events
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
    type_utilisateur VARCHAR(50) CHECK (type_utilisateur IN ('organisateur', 'prestataire', 'client')),
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
    id_reservation SERIAL PRIMARY KEY,
    id_utilisateur INT,
    id_stand INT,
    date_reservation DATE NOT NULL,
    heure_debut TIME NOT NULL,
    heure_fin TIME NOT NULL,
    statut VARCHAR(20) DEFAULT 'en attente' CHECK (statut IN ('en attente', 'acceptée', 'refusée')),
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateurs(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_stand) REFERENCES Stands(id_stand) ON DELETE CASCADE,
    CONSTRAINT check_dates CHECK (heure_debut < heure_fin)
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
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateurs(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_stand) REFERENCES Stands(id_stand) ON DELETE CASCADE
);

-- Création de la table billet
CREATE TABLE billet (
    id SERIAL PRIMARY KEY,
    acheteur_id INT REFERENCES acheteurnoninscrit(id) ON DELETE CASCADE,
    utilisateur_id INT REFERENCES Utilisateurs(id_utilisateur) ON DELETE CASCADE,
    course_nom VARCHAR(100),
    hotel_nom VARCHAR(100),
    date_debut_parking DATE,
    date_fin_parking DATE,
    date_debut_hotel DATE,
    date_fin_hotel DATE,
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
    note INT CHECK (note BETWEEN 1 AND 5)
);

-- Création de la table liste_activite_client
CREATE TABLE liste_activite_client (
    id SERIAL PRIMARY KEY,                  -- Identifiant unique de la relation
    id_utilisateur INT,                     -- Clé étrangère vers la table Utilisateurs
    id_event INT,                           -- Clé étrangère vers la table events
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Date d'inscription de l'utilisateur à l'activité
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateurs(id_utilisateur) ON DELETE CASCADE, -- Lien avec l'utilisateur
    FOREIGN KEY (id_event) REFERENCES events(id) ON DELETE CASCADE -- Lien avec l'activité
);

-- Insertion dans la table Utilisateurs
INSERT INTO Utilisateurs (nom_utilisateur, prenom_utilisateur, mail_utilisateur, mot_de_passe, type_utilisateur, image_prestataire)
VALUES
    ('Dupont', 'Jean', 'jean.dupont@example.com', 'password123', 'organisateur', NULL),
    ('Martin', 'Claire', 'claire.martin@example.com', 'password123', 'prestataire', '/assets/prestataire/prestataire1.jpg'),
    ('Durand', 'Pierre', 'pierre.durand@example.com', 'password123', 'prestataire', '/assets/prestataire/prestataire2.jpg'),
    ('Leclerc', 'Anne', 'anne.leclerc@example.com', 'password123', 'prestataire', '/assets/prestataire/prestataire3.jpg'),
    ('Bernard', 'Sophie', 'sophie.bernard@example.com', 'password123', 'prestataire', '/assets/prestataire/prestataire4.jpg'),
    ('Morel', 'Julien', 'julien.morel@example.com', 'password123', 'prestataire', '/assets/prestataire/prestataire5.jpg'),
    ('Fabre', 'Lucie', 'lucie.fabre@example.com', 'password123', 'client', NULL),
    ('Simon', 'Thomas', 'thomas.simon@example.com', 'password123', 'client', NULL),
    ('Petit', 'Alice', 'alice.petit@example.com', 'password123', 'client', NULL);

-- Insertion dans la table Stands
INSERT INTO Stands (type_stand, statut_stand, numero_emplacement_stand, prix_stand)
VALUES
    ('Restauration', 'Disponible', 1, 100),
    ('Sécurité', 'Disponible', 2, 150),
    ('Nettoyage', 'Disponible', 3, 120),
    ('Vente souvenirs', 'Disponible', 202, 150);

-- Insertion dans la table servicePrestataire
INSERT INTO servicePrestataire (id_utilisateur, nom_service, type_service, description_service, date_service, heure_service, id_stand)
VALUES
    (2, 'Restauration', 'Food', 'Service de restauration rapide', '2024-11-20', '12:00', 1),
    (3, 'Sécurité', 'Service', 'Surveillance du site', '2024-11-21', '09:00', 2),
    (4, 'Nettoyage', 'Maintenance', 'Nettoyage des stands', '2024-11-20', '14:00', 3),
    (5, 'Vente de produits', 'Merchandising', 'Vente de produits dérivés', '2024-11-21', '10:00', 2),
    (6, 'Assistance client', 'Service', 'Aide et informations aux visiteurs', '2024-11-22', '11:00', 1);

-- Insertion dans la table billet
INSERT INTO billet (utilisateur_id, course_nom, hotel_nom, date_debut_parking, date_fin_parking, date_debut_hotel, date_fin_hotel, prix_total)
VALUES
    (7, 'Course A', 'Hotel ABC', '2024-12-01', '2024-12-05', '2024-12-01', '2024-12-05', 120.50),
    (8, 'Course B', NULL, NULL, NULL, NULL, NULL, 150.00);

-- Insertion dans la table reservation_stand
INSERT INTO reservation_stand (id_utilisateur, id_stand, date_reservation, heure_debut, heure_fin, statut)
VALUES
    (2, 1, '2024-12-05', '08:00', '12:00', 'en attente'),
    (3, 2, '2024-12-06', '09:00', '13:00', 'acceptée'),
    (4, 3, '2024-12-07', '10:00', '14:00', 'en attente'),
    (5, 4, '2024-12-05', '11:00', '15:00', 'acceptée'),
    (6, 1, '2024-12-08', '12:00', '16:00', 'refusée');


-- Insertion dans la table LivreOr
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

-- Insertion dans la table events
INSERT INTO events (name, date, heure_debut, heure_fin, prix, description, image)
VALUES
    ('Karting enfant', '2025-01-10', '10:00', '11:00', 40.00, 'Course de karting pour enfants', '/assets/events/karting_enfant.jpg'),
    ('Simulateur F1', '2025-01-10', '11:30', '12:30', 25.00, 'Expérience immersive dans un simulateur F1', '/assets/events/simulateur_f1.jpg'),
    ('Rencontre avec Charles Leclerc', '2025-01-10', '09:00', '10:00', 15.00, 'Rencontre exclusive avec Charles Leclerc', '/assets/events/rencontre_leclerc.jpg'),
    ('Rencontre avec Max Verstappen', '2025-01-10', '10:00', '11:00', 15.00, 'Rencontre exclusive avec Max Verstappen', '/assets/events/rencontre_verstappen.jpg'),
    ('Exposition F1', '2025-01-10', '13:00', '18:00', 10.00, 'Exposition des voitures de F1', '/assets/events/exposition_f1.jpg');


-- Insertion dans la table liste_activite_client avec une répartition variée
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
