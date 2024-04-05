import { Scenes } from 'telegraf'
import Cart from '../models/cart.model.js';

const cartScene = new Scenes.BaseScene('CART_SCENE')

cartScene.action('BACK', async (ctx) => {
 
});

export default cartScene
