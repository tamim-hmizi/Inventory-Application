const mongoose = require('mongoose')
const Schema = mongoose.Schema
const itemSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Schema.ObjectId, ref: 'category', required: true },
    price: { type: Number, required: true },
    numberInStock: { type: Number, required: true },
})

itemSchema.virtual('url').get(function () {
    return '/item/' + this._id
})

module.exports = mongoose.model('Item', itemSchema)
