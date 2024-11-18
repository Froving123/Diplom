const {Secuilize} = require('sequelize')

module.exports = new Secuilize(
   process.env.DB_NAME,
   process.env.DB_USER,
   process.env.DB_PASSWORD,
   {
      dialect: 'MySQL',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT
   }
)