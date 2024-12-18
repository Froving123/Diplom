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
  async tablesReservation(req, res) {
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

        res.status(200).json({
          success: true,
          tables: results,
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

  async activeTables(req, res) {
    try {
      const { date, time, people } = req.query;

      const query = `
            SELECT ID, Наименование, Вместимость
            FROM Столы
            WHERE Вместимость >= ?
            AND ID NOT IN (
                SELECT ID_стола
                FROM Бронирование
                WHERE Дата = ? AND ABS(TIME_TO_SEC(TIME(Время)) - TIME_TO_SEC(?)) < 10800
            )
        `;

      conn.query(query, [people, date, time], (err, results) => {
        if (err) {
          console.error("Ошибка при получении доступных столов:", err);
          return res.status(500).json({
            success: false,
            message: "Ошибка при получении доступных столов",
          });
        }

        return res.status(200).json({ success: true, tables: results });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      return res
        .status(500)
        .json({ success: false, message: "Произошла ошибка на сервере" });
    }
  }

  async createReservation(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Токен отсутствует" });
    }

    const token = authHeader.split(" ")[1];
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, jwtSecret);
    } catch (err) {
      return res
        .status(401)
        .json({ success: false, message: "Неверный токен" });
    }

    const userId = decodedToken.userId;

    const { date, time, table, people } = req.body;

    if (!date || !time || !table || !people) {
      return res.status(400).json({
        success: false,
        message: "Не все обязательные данные предоставлены.",
      });
    }

    // Проверяем количество бронирований пользователя в базе данных
    const query = `
      SELECT COUNT(*) AS reservCount
      FROM Бронирование
      WHERE ID_пользователя = ?`;

    conn.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Ошибка при проверке бронирований пользователя:", err);
        return res.status(500).json({
          success: false,
          message: "Ошибка при проверке бронирований",
        });
      }

      const reservCount = results[0].reservCount;

      // Если у пользователя уже 3 или больше бронирований, блокируем создание нового
      if (reservCount >= 3) {
        return res.status(400).json({
          success: false,
          message: "Вы не можете создать более 3-х бронирований.",
        });
      }

      // Если бронирований меньше 3-х, разрешаем создать новое бронирование
      const insertQuery = `
        INSERT INTO Бронирование (ID_пользователя, Дата, Время, Количество_человек, ID_стола)
        VALUES (?, ?, ?, ?, ?)`;

      conn.query(
        insertQuery,
        [userId, date, time, people, table],
        (err, results) => {
          if (err) {
            console.error("Ошибка при создании бронирования:", err);
            return res.status(500).json({
              success: false,
              message: "Ошибка при создании бронирования",
            });
          }

          return res
            .status(201)
            .json({ success: true, message: "Бронирование успешно создано" });
        }
      );
    });
  }

  async removeReserv(req, res) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ success: false, message: "Токен отсутствует" });
      }

      const token = authHeader.split(" ")[1];
      let decodedToken;
      try {
        decodedToken = jwt.verify(token, jwtSecret);
      } catch (err) {
        return res
          .status(401)
          .json({ success: false, message: "Неверный токен" });
      }

      const userId = decodedToken.userId;

      // Находим бронирование пользователя
      const findReservQuery = `SELECT ID FROM Бронирование WHERE ID_пользователя = ?`;
      conn.query(findReservQuery, [userId], (err, reservResults) => {
        if (err || reservResults.length === 0) {
          return res
            .status(404)
            .json({ success: false, message: "бронь не найдена" });
        }

        const reservId = reservResults[0].ID;

        // Отменяем бронь
        const deleteReserv = `
          DELETE FROM Бронирование 
          WHERE ID = ?
        `;
        conn.query(deleteReserv, [reservId], (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Ошибка при отмене Бронирования",
            });
          }
          res.status(200).json({
            success: true,
            message: "Бронирование отменено",
          });
        });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }

  async userReservation(req, res) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: true,
        });
      }

      const token = authHeader.split(" ")[1];

      let userId;

      try {
        const decoded = jwt.verify(token, jwtSecret);
        userId = decoded.userId;
      } catch (err) {
        console.error("Ошибка расшифровки токена:", err);
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

      conn.query(query, [userId], (err, results) => {
        if (err) {
          console.error("Ошибка при получении записей бронирования:", err);
          return res.status(500).json({
            success: false,
            message: "Ошибка при получении записей бронирования",
          });
        }

        return res.status(200).json({
          success: true,
          reservations: results,
        });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      return res.status(500).json({
        success: false,
        message: "Произошла ошибка на сервере",
      });
    }
  }
}

module.exports = new ReservationController();
