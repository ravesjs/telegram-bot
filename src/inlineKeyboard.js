import { Markup } from 'telegraf';

export default function getKeyboard(products) {
  const keyboard = [];
  let row = [];
  for (let product of products) {
    const button = Markup.button.callback(product.name, `product_${product._id}`);
    row.push(button);
    if (row.length === 4) {
      keyboard.push(row);
      row = [];
    }
  }
  if (row.length > 0) {
    keyboard.push(row);
  }
  return Markup.inlineKeyboard(keyboard);
}

export const productKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('Удалить из корзины', 'Remove'), Markup.button.callback('Добавить в корзину', 'Add')],
  [Markup.button.callback('Корзина', 'Cart')]
]);
export const cartKeyboard = Markup.inlineKeyboard([
  Markup.button.callback('Назад', 'BACK'),
  Markup.button.callback('Купить', 'CHECKOUT'),
]);
