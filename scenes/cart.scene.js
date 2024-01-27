import { Scenes, Markup } from 'telegraf'

const cartScene = new Scenes.BaseScene('CART_SCENE')

const cartKeyboard = Markup.inlineKeyboard([
  Markup.button.callback('Назад', 'BACK'),
  Markup.button.callback('Купить', 'CHECKOUT'),
]);

export default cartScene
