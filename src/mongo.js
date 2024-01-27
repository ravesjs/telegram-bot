import config from './config.js';
import mongoose from 'mongoose';
//import data from './data.js';
//import Product from '../models/product.model.js';

//const products = data.products

const connectMongoDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URL);
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
//export async function createCollectionWithData() {
//  try {
//    await Product.createCollection();
//    await Product.insertMany(products);
//    console.log('Коллекция успешно создана и заполнена данными.');
//  } catch (error) {
//    console.error('Ошибка при создании коллекции:', error);
//  } finally {
//    mongoose.disconnect();
//  }
//}

export default connectMongoDB;