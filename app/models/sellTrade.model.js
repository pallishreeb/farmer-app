const mongoose = require('mongoose');
const Sequence = require('./sequence.model');  // Update the path accordingly

const sellTradeSchema = new mongoose.Schema({
    sellTradeId: { type: Number, unique: true },
    pickuplocation: { type: String },
    category: { type: String },
    product: { type: String },
    variety: { type: String },
    grade: { type: String },
    username: { type: String },
    price: { type: Number, default: 0 },
    basePrice: { type: String},
    quantity: { type: String, default: 0 },
    priceQuantityUnit: { type: String },
    Date: { type: String },
    image: [],
    availableFromDate: { type: String },
    availableToDate: { type: String },
    farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: "admin" }
}, { timestamps: true });

// Pre-save hook to assign sellTradeId
sellTradeSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const sequence = await Sequence.findOneAndUpdate(
                { name: 'sellTradeId' },  // Using the sellTradeId sequence
                { $inc: { value: 1 } },
                { new: true, upsert: true }  // upsert: create the document if it doesn't exist
            );

            this.sellTradeId = sequence.value;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

const SellModel = mongoose.model("sellTrade", sellTradeSchema);

module.exports = SellModel;
