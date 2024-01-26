import dotenv from 'dotenv'

dotenv.config();

export default {
	BOT_TOKEN: process.env.BOT_TOKEN,
	BOT_USERNAME: process.env.BOT_USERNAME,
	PORT: process.env.PORT || 3000,
	MONGODB_URL: process.env.MONGODB_URL
}