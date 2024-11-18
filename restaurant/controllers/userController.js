const bcrypt = require("bcrypt");

/*server.get('/users', (req, res) => {
    conn.query("SELECT * FROM Пользователь", (err, result, fields) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json(result);
    });
  });*/

class UserController {
  async registration(req, res) {
    const { email, password, copyPassword, number, last, name, fat } = req.body;
    if (
      !email ||
      !password ||
      !copyPassword ||
      !last ||
      !name ||
      !fat ||
      !number
    ) {
      setError("Пожалуйста, заполните все поля");
      setTimeout(() => {
        setError("");
      }, 5000);
    } else {
      if (copyPassword !== password) {
        setError("пароли не совпадают");
        setTimeout(() => {
          setError("");
        }, 5000);
      }
      const candidate = await dbData.findOne({ where: { email, number } });
      if (candidate) {
        setError("Такой пользователь уже существует");
        setTimeout(() => {
          setError("");
        }, 5000);
      }
      const hashPassword = await bcrypt.hash(password, 5);
      const user = await dbData.create({
        email,
        password: hashPassword,
        number,
        last,
        name,
        fat,
      });
    }
  }

  async login(req, res) {}

  async check(req, res) {}
}

module.exports = new UserController();
