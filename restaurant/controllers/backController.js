const mysql = require("mysql");
const jwt = require("jsonwebtoken");

const jwtSecret = "Best-Rest";

const conn = mysql.createConnection({
  host: "MySQL-8.0",
  user: "root",
  password: "Sasha228",
  database: "Best-Rest",
});

class FeedbackController {
  // Функция для создания отзыва
  async createFeedback(req, res) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Сессия была закончена, авторизуйтесь заново",
        });
      }

      const token = authHeader.split(" ")[1];

      let decodedToken;
      try {
        decodedToken = jwt.verify(token, jwtSecret);
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: "Сессия была закончена, авторизуйтесь заново",
        });
      }

      const userId = decodedToken.userId;
      const { score, text } = req.body;

      if (!score || !text) {
        return res.status(400).json({
          success: false,
          message: "Оценка и текст отзыва обязательны",
        });
      }

      // Проверяем, есть ли уже отзыв от этого пользователя
      const checkFeedbackQuery = `
                    SELECT * FROM Отзыв WHERE ID_пользователя = ?
                `;

      conn.query(checkFeedbackQuery, [userId], (err, result) => {
        if (err) {
          console.error("Ошибка при проверке отзыва:", err);
          return res.status(500).json({
            success: false,
            message: "Ошибка при проверке отзыва",
          });
        }

        if (result.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Вы уже оставили отзыв",
          });
        }

        // Если отзыва нет, создаем новый
        const feedbackQuery = `
                        INSERT INTO Отзыв (ID_пользователя, Оценка, Текст_отзыва, Дата)
                        VALUES (?, ?, ?, CURRENT_DATE)
                    `;

        conn.query(feedbackQuery, [userId, score, text], (err, result) => {
          if (err) {
            console.error("Ошибка при создании отзыва:", err);
            return res.status(500).json({
              success: false,
              message: "Ошибка при создании отзыва",
            });
          }

          return res.status(200).json({
            success: true,
            message: "Отзыв успешно создан",
          });
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

  async userFeedback(req, res) {
    try {
      const feedbackQuery = `
        SELECT
          Отзыв.ID, 
          Пользователь.Имя AS userName, 
          Отзыв.Оценка AS score, 
          Отзыв.Текст_отзыва AS text, 
          Отзыв.Дата AS date
        FROM 
          Отзыв
        INNER JOIN 
          Пользователь 
        ON 
          Отзыв.ID_пользователя = Пользователь.ID
          ORDER BY Отзыв.Дата DESC
      `;

      conn.query(feedbackQuery, (err, results) => {
        if (err) {
          console.error("Ошибка при получении отзывов:", err);
          return res.status(500).json({
            success: false,
          });
        }

        return res.status(200).json({
          success: true,
          feedbacks: results,
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

module.exports = new FeedbackController();
