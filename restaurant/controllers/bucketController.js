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

      // Проверка наличия токена
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ success: false, message: "Токен отсутствует" });
      }

      const token = authHeader.split(" ")[1];

      // Расшифровка токена и извлечение ID пользователя
      let decodedToken;
      try {
        decodedToken = jwt.verify(token, jwtSecret);
      } catch (err) {
        return res
          .status(401)
          .json({ success: false, message: "Неверный токен" });
      }

      const userId = decodedToken.userId;

      // Проверка, есть ли записи в таблице "Корзина"
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
          // Если таблица пуста, создаём запись для пользователя
          const insertQuery = `INSERT INTO Корзина (ID_пользователя, Общая_цена	
) VALUES (?, 1000)`;
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
          // Если таблица не пуста, проверяем корзину конкретного пользователя
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
              // Корзина для пользователя уже существует
              return res
                .status(200)
                .json({ success: true, message: "Корзина уже существует" });
            }

            // Если корзины для пользователя нет, создаём её
            const insertQuery = `INSERT INTO Корзина (ID_пользователя) VALUES (?)`;
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

      // Проверка наличия токена
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ success: false, message: "Токен отсутствует" });
      }

      const token = authHeader.split(" ")[1];

      // Расшифровка токена и извлечение ID пользователя
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

        const insertQuery = `
          INSERT INTO Блюда_в_корзине (ID_блюда, ID_корзины, Количество)
          VALUES (?, ?, 50)
        `;

        conn.query(insertQuery, [foodId, bucketId], (err) => {
          if (err) {
            console.error("Ошибка при добавлении блюда в корзину:", err);
            return res
              .status(500)
              .json({ success: false, message: "Ошибка при добавлении блюда" });
          }

          res
            .status(201)
            .json({ success: true, message: "Блюдо добавлено в корзину" });
        });
      });
    } catch (error) {
      console.error("Ошибка на сервере:", error);
      res.status(500).json({ success: false, message: "Ошибка на сервере" });
    }
  }
}

module.exports = new BucketController();
