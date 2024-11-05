-- Suppression des tables si elles existent déjà (ordre pour éviter les problèmes de dépendances)
DROP TABLE IF EXISTS clientRencontre;
DROP TABLE IF EXISTS prestataireReservationStand;
DROP TABLE IF EXISTS Recompense;
DROP TABLE IF EXISTS Pilote;
DROP TABLE IF EXISTS ReservationServices;
DROP TABLE IF EXISTS ChambreHotel;
DROP TABLE IF EXISTS Places;
DROP TABLE IF EXISTS FAQ;
DROP TABLE IF EXISTS Hotels;
DROP TABLE IF EXISTS PlaceParking;
DROP TABLE IF EXISTS Stands;
DROP TABLE IF EXISTS BilletCourses;
DROP TABLE IF EXISTS Courses;
DROP TABLE IF EXISTS Billets;
DROP TABLE IF EXISTS AcheteursAnonymes;
DROP TABLE IF EXISTS Utilisateurs;

-- Création de la table Utilisateurs
CREATE TABLE Utilisateurs (
   id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
   nom_utilisateur VARCHAR(50),
   prenom_utilisateur VARCHAR(50),
   mail_utilisateur VARCHAR(50),
   mot_de_passe VARCHAR(50),
   type_utilisateur VARCHAR(50)
);

-- Création de la table AcheteursAnonymes
CREATE TABLE AcheteursAnonymes (
   id_acheteur INT AUTO_INCREMENT PRIMARY KEY,
   nom_acheteur VARCHAR(50),
   prenom_acheteur VARCHAR(50),
   mail_acheteur VARCHAR(50)
);

-- Création de la table Billets
CREATE TABLE Billets (
   id_billet INT AUTO_INCREMENT PRIMARY KEY,
   nom_billet VARCHAR(50),
   prenom_billet VARCHAR(50),
   id_utilisateur INT NULL,       -- Peut être NULL si l'acheteur n'est pas un utilisateur
   id_acheteur INT NULL,          -- Référence à un acheteur anonyme
   mail_billet VARCHAR(50),       -- Email de l'acheteur
   FOREIGN KEY(id_utilisateur) REFERENCES Utilisateurs(id_utilisateur),
   FOREIGN KEY(id_acheteur) REFERENCES AcheteursAnonymes(id_acheteur)
);

-- Création de la table Stands
CREATE TABLE Stands (
   id_stand INT AUTO_INCREMENT PRIMARY KEY,
   type_stand VARCHAR(50),
   statut_stand VARCHAR(50),
   numero_emplacement_stand INT,
   prix_stand INT
);

-- Création de la table PlaceParking avec l'attribut prix
CREATE TABLE PlaceParking (
   id_place_parking INT AUTO_INCREMENT PRIMARY KEY,
   numero_place_parking INT,
   id_billet INT,
   prix DECIMAL(10, 2) DEFAULT 50.00, -- Prix de la place de parking
   FOREIGN KEY(id_billet) REFERENCES Billets(id_billet)
);

-- Création de la table Hotels
CREATE TABLE Hotels (
   id_hotel INT AUTO_INCREMENT PRIMARY KEY,
   nom_hotel VARCHAR(50),
   emplacement_hotel VARCHAR(50)
);

-- Création de la table FAQ
CREATE TABLE FAQ (
   id_faq INT AUTO_INCREMENT PRIMARY KEY,
   question_faq VARCHAR(50),
   reponse_faq VARCHAR(50),
   id_utilisateur INT NOT NULL,
   FOREIGN KEY(id_utilisateur) REFERENCES Utilisateurs(id_utilisateur)
);

-- Création de la table Places
CREATE TABLE Places (
   id_place INT AUTO_INCREMENT PRIMARY KEY,
   numero_place INT,
   id_billet INT,
   FOREIGN KEY(id_billet) REFERENCES Billets(id_billet)
);

-- Création de la table ChambreHotel avec l'attribut prix
CREATE TABLE ChambreHotel (
   id_chambre_hotel INT AUTO_INCREMENT PRIMARY KEY,
   numero_chambre INT NOT NULL,
   id_billet INT,
   id_hotel INT NOT NULL,
   prix DECIMAL(10, 2) DEFAULT 0.00, -- Prix de la chambre
   FOREIGN KEY(id_billet) REFERENCES Billets(id_billet),
   FOREIGN KEY(id_hotel) REFERENCES Hotels(id_hotel)
);

-- Création de la table ReservationServices
CREATE TABLE ReservationServices (
   id_reservation_service INT AUTO_INCREMENT PRIMARY KEY,
   libelle_service VARCHAR(50),
   date_service DATE,
   heure_service TIME,
   id_stand INT,
   id_utilisateur INT NOT NULL,
   FOREIGN KEY(id_stand) REFERENCES Stands(id_stand),
   FOREIGN KEY(id_utilisateur) REFERENCES Utilisateurs(id_utilisateur)
);

-- Création de la table Pilote
CREATE TABLE Pilote (
   id_pilote INT AUTO_INCREMENT PRIMARY KEY,
   nom_pilote VARCHAR(50),
   nom_equipe VARCHAR(50),
   prenom_pilote VARCHAR(50)
);

-- Création de la table Recompense
CREATE TABLE Recompense (
   id_recompense INT AUTO_INCREMENT PRIMARY KEY,
   libelle_recompense VARCHAR(50),
   id_utilisateur INT,
   FOREIGN KEY(id_utilisateur) REFERENCES Utilisateurs(id_utilisateur)
);

-- Création de la table prestataireReservationStand
CREATE TABLE prestataireReservationStand (
   id_utilisateur INT,
   id_stand INT,
   debut_reservation DATE,
   fin_reservation VARCHAR(50),
   PRIMARY KEY(id_utilisateur, id_stand),
   FOREIGN KEY(id_utilisateur) REFERENCES Utilisateurs(id_utilisateur),
   FOREIGN KEY(id_stand) REFERENCES Stands(id_stand)
);

-- Création de la table clientRencontre
CREATE TABLE clientRencontre (
   id_utilisateur INT,
   id_pilote INT,
   date_rencontre_pilote DATETIME,
   PRIMARY KEY(id_utilisateur, id_pilote),
   FOREIGN KEY(id_utilisateur) REFERENCES Utilisateurs(id_utilisateur),
   FOREIGN KEY(id_pilote) REFERENCES Pilote(id_pilote)
);

-- Création de la table Courses avec l'attribut prix
CREATE TABLE Courses (
   id_course INT AUTO_INCREMENT PRIMARY KEY,
   nom_course VARCHAR(50),          -- Nom de la course
   date_course DATE,                -- Date de la course
   prix DECIMAL(10, 2) DEFAULT 0.00 -- Prix de la course
);

-- Création de la table de liaison BilletCourses pour la relation many-to-many entre Billets et Courses
CREATE TABLE BilletCourses (
   id_billet INT,                -- Référence au billet
   id_course INT,                -- Référence à la course
   PRIMARY KEY(id_billet, id_course),  -- Clé primaire composite
   FOREIGN KEY(id_billet) REFERENCES Billets(id_billet) ON DELETE CASCADE,
   FOREIGN KEY(id_course) REFERENCES Courses(id_course) ON DELETE CASCADE
);
