const mongoose = require('mongoose');
const Sequence = require('./sequence.model');  // Update the path accordingly

const orderSchema = new mongoose.Schema({
    orderId: { type: Number, unique: true },
    deliveryLocation: { type: String, require: true },
    category: { type: String, require: true },
    commodity: { type: String, require: true },
    quality: { type: String, require: true },
    quantity: { type: String, require: true },
    deliveryTime: { type: String, require: true },
    basePrice: { type: Number, default: 0 },
    status: { type: String, enum: ["Placed", "Packing", "Shipping", "Delivered", "Cancelled"], default: "Placed" },
    tradeId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sellTrade'
    },
    buyerId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: "admin" }
}, {
    timestamps: true
});

// Pre-save hook to assign orderId
orderSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const sequence = await Sequence.findOneAndUpdate(
                { name: 'orderId' },  // Using the orderId sequence
                { $inc: { value: 1 } },
                { new: true, upsert: true }  // upsert: create the document if it doesn't exist
            );

            this.orderId = sequence.value;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
