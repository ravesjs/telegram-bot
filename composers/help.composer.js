import { Composer } from 'telegraf'
import { commands } from '../src/const.js'
const help = new Composer()

help.help((ctx) => {
  ctx.reply(commands)
})

help.on('text', (ctx) => {
  ctx.reply('Если вам нужна помощь, напишите /help \nЕсли нет кнопки напишите в чат "Список товаров"')
})

help.on('sticker', (ctx) => ctx.reply('👍'))

export default help
