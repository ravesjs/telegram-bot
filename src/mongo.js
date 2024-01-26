import config from './config.js';
import mongoose from 'mongoose';

const connectMongoDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection;
    db.on('error', (error) => {
      console.error('Ошибка подключения к MongoDB:', error);
    });

    return new Promise((resolve) => {
      db.once('open', () => {
        console.log('Подключение к MongoDB установлено');
        resolve()
      });
    });
  } catch (error) {
    console.error('Произошла ошибка при подключении к MongoDB:', error);
    throw error
  }
};

export default connectMongoDB;