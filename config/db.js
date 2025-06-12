const mongoose = require('mongoose');

/**
 * Função para conectar ao MongoDB
 * Usa as variáveis de ambiente do .env para a string de conexão
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB conectado: ${conn.connection.host}`.cyan.underline.bold);
  } catch (error) {
    console.error(`Erro ao conectar ao MongoDB: ${error.message}`.red);
    process.exit(1);
  }
};

module.exports = connectDB; 