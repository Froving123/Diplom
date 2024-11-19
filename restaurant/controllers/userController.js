const conn = require("../server");
const bcrypt = require("bcrypt");

class UserController {
  async registration(req, res) {
    try {
      const { last, name, fat, tel, email, password } = req.body;

      // Проверка, существует ли пользователь
      const checkUserSql = `SELECT * FROM Пользователь WHERE Номер телефона = ? OR Email = ?`;
      conn.query(checkUserSql, [tel, email], (err, results) => {
        if (err) {
          console.error("Ошибка при проверке пользователя:", err);
          return res.status(500).json({
            success: false,
            message: "Ошибка при регистрации пользователя",
          });
        }

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

          // Добавление пользователя в базу данных
          const addUserSql = `INSERT INTO Пользователь (Email, Пароль(hash), Номер телефона, Фамилия, Имя, Отчество) VALUES (?, ?, ?, ?, ?, ?)`;
          conn.query(
            addUserSql,
            [email, hashedPassword, tel, last, name, fat],
            (addErr, result) => {
              if (addErr) {
                console.error("Ошибка при добавлении пользователя:", addErr);
                return res.status(500).json({
                  success: false,
                  message: "Ошибка при регистрации пользователя",
                });
              }

              return res.json({
                success: true,
                message: "Пользователь успешно зарегистрирован",
                userId: result.insertId, // Возвращаем ID нового пользователя
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

  async login(req, res) {}

  async check(req, res) {}
}

module.exports = new UserController();