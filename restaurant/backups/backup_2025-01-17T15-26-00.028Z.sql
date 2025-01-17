-- MySQL dump 10.13  Distrib 8.0.35, for Win64 (x86_64)
--
-- Host: MySQL-8.0    Database: Best-Rest
-- ------------------------------------------------------
-- Server version	8.0.35

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
-- Table structure for table `Адрес`
--

DROP TABLE IF EXISTS `Адрес`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Адрес` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `Улица` char(255) NOT NULL,
  `Дом` int NOT NULL,
  `Квартира` int DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Адрес`
--

LOCK TABLES `Адрес` WRITE;
/*!40000 ALTER TABLE `Адрес` DISABLE KEYS */;
INSERT INTO `Адрес` VALUES (1,'Мира',20,NULL);
/*!40000 ALTER TABLE `Адрес` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Блюда`
--

DROP TABLE IF EXISTS `Блюда`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Блюда` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `ID_категории` int unsigned NOT NULL,
  `Название` char(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Фото` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Блюда_id_категории_foreign` (`ID_категории`),
  CONSTRAINT `Блюда_id_категории_foreign` FOREIGN KEY (`ID_категории`) REFERENCES `Категория_блюда` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Блюда`
--

LOCK TABLES `Блюда` WRITE;
/*!40000 ALTER TABLE `Блюда` DISABLE KEYS */;
INSERT INTO `Блюда` VALUES (2,1,'Стейк','/images/meat_delivery.png'),(3,2,'Яйца с ветчиной и беконом','/images/eggs_bacon.png'),(4,2,'Омлет с помидором и сыром фета','/images/eggs_tomato.png'),(6,3,'Молочный коктель','/images/milkShake_delivery.png'),(7,3,'Кофе','/images/coffee_delivery.png'),(8,3,'Сок','/images/juice.png'),(9,1,'Блины','/images/pancakes.png'),(10,2,'Буррито','/images/burrito.png');
/*!40000 ALTER TABLE `Блюда` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Блюда_в_заказе`
--

DROP TABLE IF EXISTS `Блюда_в_заказе`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Блюда_в_заказе` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `ID_блюда` int unsigned NOT NULL,
  `ID_содержания_заказа` int unsigned NOT NULL,
  `Количество` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Блюда_в_заказе_ID_блюда_foreign` (`ID_блюда`),
  KEY `Блюда_в_заказе_ID_содержания_заказа_foreign` (`ID_содержания_заказа`),
  CONSTRAINT `Блюда_в_заказе_ID_блюда_foreign` FOREIGN KEY (`ID_блюда`) REFERENCES `Блюда` (`ID`),
  CONSTRAINT `Блюда_в_заказе_ID_содержания_заказа_foreign` FOREIGN KEY (`ID_содержания_заказа`) REFERENCES `Содержание_заказа` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Блюда_в_заказе`
--

LOCK TABLES `Блюда_в_заказе` WRITE;
/*!40000 ALTER TABLE `Блюда_в_заказе` DISABLE KEYS */;
/*!40000 ALTER TABLE `Блюда_в_заказе` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Блюда_в_корзине`
--

DROP TABLE IF EXISTS `Блюда_в_корзине`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Блюда_в_корзине` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `ID_блюда` int unsigned NOT NULL,
  `ID_корзины` int unsigned NOT NULL,
  `Количество` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Блюда в корзине_id_блюда_foreign` (`ID_блюда`),
  KEY `Блюда в корзине_id_корзины_foreign` (`ID_корзины`),
  CONSTRAINT `Блюда в корзине_id_блюда_foreign` FOREIGN KEY (`ID_блюда`) REFERENCES `Блюда` (`ID`),
  CONSTRAINT `Блюда в корзине_id_корзины_foreign` FOREIGN KEY (`ID_корзины`) REFERENCES `Корзина` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=178 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Блюда_в_корзине`
--

LOCK TABLES `Блюда_в_корзине` WRITE;
/*!40000 ALTER TABLE `Блюда_в_корзине` DISABLE KEYS */;
/*!40000 ALTER TABLE `Блюда_в_корзине` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Бронирование`
--

DROP TABLE IF EXISTS `Бронирование`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Бронирование` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `ID_стола` int unsigned NOT NULL,
  `Количество_человек` int NOT NULL,
  `Дата` date NOT NULL,
  `Время` time NOT NULL,
  `ID_пользователя` int unsigned NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Бронирование_id_пользователя_foreign` (`ID_пользователя`),
  KEY `Бронирование_id_стола_foreign` (`ID_стола`),
  CONSTRAINT `Бронирование_id_пользователя_foreign` FOREIGN KEY (`ID_пользователя`) REFERENCES `Пользователь` (`ID`),
  CONSTRAINT `Бронирование_id_стола_foreign` FOREIGN KEY (`ID_стола`) REFERENCES `Столы` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Бронирование`
--

LOCK TABLES `Бронирование` WRITE;
/*!40000 ALTER TABLE `Бронирование` DISABLE KEYS */;
/*!40000 ALTER TABLE `Бронирование` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Должность_сотрудника`
--

DROP TABLE IF EXISTS `Должность_сотрудника`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Должность_сотрудника` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `Наименование` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Должность_сотрудника`
--

LOCK TABLES `Должность_сотрудника` WRITE;
/*!40000 ALTER TABLE `Должность_сотрудника` DISABLE KEYS */;
INSERT INTO `Должность_сотрудника` VALUES (1,'Контент-менеджер'),(2,'Менеджер-заказов'),(3,'Курьер');
/*!40000 ALTER TABLE `Должность_сотрудника` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Доставка`
--

DROP TABLE IF EXISTS `Доставка`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Доставка` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `Цена` int NOT NULL DEFAULT '500',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Доставка`
--

LOCK TABLES `Доставка` WRITE;
/*!40000 ALTER TABLE `Доставка` DISABLE KEYS */;
/*!40000 ALTER TABLE `Доставка` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Заказ`
--

DROP TABLE IF EXISTS `Заказ`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Заказ` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `ID_статуса` int unsigned NOT NULL DEFAULT '1',
  `ID_доставки` int unsigned NOT NULL,
  `ID_адреса` int unsigned NOT NULL,
  `ID_содержания_заказа` int unsigned NOT NULL,
  `ID_способа` int unsigned NOT NULL,
  `Дата_заказа` date NOT NULL,
  `Время_заказа` time NOT NULL,
  `Время_доставки` time NOT NULL DEFAULT '01:30:00',
  PRIMARY KEY (`ID`),
  KEY `Заказ_id_статуса_foreign` (`ID_статуса`),
  KEY `Заказ_id_доставки_foreign` (`ID_доставки`),
  KEY `Заказ_id_способа_foreign` (`ID_способа`),
  KEY `Заказ_ID_содержание_заказа_foreign` (`ID_содержания_заказа`),
  KEY `Заказ_ID_адреса_foreign` (`ID_адреса`),
  CONSTRAINT `Заказ_ID_адреса_foreign` FOREIGN KEY (`ID_адреса`) REFERENCES `Адрес` (`ID`),
  CONSTRAINT `Заказ_id_доставки_foreign` FOREIGN KEY (`ID_доставки`) REFERENCES `Доставка` (`ID`),
  CONSTRAINT `Заказ_ID_содержание_заказа_foreign` FOREIGN KEY (`ID_содержания_заказа`) REFERENCES `Содержание_заказа` (`ID`),
  CONSTRAINT `Заказ_id_способа_foreign` FOREIGN KEY (`ID_способа`) REFERENCES `Способ_оплаты` (`ID`),
  CONSTRAINT `Заказ_id_статуса_foreign` FOREIGN KEY (`ID_статуса`) REFERENCES `Статус_заказа` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Заказ`
--

LOCK TABLES `Заказ` WRITE;
/*!40000 ALTER TABLE `Заказ` DISABLE KEYS */;
/*!40000 ALTER TABLE `Заказ` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Заказы_доставщиков`
--

DROP TABLE IF EXISTS `Заказы_доставщиков`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Заказы_доставщиков` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `ID_сотрудника` int unsigned NOT NULL,
  `ID_заказа` int unsigned NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Доставляемые_заказ_ID_сотрудника_foreign` (`ID_сотрудника`),
  KEY `Доставляемые_заказ_ID_заказа_foreign` (`ID_заказа`),
  CONSTRAINT `Доставляемые_заказ_ID_заказа_foreign` FOREIGN KEY (`ID_заказа`) REFERENCES `Заказ` (`ID`),
  CONSTRAINT `Доставляемые_заказ_ID_сотрудника_foreign` FOREIGN KEY (`ID_сотрудника`) REFERENCES `Сотрудники` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Заказы_доставщиков`
--

LOCK TABLES `Заказы_доставщиков` WRITE;
/*!40000 ALTER TABLE `Заказы_доставщиков` DISABLE KEYS */;
/*!40000 ALTER TABLE `Заказы_доставщиков` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Категория_блюда`
--

DROP TABLE IF EXISTS `Категория_блюда`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Категория_блюда` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `Наименование` char(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Категория_блюда`
--

LOCK TABLES `Категория_блюда` WRITE;
/*!40000 ALTER TABLE `Категория_блюда` DISABLE KEYS */;
INSERT INTO `Категория_блюда` VALUES (1,'Горячие блюда'),(2,'Завтраки'),(3,'Напитки');
/*!40000 ALTER TABLE `Категория_блюда` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Корзина`
--

DROP TABLE IF EXISTS `Корзина`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Корзина` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `ID_пользователя` int unsigned NOT NULL,
  `Общая_цена` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Корзина_id_пользователя_foreign` (`ID_пользователя`),
  CONSTRAINT `Корзина_id_пользователя_foreign` FOREIGN KEY (`ID_пользователя`) REFERENCES `Пользователь` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Корзина`
--

LOCK TABLES `Корзина` WRITE;
/*!40000 ALTER TABLE `Корзина` DISABLE KEYS */;
/*!40000 ALTER TABLE `Корзина` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Отзыв`
--

DROP TABLE IF EXISTS `Отзыв`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Отзыв` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `ID_пользователя` int unsigned NOT NULL,
  `Оценка` int NOT NULL,
  `Текст_отзыва` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Дата` date NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Отзыв_id_пользователя_foreign` (`ID_пользователя`),
  CONSTRAINT `Отзыв_id_пользователя_foreign` FOREIGN KEY (`ID_пользователя`) REFERENCES `Пользователь` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Отзыв`
--

LOCK TABLES `Отзыв` WRITE;
/*!40000 ALTER TABLE `Отзыв` DISABLE KEYS */;
INSERT INTO `Отзыв` VALUES (22,37,5,' Отмечали юбилей. Прекрасная праздничная атмосфера, бесподобная кухня, профессиональная подача блюд. Обязательно вернемся сюда. Огромное спасибо всем кто участвовал в организации нашего праздника. Рекомендуем всем посетить это волшебное место.','2024-12-10'),(23,38,5,' Хороший ресторан. Еда была вкусной, а атмосфера заведения придавала особое очарование. Очень вежливый персонал, официант отлично знает позиции в меню и помог с выбором. В общем нам все очень понравилось. Рекомендую посетить это место. ','2024-12-21'),(28,42,5,'Прекрасный ресторан! Вкусные и оригинальные блюда, отличная подача. Обслуживание на высшем уровне — официанты внимательные и дружелюбные. Уходили сытыми и довольными. Однозначно рекомендую!','2024-12-17'),(29,43,3,'Заведение неплохое, но не впечатлило. Интерьер красивый и уютный, однако обслуживание оставляет желать лучшего — пришлось ждать официанта почти 20 минут. Еда нормальная, но ничего выдающегося. Можно заглянуть разок, но возвращаться вряд ли захочется.','2024-12-17'),(30,44,4,'Хорошее место для ужина с друзьями или семьёй. Большие порции, приятный интерьер и доброжелательный персонал. Единственный минус — долгое ожидание блюд в час пик. В целом, остались довольны, особенно понравился \'Стейк\' — очень вкусно!','2024-12-17'),(31,45,4,'Ресторан оставил приятное впечатление. Обслуживание вежливое и быстрое. Блюда понравились. Цены чуть выше среднего, но качество это оправдывает. Минус — немного шумно из-за большого количества посетителей.','2024-12-17'),(32,46,3,'Средненько. Понравился интерьер — чисто и стильно. Еда на троечку, ничего особенного, но сытно. Официанты были приветливы, но забыли про наш заказ и принесли его с опозданием. Для быстрого перекуса место подойдёт, но за чем-то особенным сюда не стоит идти.','2024-12-17');
/*!40000 ALTER TABLE `Отзыв` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Пользователь`
--

DROP TABLE IF EXISTS `Пользователь`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Пользователь` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `Email` char(255) NOT NULL,
  `Пароль` char(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Номер_телефона` varchar(255) NOT NULL,
  `Фамилия` char(255) NOT NULL,
  `Имя` char(255) NOT NULL,
  `Отчество` char(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Пользователь`
--

LOCK TABLES `Пользователь` WRITE;
/*!40000 ALTER TABLE `Пользователь` DISABLE KEYS */;
INSERT INTO `Пользователь` VALUES (35,'Sas@gmail.com','$2b$10$WdMRuxatJ/zGiUSk7CUTEOA8WLtKbb3Cu6Z6JRSOo.zxUWn5mcbsK','89194492626','Иванов','Александр','Иванович'),(37,'Mivit52@gmail.com','$2b$10$5z7TxlhJ7ikRGbN9e1J74u1FJBefq9n7WuEsvEWB1v6F3wiweadqm','89194582523','Павлов','Михаил','Витальевич'),(38,'Kirill36@gmail.com','$2b$10$lHJFiqSkuW4jSLUSbZ5kIeXRppRdHtpV83aw2GPpSNDXnB2WNucZm','89194781548','Иванов','Кирилл','Генадьевич'),(42,'ivan2345@gmail.com','$2b$10$ktmmtzH.Wp.D9CmIp1Pu3.uqYGNhdWU4wGcZ6vJGN8CEnJOWzYdcm','89194687205','Иванов','Иван','Иванович'),(43,'alex@gmail.com','$2b$10$kftwLIVYamRV5SHQkrabSeLaz1bXPO3v5KPcOyuwhtOJUFM6Hj.Ne','89146589246','Титов','Александр','Юрьевич'),(44,'agm398@gmail.com','$2b$10$XOkj0cVTe4zMFVZrm1SLjuJim5qBz26qnH7cC0sPQp55zjSO992Di','89567341208','Александров','Герман','Михайлович'),(45,'gen487@gmail.com','$2b$10$BpyJVQ2rX2r/OhJbaIY.5Om5MsJjSqGo.Wp3a1Pwwe01og0XSmaX6','89847584325','Динов','Генадий','Викторович'),(46,'rom4973@gmail.com','$2b$10$mS5xLMcy7H30FAVeOYyQIefbmZJZMSmjguj1Xdz/XF/n2ksMpeOYC','89263557196','Булатов','Роман','Павлович');
/*!40000 ALTER TABLE `Пользователь` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Прайс_лист`
--

DROP TABLE IF EXISTS `Прайс_лист`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Прайс_лист` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `ID_блюда` int unsigned NOT NULL,
  `Цена` int NOT NULL,
  `Дата` date NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Прайс лист_id_блюда_foreign` (`ID_блюда`),
  CONSTRAINT `Прайс лист_id_блюда_foreign` FOREIGN KEY (`ID_блюда`) REFERENCES `Блюда` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Прайс_лист`
--

LOCK TABLES `Прайс_лист` WRITE;
/*!40000 ALTER TABLE `Прайс_лист` DISABLE KEYS */;
INSERT INTO `Прайс_лист` VALUES (2,2,1000,'2024-11-20'),(3,3,1000,'2024-11-20'),(4,4,1000,'2024-11-20'),(6,6,180,'2024-11-20'),(7,7,180,'2024-11-20'),(8,8,100,'2025-01-09'),(9,9,500,'2025-01-09'),(10,10,1000,'2025-01-09');
/*!40000 ALTER TABLE `Прайс_лист` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Ресторан`
--

DROP TABLE IF EXISTS `Ресторан`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Ресторан` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `ID_адреса` int unsigned NOT NULL,
  `Название` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Ресторан_ID_адреса_foreign` (`ID_адреса`),
  CONSTRAINT `Ресторан_ID_адреса_foreign` FOREIGN KEY (`ID_адреса`) REFERENCES `Адрес` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Ресторан`
--

LOCK TABLES `Ресторан` WRITE;
/*!40000 ALTER TABLE `Ресторан` DISABLE KEYS */;
INSERT INTO `Ресторан` VALUES (2,1,'Best-Rest');
/*!40000 ALTER TABLE `Ресторан` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Содержание_заказа`
--

DROP TABLE IF EXISTS `Содержание_заказа`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Содержание_заказа` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `ID_пользователя` int unsigned NOT NULL,
  `Общая_цена` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Содержание_заказа_ID_пользователя_foreign` (`ID_пользователя`),
  CONSTRAINT `Содержание_заказа_ID_пользователя_foreign` FOREIGN KEY (`ID_пользователя`) REFERENCES `Пользователь` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Содержание_заказа`
--

LOCK TABLES `Содержание_заказа` WRITE;
/*!40000 ALTER TABLE `Содержание_заказа` DISABLE KEYS */;
/*!40000 ALTER TABLE `Содержание_заказа` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Сотрудники`
--

DROP TABLE IF EXISTS `Сотрудники`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Сотрудники` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `ID_ресторана` int unsigned NOT NULL,
  `ID_должности_сотрудника` int unsigned NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Пароль` varchar(255) NOT NULL,
  `Номер_телефона` varchar(255) NOT NULL,
  `Фамилия` varchar(255) NOT NULL,
  `Имя` varchar(255) NOT NULL,
  `Отчество` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Сотрудники_ID_роли_сотрудника_foreign` (`ID_должности_сотрудника`),
  KEY `Сотрудники_ID_ресторана_foreign` (`ID_ресторана`),
  CONSTRAINT `Сотрудники_ID_ресторана_foreign` FOREIGN KEY (`ID_ресторана`) REFERENCES `Ресторан` (`ID`),
  CONSTRAINT `Сотрудники_ID_роли_сотрудника_foreign` FOREIGN KEY (`ID_должности_сотрудника`) REFERENCES `Должность_сотрудника` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Сотрудники`
--

LOCK TABLES `Сотрудники` WRITE;
/*!40000 ALTER TABLE `Сотрудники` DISABLE KEYS */;
INSERT INTO `Сотрудники` VALUES (1,2,1,'Contman@gmail.com','$2b$10$WeVemZePCcvrYoZTNU2nEuaUtlqI5Q8JMkIHGBiz9WajPgZFiuuym','89191475851','Петрова','Елизавета','Александровна'),(2,2,2,'Manord@gmail.com','$2b$10$uKUCvz18EW0gogOg83tHh.3hvBY9ex6U7SEQNv6HjBaqtW0BMdXjO','89194768548','Тарин','Михаил','Валерьевич'),(3,2,3,'Deliver@gmail.com','$2b$10$EwgYe6rBT36Q6qauIFWfHudcYf26cryuQMHdPDXKUka3W9pfhA5Ly','89194497685','Перов','Павел','Алексеевич');
/*!40000 ALTER TABLE `Сотрудники` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Спец_предложения`
--

DROP TABLE IF EXISTS `Спец_предложения`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Спец_предложения` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `ID_блюда` int unsigned NOT NULL,
  `Описание` text NOT NULL,
  `Дата_начала` date NOT NULL,
  `Дата_окончания` date NOT NULL,
  `Размер_скидки` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `Спец предложения_id_блюда_foreign` (`ID_блюда`),
  CONSTRAINT `Спец предложения_id_блюда_foreign` FOREIGN KEY (`ID_блюда`) REFERENCES `Блюда` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Спец_предложения`
--

LOCK TABLES `Спец_предложения` WRITE;
/*!40000 ALTER TABLE `Спец_предложения` DISABLE KEYS */;
INSERT INTO `Спец_предложения` VALUES (1,3,'Скидка 50%','2024-12-01','2024-12-31',500),(2,4,'Скидка 50%','2024-12-01','2024-12-31',500),(9,10,'Скидка 50%','2025-01-01','2025-01-16',500);
/*!40000 ALTER TABLE `Спец_предложения` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Способ_оплаты`
--

DROP TABLE IF EXISTS `Способ_оплаты`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Способ_оплаты` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `Наименование` char(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Способ_оплаты`
--

LOCK TABLES `Способ_оплаты` WRITE;
/*!40000 ALTER TABLE `Способ_оплаты` DISABLE KEYS */;
INSERT INTO `Способ_оплаты` VALUES (1,'Наличными при получении'),(2,'Картой при получении');
/*!40000 ALTER TABLE `Способ_оплаты` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Статус_заказа`
--

DROP TABLE IF EXISTS `Статус_заказа`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Статус_заказа` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `Наименование` char(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Статус_заказа`
--

LOCK TABLES `Статус_заказа` WRITE;
/*!40000 ALTER TABLE `Статус_заказа` DISABLE KEYS */;
INSERT INTO `Статус_заказа` VALUES (1,'В обработке'),(2,'Готовиться'),(3,'Готов'),(4,'В пути'),(5,'Получен');
/*!40000 ALTER TABLE `Статус_заказа` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Столы`
--

DROP TABLE IF EXISTS `Столы`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Столы` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `Наименование` varchar(255) NOT NULL,
  `Вместимость` int NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Столы`
--

LOCK TABLES `Столы` WRITE;
/*!40000 ALTER TABLE `Столы` DISABLE KEYS */;
INSERT INTO `Столы` VALUES (1,'1(2 персоны)',2),(2,'2(4 персоны)',4),(3,'3(2 персоны)',2),(4,'4(6 персон)',6),(5,'5(2 персоны)',2),(6,'6(6 персон)',6),(7,'7(4 персоны)',4),(8,'8(2 персоны)',2),(9,'9(4 персоны)',4),(10,'10(2 персоны)',2);
/*!40000 ALTER TABLE `Столы` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-17 20:26:00
