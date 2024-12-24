const mysql = require("mysql");

const conn = mysql.createConnection({
  host: "MySQL-8.0",
  user: "root",
  password: "Sasha228",
  database: "Best-Rest",
});

class ContmanController {
  async newPrice(req, res) {
    try {
      const { dishId, price } = req.body;

      // Проверка входных данных
      if (!dishId || !price) {
        return res
          .status(400)
          .json({ success: false, message: "Неверные данные" });
      }

      const query = `
            UPDATE 
              Прайс_лист
            SET 
              Цена = ?,
              Дата = CURDATE()
            WHERE 
              ID_блюда = ?
          `;

      conn.query(query, [price, dishId], (err, result) => {
        if (err) {
          console.error(
            "Ошибка при обновлении цены в таблице Прайс_лист:",
            err
          );
          return res.status(500).json({
            success: false,
            message: "Ошибка при обновлении цены",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "Блюдо не найдено в Прайс_листе",
          });
        }

        res.json({
          success: true,
          message: "Цена успешно обновлена",
        });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }

  async getAllOffers(req, res) {
    try {
      const query = `
        SELECT 
          Спец_предложения.ID, 
          Спец_предложения.Описание, 
          Спец_предложения.Дата_начала, 
          Спец_предложения.Дата_окончания, 
          Спец_предложения.Размер_скидки, 
          Блюда.Название AS Название_блюда
        FROM 
          Спец_предложения
        JOIN 
          Блюда ON Спец_предложения.ID_блюда = Блюда.ID
      `;
      conn.query(query, (err, results) => {
        if (err) {
          console.error("Ошибка при получении предложений:", err);
          return res.status(500).json({
            success: false,
            message: "Ошибка при получении предложений",
          });
        }
        res.json({ success: true, data: results });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }

  // Удаление спецпредложения
  async deleteOffer(req, res) {
    const { id } = req.body; // Получение ID из тела запроса

    if (!id) {
      return res.status(400).json({ success: false, message: "ID не указан" });
    }

    try {
      const query = `
          DELETE FROM Спец_предложения
          WHERE ID = ?
        `;
      conn.query(query, [id], (err, result) => {
        if (err) {
          console.error("Ошибка при удалении предложения:", err);
          return res.status(500).json({
            success: false,
            message: "Ошибка при удалении предложения",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "Спецпредложение с указанным ID не найдено",
          });
        }

        res.json({
          success: true,
          message: "Спецпредложение успешно удалено",
        });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }

  // Создание нового спецпредложения
  async createOffer(req, res) {
    const { dish, description, startDate, endDate, discount } = req.body;

    if (!dish || !description || !startDate || !endDate || !discount) {
      return res
        .status(400)
        .json({ success: false, message: "Данные не указаны" });
    }

    try {
      const query = `
        INSERT INTO Спец_предложения (ID_блюда, Описание, Дата_начала, Дата_окончания, Размер_скидки) 
        VALUES (?, ?, ?, ?, ?)
      `;
      conn.query(
        query,
        [dish, description, startDate, endDate, discount],
        (err, result) => {
          if (err) {
            console.error("Ошибка при создании предложения:", err);
            return res.status(500).json({
              success: false,
              message: "Ошибка при создании предложения",
            });
          }
          res.json({ success: true, message: "Новое предложение создано" });
        }
      );
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }

  async activeDish(req, res) {
    try {
      const query = `
            SELECT ID, Название
            FROM Блюда
            WHERE ID NOT IN (
                SELECT ID_Блюда
                FROM Спец_предложения
            )
        `;

      conn.query(query, (err, results) => {
        if (err) {
          console.error("Ошибка при получении доступных блюд:", err);
          return res.status(500).json({
            success: false,
            message: "Ошибка при получении доступных блюд",
          });
        }

        return res.status(200).json({ success: true, dishes: results });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      return res
        .status(500)
        .json({ success: false, message: "Произошла ошибка на сервере" });
    }
  }

  async getAllReview(req, res) {
    try {
      const query = `
        SELECT 
          Отзыв.ID, 
          Отзыв.Оценка, 
          Отзыв.Текст_отзыва, 
          Отзыв.Дата, 
          Пользователь.Имя AS Имя_пользователя
        FROM 
          Отзыв
        JOIN 
          Пользователь ON Отзыв.ID_пользователя = Пользователь.ID
          ORDER BY Отзыв.Дата DESC
      `;
      conn.query(query, (err, results) => {
        if (err) {
          console.error("Ошибка при получении отзывов:", err);
          return res.status(500).json({
            success: false,
            message: "Ошибка при получении отзывов",
          });
        }
        res.json({ success: true, data: results });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }

  async deleteReview(req, res) {
    const { id } = req.body; // Получение ID из тела запроса

    if (!id) {
      return res.status(400).json({ success: false, message: "ID не указан" });
    }

    try {
      const query = `
          DELETE FROM Отзыв
          WHERE ID = ?
        `;
      conn.query(query, [id], (err, result) => {
        if (err) {
          console.error("Ошибка при удалении отзыва:", err);
          return res.status(500).json({
            success: false,
            message: "Ошибка при удалении отзыва",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "Отзыв с указанным ID не найден",
          });
        }

        res.json({
          success: true,
          message: "Отзыв успешно удален",
        });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }
}

module.exports = new ContmanController();
