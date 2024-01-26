import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
	_id: {type: String, required: true},
  name: { type: String, required: true },
	category: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  countInStock: { type: Number, required: true },
  file_id: { type: String, required: true },
});

const Product = mongoose.model('Product', productSchema);

export default Product;