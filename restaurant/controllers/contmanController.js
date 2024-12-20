const mysql = require("mysql");

const conn = mysql.createConnection({
  host: "MySQL-8.0",
  user: "root",
  password: "Sasha228",
  database: "Best-Rest",
});

class ContmanController {
    async newPrice(req, res) {
        try {
          const { dishId, price } = req.body;
      
          // Проверка входных данных
          if (!dishId || !price) {
            return res.status(400).json({ success: false, message: "Неверные данные" });
          }
      
          const query = `
            UPDATE 
              Прайс_лист
            SET 
              Цена = ?
            WHERE 
              ID_блюда = ?
          `;
      
          conn.query(query, [price, dishId], (err, result) => {
            if (err) {
              console.error("Ошибка при обновлении цены в таблице Прайс_лист:", err);
              return res.status(500).json({
                success: false,
                message: "Ошибка при обновлении цены",
              });
            }
      
            if (result.affectedRows === 0) {
              return res
                .status(404)
                .json({ success: false, message: "Блюдо не найдено в Прайс_листе" });
            }
      
            res.json({
              success: true,
              message: "Цена успешно обновлена",
            });
          });
        } catch (error) {
          console.error("Ошибка на сервере:", error);
          res.status(500).json({ success: false, message: "Ошибка на сервере" });
        }
      }      
}

module.exports = new ContmanController();