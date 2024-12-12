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
      const { address, deliveryPrice } = req.body;

      // 1. Вставляем адрес в таблицу Адрес
      const insertAddressQuery = `
        INSERT INTO Адрес (Улица, Дом, Квартира)
        VALUES (?, ?, ?)
      `;
      conn.query(
        insertAddressQuery,
        [address.street, address.home, address.flat || null],
        (err, addressResult) => {
          if (err) {
            console.error("Ошибка при добавлении адреса:", err);
            return res
              .status(500)
              .json({
                success: false,
                message: "Ошибка при добавлении адреса",
              });
          }

          const addressId = addressResult.insertId; // Получаем ID добавленного адреса

          // 2. Вставляем данные в таблицу Доставка
          const insertDeliveryQuery = `
            INSERT INTO Доставка (ID_адреса, Цена)
            VALUES (?, ?)
          `;
          conn.query(insertDeliveryQuery, [addressId, deliveryPrice], (err) => {
            if (err) {
              console.error("Ошибка при добавлении доставки:", err);
              return res
                .status(500)
                .json({
                  success: false,
                  message: "Ошибка при добавлении доставки",
                });
            }

            res
              .status(201)
              .json({
                success: true,
                message: "Доставка успешно создана",
                addressId,
              });
          });
        }
      );
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
