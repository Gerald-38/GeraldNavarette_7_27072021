SET NAMES utf8;

DROP DATABASE IF EXISTS GroupomaniaDataBase;

CREATE DATABASE GroupomaniaDataBase CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE GroupomaniaDataBase;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


-- Table `posts`--

CREATE TABLE `posts` (
  `postID` int(10) UNSIGNED NOT NULL,
  `userID` int(10) UNSIGNED NOT NULL,
  `title` varchar(250) NOT NULL,
  `gifUrl` varchar(150) NULL,
  `dateCreation` datetime NOT NULL DEFAULT current_timestamp(),  
  `content` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Table `users`--

CREATE TABLE `users` (
  `userID` int(10) UNSIGNED NOT NULL,
  `email` varchar(80) NOT NULL,
  `firstName` varchar(40) NOT NULL,
  `lastName` varchar(40) NOT NULL,
  `password` varchar(80) NOT NULL,
  `pseudo` varchar(30), NOT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT 0  
  `bio` varchar(255),
  `avatarUrl` varchar (150) NOT NULL DEFAULT 'http://localhost:3000/images/avatarDefault.jpg',
  `dateCreation` DATETIME NOT NULL  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Table `comments`--

CREATE TABLE `comments` (
  `commentID` int(10) UNSIGNED NOT NULL,
  `userID` int(10) UNSIGNED NOT NULL,
  `postID` int(10) UNSIGNED NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `content` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- creation de l'administrateur 

INSERT INTO `users` (`id`, `nom`, `prenom`, `password`, `email`, `admin`) VALUES
('', 'Christelle', 'De la Comm', 'comm@groupomania.fr', 'Azerty1', 1);

--

INSERT INTO `user` (`userID`, `firstName`, `lastName`, `email`, `password`, `admin`, `pseudo`, `dateCreation`) VALUES
(null, 'Service', 'Communication', 'service_comm@groupomania.fr', '$2b$10$JO65gtypfcpssSdf49nAVugYsRkXKDq1RD6qS8rmapkYe7NlTfrce', 1, '', Now())

--

-- Index pour la table `posts`--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`postID`),
  ADD KEY `fk_userId_posts` (`userID`);


-- Index pour la table `users`--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`);


-- Index pour la table `comments`--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`commentID`),
  ADD KEY `fk_userId_comments` (`userID`),
  ADD KEY `fk_postId_comments` (`postID`);


-- AUTO_INCREMENT pour la table `posts`--
ALTER TABLE `posts`
  MODIFY `postID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;


-- AUTO_INCREMENT pour la table `users`--
ALTER TABLE `users`
  MODIFY `userID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;


-- AUTO_INCREMENT pour la table `comments`--
ALTER TABLE `comments`
  MODIFY `commentID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;



-- Contraintes pour la table `comments`--
ALTER TABLE `comments`
  ADD CONSTRAINT `fk_postId_comments` FOREIGN KEY (`postID`) REFERENCES `posts` (`postID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_userId_comments` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE;

-- Contraintes pour la table `posts`--
ALTER TABLE `posts`
  ADD CONSTRAINT `fk_userId_posts` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;