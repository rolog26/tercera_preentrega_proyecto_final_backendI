import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = 'products';

const stringTypeSchemaUniqueRequired = {
    type: String,
    required: true,
    unique: true
}

const stringTypeSchemaNonUniqueRequired = {
    type: String,
    required: true
}

const productSchema = new mongoose.Schema({
    title: stringTypeSchemaUniqueRequired,
    description: stringTypeSchemaNonUniqueRequired,
    code: stringTypeSchemaUniqueRequired,
    thumbnail: String,
    price: stringTypeSchemaNonUniqueRequired,
    stock: stringTypeSchemaNonUniqueRequired,
    category: stringTypeSchemaNonUniqueRequired
});

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model(productCollection, productSchema);