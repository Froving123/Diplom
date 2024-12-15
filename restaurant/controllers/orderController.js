const mysql = require("mysql");
const jwt = require("jsonwebtoken");

const jwtSecret = "Best-Rest";

const conn = mysql.createConnection({
  host: "MySQL-8.0",
  user: "root",
  password: "Sasha228",
  database: "Best-Rest",
});

class OrderController {
  async paymentOrder(req, res) {
    try {
      const query = `SELECT ID, Наименование FROM Способ_оплаты`;

      conn.query(query, (err, results) => {
        if (err) {
          console.error("Ошибка при получении способов:", err);
          return res.status(500).json({
            success: false,
            message: "Ошибка при получении способов",
          });
        }

        res.status(200).json({
          success: true,
          payment: results,
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

  async createOrder(req, res) {
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
      const { address, deliveryPrice, totalPrice, payment } = req.body;

      // Добавление адреса
      const insertAddressQuery = `INSERT INTO Адрес (Улица, Дом, Квартира) VALUES (?, ?, ?)`;
      conn.query(
        insertAddressQuery,
        [address.street, address.home, address.flat || null],
        (err, addressResult) => {
          if (err) {
            console.error("Ошибка при добавлении адреса:", err);
            return res.status(500).json({
              success: false,
              message: "Ошибка при добавлении адреса",
            });
          }

          const addressId = addressResult.insertId;

          // Добавление доставки
          const insertDeliveryQuery = `INSERT INTO Доставка (ID_адреса, Цена) VALUES (?, ?)`;
          conn.query(
            insertDeliveryQuery,
            [addressId, deliveryPrice],
            (err, deliveryResult) => {
              if (err) {
                console.error("Ошибка при добавлении доставки:", err);
                return res.status(500).json({
                  success: false,
                  message: "Ошибка при добавлении доставки",
                });
              }

              const deliveryId = deliveryResult.insertId;

              // Добавление содержания заказа
              const insertContentQuery = `INSERT INTO Содержание_заказа (ID_пользователя, Общая_цена) VALUES (?, ?)`;
              conn.query(
                insertContentQuery,
                [userId, totalPrice],
                (err, contentResult) => {
                  if (err) {
                    console.error(
                      "Ошибка при добавлении содержания заказа:",
                      err
                    );
                    return res.status(500).json({
                      success: false,
                      message: "Ошибка при добавлении содержания заказа",
                    });
                  }

                  const contentId = contentResult.insertId;

                  // Получение корзины пользователя
                  const findBucketQuery = `SELECT ID FROM Корзина WHERE ID_пользователя = ?`;
                  conn.query(
                    findBucketQuery,
                    [userId],
                    (err, bucketResults) => {
                      if (err || bucketResults.length === 0) {
                        console.error("Ошибка при получении корзины:", err);
                        return res.status(404).json({
                          success: false,
                          message: "Корзина не найдена",
                        });
                      }

                      const bucketId = bucketResults[0].ID;

                      // Получение блюд в корзине
                      const findFoodQuery = `SELECT ID_блюда, Количество FROM Блюда_в_корзине WHERE ID_корзины = ?`;
                      conn.query(
                        findFoodQuery,
                        [bucketId],
                        (err, foodResults) => {
                          if (err || foodResults.length === 0) {
                            console.error("Ошибка при получении блюд:", err);
                            return res.status(404).json({
                              success: false,
                              message: "Блюда не найдены",
                            });
                          }

                          // Добавление блюд в заказ
                          const insertFoodQuery = `INSERT INTO Блюда_в_заказе (ID_блюда, Количество, ID_содержания_заказа) VALUES ?`;
                          const foodValues = foodResults.map((food) => [
                            food.ID_блюда,
                            food.Количество,
                            contentId,
                          ]);

                          conn.query(insertFoodQuery, [foodValues], (err) => {
                            if (err) {
                              console.error(
                                "Ошибка при добавлении блюд в заказ:",
                                err
                              );
                              return res.status(500).json({
                                success: false,
                                message: "Ошибка при добавлении блюд в заказ",
                              });
                            }

                            // Удаление блюд из корзины
                            const deleteFoodQuery = `DELETE FROM Блюда_в_корзине WHERE ID_корзины = ?`;
                            conn.query(deleteFoodQuery, [bucketId], (err) => {
                              if (err) {
                                console.error(
                                  "Ошибка при удалении блюд из корзины:",
                                  err
                                );
                                return res.status(500).json({
                                  success: false,
                                  message:
                                    "Ошибка при удалении блюд из корзины",
                                });
                              }

                              // Удаление корзины
                              const deleteBucketQuery = `DELETE FROM Корзина WHERE ID_пользователя = ?`;
                              conn.query(deleteBucketQuery, [userId], (err) => {
                                if (err) {
                                  console.error(
                                    "Ошибка при удалении записи корзины:",
                                    err
                                  );
                                  return res.status(500).json({
                                    success: false,
                                    message:
                                      "Ошибка при удалении записи корзины",
                                  });
                                }

                                // Добавление заказа
                                const insertOrderQuery = `INSERT INTO Заказ (ID_статуса, ID_доставки, ID_содержания_заказа, ID_способа, Дата_заказа, Время_заказа) VALUES ((SELECT ID FROM Статус_заказа WHERE ID = 1), ?, ?, ?, CURDATE(), CURTIME())`;
                                conn.query(
                                  insertOrderQuery,
                                  [deliveryId, contentId, payment],
                                  (err, orderResult) => {
                                    if (err) {
                                      console.error(
                                        "Ошибка при добавлении заказа:",
                                        err
                                      );
                                      return res.status(500).json({
                                        success: false,
                                        message: "Ошибка при добавлении заказа",
                                      });
                                    }

                                    res.status(201).json({
                                      success: true,
                                      message: "Заказ успешно создан",
                                      orderId: orderResult.insertId,
                                    });
                                  }
                                );
                              });
                            });
                          });
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }

  async removeOrder(req, res) {
    try {
      const { orderId } = req.body;
      if (!orderId) {
        return res
          .status(400)
          .json({ success: false, message: "ID заказа обязателен" });
      }

      const getOrderDetailsQuery = `
        SELECT 
          Заказ.ID AS orderId,
          Заказ.ID_доставки AS deliveryId,
          Заказ.ID_содержания_заказа AS contentId,
          Доставка.ID_адреса AS addressId
        FROM Заказ
        INNER JOIN Доставка ON Заказ.ID_доставки = Доставка.ID
        WHERE Заказ.ID = ? 
      `;

      const orderDetails = await new Promise((resolve, reject) => {
        conn.query(getOrderDetailsQuery, [orderId], (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        });
      });

      if (!orderDetails) {
        return res
          .status(404)
          .json({
            success: false,
            message: "Заказ не найден",
          });
      }

      const { deliveryId, contentId, addressId } = orderDetails;

      await new Promise((resolve, reject) => {
        conn.query(
          "DELETE FROM Блюда_в_заказе WHERE ID_содержания_заказа = ?",
          [contentId],
          (err) => (err ? reject(err) : resolve())
        );
      });

      await new Promise((resolve, reject) => {
        conn.query("DELETE FROM Заказ WHERE ID = ?", [orderId], (err) =>
          err ? reject(err) : resolve()
        );
      });

      await new Promise((resolve, reject) => {
        conn.query(
          "DELETE FROM Содержание_заказа WHERE ID = ?",
          [contentId],
          (err) => (err ? reject(err) : resolve())
        );
      });

      await new Promise((resolve, reject) => {
        conn.query("DELETE FROM Доставка WHERE ID = ?", [deliveryId], (err) =>
          err ? reject(err) : resolve()
        );
      });

      await new Promise((resolve, reject) => {
        conn.query("DELETE FROM Адрес WHERE ID = ?", [addressId], (err) =>
          err ? reject(err) : resolve()
        );
      });

      res.status(200).json({ success: true, message: "Заказ успешно удален" });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }

  async userOrder(req, res) {
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

      const getOrdersQuery = `
        SELECT 
          Заказ.ID AS orderId,
          Заказ.Дата_заказа AS orderDate,
          Заказ.Время_заказа AS orderTime,
          CONCAT(Адрес.Улица, ', дом ', Адрес.Дом, 
            IF(Адрес.Квартира IS NOT NULL, CONCAT(', кв. ', Адрес.Квартира), '')) AS address,
          Статус_заказа.Наименование AS status,
          (Содержание_заказа.Общая_цена + Доставка.Цена) AS totalPrice,
          Способ_оплаты.Наименование AS paymentMethod,
          Заказ.Время_доставки AS deliveryTime,
          Содержание_заказа.ID AS contentId
        FROM Заказ
        INNER JOIN Доставка ON Заказ.ID_доставки = Доставка.ID
        INNER JOIN Адрес ON Доставка.ID_адреса = Адрес.ID
        INNER JOIN Статус_заказа ON Заказ.ID_статуса = Статус_заказа.ID
        INNER JOIN Содержание_заказа ON Заказ.ID_содержания_заказа = Содержание_заказа.ID
        INNER JOIN Способ_оплаты ON Заказ.ID_способа = Способ_оплаты.ID
        WHERE Содержание_заказа.ID_пользователя = ?
        ORDER BY Заказ.Дата_заказа DESC, Заказ.Время_заказа DESC
      `;

      const orders = await new Promise((resolve, reject) => {
        conn.query(getOrdersQuery, [userId], (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        });
      });

      if (orders.length === 0) {
        return res.status(404).json({ success: false });
      }

      const getFoodsQuery = `
        SELECT 
          Блюда.Название AS foodName,
          Блюда_в_заказе.Количество AS quantity
        FROM Блюда_в_заказе
        INNER JOIN Блюда ON Блюда_в_заказе.ID_блюда = Блюда.ID
        WHERE Блюда_в_заказе.ID_содержания_заказа = ?
      `;

      const ordersWithFoods = await Promise.all(
        orders.map(async (order) => {
          const foods = await new Promise((resolve, reject) => {
            conn.query(getFoodsQuery, [order.contentId], (err, results) => {
              if (err) {
                return reject(err);
              }
              resolve(results);
            });
          });
          return { ...order, foods };
        })
      );

      res.status(200).json({
        success: true,
        message: "Заказы успешно получены",
        orders: ordersWithFoods,
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }
}

module.exports = new OrderController();
