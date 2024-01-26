import { Scenes } from 'telegraf'
import getKeyboard from '../src/inlineKeyboard.js'
import { productKeyboard } from '../src/inlineKeyboard.js'
import Product from '../models/product.model.js'

const productScene = new Scenes.BaseScene('PRODUCT_SCENE')

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

productScene.action(/product_(\d+)/, async (ctx) => {
  try {
    const productId = ctx.match[1]
    const product = await Product.findById(productId)

    if (product) {
      ctx.session = ctx.session || {}

      if (ctx.session.lastId) {
        await ctx.telegram.deleteMessage(ctx.chat.id, ctx.session.lastId)
      }

      const nameLength = product.name.length
      const spacesToAdd = Math.max(0, Math.floor((30 - nameLength) / 2))
      const caption = `
        \u200E<pre>${' '.repeat(spacesToAdd)}${product.category} ${product.name}</pre>

        ${product.description}

        Цена: ${product.price}₽

        Кол-во в наличии: ${product.countInStock}
        \u200E
      `
      const message = await ctx.replyWithPhoto(product.file_id, {
        parse_mode: 'HTML',
        caption: caption,
        ...productKeyboard,
      })

      ctx.session.lastId = message.message_id
    } else {
      await ctx.answerCbQuery('Произошла ошибка. Пожалуйста, повторите попытку позже.')
    }
  } catch (error) {
    console.log(error)
  }
})

export default productScene
