const { sequelize, Sequelize } = require('./db');

const Usuario = sequelize.define('Usuario', {
  ID_USUARIO: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  NOME: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  EMAIL: {
    type: Sequelize.STRING(100),
    allowNull: false,
    unique: true
  },
  SENHA: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  sexo: {
    type: Sequelize.ENUM('F', 'M', 'P'),
    allowNull: true
  },
  flag_tipo_usuario: {
    type: Sequelize.INTEGER(1),
    allowNull: false
  },
  DATA_NASC: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  TELEFONE: {
    type: Sequelize.STRING(15),
    allowNull: false
  },
  IMAGE:{
    type: Sequelize.STRING,
    allowNull:true,
  },
  GENERO_MUSICAL: {
    type: Sequelize.ENUM(
      'Rock', 'Sertanejo', 'Pop', 'Hip_Hop', 'Jazz', 'Blues', 'Classical',
      'Electronic_Dance_Music', 'Country', 'Reggae', 'Reggaeton', 'Soul',
      'Funk', 'Disco', 'Gospel', 'Todos'
    ),
    allowNull: false
  },
  confirmationToken: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  NovoUsuario: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  }

}, {
  tableName: 'tb_usuario',
  timestamps: false, 
  charset: 'utf8mb4',
  collate: 'utf8mb4_general_ci'
});

module.exports = Usuario;
