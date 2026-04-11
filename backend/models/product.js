import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: String,
    image: String,
    countInStock: Number,
});

export default mongoose.model('Product', productSchema);
