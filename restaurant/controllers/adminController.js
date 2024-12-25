const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtSecret = "Best-RestAdmin";

const conn = mysql.createConnection({
  host: "MySQL-8.0",
  user: "root",
  password: "Sasha228",
  database: "Best-Rest",
});

class AdminController {
  // Метод для создания пароля
  async createPassword(req, res) {
    try {
      const { email, password } = req.body;

      // Проверка, существует ли пользователь с таким логином
      const checkUserSql = `
        SELECT * FROM Сотрудники
        WHERE Email = ? AND Пароль != ''
      `;

      conn.query(checkUserSql, [email], (err, results) => {
        if (err) {
          console.error("Ошибка при проверке пользователя:", err);
          return res.status(500).json({
            success: false,
            message: "Ошибка при проверке пользователя",
          });
        }

        // Если пользователь найден, возвращаем сообщение
        if (results.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Пользователь с таким Email уже имеет пароль",
          });
        }

        // Хеширование пароля
        bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
          if (hashErr) {
            console.error("Ошибка при хешировании пароля:", hashErr);
            return res.status(500).json({
              success: false,
              message: "Ошибка при обработке пароля",
            });
          }

          // SQL-запрос для обновления пароля пользователя с заданным логином
          const addUserSql = `
            UPDATE Сотрудники
            SET Пароль = ?
            WHERE Email = ?
          `;

          conn.query(addUserSql, [hashedPassword, email], (addErr, result) => {
            if (addErr) {
              console.error("Ошибка при создании пароля:", addErr);
              return res.status(500).json({
                success: false,
                message: "Ошибка при создании пароля",
              });
            }

            if (result.affectedRows === 0) {
              // Если ни одна строка не была обновлена, значит пользователя с таким логином нет
              return res.status(404).json({
                success: false,
                message: "Пользователь с таким Email не найден",
              });
            }

            return res.status(201).json({
              success: true,
              message: "Пароль успешно обновлён",
            });
          });
        });
      });
    } catch (error) {
      console.error("Ошибка при обработке запроса:", error);
      return res.status(500).json({
        success: false,
        message: "Произошла ошибка на сервере",
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password, role } = req.body; // добавлено поле role

      // Проверка, существует ли пользователь с таким email
      const checkUserSql = `
        SELECT * FROM Сотрудники
        WHERE Email = ?
      `;

      conn.query(checkUserSql, [email], (err, results) => {
        if (err) {
          console.error("Ошибка при проверке пользователя:", err);
          return res.status(500).json({
            success: false,
            message: "Ошибка при проверке пользователя",
          });
        }

        if (results.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Пользователь с таким Email не найден",
          });
        }

        const user = results[0];

        // Проверяем, соответствует ли выбранная роль роли пользователя
        if (parseInt(role) !== user.ID_должности_сотрудника) {
          return res.status(403).json({
            success: false,
            message: "Выбранная роль не соответствует вашей роли",
          });
        }

        // Сравниваем введённый пароль с хешем пароля, который хранится в базе
        bcrypt.compare(password, user.Пароль, (compareErr, isMatch) => {
          if (compareErr) {
            console.error("Ошибка при проверке пароля:", compareErr);
            return res.status(500).json({
              success: false,
              message: "Ошибка при проверке пароля",
            });
          }

          if (!isMatch) {
            return res.status(401).json({
              success: false,
              message: "Неверный пароль",
            });
          }

          const token = jwt.sign(
            { email: user.Email, id: user.ID, role: user.ID_должности_сотрудника },
            jwtSecret,
            { expiresIn: "19h" } // Срок действия токена 19 часов
          );

          return res.status(200).json({
            success: true,
            message: "Авторизация успешна",
            token,
          });
        });
      });
    } catch (error) {
      console.error("Ошибка при обработке запроса:", error);
      return res.status(500).json({
        success: false,
        message: "Произошла ошибка на сервере",
      });
    }
  }

  async admin(req, res) {
    try {
      const authHeader = req.headers.authorization;

      // Проверка наличия токена
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({
            success: false,
            message: "Сессия была закончена, авторизуйтесь заново",
          });
      }

      const token = authHeader.split(" ")[1];

      // Расшифровка токена и извлечение ID пользователя
      let decodedToken;
      try {
        decodedToken = jwt.verify(token, jwtSecret);
      } catch (err) {
        return res
          .status(401)
          .json({
            success: false,
            message: "Сессия была закончена, авторизуйтесь заново",
          });
      }

      const userId = decodedToken.id;

      // Запрос на получение данных пользователя из базы данных
      const getUserSql = `SELECT * FROM Сотрудники WHERE ID = ?`;

      conn.query(getUserSql, [userId], (err, results) => {
        if (err) {
          console.error("Ошибка при запросе данных пользователя:", err);
          return res
            .status(500)
            .json({ success: false, message: "Ошибка сервера" });
        }

        if (results.length === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Пользователь не найден" });
        }

        const user = results[0];

        return res.status(200).json({
          success: true,
          user: {
            id: user.ID,
            email: user.Email,
            role: user.ID_должности_сотрудника,
          },
        });
      });
    } catch (error) {
      console.error("Ошибка в функции admin:", error);
      return res
        .status(500)
        .json({ success: false, message: "Ошибка сервера" });
    }
  }

  async roleAdmins(req, res) {
    try {
      // SQL-запрос для получения всех столов
      const query = `SELECT ID, Наименование FROM Должность_сотрудника`;

      conn.query(query, (err, results) => {
        if (err) {
          console.error("Ошибка при получении столов:", err);
          return res.status(500).json({
            success: false,
            message: "Ошибка при получении столов",
          });
        }

        res.status(200).json({
          success: true,
          role: results,
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
}

module.exports = new AdminController();
