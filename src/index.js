import { Telegraf, session, Scenes } from 'telegraf'
import config from './config.js'
import productScene from '../scenes/product.scene.js'
import help from '../composers/help.composer.js'
import startComposer from '../composers/start.composer.js'
import connectMongoDB from './mongo.js'
import cartScene from '../scenes/cart.scene.js'

connectMongoDB()
createCollectionWithData() // Создаёт коллекцию products на основе данных из data.js

const bot = new Telegraf(config.BOT_TOKEN)
if (!config.BOT_TOKEN) throw new Error('"BOT_TOKEN" is required!')

bot.use(session())
const stage = new Scenes.Stage([productScene, cartScene])
bot.use(stage.middleware())
bot.use(startComposer, help)

//bot.command('getFile', async (ctx) => {
//  const fileUploadResponse = await ctx.telegram.sendPhoto(ctx.chat.id, { source: 'images/watch4.jpg' });
//    const fileId = fileUploadResponse.photo[3].file_id;
//    console.log(fileId)
//})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
