const { Sequelize } = require('sequelize'); // ORM para interagir com os bancos de dados dos inquilinos (MySQL).
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      throw new Error("A URI do MongoDB Master (MONGO_URI) não foi definida no arquivo .env");
    }
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conexão com o Banco de Dados Mestre (MongoDB) estabelecida com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar ao Banco de Dados Mestre:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;