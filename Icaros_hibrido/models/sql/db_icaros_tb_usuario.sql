-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: db_icaros
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.28-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tb_usuario`
--

DROP TABLE IF EXISTS `tb_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_usuario` (
  `ID_USUARIO` int(11) NOT NULL AUTO_INCREMENT,
  `NOME` varchar(50) NOT NULL,
  `EMAIL` varchar(100) NOT NULL,
  `SENHA` varchar(255) NOT NULL,
  `sexo` enum('F','M','P') DEFAULT NULL,
  `flag_tipo_usuario` int(1) NOT NULL,
  `DATA_NASC` date NOT NULL,
  `TELEFONE` varchar(15) NOT NULL,
  `GENERO_MUSICAL` enum('Rock','Sertanejo','Pop','Hip_Hop','Jazz','Blues','Classical','Electronic_Dance_Music','Country','Reggae','Reggaeton','Soul','Funk','Disco','Gospel','Todos') NOT NULL,
  PRIMARY KEY (`ID_USUARIO`),
  UNIQUE KEY `ID_USUARIO` (`ID_USUARIO`),
  UNIQUE KEY `EMAIL_UNIQUE` (`EMAIL`),
  UNIQUE KEY `UK_spmnyb4dsul95fjmr5kmdmvub` (`EMAIL`)
) ENGINE=InnoDB AUTO_INCREMENT=222 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_usuario`
--

LOCK TABLES `tb_usuario` WRITE;
/*!40000 ALTER TABLE `tb_usuario` DISABLE KEYS */;
INSERT INTO `tb_usuario` VALUES (178,'Thiago ','thiago.magalhaes11@fatec.sp.gov.br','$2a$10$7C9QN3YDb1BfgvIch0t0PuxfgmvTTninh7mlApqx/FoRGH8Fuwy4e','M',1,'2005-02-15','(11) 93462-9535','Sertanejo'),(180,'Elizangela Rodrigues','elizangela.ro@gmail.com','$2a$10$G/G3NGbQJxeOdg7LD5IJJ.KFPAiVnTry77xGv5PQKEcbDL//16qDO','F',2,'2005-01-02','(11) 49823-4242','Blues'),(181,'Emanel Rodrigues','emanel.rodri@gmail.com','$2a$10$xQIqOFsDmlSDfZA7p830WuKLKuQvhm.sHgzV3FIY1hwnWq66O.rVK','M',2,'2005-01-02','(11) 49803-4242','Blues'),(182,'Emanel Rodrig','emanel.@gmail.com','$2a$10$zRH8d4EHTsyhRGOa4LMG3eCVBpRSzKRgAsqpRMyviid7jYS6LKolG','M',2,'2005-01-02','(11) 49803-4242','Blues'),(183,'Emanel ','emanel.@gmail.com.br','$2a$10$bcosSshyWiXUGpQ/RVWhoOKIkPa1IDZxp6me16SZ0KhLjjxGGztfC','M',2,'2005-01-02','(11) 49803-4249','Classical'),(184,'eman nuel','emanl.@gml.com.br','$2a$10$FSwqkzaHLX4HSZZ0EdQfCOUVISr4kHPsNA.jyUYA.PVWc9V.N0BHS','M',2,'2005-01-02','(11) 4983-4249','Blues'),(185,'Gustavo aloba','gus.tavo@gmail.com','$2a$10$bgFHxKhrHer5EcxSJP0KeOFkpwMygg6AY5xTAotdTwdHrn.2NPnbC','M',1,'2000-07-15','(11) 86385-3764','Rock'),(197,'Felipinho do funk','fefe@gmail.com','$2a$10$WZftt8mBFEBcJ6H8Zov1Ge487gkKh5XApIp8RJOcRuOTH1ZUWwj7e','M',3,'2005-02-15','(11) 98749-2384','Funk'),(199,'thiago do Atuador','Atuador.com','$2a$10$3u/M51IsNzPOfl.MvSCLtuJWbJ5153hibb/NsH2KaX9Si9LJ7vGwC','M',3,'2004-04-06','2233432','Classical'),(200,'kid apoio de homem','apoio.com','$2a$10$Jw1zQ1Jkqm.SR0IUnB1M3.uhrucTyd2/x23icZiBGptsEa75z/jRO','M',3,'2004-04-06','22334432','Classical'),(202,'Celmo Lisboa Magalhaes','c.elmo@gmail.com','$2a$10$6H1cPnlY.87pj6c7792jveoDVOfJasFh/6XePl9dfDPGQvAa5QzHK','M',2,'1998-03-22','(11) 94263-4572','Disco'),(203,'enzo','enzo@gmail.com','$2a$10$eYva4ouj.hLXnyM52vem3uCfCubi2Nh59SILAi8oVdPaT/9vuXis2','M',2,'1990-02-15','(11) 84563-7565','Blues'),(204,'ze musico do rock','ze@gmail.com','$2a$10$EkX7urNI..QaxWgc0DrfOOv8kTZYdJEfHSGpoiCNSJo2Z2KV0HeXW','F',2,'1800-03-28','(11) 82635-4298','Disco'),(214,'enzo 4','enzo.silva@gmail.com','$2a$10$1YZQRvLUMsiSwIDACm83kusfkkoOllv7DmI3MbB4chDAHVCTBrfO.','M',1,'2000-05-17','(11) 94356-3224','Funk'),(220,'Icara','icaro@gmail.com','$2a$10$vo.DEViPsU5p3FcWIzfxnuUu.FjFItzKCGb9U1QaKfALws4nVIMjK','M',1,'1998-09-17','(11) 48573-9453','Jazz'),(221,'thiago','vieraathiagoo@gmail.com','$2a$10$uSfPFhqHzK.HoQA1MtWvnOwEr6c5KD8Yk8aV5kkponu0AvY4W4H/m','M',1,'2005-02-15','(11) 93746-3843','Sertanejo');
/*!40000 ALTER TABLE `tb_usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-15 20:57:45
