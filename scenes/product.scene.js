import { Scenes } from 'telegraf'
import getKeyboard from '../src/inlineKeyboard.js'
import Product from '../models/product.model.js'
import Cart from '../models/cart.model.js'

const productScene = new Scenes.BaseScene('PRODUCT_SCENE')
// TODO: Сделать счётчик в корзине рабочим

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
      await ctx.answerCbQuery()
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
              { text: 'Удалить из корзины', callback_data: `Remove_${productId}` },
              { text: 'Добавить в корзину', callback_data: `Add_${productId}` },
            ],
            [{ text: `Корзина [${quantity}]`, callback_data: `Cart` }],
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

async function updateCartButton(ctx) {
  try {
    await ctx.telegram.editMessageReplyMarkup(ctx.chat.id, ctx.session.lastId, undefined, {
      inline_keyboard: [
        [
          { text: 'Удалить из корзины', callback_data: `Remove_${productId}` },
          { text: 'Добавить в корзину', callback_data: `Add_${productId}` },
        ],
        [{ text: `Корзина [${quantity}]`, callback_data: 'Cart' }],
      ],
    })
  } catch (error) {
    console.error('Ошибка при обновлении кнопки "Корзина":', error)
  }
}

productScene.action(/Add_([0-9a-fA-F]{24})/, async (ctx) => {
  try {
    const userId = ctx.from.id
    const productId = ctx.match[1]
    let cart = await Cart.findOne({ userId: userId })
    const item = cart.items.find((item) => item.productId.equals(productId))
    if (!cart) {
      cart = new Cart({
        userId: userId,
        items: [{ productId: productId }],
      })
    } else {
      if (!item) {
        item.quantity = 0
      }
      if (item) {
        item.quantity++
      } else {
        cart.items.push({ productId: productId })
      }
    }
    await updateCartButton(ctx)
    await cart.save()
    await ctx.answerCbQuery('Товар добавлен в корзину!')
  } catch (error) {
    console.error('Ошибка при добавлении товара в корзину:', error)
  }
})
// TODO: Сделать кнопку Remove
productScene.action(/Remove_([0-9a-fA-F]{24})/, async (ctx) => {
  const productId = ctx.match[1]
 
  await updateCartButton(ctx)
  await cart.save()
  await ctx.answerCbQuery()
})
// TODO: Сделать кнопку Cart
productScene.action('Cart', async (ctx) => {
  try {
    await ctx.answerCbQuery()
    await ctx.scene.enter('CART_SCENE')
  } catch (error) {
    console.error('Ошибка при переходе в сцену корзины:', error)
  }
})

export default productScene
