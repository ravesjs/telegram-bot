import { Composer, Markup } from 'telegraf'

const startComposer = new Composer()

startComposer.start(async (ctx) => {
  try {
    await ctx.reply(
      'Здравствуйте, выберите товар, чтобы оформить заказ',
      Markup.keyboard(['Список товаров']).resize()
    )
    await ctx.scene.enter('PRODUCT_SCENE')
  } catch (e) {
    console.error('cant handle start command')
  }
})

export default startComposer
