const { sequelize, Sequelize } = require('./db');
const Usuario = require('./tb_usuario'); 

const UsuarioProdutor = sequelize.define('UsuarioProdutor', {
    ID_PRODUTOR: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    CNPJ: {
      type: Sequelize.STRING(18),
      allowNull: false,
      unique: true
    },
    NOME_FANTASIA: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    COMENTARIO: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    ID_USUARIO: {
      type: Sequelize.INTEGER,
      allowNull: true,
      unique: true,
      references: {
        model: Usuario, 
        key: 'ID_USUARIO'
      }
    },
  }, {
    tableName: 'tb_usuario_produtor',
    timestamps: false, 
  });
  
  module.exports = UsuarioProdutor;
  