const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtSecret = "Best-Rest";

const conn = mysql.createConnection({
  host: "MySQL-8.0",
  user: "root",
  password: "Sasha228",
  database: "Best-Rest",
});

class UserController {
  // Метод для создания пароля
  async createPassword(req, res) {
    try {
      const { login, password } = req.body;

      // Проверка, существует ли пользователь с таким логином
      const checkUserSql = `
        SELECT * FROM Сотрудники
        WHERE  Логин= ? AND Пароль!= 0
      `;

      conn.query(checkUserSql, [login], (err, results) => {
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
            message: "Пользователь с таким логином уже имеет пароль",
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

          // SQL-запрос для добавления нового пользователя
          const addUserSql = `
            INSERT INTO Сотрудники
            (Пароль)
            VALUES (?) WHERE Логин= ?
          `;

          conn.query(
            addUserSql,
            [hashedPassword, login],
            (addErr, result) => {
              if (addErr) {
                console.error("Ошибка при добавлении пользователя:", addErr);
                return res.status(500).json({
                  success: false,
                  message: "Ошибка при регистрации пользователя",
                });
              }

              // Создание JWT токена
              const token = jwt.sign(
                { userId: result.insertId },
                jwtSecret,
                { expiresIn: "3h" } // Срок действия токена 3 часа
              );

              return res.status(201).json({
                success: true,
                message: "Пользователь успешно зарегистрирован",
                token,
              });
            }
          );
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
      const { email, password } = req.body;

      // Проверка, существует ли пользователь с таким email
      const checkUserSql = `
        SELECT * FROM Пользователь
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
            message: "Пользователь с таким email не найден",
          });
        }

        const user = results[0];

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

          // Создание JWT токена
          const token = jwt.sign(
            { userId: user.ID },
            jwtSecret,
            { expiresIn: "3h" } // Срок действия токена 3 часа
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

      // Запрос на получение данных пользователя из базы данных
      const getUserSql = `SELECT * FROM Пользователь WHERE ID = ?`;

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
            name: user.Имя,
            lastName: user.Фамилия,
            email: user.Email,
            phone: user.Номер_телефона,
          },
        });
      });
    } catch (error) {
      console.error("Ошибка в функции profile:", error);
      return res
        .status(500)
        .json({ success: false, message: "Ошибка сервера" });
    }
  }
}

module.exports = new UserController();