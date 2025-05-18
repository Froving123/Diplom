const mysql = require("mysql");

// Настройка подключения к базе данных
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Sasha228",
  database: "BRC",
});

class ContmanController {
  async getAllReserv(req, res) {
    try {
      const query = `
              SELECT 
                Бронирование.ID AS reservId,
                Бронирование.Дата AS reservDate,
                Бронирование.Время AS reservTime,
                Бронирование.Количество_человек AS people,
                Столы.Наименование AS tableNumber,
                Пользователь.ID AS userId,
                Пользователь.Имя AS userName,
                Пользователь.Фамилия AS userSurname,
                Пользователь.Email AS userEmail,
                Пользователь.Номер_телефона AS userPhone
              FROM Бронирование
              INNER JOIN Столы ON Бронирование.ID_стола = Столы.ID
              INNER JOIN Пользователь ON Бронирование.ID_пользователя = Пользователь.ID
              ORDER BY Бронирование.Дата, Бронирование.Время DESC;
            `;

      conn.query(query, (err, results) => {
        if (err) {
          console.error("Ошибка при получении брони:", err);
          return res.status(500).json({
            success: false,
            message: "Ошибка при получении брони",
          });
        }
        res.json({ success: true, data: results });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }

  async deleteReserv(req, res) {
    const { reservId } = req.body; // Получение ID из тела запроса

    if (!reservId) {
      return res.status(400).json({ success: false, message: "ID не указан" });
    }

    try {
      const query = `
          DELETE FROM Бронирование
          WHERE ID = ?
        `;
      conn.query(query, [reservId], (err, result) => {
        if (err) {
          console.error("Ошибка при удалении брони:", err);
          return res.status(500).json({
            success: false,
            message: "Ошибка при удалении брони",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "бронь с указанным ID не найдена",
          });
        }

        res.json({
          success: true,
          message: "бронь успешно удалена",
        });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }
}

module.exports = new ContmanController();
