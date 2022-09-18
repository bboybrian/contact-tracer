-- MySQL dump 10.13  Distrib 8.0.25, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: user_db
-- ------------------------------------------------------
-- Server version	8.0.19-0ubuntu5

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `checkin`
--

DROP TABLE IF EXISTS `checkin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `checkin` (
  `checkin_id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(8) DEFAULT NULL,
  `loc_id` varchar(8) DEFAULT NULL,
  `date_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `exposure_id` int DEFAULT NULL,
  PRIMARY KEY (`checkin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=135 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checkin`
--

LOCK TABLES `checkin` WRITE;
/*!40000 ALTER TABLE `checkin` DISABLE KEYS */;
INSERT INTO `checkin` VALUES (75,'0v5v8n6','09l0rf6','2021-06-13 08:41:44',44),(76,'0v5v8n6','09l0rf6','2021-06-13 08:41:47',44),(77,'0v5v8n6','09l0rf6','2021-06-13 08:41:49',44),(78,'0v5v8n6','09l0rf6','2021-06-13 08:41:52',44),(79,'0v5v8n6','09l0rf6','2021-06-13 08:41:53',44),(80,'0v5v8n6','09l0rf6','2021-06-13 08:41:55',44),(81,'0v5v8n6','09l0rf6','2021-06-13 08:41:56',44),(82,'0v5v8n6','09l0rf6','2021-06-13 08:41:58',44),(83,'0v5v8n6','09l0rf6','2021-06-13 08:42:00',44),(84,'0v5v8n6','09l0rf6','2021-06-13 08:42:01',44),(85,'0v5v8n6','09l0rf6','2021-06-13 08:42:03',44),(86,'0v5v8n6','09l0rf6','2021-06-13 08:42:04',44),(87,'0v5v8n6','09l0rf6','2021-06-13 08:42:06',44),(88,'0v5v8n6','09l0rf6','2021-06-13 08:42:07',44),(89,'0v5v8n6','09l0rf6','2021-06-13 08:42:10',44),(90,'0v5v8n6','09l0rf6','2021-06-13 08:42:11',44),(91,'0v5v8n6','09l0rf6','2021-06-13 08:42:13',44),(92,'0v5v8n6','09l0rf6','2021-06-13 08:42:15',44),(93,'0v5v8n6','09l0rf6','2021-06-13 08:42:17',44),(94,'0v5v8n6','09l0rf6','2021-06-13 08:42:18',44),(95,'0v5v8n6','09l0rf6','2021-06-13 08:42:20',44),(96,'0v5v8n6','09l0rf6','2021-06-13 08:42:22',44),(97,'0v5v8n6','09l0rf6','2021-06-13 08:42:23',44),(98,'0v5v8n6','09l0rf6','2021-06-13 08:42:25',44),(99,'0v5v8n6','09l0rf6','2021-06-13 08:42:27',44),(100,'0v5v8n6','09l0rf6','2021-06-13 08:42:28',44),(101,'0v5v8n6','09l0rf6','2021-06-13 08:42:30',44),(102,'0v5v8n6','09l0rf6','2021-06-13 08:42:32',44),(103,'0v5v8n6','09l0rf6','2021-06-13 08:42:34',44),(104,'0v5v8n6','09l0rf6','2021-06-13 08:42:35',44),(105,'0v5v8n6','09l0rf6','2021-06-13 08:42:37',44),(106,'0v5v8n6','09l0rf6','2021-06-13 08:42:38',44),(107,'0v5v8n6','09l0rf6','2021-06-13 08:42:41',44),(108,'0v5v8n6','09l0rf6','2021-06-13 08:42:43',44),(109,'0v5v8n6','09l0rf6','2021-06-13 08:42:44',44),(110,'0v5v8n6','09l0rf6','2021-06-13 08:42:46',44),(111,'0v5v8n6','09l0rf6','2021-06-13 08:42:47',44),(112,'0v5v8n6','09l0rf6','2021-06-13 08:42:48',44),(113,'0v5v8n6','09l0rf6','2021-06-13 08:42:49',44),(114,'0v5v8n6','09l0rf6','2021-06-13 08:42:49',44),(115,'0v5v8n6','09l0rf6','2021-06-13 08:42:51',44),(116,'0v5v8n6','09l0rf6','2021-06-13 08:42:51',44),(117,'0v5v8n6','09l0rf6','2021-06-13 08:42:52',44),(118,'0v5v8n6','09l0rf6','2021-06-13 08:42:52',44),(119,'0v5v8n6','09l0rf6','2021-06-13 08:42:54',44),(120,'0v5v8n6','09l0rf6','2021-06-13 08:42:54',44),(121,'0v5v8n6','09l0rf6','2021-06-13 08:42:55',44),(122,'0v5v8n6','09l0rf6','2021-06-13 08:42:56',44),(123,'0v5v8n6','09l0rf6','2021-06-13 08:42:57',44),(124,'0v5v8n6','09l0rf6','2021-06-13 08:42:57',44),(125,'0v5v8n6','09l0rf6','2021-06-13 08:42:59',44),(126,'0v5v8n6','09l0rf6','2021-06-13 08:42:59',44),(127,'0v5v8n6','09l0rf6','2021-06-13 08:43:00',44),(128,'0v5v8n6','09l0rf6','2021-06-13 08:43:00',44),(129,'0v5v8n6','09l0rf6','2021-06-13 08:43:02',44),(130,'0v5v8n6','09l0rf6','2021-06-13 08:43:02',44),(133,'06epvrm','04a4dkp','2021-06-13 09:09:08',-1),(134,'0xedlif','04a4dkp','2021-06-13 09:17:46',50);
/*!40000 ALTER TABLE `checkin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exposures`
--

DROP TABLE IF EXISTS `exposures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exposures` (
  `exposure_id` int NOT NULL AUTO_INCREMENT,
  `loc_id` varchar(8) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  PRIMARY KEY (`exposure_id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exposures`
--

LOCK TABLES `exposures` WRITE;
/*!40000 ALTER TABLE `exposures` DISABLE KEYS */;
INSERT INTO `exposures` VALUES (47,'04a4dkp','2021-06-13 08:17:46','2021-06-13 13:17:46'),(48,'04a4dkp','2021-06-12 12:32:00','2021-06-13 22:32:00'),(49,'04a4dkp','2021-06-13 08:09:08','2021-06-13 13:09:08'),(50,'04a4dkp','2021-06-12 09:44:00','2021-06-14 09:44:00');
/*!40000 ALTER TABLE `exposures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `loc_id` varchar(255) DEFAULT NULL,
  `owner_id` varchar(8) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `loc_name` text,
  `lat` float DEFAULT NULL,
  `lng` float DEFAULT NULL,
  `exposed` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES ('09l0rf6','abcdefg','12 anzac hwy','Zac\'s Tacos',-34.9496,138.577,0),('04a4dkp','06epvrm','476 Anzac Hwy, Camden Park SA 5038','Mcdonalds Anzac Hwy',-34.9753,138.538,0),('0ladaiu','06epvrm','4','Mcdonald',42.3297,-83.0536,0);
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `user_id` varchar(255) DEFAULT NULL,
  `session_id` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('abcdefg',''),('abcdefg','0429khx'),('abcdefg','0sbfuyg'),('abcdefg','06xmlv6'),('0rp8u9y','0auf4g8'),('0rp8u9y','0cfvmbb'),('abcdefg','020osqp'),('abcdefg','0sx9fka'),('abcdefg','0iqecum'),('abcdefg','03hnx5e'),('06epvrm','0vl5am1'),('abcdefg','0646lan'),('abcdefg','0awchi1'),('abcdefg','0iwhvjv'),('abcdefg','0x1dqxj'),('abcdefg','0lsuwri'),('abcdefg','039ros9'),('abcdefg','01azf6j'),('abcdefg','02837f9'),('0rp8u9y','0dsdw79'),('0yuph08','0hatnl3'),('abcdefg','02zjgpr'),('abcdefg','0b6bvpm'),('abcdefg','04nu9ru'),('abcdefg','0g4q15y'),('abcdefg','094pg36'),('abcdefg','0y9g0ea'),('abcdefg','0tb1u24'),('abcdefg','08jwfik'),('abcdefg','0o9c11i'),('0rp8u9y','0rssnrl'),('abcdefg','0y87jkn'),('abcdefg','002vog9'),('abcdefg','0d1cn00'),('abcdefg','05owcea'),('abcdefg','0mcfhgt'),('abcdefg','07mz7rl'),('abcdefg','03dkpbd'),('abcdefg','0jo8cwx'),('06epvrm','0l9edxo'),('0v5v8n6','082pm0i'),('06epvrm','0esr8ip'),('09btgos','0alexkg'),('06epvrm','01vbd81'),('06epvrm','0oe6cpa'),('0xedlif','0e7y6k6'),('0xedlif','0jzkj7z'),('0sm282b','0udnnpr'),('0xedlif','07coqqc'),('0h0nj90','0by59z6'),('0xedlif','0i25coc'),('0h0nj90','08i4s2c');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `updates`
--

DROP TABLE IF EXISTS `updates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `updates` (
  `update_id` int NOT NULL AUTO_INCREMENT,
  `title` text,
  `content` text,
  `date_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`update_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `updates`
--

LOCK TABLES `updates` WRITE;
/*!40000 ALTER TABLE `updates` DISABLE KEYS */;
INSERT INTO `updates` VALUES (15,'Test Update','Mcdonald\'s is Ok','2021-06-13 08:53:24'),(16,'Remember to wash hands','Make sure that you remember to wash your hands regularly!','2021-06-13 09:11:04');
/*!40000 ALTER TABLE `updates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` varchar(255) DEFAULT NULL,
  `social_id` text,
  `permissions` int DEFAULT NULL,
  `given_name` varchar(255) DEFAULT NULL,
  `family_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(256) DEFAULT NULL,
  `exposed` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('06epvrm','101612954728713019141',2,'Zachary','Sobarzo','zacsob@gmail.com',NULL,0),('0v5v8n6','108619324590412101449',NULL,'html','javascript','2021wdc@gmail.com',NULL,NULL),('0xedlif',NULL,2,'Brian','Tan','tanszekai@gmail.com','4e04e922b12017b473b2e8adfe2695377254757ab9a386bbf701f87b7f391e5b',0),('0sm282b',NULL,NULL,'Dummy','User','dummyuser@gmail.com','30fd8ddeb029885994dd61d75795770dcdf7fecb6d2e224dd2926b4e85830207',NULL),('0h0nj90',NULL,2,'Dummy','Admin','dummyadmin@gmail.com','b9016af7d6dd5deebd95c71282ccc9dbaf8199095bb027ff91e14e5a20a8fa45',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-13 14:00:19
