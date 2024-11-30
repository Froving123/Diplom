const mysql = require("mysql");
const jwt = require("jsonwebtoken");

const jwtSecret = "Best-Rest";

const conn = mysql.createConnection({
  host: "MySQL-8.0",
  user: "root",
  password: "Sasha228",
  database: "Best-Rest",
});

class BucketController {
  async createBucket(req, res) {
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

      const tableCheckQuery = `SELECT COUNT(*) AS count FROM Корзина`;
      conn.query(tableCheckQuery, (err, results) => {
        if (err) {
          console.error("Ошибка при проверке таблицы:", err);
          return res
            .status(500)
            .json({ success: false, message: "Ошибка при проверке таблицы" });
        }

        const recordCount = results[0]?.count || 0;

        if (recordCount === 0) {
          const insertQuery = `
            INSERT INTO Корзина (ID_пользователя, Общая_цена) 
            VALUES (?, 0)
          `;
          conn.query(insertQuery, [userId], (err) => {
            if (err) {
              console.error("Ошибка при создании корзины:", err);
              return res.status(500).json({
                success: false,
                message: "Ошибка при создании корзины",
              });
            }

            return res
              .status(201)
              .json({ success: true, message: "Корзина успешно создана" });
          });
        } else {
          const checkQuery = `SELECT ID FROM Корзина WHERE ID_пользователя = ?`;
          conn.query(checkQuery, [userId], (err, results) => {
            if (err) {
              console.error("Ошибка при проверке корзины:", err);
              return res.status(500).json({
                success: false,
                message: "Ошибка при проверке корзины",
              });
            }

            if (results.length > 0) {
              return res
                .status(200)
                .json({ success: true, message: "Корзина уже существует" });
            }

            const insertQuery = `
              INSERT INTO Корзина (ID_пользователя, Общая_цена) 
              VALUES (?, 0)
            `;
            conn.query(insertQuery, [userId], (err) => {
              if (err) {
                console.error("Ошибка при создании корзины:", err);
                return res.status(500).json({
                  success: false,
                  message: "Ошибка при создании корзины",
                });
              }

              res
                .status(201)
                .json({ success: true, message: "Корзина успешно создана" });
            });
          });
        }
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }

  async createFootDelivery(req, res) {
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
      const { foodId } = req.body;

      const findBucketQuery = `SELECT ID FROM Корзина WHERE ID_пользователя = ?`;
      conn.query(findBucketQuery, [userId], (err, results) => {
        if (err || results.length === 0) {
          console.error("Ошибка при получении корзины:", err);
          return res
            .status(404)
            .json({ success: false, message: "Корзина не найдена" });
        }

        const bucketId = results[0].ID;

        const checkFoodQuery = `
          SELECT ID, Количество 
          FROM Блюда_в_корзине 
          WHERE ID_блюда = ? AND ID_корзины = ?
        `;

        conn.query(checkFoodQuery, [foodId, bucketId], (err, foodResults) => {
          if (err) {
            console.error("Ошибка при проверке блюда:", err);
            return res.status(500).json({
              success: false,
              message: "Ошибка при проверке блюда",
            });
          }

          // Запрос для получения цены блюда
          const getFoodPriceQuery = `SELECT Цена FROM Прайс_лист WHERE ID = ?`;
          conn.query(getFoodPriceQuery, [foodId], (err, foodPriceResults) => {
            if (err || foodPriceResults.length === 0) {
              console.error("Ошибка при получении цены блюда:", err);
              return res.status(500).json({
                success: false,
                message: "Ошибка при получении цены блюда",
              });
            }

            const foodPrice = foodPriceResults[0].Цена; // Цена блюда

            if (foodResults.length > 0) {
              // Блюдо уже есть в корзине, увеличиваем количество
              const updateFoodQuery = `
                UPDATE Блюда_в_корзине 
                SET Количество = Количество + 1 
                WHERE ID = ?
              `;
              conn.query(updateFoodQuery, [foodResults[0].ID], (err) => {
                if (err) {
                  console.error("Ошибка при обновлении количества:", err);
                  return res.status(500).json({
                    success: false,
                    message: "Ошибка при обновлении количества",
                  });
                }

                // Пересчитываем общую цену корзины
                const updateTotalPriceQuery = `
                  UPDATE Корзина 
                  SET Общая_цена = Общая_цена + ? 
                  WHERE ID = ?
                `;
                conn.query(
                  updateTotalPriceQuery,
                  [foodPrice, bucketId],
                  (err) => {
                    if (err) {
                      console.error(
                        "Ошибка при обновлении общей цены корзины:",
                        err
                      );
                      return res.status(500).json({
                        success: false,
                        message: "Ошибка при обновлении общей цены корзины",
                      });
                    }

                    res.status(201).json({
                      success: true,
                      message: "Блюдо добавлено в корзину",
                    });
                  }
                );
              });
            } else {
              // Блюда нет в корзине, добавляем с количеством 1
              const insertFoodQuery = `
                INSERT INTO Блюда_в_корзине (ID_блюда, ID_корзины, Количество) 
                VALUES (?, ?, 1)
              `;
              conn.query(insertFoodQuery, [foodId, bucketId], (err) => {
                if (err) {
                  console.error("Ошибка при добавлении блюда:", err);
                  return res.status(500).json({
                    success: false,
                    message: "Ошибка при добавлении блюда",
                  });
                }

                // Пересчитываем общую цену корзины
                const updateTotalPriceQuery = `
                  UPDATE Корзина 
                  SET Общая_цена = Общая_цена + ? 
                  WHERE ID = ?
                `;
                conn.query(
                  updateTotalPriceQuery,
                  [foodPrice, bucketId],
                  (err) => {
                    if (err) {
                      console.error(
                        "Ошибка при обновлении общей цены корзины:",
                        err
                      );
                      return res.status(500).json({
                        success: false,
                        message: "Ошибка при обновлении общей цены корзины",
                      });
                    }

                    res.status(201).json({
                      success: true,
                      message: "Блюдо добавлено в корзину",
                    });
                  }
                );
              });
            }
          });
        });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }

  async userBucket(req, res) {
    try {
      // Извлекаем авторизационный заголовок из запроса
      const authHeader = req.headers.authorization;

      // Проверка наличия токена в заголовке
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ success: false, message: "Токен отсутствует" });
      }

      // Извлекаем сам токен из заголовка
      const token = authHeader.split(" ")[1];

      // Декодируем токен
      let decodedToken;
      try {
        decodedToken = jwt.verify(token, jwtSecret);
      } catch (err) {
        return res
          .status(401)
          .json({ success: false, message: "Неверный токен" });
      }

      // Получаем userId из декодированного токена
      const userId = decodedToken.userId;

      // Находим корзину пользователя по userId
      const findBucketQuery = `SELECT ID FROM Корзина WHERE ID_пользователя = ?`;
      conn.query(findBucketQuery, [userId], (err, results) => {
        if (err || results.length === 0) {
          // Если ошибка или корзина не найдена, возвращаем ошибку
          console.error("Ошибка при получении корзины:", err);
          return res
            .status(404)
            .json({ success: false, message: "Корзина не найдена" });
        }

        // Если корзина найдена, получаем её ID
        const bucketId = results[0].ID;

        // Теперь получаем блюда из этой корзины
        const getFoodsQuery = `
            SELECT Блюда_в_корзине.ID, Блюда_в_корзине.Количество, Блюда.Название, Блюда_в_корзине.ID_блюда, Прайс_лист.Цена, Блюда_в_корзине.ID_корзины
            FROM Блюда_в_корзине
            INNER JOIN Блюда ON Блюда_в_корзине.ID_блюда = Блюда.ID
            INNER JOIN Прайс_лист ON Блюда.ID = Прайс_лист.ID_блюда
            WHERE Блюда_в_корзине.ID_корзины = ?
          `;

        conn.query(getFoodsQuery, [bucketId], (err, foods) => {
          if (err) {
            console.error("Ошибка при получении блюд из корзины:", err);
            return res.status(500).json({
              success: false,
              message: "Ошибка при получении блюд из корзины",
            });
          }

          // Возвращаем блюда, которые находятся в корзине пользователя
          res.status(200).json({
            success: true,
            message: "Блюда успешно получены из корзины",
            data: foods,
          });
        });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }
  async incrementProductQuantity(req, res) {
    try {
      const { foodName } = req.body;

      if (!foodName) {
        return res.status(400).json({
          success: false,
          message: "Не передано название блюда",
        });
      }

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

      // Находим корзину пользователя
      const findBucketQuery = `SELECT ID FROM Корзина WHERE ID_пользователя = ?`;
      conn.query(findBucketQuery, [userId], (err, bucketResults) => {
        if (err || bucketResults.length === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Корзина не найдена" });
        }

        const bucketId = bucketResults[0].ID;

        // Получаем ID_блюда по названию
        const getFoodIdQuery = `SELECT ID FROM Блюда WHERE Название = ?`;
        conn.query(getFoodIdQuery, [foodName], (err, foodIdResults) => {
          if (err || foodIdResults.length === 0) {
            return res
              .status(404)
              .json({ success: false, message: "Блюдо не найдено" });
          }

          const foodId = foodIdResults[0].ID;

          // Проверяем, есть ли блюдо в корзине
          const checkFoodQuery = `
            SELECT ID, Количество 
            FROM Блюда_в_корзине 
            WHERE ID_блюда = ? AND ID_корзины = ?
          `;
          conn.query(checkFoodQuery, [foodId, bucketId], (err, foodResults) => {
            if (err || foodResults.length === 0) {
              return res
                .status(404)
                .json({
                  success: false,
                  message: "Блюдо не найдено в корзине",
                });
            }

            const foodInCartId = foodResults[0].ID;

            // Увеличиваем количество блюда
            const updateQuantityQuery = `
              UPDATE Блюда_в_корзине 
              SET Количество = Количество + 1 
              WHERE ID = ?
            `;
            conn.query(updateQuantityQuery, [foodInCartId], (err) => {
              if (err) {
                return res.status(500).json({
                  success: false,
                  message: "Ошибка при увеличении количества блюда",
                });
              }
              const getFoodPriceQuery = `SELECT Цена FROM Прайс_лист WHERE ID = ?`;
              conn.query(
                getFoodPriceQuery,
                [foodId],
                (err, foodPriceResults) => {
                  if (err || foodPriceResults.length === 0) {
                    console.error("Ошибка при получении цены блюда:", err);
                    return res.status(500).json({
                      success: false,
                      message: "Ошибка при получении цены блюда",
                    });
                  }

                  const foodPrice = foodPriceResults[0].Цена;

                  // Обновляем общую цену корзины
                  const updateTotalPriceQuery = `
                UPDATE Корзина 
                SET Общая_цена = Общая_цена + ? 
                WHERE ID = ?
              `;
                  conn.query(
                    updateTotalPriceQuery,
                    [foodPrice, bucketId],
                    (err) => {
                      if (err) {
                        return res.status(500).json({
                          success: false,
                          message: "Ошибка при обновлении общей цены корзины",
                        });
                      }

                      res.status(200).json({
                        success: true,
                        message: "Количество блюда увеличено",
                      });
                    }
                  );
                }
              );
            });
          });
        });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }

  async decrementProductQuantity(req, res) {
    try {
      const { foodName } = req.body;

      if (!foodName) {
        return res.status(400).json({
          success: false,
          message: "Не передано название блюда",
        });
      }

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

      // Находим корзину пользователя
      const findBucketQuery = `SELECT ID FROM Корзина WHERE ID_пользователя = ?`;
      conn.query(findBucketQuery, [userId], (err, bucketResults) => {
        if (err || bucketResults.length === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Корзина не найдена" });
        }

        const bucketId = bucketResults[0].ID;

        // Получаем ID_блюда по названию
        const getFoodIdQuery = `SELECT ID FROM Блюда WHERE Название = ?`;
        conn.query(getFoodIdQuery, [foodName], (err, foodIdResults) => {
          if (err || foodIdResults.length === 0) {
            return res
              .status(404)
              .json({ success: false, message: "Блюдо не найдено" });
          }

          const foodId = foodIdResults[0].ID;

          // Проверяем, есть ли блюдо в корзине
          const checkFoodQuery = `
            SELECT ID, Количество 
            FROM Блюда_в_корзине 
            WHERE ID_блюда = ? AND ID_корзины = ?
          `;
          conn.query(checkFoodQuery, [foodId, bucketId], (err, foodResults) => {
            if (err || foodResults.length === 0) {
              return res
                .status(404)
                .json({
                  success: false,
                  message: "Блюдо не найдено в корзине",
                });
            }

            const foodInCartId = foodResults[0].ID;

            // Увеличиваем количество блюда
            const updateQuantityQuery = `
              UPDATE Блюда_в_корзине 
              SET Количество = Количество - 1 
              WHERE ID = ?
            `;
            conn.query(updateQuantityQuery, [foodInCartId], (err) => {
              if (err) {
                return res.status(500).json({
                  success: false,
                  message: "Ошибка при уменьшении количества блюда",
                });
              }
              const getFoodPriceQuery = `SELECT Цена FROM Прайс_лист WHERE ID = ?`;
              conn.query(
                getFoodPriceQuery,
                [foodId],
                (err, foodPriceResults) => {
                  if (err || foodPriceResults.length === 0) {
                    console.error("Ошибка при получении цены блюда:", err);
                    return res.status(500).json({
                      success: false,
                      message: "Ошибка при получении цены блюда",
                    });
                  }

                  const foodPrice = foodPriceResults[0].Цена;

                  // Обновляем общую цену корзины
                  const updateTotalPriceQuery = `
                UPDATE Корзина 
                SET Общая_цена = Общая_цена - ? 
                WHERE ID = ?
              `;
                  conn.query(
                    updateTotalPriceQuery,
                    [foodPrice, bucketId],
                    (err) => {
                      if (err) {
                        return res.status(500).json({
                          success: false,
                          message: "Ошибка при обновлении общей цены корзины",
                        });
                      }

                      res.status(200).json({
                        success: true,
                        message: "Количество блюда увеличено",
                      });
                    }
                  );
                }
              );
            });
          });
        });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }
}

module.exports = new BucketController();
