const {Secuilize} = require('sequelize')

module.exports = new Secuilize({
    process.env.DB_NAME
})