const { sequelize, Sequelize } = require('./db');
const UsuarioMusico = require('./tb_usuario_musico');
const UsuarioProdutor = require('./tb_usuario_produtor');
const UsuarioAmanteMusica = require('./tb_usuario_am');

// Sincronize os modelos com o banco de dados
sequelize.sync({ alter: true }) // Use { force: true } para recriar tabelas do zero
  .then(() => console.log('Tabelas sincronizadas com sucesso'))
  .catch(error => console.error('Erro ao sincronizar tabelas:', error));