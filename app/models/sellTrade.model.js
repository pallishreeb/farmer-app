const mongoose = require('mongoose');

const sellTradeSchema = new mongoose.Schema({
    pickuplocation: { type: String },
    category: { type: String },
    product: { type: String },
    variety: { type: String },
    grade: { type: String },
    username: { type: String },
    price: { type: Number, default: 0 },
    quantity: { type: String, default: 0 },
    priceQuantityUnit: { type: String },
    Date: { type: String },
    image: [],
    availableFromDate: { type: String },
    availableToDate: { type: String },
    farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: "admin" }
}, { timestamps: true });

const SellModel = mongoose.model("sellTrade", sellTradeSchema);

module.exports = SellModel;
