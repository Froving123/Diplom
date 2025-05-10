const express = require("express");
const mysql = require("mysql");
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const schedule = require('node-schedule');
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes/index");

const server = express();
const PORT = 5000;

server.use(cors());
server.use(bodyParser.json());
server.use("/api", router);
server.use(bodyParser.json({ limit: "50mb" }));
server.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Создание пула соединений
const pool = mysql.createPool({
  connectionLimit: 10, // можно настроить под нагрузку
  host: "localhost",
  user: "root",
  password: "Sasha228",
  database: "BRC",
});

// Резервное копирование БД
const backupDB = () => {
  const backupFile = `backup_${new Date().toISOString().replace(/:/g, '-')}.sql`;
  const backupPath = path.join(__dirname, 'backups', backupFile);

  // Проверка наличия папки
  if (!fs.existsSync(path.join(__dirname, 'backups'))) {
    fs.mkdirSync(path.join(__dirname, 'backups'));
  }

  const dumpCommand = `mysqldump -h ${pool.config.connectionConfig.host} -u ${pool.config.connectionConfig.user} ${
    pool.config.connectionConfig.password ? `-p${pool.config.connectionConfig.password}` : ''
  } ${pool.config.connectionConfig.database} > ${backupPath}`;

  exec(dumpCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Ошибка при резервном копировании БД: ${error.message}`);
      return;
    }
    console.log(`Резервная копия базы данных сохранена: ${backupPath}`);
  });
};

// Автоматическое копирование каждый день в 03:00
schedule.scheduleJob('0 3 * * *', () => {
  console.log('Запуск резервного копирования БД');
  backupDB();
});

// Проверка соединения с БД
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Ошибка подключения к БД:", err);
  } else {
    console.log("DB pool connected");
    connection.release(); // обязательно освобождаем соединение
  }
});

server.listen(PORT, () => {
  console.log("Server started on port", PORT);
});

module.exports = pool;