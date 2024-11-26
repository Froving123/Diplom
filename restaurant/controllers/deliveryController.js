const mysql = require("mysql");
//const jwt = require("jsonwebtoken");

//const jwtSecret = "Best-Rest";

const conn = mysql.createConnection({
  host: "MySQL-8.0",
  user: "root",
  password: "Sasha228",
  database: "Best-Rest",
});

class DeliveryController {
  async getCategories(req, res) {
    try {
      const query = "SELECT ID, Наименование FROM Категория_блюда ORDER BY ID;";

      conn.query(query, (err, results) => {
        if (err) {
          console.error("Ошибка при получении категорий блюд:", err);
          return res.status(500).json({ success: false, message: "Ошибка при получении категорий" });
        }

        res.status(200).json({ success: true, categories: results });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }

  async menuDelivery(req, res) {
    try {
      const query = `
        SELECT 
          Блюда.ID, 
          Блюда.Название, 
          Блюда.Фото, 
          Категория_блюда.Наименование AS Категория,
          Прайс_лист.Цена
        FROM 
          Блюда
        JOIN 
          Категория_блюда ON Блюда.ID_категории = Категория_блюда.ID
        JOIN 
          Прайс_лист ON Блюда.ID = Прайс_лист.ID_блюда
        ORDER BY 
          Категория_блюда.ID, Блюда.ID;
      `;

      conn.query(query, (err, results) => {
        if (err) {
          console.error("Ошибка при получении меню:", err);
          return res.status(500).json({ success: false, message: "Ошибка при получении меню" });
        }

        res.status(200).json({ success: true, menu: results });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }

  async createBucket(req, res) {
    try {
      const { userId } = req.body;

      const checkQuery = `SELECT ID FROM Корзина WHERE ID_пользователя = ?`;
      conn.query(checkQuery, [userId], (err, results) => {
        if (err) {
          console.error("Ошибка при проверке корзины:", err);
          return res.status(500).json({ success: false, message: "Ошибка при создании корзины" });
        }

        if (results.length > 0) {
          return res.status(200).json({ success: true, message: "Корзина уже существует" });
        }

        const insertQuery = `INSERT INTO Корзина (ID_пользователя) VALUES (?)`;
        conn.query(insertQuery, [userId], (err) => {
          if (err) {
            console.error("Ошибка при создании корзины:", err);
            return res.status(500).json({ success: false, message: "Ошибка при создании корзины" });
          }

          res.status(201).json({ success: true, message: "Корзина успешно создана" });
        });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }

  async createFootDelivery(req, res) {
    try {
      const { userId, foodId } = req.body;

      const findBucketQuery = `SELECT ID FROM Корзина WHERE ID_пользователя = ?`;
      conn.query(findBucketQuery, [userId], (err, results) => {
        if (err || results.length === 0) {
          console.error("Ошибка при получении корзины:", err);
          return res.status(404).json({ success: false, message: "Корзина не найдена" });
        }

        const bucketId = results[0].ID;

        const insertQuery = `
          INSERT INTO Блюда_в_корзине (ID_блюда, ID_корзины)
          VALUES (?, ?)
        `;

        conn.query(insertQuery, [bucketId, foodId], (err) => {
          if (err) {
            console.error("Ошибка при добавлении блюда в корзину:", err);
            return res.status(500).json({ success: false, message: "Ошибка при добавлении блюда" });
          }

          res.status(201).json({ success: true, message: "Блюдо добавлено в корзину" });
        });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }

  async createOrder(req, res) {
    
  }

  async userDelivery(req, res) {
    
  }

  async getPriceList(req, res) {
    try {
      const query = `
        SELECT 
          Прайс_лист.ID, 
          Прайс_лист.ID_блюда, 
          Прайс_лист.Цена
        FROM 
          Прайс_лист
        ORDER BY 
          Прайс_лист.ID_блюда;
      `;

      conn.query(query, (err, results) => {
        if (err) {
          console.error("Ошибка при получении данных из таблицы Прайс_лист:", err);
          return res.status(500).json({ success: false, message: "Ошибка при получении данных" });
        }

        res.status(200).json({ success: true, priceList: results });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }
}

module.exports = new DeliveryController();
