const mysql = require("mysql");
const jwt = require("jsonwebtoken");

const jwtSecret = "Best-Rest";

const conn = mysql.createConnection({
  host: "MySQL-8.0",
  user: "root",
  password: "Sasha228",
  database: "Best-Rest",
});

class DeliveryController {
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
      // Проверка токена
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
                        return res
                          .status(404)
                          .json({
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
                            return res
                              .status(404)
                              .json({
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
                                  message: "Ошибка при удалении блюд из корзины",
                                });
                              }
  
                              // Удаление корзины после удаления блюд
                              const deleteBucketQuery = `DELETE FROM Корзина WHERE ID_пользователя = ?`;
                              conn.query(deleteBucketQuery, [userId], (err) => {
                                if (err) {
                                  console.error(
                                    "Ошибка при удалении записи корзины:",
                                    err
                                  );
                                  return res.status(500).json({
                                    success: false,
                                    message: "Ошибка при удалении записи корзины",
                                  });
                                }
  
                                // Добавление заказа
                                const insertOrderQuery = `INSERT INTO Заказ (ID_статуса, ID_доставки, ID_Содержания_заказа, ID_способа, Дата_заказа, Время_заказа) VALUES ((SELECT ID FROM Статус_заказа WHERE ID = 1), ?, ?, ?, CURDATE(), CURTIME())`;
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
