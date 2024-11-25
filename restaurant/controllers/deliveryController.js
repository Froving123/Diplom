const mysql = require("mysql");
const jwt = require("jsonwebtoken");

const jwtSecret = "Best-Rest";

const conn = mysql.createConnection({
  host: "MySQL-8.0",
  user: "root",
  password: "Sasha228",
  database: "Best-Rest",
});

class DeliveryController {
  async createOrder(req, res) {}

  async menuDelivery(req, res) {}

  async userDelivery(req, res) {}
}

module.exports = new DeliveryController();
