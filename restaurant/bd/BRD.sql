-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: MySQL-8.0
-- Время создания: Май 18 2025 г., 16:09
-- Версия сервера: 8.0.35
-- Версия PHP: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `BRD`
--

-- --------------------------------------------------------

--
-- Структура таблицы `Адрес`
--

CREATE TABLE `Адрес` (
  `ID` int UNSIGNED NOT NULL,
  `Улица` char(255) NOT NULL,
  `Дом` int NOT NULL,
  `Квартира` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Дамп данных таблицы `Адрес`
--

INSERT INTO `Адрес` (`ID`, `Улица`, `Дом`, `Квартира`) VALUES
(118, 'Ленина', 156, 55);

-- --------------------------------------------------------

--
-- Структура таблицы `Категория_блюда`
--

CREATE TABLE `Категория_блюда` (
  `ID` int UNSIGNED NOT NULL,
  `Наименование` char(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Дамп данных таблицы `Категория_блюда`
--

INSERT INTO `Категория_блюда` (`ID`, `Наименование`) VALUES
(1, 'Горячие блюда'),
(2, 'Завтраки'),
(3, 'Напитки');

-- --------------------------------------------------------

--
-- Структура таблицы `Отзыв`
--

CREATE TABLE `Отзыв` (
  `ID` int UNSIGNED NOT NULL,
  `ID_пользователя` int UNSIGNED NOT NULL,
  `Оценка` int NOT NULL,
  `Текст_отзыва` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Дата` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Дамп данных таблицы `Отзыв`
--

INSERT INTO `Отзыв` (`ID`, `ID_пользователя`, `Оценка`, `Текст_отзыва`, `Дата`) VALUES
(22, 37, 5, ' Отмечали юбилей. Прекрасная праздничная атмосфера, бесподобная кухня, профессиональная подача блюд. Обязательно вернемся сюда. Огромное спасибо всем кто участвовал в организации нашего праздника. Рекомендуем всем посетить это волшебное место.', '2024-12-10'),
(23, 38, 5, ' Хороший ресторан. Еда была вкусной, а атмосфера заведения придавала особое очарование. Очень вежливый персонал, официант отлично знает позиции в меню и помог с выбором. В общем нам все очень понравилось. Рекомендую посетить это место. ', '2024-12-21'),
(28, 42, 5, 'Прекрасный ресторан! Вкусные и оригинальные блюда, отличная подача. Обслуживание на высшем уровне — официанты внимательные и дружелюбные. Уходили сытыми и довольными. Однозначно рекомендую!', '2024-12-17'),
(29, 43, 3, 'Заведение неплохое, но не впечатлило. Интерьер красивый и уютный, однако обслуживание оставляет желать лучшего — пришлось ждать официанта почти 20 минут. Еда нормальная, но ничего выдающегося. Можно заглянуть разок, но возвращаться вряд ли захочется.', '2024-12-17'),
(30, 44, 4, 'Хорошее место для ужина с друзьями или семьёй. Большие порции, приятный интерьер и доброжелательный персонал. Единственный минус — долгое ожидание блюд в час пик. В целом, остались довольны, особенно понравился \'Стейк\' — очень вкусно!', '2024-12-17'),
(31, 45, 4, 'Ресторан оставил приятное впечатление. Обслуживание вежливое и быстрое. Блюда понравились. Цены чуть выше среднего, но качество это оправдывает. Минус — немного шумно из-за большого количества посетителей.', '2024-12-17'),
(32, 46, 3, 'Средненько. Понравился интерьер — чисто и стильно. Еда на троечку, ничего особенного, но сытно. Официанты были приветливы, но забыли про наш заказ и принесли его с опозданием. Для быстрого перекуса место подойдёт, но за чем-то особенным сюда не стоит идти.', '2024-12-17');

-- --------------------------------------------------------

--
-- Структура таблицы `Пользователь`
--

CREATE TABLE `Пользователь` (
  `ID` int UNSIGNED NOT NULL,
  `Email` char(255) NOT NULL,
  `Пароль` char(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Номер_телефона` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Фамилия` char(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Имя` char(255) NOT NULL,
  `Отчество` char(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Дамп данных таблицы `Пользователь`
--

INSERT INTO `Пользователь` (`ID`, `Email`, `Пароль`, `Номер_телефона`, `Фамилия`, `Имя`, `Отчество`) VALUES
(35, 'Sas@gmail.com', '$2b$10$WdMRuxatJ/zGiUSk7CUTEOA8WLtKbb3Cu6Z6JRSOo.zxUWn5mcbsK', '89194492626', 'Иванов', 'Александр', 'Иванович'),
(37, 'Mivit52@gmail.com', '$2b$10$5z7TxlhJ7ikRGbN9e1J74u1FJBefq9n7WuEsvEWB1v6F3wiweadqm', '89194582523', 'Павлов', 'Михаил', 'Витальевич'),
(38, 'Kirill36@gmail.com', '$2b$10$lHJFiqSkuW4jSLUSbZ5kIeXRppRdHtpV83aw2GPpSNDXnB2WNucZm', '89194781548', 'Иванов', 'Кирилл', 'Генадьевич'),
(42, 'ivan2345@gmail.com', '$2b$10$ktmmtzH.Wp.D9CmIp1Pu3.uqYGNhdWU4wGcZ6vJGN8CEnJOWzYdcm', '89194687205', 'Иванов', 'Иван', 'Иванович'),
(43, 'alex@gmail.com', '$2b$10$kftwLIVYamRV5SHQkrabSeLaz1bXPO3v5KPcOyuwhtOJUFM6Hj.Ne', '89146589246', 'Титов', 'Александр', 'Юрьевич'),
(44, 'agm398@gmail.com', '$2b$10$XOkj0cVTe4zMFVZrm1SLjuJim5qBz26qnH7cC0sPQp55zjSO992Di', '89567341208', 'Александров', 'Герман', 'Михайлович'),
(45, 'gen487@gmail.com', '$2b$10$BpyJVQ2rX2r/OhJbaIY.5Om5MsJjSqGo.Wp3a1Pwwe01og0XSmaX6', '89847584325', 'Динов', 'Генадий', 'Викторович'),
(46, 'rom4973@gmail.com', '$2b$10$mS5xLMcy7H30FAVeOYyQIefbmZJZMSmjguj1Xdz/XF/n2ksMpeOYC', '89263557196', 'Булатов', 'Роман', 'Павлович');

-- --------------------------------------------------------

--
-- Структура таблицы `Прайс_лист`
--

CREATE TABLE `Прайс_лист` (
  `ID` int UNSIGNED NOT NULL,
  `ID_блюда` int UNSIGNED NOT NULL,
  `Цена` int NOT NULL,
  `Дата` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Дамп данных таблицы `Прайс_лист`
--

INSERT INTO `Прайс_лист` (`ID`, `ID_блюда`, `Цена`, `Дата`) VALUES
(2, 2, 1000, '2024-11-20'),
(3, 3, 1000, '2024-11-20'),
(4, 4, 1000, '2024-11-20'),
(6, 6, 180, '2024-11-20'),
(7, 7, 180, '2024-11-20'),
(8, 8, 100, '2025-01-09'),
(9, 9, 500, '2025-01-21'),
(10, 10, 1000, '2025-01-09');

-- --------------------------------------------------------

--
-- Структура таблицы `Блюда`
--

CREATE TABLE `Блюда` (
  `ID` int UNSIGNED NOT NULL,
  `ID_категории` int UNSIGNED NOT NULL,
  `Название` char(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Фото` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Дамп данных таблицы `Блюда`
--

INSERT INTO `Блюда` (`ID`, `ID_категории`, `Название`, `Фото`) VALUES
(2, 1, 'Стейк', '/images/meat_delivery.png'),
(3, 2, 'Яйца с ветчиной и беконом', '/images/eggs_bacon.png'),
(4, 2, 'Омлет с помидором и сыром фета', '/images/eggs_tomato.png'),
(6, 3, 'Молочный коктель', '/images/milkShake_delivery.png'),
(7, 3, 'Кофе', '/images/coffee_delivery.png'),
(8, 3, 'Сок', '/images/juice.png'),
(9, 1, 'Блины', '/images/pancakes.png'),
(10, 2, 'Буррито', '/images/burrito.png');

-- --------------------------------------------------------

--
-- Структура таблицы `Блюда_в_корзине`
--

CREATE TABLE `Блюда_в_корзине` (
  `ID` int UNSIGNED NOT NULL,
  `ID_блюда` int UNSIGNED NOT NULL,
  `ID_пользователя` int UNSIGNED NOT NULL,
  `Количество` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Структура таблицы `Блюда_в_заказе`
--

CREATE TABLE `Блюда_в_заказе` (
  `ID` int UNSIGNED NOT NULL,
  `ID_блюда` int UNSIGNED NOT NULL,
  `ID_заказа` int UNSIGNED NOT NULL,
  `Количество` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Дамп данных таблицы `Блюда_в_заказе`
--

INSERT INTO `Блюда_в_заказе` (`ID`, `ID_блюда`, `ID_заказа`, `Количество`) VALUES
(175, 2, 109, 1),
(176, 9, 109, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `Бронирование`
--

CREATE TABLE `Бронирование` (
  `ID` int UNSIGNED NOT NULL,
  `ID_стола` int UNSIGNED NOT NULL,
  `ID_пользователя` int UNSIGNED NOT NULL,
  `Количество_человек` int NOT NULL,
  `Дата` date NOT NULL,
  `Время` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Структура таблицы `Должность_сотрудника`
--

CREATE TABLE `Должность_сотрудника` (
  `ID` int UNSIGNED NOT NULL,
  `Наименование` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Дамп данных таблицы `Должность_сотрудника`
--

INSERT INTO `Должность_сотрудника` (`ID`, `Наименование`) VALUES
(1, 'Контент-менеджер'),
(2, 'Менеджер-заказов'),
(3, 'Курьер'),
(4, 'Менеджер-брони');

-- --------------------------------------------------------

--
-- Структура таблицы `Заказ`
--

CREATE TABLE `Заказ` (
  `ID` int UNSIGNED NOT NULL,
  `ID_статуса` int UNSIGNED NOT NULL DEFAULT '1',
  `ID_адреса` int UNSIGNED NOT NULL,
  `ID_способа` int UNSIGNED NOT NULL,
  `ID_пользователя` int UNSIGNED NOT NULL,
  `ID_сотрудника` int UNSIGNED DEFAULT NULL,
  `Общая_цена_блюд` int NOT NULL,
  `Цена_доставки` int NOT NULL DEFAULT '500',
  `Дата_заказа` date NOT NULL,
  `Время_заказа` time NOT NULL,
  `Время_доставки` time NOT NULL DEFAULT '01:30:00',
  `Примечания` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Дамп данных таблицы `Заказ`
--

INSERT INTO `Заказ` (`ID`, `ID_статуса`, `ID_адреса`, `ID_способа`, `ID_пользователя`, `ID_сотрудника`, `Общая_цена_блюд`, `Цена_доставки`, `Дата_заказа`, `Время_заказа`, `Время_доставки`, `Примечания`) VALUES
(109, 1, 118, 1, 35, 3, 1500, 500, '2025-01-28', '23:55:06', '01:30:00', 'Код домофона 754736');

-- --------------------------------------------------------

--
-- Структура таблицы `Спец_предложения`
--

CREATE TABLE `Спец_предложения` (
  `ID` int UNSIGNED NOT NULL,
  `ID_блюда` int UNSIGNED NOT NULL,
  `Описание` text NOT NULL,
  `Дата_начала` date NOT NULL,
  `Дата_окончания` date NOT NULL,
  `Размер_скидки` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Дамп данных таблицы `Спец_предложения`
--

INSERT INTO `Спец_предложения` (`ID`, `ID_блюда`, `Описание`, `Дата_начала`, `Дата_окончания`, `Размер_скидки`) VALUES
(1, 3, 'Скидка 50%', '2025-03-10', '2025-03-19', 500),
(2, 4, 'Скидка 50%', '2024-12-01', '2024-12-31', 500),
(9, 10, 'Скидка 50%', '2025-01-01', '2025-01-26', 500);

-- --------------------------------------------------------

--
-- Структура таблицы `Способ_оплаты`
--

CREATE TABLE `Способ_оплаты` (
  `ID` int UNSIGNED NOT NULL,
  `Наименование` char(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Дамп данных таблицы `Способ_оплаты`
--

INSERT INTO `Способ_оплаты` (`ID`, `Наименование`) VALUES
(1, 'Наличными при получении'),
(2, 'Картой при получении');

-- --------------------------------------------------------

--
-- Структура таблицы `Сотрудники`
--

CREATE TABLE `Сотрудники` (
  `ID` int UNSIGNED NOT NULL,
  `ID_ресторана` int UNSIGNED NOT NULL,
  `ID_должности_сотрудника` int UNSIGNED NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Пароль` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Номер_телефона` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Фамилия` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Имя` varchar(255) NOT NULL,
  `Отчество` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Дамп данных таблицы `Сотрудники`
--

INSERT INTO `Сотрудники` (`ID`, `ID_ресторана`, `ID_должности_сотрудника`, `Email`, `Пароль`, `Номер_телефона`, `Фамилия`, `Имя`, `Отчество`) VALUES
(1, 2, 1, 'Contman@gmail.com', '$2b$10$WeVemZePCcvrYoZTNU2nEuaUtlqI5Q8JMkIHGBiz9WajPgZFiuuym', '89191475851', 'Петрова', 'Елизавета', 'Александровна'),
(2, 2, 2, 'Manord@gmail.com', '$2b$10$uKUCvz18EW0gogOg83tHh.3hvBY9ex6U7SEQNv6HjBaqtW0BMdXjO', '89194768548', 'Тарин', 'Михаил', 'Валерьевич'),
(3, 2, 3, 'Deliver@gmail.com', '$2b$10$EwgYe6rBT36Q6qauIFWfHudcYf26cryuQMHdPDXKUka3W9pfhA5Ly', '89194497685', 'Перов', 'Павел', 'Алексеевич'),
(4, 2, 4, 'Reservman@gmail.com', '$2b$10$AResCyypFWJX0sKKVulnGutM1odR9b/SEQkjfCKMQcphj7R5pbkya', '89123462956', 'Павлов', 'Сергей', 'Валерьевич');

-- --------------------------------------------------------

--
-- Структура таблицы `Статус_заказа`
--

CREATE TABLE `Статус_заказа` (
  `ID` int UNSIGNED NOT NULL,
  `Наименование` char(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Дамп данных таблицы `Статус_заказа`
--

INSERT INTO `Статус_заказа` (`ID`, `Наименование`) VALUES
(1, 'В обработке'),
(2, 'Готовиться'),
(3, 'Готов'),
(4, 'В пути'),
(5, 'Получен');

-- --------------------------------------------------------

--
-- Структура таблицы `Столы`
--

CREATE TABLE `Столы` (
  `ID` int UNSIGNED NOT NULL,
  `Наименование` varchar(255) NOT NULL,
  `Вместимость` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Дамп данных таблицы `Столы`
--

INSERT INTO `Столы` (`ID`, `Наименование`, `Вместимость`) VALUES
(1, '1(2 персоны)', 2),
(2, '2(4 персоны)', 4),
(3, '3(2 персоны)', 2),
(4, '4(6 персон)', 6),
(5, '5(2 персоны)', 2),
(6, '6(6 персон)', 6),
(7, '7(4 персоны)', 4),
(8, '8(2 персоны)', 2),
(9, '9(4 персоны)', 4),
(10, '10(2 персоны)', 2);

-- --------------------------------------------------------

--
-- Структура таблицы `Ресторан`
--

CREATE TABLE `Ресторан` (
  `ID` int UNSIGNED NOT NULL,
  `Название` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Дамп данных таблицы `Ресторан`
--

INSERT INTO `Ресторан` (`ID`, `Название`) VALUES
(2, 'Best-Rest');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `Адрес`
--
ALTER TABLE `Адрес`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `Категория_блюда`
--
ALTER TABLE `Категория_блюда`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `Отзыв`
--
ALTER TABLE `Отзыв`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Отзыв_id_пользователя_foreign` (`ID_пользователя`);

--
-- Индексы таблицы `Пользователь`
--
ALTER TABLE `Пользователь`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `Прайс_лист`
--
ALTER TABLE `Прайс_лист`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Прайс лист_id_блюда_foreign` (`ID_блюда`);

--
-- Индексы таблицы `Блюда`
--
ALTER TABLE `Блюда`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Блюда_id_категории_foreign` (`ID_категории`);

--
-- Индексы таблицы `Блюда_в_корзине`
--
ALTER TABLE `Блюда_в_корзине`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Блюда в корзине_id_блюда_foreign` (`ID_блюда`),
  ADD KEY `Блюда_в_корзине_ID_пользователя_foreign` (`ID_пользователя`);

--
-- Индексы таблицы `Блюда_в_заказе`
--
ALTER TABLE `Блюда_в_заказе`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Блюда_в_заказе_ID_блюда_foreign` (`ID_блюда`),
  ADD KEY `Блюда_в_заказе_ID_заказа_foreign` (`ID_заказа`);

--
-- Индексы таблицы `Бронирование`
--
ALTER TABLE `Бронирование`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Бронирование_id_пользователя_foreign` (`ID_пользователя`),
  ADD KEY `Бронирование_id_стола_foreign` (`ID_стола`);

--
-- Индексы таблицы `Должность_сотрудника`
--
ALTER TABLE `Должность_сотрудника`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `Заказ`
--
ALTER TABLE `Заказ`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Заказ_id_статуса_foreign` (`ID_статуса`),
  ADD KEY `Заказ_id_способа_foreign` (`ID_способа`),
  ADD KEY `Заказ_ID_адреса_foreign` (`ID_адреса`),
  ADD KEY `Заказ_ID_сотрудника_foreign` (`ID_сотрудника`),
  ADD KEY `Заказ_ID_пользователя_foreign` (`ID_пользователя`);

--
-- Индексы таблицы `Спец_предложения`
--
ALTER TABLE `Спец_предложения`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Спец предложения_id_блюда_foreign` (`ID_блюда`);

--
-- Индексы таблицы `Способ_оплаты`
--
ALTER TABLE `Способ_оплаты`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `Сотрудники`
--
ALTER TABLE `Сотрудники`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Сотрудники_ID_роли_сотрудника_foreign` (`ID_должности_сотрудника`),
  ADD KEY `Сотрудники_ID_ресторана_foreign` (`ID_ресторана`);

--
-- Индексы таблицы `Статус_заказа`
--
ALTER TABLE `Статус_заказа`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `Столы`
--
ALTER TABLE `Столы`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `Ресторан`
--
ALTER TABLE `Ресторан`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `Адрес`
--
ALTER TABLE `Адрес`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT для таблицы `Категория_блюда`
--
ALTER TABLE `Категория_блюда`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `Отзыв`
--
ALTER TABLE `Отзыв`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT для таблицы `Пользователь`
--
ALTER TABLE `Пользователь`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT для таблицы `Прайс_лист`
--
ALTER TABLE `Прайс_лист`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT для таблицы `Блюда`
--
ALTER TABLE `Блюда`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT для таблицы `Блюда_в_корзине`
--
ALTER TABLE `Блюда_в_корзине`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=289;

--
-- AUTO_INCREMENT для таблицы `Блюда_в_заказе`
--
ALTER TABLE `Блюда_в_заказе`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=180;

--
-- AUTO_INCREMENT для таблицы `Бронирование`
--
ALTER TABLE `Бронирование`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT для таблицы `Должность_сотрудника`
--
ALTER TABLE `Должность_сотрудника`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `Заказ`
--
ALTER TABLE `Заказ`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT для таблицы `Спец_предложения`
--
ALTER TABLE `Спец_предложения`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT для таблицы `Способ_оплаты`
--
ALTER TABLE `Способ_оплаты`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `Сотрудники`
--
ALTER TABLE `Сотрудники`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `Статус_заказа`
--
ALTER TABLE `Статус_заказа`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT для таблицы `Столы`
--
ALTER TABLE `Столы`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `Ресторан`
--
ALTER TABLE `Ресторан`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `Отзыв`
--
ALTER TABLE `Отзыв`
  ADD CONSTRAINT `Отзыв_id_пользователя_foreign` FOREIGN KEY (`ID_пользователя`) REFERENCES `Пользователь` (`ID`);

--
-- Ограничения внешнего ключа таблицы `Прайс_лист`
--
ALTER TABLE `Прайс_лист`
  ADD CONSTRAINT `Прайс лист_id_блюда_foreign` FOREIGN KEY (`ID_блюда`) REFERENCES `Блюда` (`ID`);

--
-- Ограничения внешнего ключа таблицы `Блюда`
--
ALTER TABLE `Блюда`
  ADD CONSTRAINT `Блюда_id_категории_foreign` FOREIGN KEY (`ID_категории`) REFERENCES `Категория_блюда` (`ID`);

--
-- Ограничения внешнего ключа таблицы `Блюда_в_корзине`
--
ALTER TABLE `Блюда_в_корзине`
  ADD CONSTRAINT `Блюда в корзине_id_блюда_foreign` FOREIGN KEY (`ID_блюда`) REFERENCES `Блюда` (`ID`),
  ADD CONSTRAINT `Блюда_в_корзине_ID_пользователя_foreign` FOREIGN KEY (`ID_пользователя`) REFERENCES `Пользователь` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ограничения внешнего ключа таблицы `Блюда_в_заказе`
--
ALTER TABLE `Блюда_в_заказе`
  ADD CONSTRAINT `Блюда_в_заказе_ID_блюда_foreign` FOREIGN KEY (`ID_блюда`) REFERENCES `Блюда` (`ID`),
  ADD CONSTRAINT `Блюда_в_заказе_ID_заказа_foreign` FOREIGN KEY (`ID_заказа`) REFERENCES `Заказ` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ограничения внешнего ключа таблицы `Бронирование`
--
ALTER TABLE `Бронирование`
  ADD CONSTRAINT `Бронирование_id_пользователя_foreign` FOREIGN KEY (`ID_пользователя`) REFERENCES `Пользователь` (`ID`),
  ADD CONSTRAINT `Бронирование_id_стола_foreign` FOREIGN KEY (`ID_стола`) REFERENCES `Столы` (`ID`);

--
-- Ограничения внешнего ключа таблицы `Заказ`
--
ALTER TABLE `Заказ`
  ADD CONSTRAINT `Заказ_ID_адреса_foreign` FOREIGN KEY (`ID_адреса`) REFERENCES `Адрес` (`ID`),
  ADD CONSTRAINT `Заказ_ID_пользователя_foreign` FOREIGN KEY (`ID_пользователя`) REFERENCES `Пользователь` (`ID`),
  ADD CONSTRAINT `Заказ_ID_сотрудника_foreign` FOREIGN KEY (`ID_сотрудника`) REFERENCES `Сотрудники` (`ID`),
  ADD CONSTRAINT `Заказ_id_способа_foreign` FOREIGN KEY (`ID_способа`) REFERENCES `Способ_оплаты` (`ID`),
  ADD CONSTRAINT `Заказ_id_статуса_foreign` FOREIGN KEY (`ID_статуса`) REFERENCES `Статус_заказа` (`ID`);

--
-- Ограничения внешнего ключа таблицы `Спец_предложения`
--
ALTER TABLE `Спец_предложения`
  ADD CONSTRAINT `Спец предложения_id_блюда_foreign` FOREIGN KEY (`ID_блюда`) REFERENCES `Блюда` (`ID`);

--
-- Ограничения внешнего ключа таблицы `Сотрудники`
--
ALTER TABLE `Сотрудники`
  ADD CONSTRAINT `Сотрудники_ID_ресторана_foreign` FOREIGN KEY (`ID_ресторана`) REFERENCES `Ресторан` (`ID`),
  ADD CONSTRAINT `Сотрудники_ID_роли_сотрудника_foreign` FOREIGN KEY (`ID_должности_сотрудника`) REFERENCES `Должность_сотрудника` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
