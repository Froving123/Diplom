const mysql = require("mysql");
const jwt = require("jsonwebtoken");

const jwtSecret = "Best-Rest";

const conn = mysql.createConnection({
  host: "MySQL-8.0",
  user: "root",
  password: "Sasha228",
  database: "Best-Rest",
});

class ReservationController {
  async createReservation(req, res) {
    try {
      const authHeader = req.headers.authorization;

      // Проверка наличия токена
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ success: false, message: "Токен отсутствует" });
      }

      const token = authHeader.split(" ")[1];

      // Расшифровка токена и извлечение ID пользователя
      let decodedToken;
      try {
        decodedToken = jwt.verify(token, jwtSecret);
      } catch (err) {
        return res
          .status(401)
          .json({ success: false, message: "Неверный токен" });
      }

      const userId = decodedToken.userId;

      // Получаем данные для бронирования из тела запроса
      const { table, people, date, time } = req.body;

      // SQL-запрос для создания бронирования
      const reservationQuery = `
          INSERT INTO Бронирование (ID_стола, Количество_человек, Дата, Время, ID_пользователя)
          VALUES (?, ?, ?, ?, ?)
        `;

      conn.query(
        reservationQuery,
        [table, people, date, time, userId],
        (err, result) => {
          if (err) {
            console.error("Ошибка при создании бронирования:", err);
            return res.status(500).json({
              success: false,
              message: "Ошибка при создании бронирования",
            });
          }

          // Бронирование успешно создано
          return res.status(201).json({
            success: true,
            message: "Бронирование успешно создано",
          });
        }
      );
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      return res.status(500).json({
        success: false,
        message: "Произошла ошибка на сервере",
      });
    }
  }

  async tableReservation(req, res) {
    try {
      // SQL-запрос для получения всех столов
      const query = `SELECT ID, Наименование FROM Столы`;

      conn.query(query, (err, results) => {
        if (err) {
          console.error("Ошибка при получении столов:", err);
          return res.status(500).json({
            success: false,
            message: "Ошибка при получении столов",
          });
        }

        // Возвращаем список столов
        res.status(200).json({
          success: true,
          tables: results, // Список столов с их ID и названиями
        });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({
        success: false,
        message: "Произошла ошибка на сервере",
      });
    }
  }

  async userReservation(req, res) {
    try {
      // Извлекаем токен из заголовков авторизации
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: true,
          message: "Бронирование пользователя выведено на фронт",
        });
      }

      const token = authHeader.split(" ")[1];

      let userId;

      // Расшифровываем токен
      try {
        const decoded = jwt.verify(token, jwtSecret);
        userId = decoded.userId; // Получаем ID пользователя из токена
      } catch (err) {
        console.error("Ошибка расшифровки токена:", err); // Логируем ошибку, если токен неверный
        return res.status(403).json({
          success: false,
          message: "Неверный или истекший токен",
        });
      }

      // SQL-запрос для получения записей бронирования пользователя
      const query = `
        SELECT 
          Бронирование.ID,
          Бронирование.Количество_человек,
          Бронирование.Дата,
          Бронирование.Время,
          Столы.Наименование AS Номер_стола
        FROM 
          Бронирование  
        INNER JOIN 
          Столы
        ON 
          Бронирование.ID_стола = Столы.ID
        WHERE 
          Бронирование.ID_пользователя = ?
      `;

      // Выполняем запрос к базе данных
      conn.query(query, [userId], (err, results) => {
        if (err) {
          console.error("Ошибка при получении записей бронирования:", err); // Логируем ошибку SQL
          return res.status(500).json({
            success: false,
            message: "Ошибка при получении записей бронирования",
          });
        }

        // Возвращаем записи бронирования
        return res.status(200).json({
          success: true,
          reservations: results,
        });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error); // Логируем общую ошибку
      return res.status(500).json({
        success: false,
        message: "Произошла ошибка на сервере",
      });
    }
  }
}

module.exports = new ReservationController();
