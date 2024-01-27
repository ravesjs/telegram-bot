import { Scenes } from 'telegraf'
import getKeyboard from '../src/inlineKeyboard.js'
import Product from '../models/product.model.js'

const productScene = new Scenes.BaseScene('PRODUCT_SCENE')

let cartCount = 0

productScene.hears('Список товаров', async (ctx) => {
  try {
    ctx.session = ctx.session || {}
    if (ctx.session.lastKeyboardId) {
      await ctx.telegram.deleteMessage(ctx.chat.id, ctx.session.lastKeyboardId)
    }
    const products = await Product.find()
    if (products.length > 0) {
      const keyboard = getKeyboard(products)
      const message = await ctx.reply('Товары:', keyboard)
      ctx.session.lastKeyboardId = message.message_id
    } else {
      ctx.reply('Нет товаров, ожидайте поставки')
    }
  } catch (error) {
    console.error('Ошибка при получении списка товаров из базы данных:', error)
    ctx.reply('Произошла ошибка. Пожалуйста, повторите попытку позже.')
  }
})

productScene.action(/product_([0-9a-fA-F]{24})/, async (ctx) => {
  try {
    const productId = ctx.match[1]
    const product = await Product.findById(productId)

    if (product) {
      const nameLength = product.name.length
      const spacesToAdd = Math.max(0, Math.floor((30 - nameLength) / 2))
      const caption = `
        \u200E<pre>${' '.repeat(spacesToAdd)}${product.category} ${product.name}</pre>

        ${product.description}

        Цена: ${product.price}₽

        Кол-во в наличии: ${product.countInStock}
        \u200E
      `
      await ctx.answerCbQuery()

      if (ctx.session.lastId) {
        await ctx.telegram.deleteMessage(ctx.chat.id, ctx.session.lastId)
      }

      const message = await ctx.replyWithPhoto(product.file_id, {
        parse_mode: 'HTML',
        caption: caption,
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Удалить из корзины', callback_data: 'Remove' },
              { text: 'Добавить в корзину', callback_data: 'Add' },
            ],
            [{ text: 'Корзина', callback_data: 'Cart' }],
          ],
        },
      })
      ctx.session = ctx.session || {}
      ctx.session.lastId = message.message_id
    } else {
      await ctx.answerCbQuery('Произошла ошибка. Пожалуйста, повторите попытку позже.')
    }
  } catch (error) {
    console.log(error)
  }
})

async function updateCartButton(ctx, cartCount) {
  try {
    const cartText = cartCount === 0 ? 'Корзина' : `Корзина [${cartCount}]`
    await ctx.telegram.editMessageReplyMarkup(ctx.chat.id, ctx.session.lastId, undefined, {
      inline_keyboard: [
        [
          { text: 'Удалить из корзины', callback_data: 'Remove' },
          { text: 'Добавить в корзину', callback_data: 'Add' },
        ],
        [{ text: cartText, callback_data: 'Cart' }],
      ],
    })
  } catch (error) {
    console.error('Ошибка при обновлении кнопки "Корзина":', error)
  }
}

productScene.action('Add', async (ctx) => {
  try {
  await ctx.answerCbQuery()
  const productId = ctx.match[1]
  const product = await Product.findById(productId)
  if (product && product.countInStock > 0) {
    if (cartCount < product.countInStock) {
      cartCount++
      await updateCartButton(ctx, cartCount)
    }
  }} catch (error) {
    console.error('Ошибка в обработчике "Add":', error)
  }
})

productScene.action('Remove', async (ctx) => {
  await ctx.answerCbQuery()
  if (cartCount > 0) {
    cartCount--
    await updateCartButton(ctx, cartCount)
  }
})

productScene.action('Cart', async (ctx) => {
  await ctx.answerCbQuery()
  await ctx.scene.enter('CART_SCENE')
})

export default productScene
