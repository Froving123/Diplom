const mysql = require("mysql");

const conn = mysql.createConnection({
  host: "MySQL-8.0",
  user: "root",
  password: "Sasha228",
  database: "Best-Rest",
});

class DeliveryController {
  async createOrder(req, res) {
    try {
      const { userId, orderDetails } = req.body;

      const insertOrderQuery = `
        INSERT INTO Заказ (ID_пользователя, Дата)
        VALUES (?, NOW())
      `;

      conn.query(insertOrderQuery, [userId], (err, orderResult) => {
        if (err) {
          console.error("Ошибка при создании заказа:", err);
          return res
            .status(500)
            .json({ success: false, message: "Ошибка при создании заказа" });
        }

        const orderId = orderResult.insertId;

        const insertOrderDetailsQuery = `
          INSERT INTO Блюда_в_заказе (ID_заказа, ID_блюда)
          VALUES (?, ?)
        `;

        orderDetails.forEach((foodId) => {
          conn.query(insertOrderDetailsQuery, [orderId, foodId], (err) => {
            if (err) {
              console.error("Ошибка при добавлении деталей заказа:", err);
              return res.status(500).json({
                success: false,
                message: "Ошибка при создании заказа",
              });
            }
          });
        });

        res
          .status(201)
          .json({ success: true, message: "Заказ успешно создан" });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }

  async userOrder(req, res) {
    try {
      const { userId } = req.query;

      const query = `
        SELECT 
          Заказ.ID AS ID_заказа, Заказы.Дата, Блюда.Название, Прайс_лист.Цена
        FROM 
          Заказы
        JOIN 
          Блюда_в_заказе ON Заказы.ID = Блюда_в_заказе.ID_заказа
        JOIN 
          Блюда ON Блюда_в_заказе.ID_блюда = Блюда.ID
        JOIN 
          Прайс_лист ON Блюда.ID = Прайс_лист.ID_блюда
        WHERE 
          Заказы.ID_пользователя = ?
      `;

      conn.query(query, [userId], (err, results) => {
        if (err) {
          console.error("Ошибка при получении заказов пользователя:", err);
          return res
            .status(500)
            .json({ success: false, message: "Ошибка при получении заказов" });
        }

        res.status(200).json({ success: true, orders: results });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }
}

module.exports = new DeliveryController();
