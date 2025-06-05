const { sequelize, Sequelize } = require('./db');

async function alterarTabelas() {
    try {
        await sequelize.query(`
        ALTER TABLE tb_usuario_musico DROP CONSTRAINT tb_usuario_musico_ibfk_1;
        ALTER TABLE tb_usuario_produtor DROP CONSTRAINT tb_usuario_produtor_ibfk_1;
        ALTER TABLE tb_usuario_am DROP CONSTRAINT tb_usuario_am_ibfk_1;
  
        ALTER TABLE tb_usuario_musico
        ADD CONSTRAINT tb_usuario_musico_ibfk_1
        FOREIGN KEY (ID_USUARIO) REFERENCES tb_usuario(ID_USUARIO) ON DELETE CASCADE;
  
        ALTER TABLE tb_usuario_produtor
        ADD CONSTRAINT tb_usuario_produtor_ibfk_1
        FOREIGN KEY (ID_USUARIO) REFERENCES tb_usuario(ID_USUARIO) ON DELETE CASCADE;
  
        ALTER TABLE tb_usuario_am
        ADD CONSTRAINT tb_usuario_am_ibfk_1
        FOREIGN KEY (ID_USUARIO) REFERENCES tb_usuario(ID_USUARIO) ON DELETE CASCADE;
      `);
        console.log('Tabelas alteradas com sucesso');
    } catch (error) {
        console.error('Erro ao alterar tabelas:', error);
    } finally {
        await sequelize.close();
    }
}

alterarTabelas();