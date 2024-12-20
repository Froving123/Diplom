const mysql = require("mysql");

const conn = mysql.createConnection({
  host: "MySQL-8.0",
  user: "root",
  password: "Sasha228",
  database: "Best-Rest",
});

class ContmanController {
  async newPrice(req, res) {

  }
}

module.exports = new ContmanController();