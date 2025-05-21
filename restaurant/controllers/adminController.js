const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtSecret = "Best-Rest-CAdmin";

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Sasha228",
  database: "BRC",
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
      const { email, password, role } = req.body;
  
      // Поиск сотрудника по email
      const findUserSql = `SELECT * FROM Сотрудники WHERE Email = ?`;
  
      conn.query(findUserSql, [email], (err, userResults) => {
        if (err) {
          console.error("Ошибка при поиске пользователя:", err);
          return res.status(500).json({ success: false, message: "Ошибка при поиске пользователя" });
        }
  
        if (userResults.length === 0) {
          return res.status(404).json({ success: false, message: "Пользователь с таким Email не найден" });
        }
  
        const user = userResults[0];
  
        // Проверка принадлежности роли (должности)
        const checkRoleSql = `
          SELECT * FROM Должность_сотрудника
          WHERE ID_сотрудника = ? AND ID_должности = ?
        `;
  
        conn.query(checkRoleSql, [user.ID, role], (roleErr, roleResults) => {
          if (roleErr) {
            console.error("Ошибка при проверке роли:", roleErr);
            return res.status(500).json({ success: false, message: "Ошибка при проверке роли" });
          }
  
          if (roleResults.length === 0) {
            return res.status(403).json({ success: false, message: "У вас нет доступа с выбранной ролью" });
          }
  
          // Проверка пароля
          bcrypt.compare(password, user.Пароль, (compareErr, isMatch) => {
            if (compareErr) {
              console.error("Ошибка при проверке пароля:", compareErr);
              return res.status(500).json({ success: false, message: "Ошибка при проверке пароля" });
            }
  
            if (!isMatch) {
              return res.status(401).json({ success: false, message: "Неверный пароль" });
            }
  
            // Генерация токена
            const token = jwt.sign(
              { email: user.Email, id: user.ID, role },
              jwtSecret,
              { expiresIn: "19h" }
            );
  
            return res.status(200).json({
              success: true,
              message: "Авторизация успешна",
              token,
            });
          });
        });
      });
    } catch (error) {
      console.error("Ошибка при обработке запроса:", error);
      return res.status(500).json({ success: false, message: "Произошла ошибка на сервере" });
    }
  }  

  async admin(req, res) {
    try {
      const authHeader = req.headers.authorization;
  
      // Проверка наличия токена
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Сессия была закончена, авторизуйтесь заново",
        });
      }
  
      const token = authHeader.split(" ")[1];
  
      // Расшифровка токена
      let decodedToken;
      try {
        decodedToken = jwt.verify(token, jwtSecret);
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: "Сессия была закончена, авторизуйтесь заново",
        });
      }
  
      const userId = decodedToken.id;
  
      // Запрос на получение данных пользователя и всех его ролей (ID и название)
      const getUserSql = `
        SELECT 
          С.ID, 
          С.Email, 
          ДС.ID_должности, 
          Д.Наименование AS Наименование_должности
        FROM Сотрудники С
        LEFT JOIN Должность_сотрудника ДС ON С.ID = ДС.ID_сотрудника
        LEFT JOIN Должность Д ON ДС.ID_должности = Д.ID
        WHERE С.ID = ?
      `;
  
      conn.query(getUserSql, [userId], (err, results) => {
        if (err) {
          console.error("Ошибка при запросе данных пользователя:", err);
          return res.status(500).json({
            success: false,
            message: "Ошибка сервера",
          });
        }
  
        if (results.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Пользователь не найден",
          });
        }
  
        const userInfo = {
          id: results[0].ID,
          email: results[0].Email,
          roles: results
            .filter(row => row.ID_должности !== null) // исключить случаи, когда нет ролей
            .map(row => ({
              id: row.ID_должности,
              name: row.Название_должности,
            })),
        };
  
        return res.status(200).json({
          success: true,
          user: userInfo,
        });
      });
    } catch (error) {
      console.error("Ошибка в функции admin:", error);
      return res.status(500).json({
        success: false,
        message: "Ошибка сервера",
      });
    }
  }

  async roleAdmins(req, res) {
    try {
      // Запрос всех должностей из таблицы "Должности"
      const query = `SELECT ID, Наименование FROM Должность`;
  
      conn.query(query, (err, results) => {
        if (err) {
          console.error("Ошибка при получении ролей:", err);
          return res.status(500).json({
            success: false,
            message: "Ошибка при получении ролей",
          });
        }
  
        res.status(200).json({
          success: true,
          roles: results,
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
