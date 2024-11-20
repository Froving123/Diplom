const mysql = require("mysql");
const bcrypt = require("bcrypt");

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

              return res.status(201).json({
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