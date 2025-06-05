const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('db_icaros', 'root', 'root', {
  host: 'localhost',
  port: '3306',
  dialect: 'mysql',
});

sequelize.authenticate()
  .then(() => {
    console.log('Conexão estabelecida com sucesso.');
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MySQL:', error);
  });

module.exports = { sequelize, Sequelize };

