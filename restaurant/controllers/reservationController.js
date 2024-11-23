const mysql = require("mysql");

const conn = mysql.createConnection({
  host: "MySQL-8.0",
  user: "root",
  password: "Sasha228",
  database: "Best-Rest",
});

class ReservationController {
  async createReservation(req, res) {

  };

  async userReservation(req, res){

  };
}

module.exports = new ReservationController();
