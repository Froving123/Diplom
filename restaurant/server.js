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

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Sasha228",
  database: "BRC",
});

// Резервное копирование бд
const backupDB = () => {
  const backupFile = `backup_${new Date().toISOString().replace(/:/g, '-')}.sql`;
  const backupPath = path.join(__dirname, 'backups', backupFile);

  // Проверка наличия папки копий
  if (!fs.existsSync(path.join(__dirname, 'backups'))) {
    fs.mkdirSync(path.join(__dirname, 'backups'));
  }

  const dumpCommand = `mysqldump -h ${conn.config.host} -u ${conn.config.user} ${conn.config.password ? `-p${conn.config.password}` : ''
    } ${conn.config.database} > ${backupPath}`;

  exec(dumpCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Ошибка при резервном копировании бд: ${error.message}`);
      return;
    }
    console.log(`Резервная копия базы данных сохранена: ${backupPath}`);
  });
};

// Автоматическое копирование каждый день в 03:00
schedule.scheduleJob('0 3 * * *', () => {
  console.log('Запуск резервного копирования бд');
  backupDB();
});

conn.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("db connected");
  }
});

server.listen(PORT, () => {
  console.log("server started");
});
