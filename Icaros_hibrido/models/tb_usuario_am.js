const { sequelize, Sequelize } = require('./db');
const Usuario = require('./tb_usuario'); 

const UsuarioAmanteMusica = sequelize.define('UsuarioAmanteMusica', {
    ID_AMANTE_MUSICA: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    CPF: {

        type: Sequelize.STRING(14),
        allowNull: false,
        unique: true
    },
    COMENTARIO: {
        type: Sequelize.TEXT,
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
    tableName: 'tb_usuario_am',
    timestamps: false, 
});

module.exports = UsuarioAmanteMusica;