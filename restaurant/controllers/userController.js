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
  // Метод для регистрации
  async registration(req, res) {
    try {
      const { last_name, name, surname, phone, email, password } = req.body;

      // Проверка, существует ли пользователь с таким email или телефоном
      const checkUserSql = `
        SELECT * FROM Пользователь
        WHERE Номер_телефона = ? OR Email = ?
      `;

      conn.query(checkUserSql, [phone, email], (err, results) => {
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
            message: "Пользователь с таким email или телефоном уже существует",
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
            INSERT INTO Пользователь
            (Фамилия, Имя, Отчество, Номер_телефона, Email, Пароль)
            VALUES (?, ?, ?, ?, ?, ?)
          `;

          conn.query(
            addUserSql,
            [last_name, name, surname, phone, email, hashedPassword],
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
                { expiresIn: "1h" } // Срок действия токена 1 час
              );

              return res.status(201).json({
                success: true,
                message: "Пользователь успешно зарегистрирован",
                token, // Возвращаем токен
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

        // Если пользователь не найден
        if (results.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Пользователь с таким email не найден",
          });
        }

        const user = results[0]; // Полагаем, что пользователь найден (первый из результатов)

        // Сравниваем введённый пароль с хешем пароля, который хранится в базе
        bcrypt.compare(password, user.Пароль, (compareErr, isMatch) => {
          if (compareErr) {
            console.error("Ошибка при проверке пароля:", compareErr);
            return res.status(500).json({
              success: false,
              message: "Ошибка при проверке пароля",
            });
          }

          // Если пароли не совпадают
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
            { expiresIn: "1h" } // Срок действия токена 1 час
          );

          return res.status(200).json({
            success: true,
            message: "Авторизация успешна",
            token, // Возвращаем токен
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

  async profile(req, res) {
    try {
      // Получение токена из заголовка Authorization
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ success: false, message: "Токен отсутствует" });
      }

      const token = authHeader.split(" ")[1];

      // Проверка токена
      let decodedToken;
      try {
        decodedToken = jwt.verify(token, jwtSecret); // Расшифровка токена
      } catch (err) {
        return res
          .status(401)
          .json({ success: false, message: "Неверный токен" });
      }

      // Извлечение информации о пользователе
      const user = await User.findById(decodedToken.id); // Поиск пользователя по ID из токена
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Пользователь не найден" });
      }

      // Возврат данных пользователя
      return res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (err) {
      console.error("Ошибка в profile:", err);
      return res
        .status(500)
        .json({ success: false, message: "Ошибка сервера" });
    }
  }
}

module.exports = new UserController();
