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
  async createFootDelivery(req, res) {
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
      const { foodId } = req.body;

      const checkFoodQuery = `
          SELECT ID, Количество 
          FROM Блюда_в_корзине 
          WHERE ID_блюда = ? AND ID_пользователя = ?
        `;

      conn.query(checkFoodQuery, [foodId, userId], (err, foodResults) => {
        if (err) {
          console.error("Ошибка при проверке блюда:", err);
          return res.status(500).json({
            success: false,
            message: "Ошибка при проверке блюда",
          });
        }

        // Запрос для получения цены блюда
        const getDiscountedPriceQuery = `
          SELECT 
              CASE 
                  WHEN Спец_предложения.ID_блюда = Прайс_лист.ID_блюда 
                      THEN Прайс_лист.Цена - Спец_предложения.Размер_скидки
                  ELSE Прайс_лист.Цена
              END AS Цена
          FROM Прайс_лист
          LEFT JOIN Спец_предложения 
              ON Прайс_лист.ID_блюда = Спец_предложения.ID_блюда
              AND Спец_предложения.Дата_окончания >= CURRENT_DATE
          WHERE Прайс_лист.ID = (
              SELECT MAX(ID)
              FROM Прайс_лист
              WHERE ID_блюда = ?
          );
        `;

        conn.query(getDiscountedPriceQuery, [foodId], (err, priceResults) => {
          if (err || priceResults.length === 0) {
            console.error("Ошибка при получении цены блюда:", err);
            return res.status(500).json({
              success: false,
              message: "Ошибка при получении цены блюда",
            });
          }

          const foodPrice = priceResults[0].Цена;

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
                  UPDATE Пользователь 
                  SET Цена_корзины = Цена_корзины + ? 
                  WHERE ID = ?
                `;
              conn.query(updateTotalPriceQuery, [foodPrice, userId], (err) => {
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
              });
            });
          } else {
            // Блюда нет в корзине, добавляем с количеством 1
            const insertFoodQuery = `
                INSERT INTO Блюда_в_корзине (ID_блюда, ID_пользователя, Количество) 
                VALUES (?, ?, 1)
              `;
            conn.query(insertFoodQuery, [foodId, userId], (err) => {
              if (err) {
                console.error("Ошибка при добавлении блюда:", err);
                return res.status(500).json({
                  success: false,
                  message: "Ошибка при добавлении блюда",
                });
              }

              // Пересчитываем общую цену корзины
              const updateTotalPriceQuery = `
                  UPDATE Пользователь 
                  SET Цена_корзины = Цена_корзины + ? 
                  WHERE ID = ?
                `;
              conn.query(updateTotalPriceQuery, [foodPrice, userId], (err) => {
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
              });
            });
          }
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
            WHERE ID_блюда = ? AND ID_пользователя = ?
          `;
        conn.query(checkFoodQuery, [foodId, userId], (err, foodResults) => {
          if (err || foodResults.length === 0) {
            return res.status(404).json({
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

            const getDiscountedPriceQuery = `
                  SELECT 
                      CASE 
                          WHEN Спец_предложения.ID_блюда = Прайс_лист.ID_блюда 
                              THEN Прайс_лист.Цена - Спец_предложения.Размер_скидки
                          ELSE Прайс_лист.Цена
                      END AS Цена
                  FROM Прайс_лист
                  LEFT JOIN Спец_предложения 
                      ON Прайс_лист.ID_блюда = Спец_предложения.ID_блюда
                      AND Спец_предложения.Дата_окончания >= CURRENT_DATE
                  WHERE Прайс_лист.ID = (
                      SELECT MAX(ID)
                      FROM Прайс_лист
                      WHERE ID_блюда = ?
                  );
                `;

            conn.query(
              getDiscountedPriceQuery,
              [foodId],
              (err, priceResults) => {
                if (err || priceResults.length === 0) {
                  console.error("Ошибка при получении цены блюда:", err);
                  return res.status(500).json({
                    success: false,
                    message: "Ошибка при получении цены блюда",
                  });
                }

                const foodPrice = priceResults[0].Цена;
                // Обновляем общую цену корзины
                const updateTotalPriceQuery = `
                  UPDATE Пользователь 
                  SET Цена_корзины = Цена_корзины + ? 
                  WHERE ID = ?
                `;
                conn.query(
                  updateTotalPriceQuery,
                  [foodPrice, userId],
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
            WHERE ID_блюда = ? AND ID_пользователя = ?
          `;
        conn.query(checkFoodQuery, [foodId, userId], (err, foodResults) => {
          if (err || foodResults.length === 0) {
            return res.status(404).json({
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

            const getDiscountedPriceQuery = `
              SELECT 
                  CASE 
                      WHEN Спец_предложения.ID_блюда = Прайс_лист.ID_блюда 
                          THEN Прайс_лист.Цена - Спец_предложения.Размер_скидки
                      ELSE Прайс_лист.Цена
                  END AS Цена
              FROM Прайс_лист
              LEFT JOIN Спец_предложения 
                  ON Прайс_лист.ID_блюда = Спец_предложения.ID_блюда
                  AND Спец_предложения.Дата_окончания >= CURRENT_DATE
              WHERE Прайс_лист.ID = (
                  SELECT MAX(ID)
                  FROM Прайс_лист
                  WHERE ID_блюда = ?
              );
            `;

            conn.query(
              getDiscountedPriceQuery,
              [foodId],
              (err, priceResults) => {
                if (err || priceResults.length === 0) {
                  console.error("Ошибка при получении цены блюда:", err);
                  return res.status(500).json({
                    success: false,
                    message: "Ошибка при получении цены блюда",
                  });
                }

                const foodPrice = priceResults[0].Цена;

                // Обновляем общую цену корзины
                const updateTotalPriceQuery = `
                  UPDATE Пользователь 
                  SET Цена_корзины = Цена_корзины - ? 
                  WHERE ID = ?
                `;
                conn.query(
                  updateTotalPriceQuery,
                  [foodPrice, userId],
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
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }

  async removeProduct(req, res) {
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
          SELECT ID, ID_блюда, Количество
          FROM Блюда_в_корзине 
          WHERE ID_блюда = ? AND ID_пользователя = ?
        `;
        conn.query(checkFoodQuery, [foodId, userId], (err, foodResults) => {
          if (err || foodResults.length === 0) {
            return res.status(404).json({
              success: false,
              message: "Блюдо не найдено в корзине",
            });
          }

          const foodQuantity = foodResults[0].Количество;

          // Удаляем блюдо из корзины
          const deleteFoodQuery = `
            DELETE FROM Блюда_в_корзине 
            WHERE ID_блюда = ?
          `;
          conn.query(deleteFoodQuery, [foodId], (err) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: "Ошибка при удалении блюда из корзины",
              });
            }

            const getDiscountedPriceQuery = `
              SELECT 
                  CASE 
                      WHEN Спец_предложения.ID_блюда = Прайс_лист.ID_блюда 
                          THEN Прайс_лист.Цена - Спец_предложения.Размер_скидки
                      ELSE Прайс_лист.Цена
                  END AS Цена
              FROM Прайс_лист
              LEFT JOIN Спец_предложения 
                  ON Прайс_лист.ID_блюда = Спец_предложения.ID_блюда
                  AND Спец_предложения.Дата_окончания >= CURRENT_DATE
              WHERE Прайс_лист.ID = (
                  SELECT MAX(ID)
                  FROM Прайс_лист
                  WHERE ID_блюда = ?
              );
            `;

            conn.query(
              getDiscountedPriceQuery,
              [foodId],
              (err, priceResults) => {
                if (err || priceResults.length === 0) {
                  console.error("Ошибка при получении цены блюда:", err);
                  return res.status(500).json({
                    success: false,
                    message: "Ошибка при получении цены блюда",
                  });
                }

                const foodPrice = priceResults[0].Цена;

                // Обновляем общую цену корзины
                const updateTotalPriceQuery = `
                  UPDATE Пользователь 
                  SET Цена_корзины = Цена_корзины - (? * ?) 
                  WHERE ID = ?
                `;
                conn.query(
                  updateTotalPriceQuery,
                  [foodPrice, foodQuantity, userId],
                  (err) => {
                    if (err) {
                      return res.status(500).json({
                        success: false,
                        message: "Ошибка при обновлении общей цены корзины",
                      });
                    }

                    res.status(200).json({
                      success: true,
                      message: "Блюдо удалено из корзины",
                    });
                  }
                );
              }
            );
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
        return res.status(401).json({
          success: false,
          message: "Сессия была закончена, авторизуйтесь заново",
        });
      }

      // Извлекаем сам токен из заголовка
      const token = authHeader.split(" ")[1];

      // Декодируем токен
      let decodedToken;
      try {
        decodedToken = jwt.verify(token, jwtSecret);
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: "Сессия была закончена, авторизуйтесь заново",
        });
      }

      // Получаем userId из декодированного токена
      const userId = decodedToken.userId;

      // Теперь получаем блюда из этой корзины
      const getFoodsQuery = `
        SELECT 
            Блюда_в_корзине.ID,
            Блюда_в_корзине.Количество,
            Блюда.Название,
            Блюда_в_корзине.ID_блюда,
            COALESCE(
                Прайс_лист.Цена - Спец_предложения.Размер_скидки, 
                Прайс_лист.Цена
            ) AS Цена,
            Блюда_в_корзине.ID_пользователя
        FROM 
            Блюда_в_корзине
        INNER JOIN 
            Блюда ON Блюда_в_корзине.ID_блюда = Блюда.ID
        INNER JOIN 
            Прайс_лист ON Прайс_лист.ID = (
                SELECT MAX(ID)
                FROM Прайс_лист
                WHERE ID_блюда = Блюда.ID
            )
        LEFT JOIN 
            Спец_предложения 
            ON Блюда.ID = Спец_предложения.ID_блюда
            AND Спец_предложения.Дата_окончания >= CURRENT_DATE
        WHERE 
            Блюда_в_корзине.ID_пользователя = ?;
      `;

      conn.query(getFoodsQuery, [userId], (err, foods) => {
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
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }

  async getTotalPrice(req, res) {
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

      // Получаем цену корзины пользователя
      const findBucketQuery = `SELECT ID, Цена_корзины FROM Пользователь WHERE ID = ?`;
      conn.query(findBucketQuery, [userId], (err, bucketResults) => {
        if (err || bucketResults.length === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Корзина пуста" });
        }

        const totalPrice = bucketResults[0].Цена_корзины || 0;
        const hasItems = totalPrice > 0;

        res.status(200).json({
          success: true,
          hasItems,
          totalPrice,
        });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }
}

module.exports = new BucketController();
