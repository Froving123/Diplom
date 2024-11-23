const mysql = require("mysql");

const conn = mysql.createConnection({
  host: "MySQL-8.0",
  user: "root",
  password: "Sasha228",
  database: "Best-Rest",
});

class ReservationController {
  async createReservation(req, res) {
    try {
      // Извлекаем токен из заголовков авторизации
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Вы не авторизованы",
        });
      }

      const token = authHeader.split(" ")[1];
      let userId;

      // Расшифровка токена
      try {
        const decoded = jwt.verify(token, jwtSecret);
        userId = decoded.userId; // Получаем ID пользователя из токена
      } catch (err) {
        return res.status(403).json({
          success: false,
          message: "Неверный или истекший токен",
        });
      }

      // Получаем данные бронирования из тела запроса
      const { date, time, people, number } = req.body;

      // Проверка на наличие всех обязательных полей
      if (!date || !time || !people || !number) {
        return res.status(400).json({
          success: false,
          message: "Пожалуйста, заполните все поля",
        });
      }

      // SQL-запрос для создания бронирования
      const reservationQuery = `
            INSERT INTO Бронирование (ID_стола, количество_человек, дата, время, ID_пользователя)
            VALUES (?, ?, ?, ?, ?)
          `;

      conn.query(
        reservationQuery,
        [number, people, date, time, userId],
        (err, result) => {
          if (err) {
            console.error("Ошибка при создании бронирования:", err);
            return res.status(500).json({
              success: false,
              message: "Ошибка при создании бронирования",
            });
          }

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

  async userReservation(req, res) {}
}

module.exports = new ReservationController();
