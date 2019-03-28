CREATE DATABASE IF NOT EXISTS`Teste_Vaga` CHAR SET 'utf8';

USE `Teste_Vaga`;

CREATE TABLE IF NOT EXISTS `Logins`(
  `Id_Login` INT AUTO_INCREMENT,
  `Login` VARCHAR(15) NOT NULL UNIQUE,
  `Senha` VARCHAR(40) NOT NULL,
  PRIMARY KEY(`Id_Login`)
);

CREATE VIEW `view_Logins` AS 
SELECT `Id_Login`,`Login`,`Senha` FROM `Logins` ; 