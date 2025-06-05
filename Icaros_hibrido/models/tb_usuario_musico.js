const { sequelize, Sequelize } = require('./db');
const Usuario = require('./tb_usuario');

const UsuarioMusico = sequelize.define('UsuarioMusico', {
  ID_MUSICO: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  CPF: {
    type: Sequelize.STRING(14),
    allowNull: false,
    unique: true
  },
  ID_USUARIO: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: Usuario,
      key: 'ID_USUARIO'
    }
  },
  COMENTARIO: {
    type: Sequelize.TEXT,
    allowNull: true
  }
}, {
  tableName: 'tb_usuario_musico',
  timestamps: false,
});

module.exports = UsuarioMusico;
