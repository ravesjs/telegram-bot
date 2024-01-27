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