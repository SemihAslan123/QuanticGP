-- Suppression des tables dans l'ordre pour respecter les dépendances
DROP TABLE IF EXISTS billet CASCADE;
DROP TABLE IF EXISTS acheteurnoninscrit CASCADE;
DROP TABLE IF EXISTS servicePrestataire CASCADE;
DROP TABLE IF EXISTS Stands CASCADE;
DROP TABLE IF EXISTS Utilisateurs CASCADE;
DROP TABLE IF EXISTS events CASCADE;

-- Création de la table events
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
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

-- Création de la table billet
CREATE TABLE billet (
    id SERIAL PRIMARY KEY,
    acheteur_id INT REFERENCES acheteurnoninscrit(id) ON DELETE CASCADE,
    utilisateur_id INT REFERENCES Utilisateurs(id_utilisateur) ON DELETE CASCADE,
    course_nom VARCHAR(100),
    hotel_nom VARCHAR(100),
    date_debut_parking DATE,
    date_fin_parking DATE,
    is_vip BOOLEAN DEFAULT FALSE,
    prix_total DECIMAL(10, 2) NOT NULL,
    date_paiement TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion dans la table Utilisateurs
INSERT INTO Utilisateurs (nom_utilisateur, prenom_utilisateur, mail_utilisateur, mot_de_passe, type_utilisateur, image_prestataire)
VALUES
    ('Dupont', 'Jean', 'jean.dupont@example.com', 'password123', 'admin', NULL),
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
-- Un billet acheté par un utilisateur inscrit
INSERT INTO billet (utilisateur_id, course_nom, prix_total)
VALUES (7, 'Course A', 120.50);
